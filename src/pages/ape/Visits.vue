<template>
  <!-- class="row justify-center" -->
  <q-page :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
    <div
      class="bg-white full-width"
      style="border-radius: 6px; overflow: hidden"
    >
      <PageHeader icon="fa-solid fa-house-medical" text="VISITS" />
      <div :class="$q.screen.gt.md ? 'q-pa-xl' : 'q-pa-lg'">
        <div class="column full-width" style="gap: 36px">
          <div
            class="full-width"
            :class="$q.screen.gt.md ? 'row' : 'column'"
            style="gap: 56px"
          >
            <div :class="$q.screen.gt.md ? 'col' : 'full-width'">
              <div class="row items-start q-mb-md" style="gap: 16px">
                <div
                  class="col-auto"
                  :class="$q.screen.gt.md ? 'col' : 'col-12'"
                >
                  <div
                    class="text-primary text-weight-medium text-uppercase q-pt-sm"
                    style="
                      font-size: 16px;
                      line-height: 16px;
                      letter-spacing: 0.8pt;
                    "
                  >
                    PENDING VISITS:
                  </div>
                </div>
                <div class="col">
                  <q-form @submit="getPendingVisits">
                    <div
                      class="row items-start justify-end"
                      :class="$q.screen.gt.md ? '' : 'q-mb-lg'"
                      :style="$q.screen.gt.md ? { gap: '8px' } : {}"
                    >
                      <q-input
                        :disable="pendingVisitsLoading"
                        :class="$q.screen.gt.md ? '' : 'full-width'"
                        :style="$q.screen.gt.md ? { width: '100px' } : {}"
                        :dense="$q.screen.gt.md"
                        stack-label
                        outlined
                        label="Year"
                        maxlength="4"
                        :rules="[requiredRule, yearRule]"
                        v-model.trim="pendingVisitsFilters.year"
                      />
                      <q-select
                        :disable="pendingVisitsLoading"
                        :class="$q.screen.gt.md ? '' : 'full-width'"
                        :dense="$q.screen.gt.md"
                        stack-label
                        outlined
                        emit-value
                        map-options
                        option-label="name"
                        option-value="code"
                        :options="campuses"
                        label="Campus"
                        hint=""
                        v-model="pendingVisitsFilters.patientCampusCode"
                      />
                      <q-select
                        :disable="pendingVisitsLoading"
                        :class="$q.screen.gt.md ? '' : 'full-width'"
                        :dense="$q.screen.gt.md"
                        stack-label
                        outlined
                        emit-value
                        map-options
                        option-label="name"
                        option-value="code"
                        :options="affiliations"
                        label="Affiliation"
                        hint=""
                        v-model="pendingVisitsFilters.patientAffiliationCode"
                      />
                      <q-input
                        :disable="pendingVisitsLoading"
                        :class="$q.screen.gt.md ? '' : 'full-width'"
                        :style="$q.screen.gt.md ? { width: '200px' } : {}"
                        :dense="$q.screen.gt.md"
                        outlined
                        label="Patient Name"
                        maxlength="255"
                        hint=""
                        :rules="[
                          (v) =>
                            v.length > 0 && v.length < 3
                              ? 'At least 3 letters is required.'
                              : undefined,
                        ]"
                        v-model.trim="pendingVisitsFilters.patientFullName"
                      >
                        <template v-slot:append>
                          <q-icon
                            v-if="pendingVisitsFilters.patientFullName !== ''"
                            size="xs"
                            name="close"
                            class="cursor-pointer"
                            @click="pendingVisitsFilters.patientFullName = ''"
                          />
                        </template>
                      </q-input>
                      <q-btn
                        :disable="pendingVisitsLoading"
                        :class="$q.screen.gt.md ? '' : 'full-width'"
                        class="q-px-md q-py-sm"
                        unelevated
                        color="primary"
                        label="SEARCH"
                        type="submit"
                      />
                    </div>
                  </q-form>
                </div>
              </div>
              <div>
                <FetchingData v-if="pendingVisitsLoading" />
                <template v-else>
                  <template v-if="pendingVisits && pendingVisits.length > 0">
                    <div
                      class="full-width relative-position"
                      v-if="$q.screen.gt.md"
                    >
                      <q-table
                        bordered
                        style="border-radius: 0"
                        id="uerm-infirmary__visits-page__q-table"
                        class="shadow-0"
                        :rows="pendingVisits"
                        :columns="columns"
                        hide-bottom
                        :rows-per-page-options="[0]"
                      >
                        <template v-slot:body="props">
                          <q-tr
                            class="cursor-pointer"
                            @click.stop="showPxVisitInfo(props.row)"
                          >
                            <template v-for="column of columns">
                              <q-td v-if="column.name === 'dateTimeCreated'">
                                <span class="text-grey-7">
                                  {{ formatDate(props.row.dateTimeCreated) }}
                                </span>
                              </q-td>
                              <q-td
                                v-else-if="column.name === 'visitExams'"
                                class="row items-center no-wrap"
                                style="gap: 6px"
                              >
                                <q-btn
                                  v-for="(item, idx) in props.row.exams"
                                  :key="idx"
                                  dense
                                  unelevated
                                  class="q-px-sm"
                                  style="font-size: 9pt"
                                  :class="
                                    item.dateTimeCompleted
                                      ? 'text-positive'
                                      : 'text-negative'
                                  "
                                  @click.stop="
                                    () => {
                                      visitInfoTabCode = item.examCode;
                                      showPxVisitInfo(props.row);
                                    }
                                  "
                                  :label="examsMap[item.examCode].name"
                                />
                              </q-td>
                              <q-td v-else-if="column.name === 'action'">
                                <div
                                  class="row justify-center"
                                  style="gap: 8px; width: 146px"
                                >
                                  <q-btn
                                    outline
                                    dense
                                    class="text-primary"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                    unelevated
                                    label="DETAILS"
                                    @click.stop="showPxVisitInfo(props.row)"
                                  />
                                  <q-btn
                                    v-if="
                                      props.row.exams?.some(
                                        (e) => e.dateTimeCompleted
                                      )
                                    "
                                    dense
                                    class="bg-accent text-black"
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                    unelevated
                                    label="PRINT"
                                    @click.stop="showPxVisitPrintout(props.row)"
                                  />
                                </div>
                              </q-td>
                              <!-- <q-td
                                v-else-if="column.name === 'patientCampusCode'"
                              >
                                <div class="row justify-center">
                                  <q-badge
                                    v-if="props.row.patientCampusCode"
                                    class="bg-grey"
                                  >
                                    {{
                                      campusesMap[props.row.patientCampusCode]
                                        .name
                                    }}
                                  </q-badge>
                                </div>
                              </q-td>
                              <q-td
                                v-else-if="
                                  column.name === 'patientAffiliationCode'
                                "
                              >
                                <div class="row justify-center">
                                  <q-badge
                                    v-if="props.row.patientCampusCode"
                                    class="bg-grey"
                                  >
                                    {{
                                      affiliationsMap[
                                        props.row.patientAffiliationCode
                                      ].name
                                    }}
                                  </q-badge>
                                </div>
                              </q-td> -->
                              <q-td
                                v-else-if="column.name === 'patientFullName'"
                                class="text-weight-bold text-uppercase"
                              >
                                {{
                                  formatName(
                                    props.row.patientFirstName,
                                    props.row.patientMiddleName,
                                    props.row.patientLastName,
                                    props.row.patientExtName
                                  )
                                }}
                              </q-td>
                              <q-td
                                v-else-if="column.name === 'patientDeptCode'"
                                class="text-center"
                              >
                                {{
                                  props.row[column.name]
                                    ? departmentsMap[props.row[column.name]]
                                    : ""
                                }}
                              </q-td>
                              <q-td
                                v-else-if="column.name === 'patientYearLevel'"
                                class="text-center"
                              >
                                {{
                                  props.row[column.name]
                                    ? Object.values(yearLevelsMap).find(
                                        (y) =>
                                          y.code ===
                                          Number(props.row[column.name])
                                      ).name
                                    : ""
                                }}
                              </q-td>
                              <q-td v-else class="text-center">
                                {{
                                  column.format
                                    ? column.format(props.row[column.name])
                                    : props.row[column.name]
                                }}
                              </q-td>
                            </template>
                          </q-tr>
                        </template>
                      </q-table>
                      <div class="row justify-start q-mt-md">
                        <q-badge
                          color="accent"
                          class="text-black q-pa-sm"
                          :class="$q.screen.lt.md ? 'q-mt-md' : ''"
                        >
                          <span class="text-weight-bold">{{
                            pendingVisits.length
                          }}</span
                          >&nbsp;item/s
                        </q-badge>
                      </div>
                    </div>
                    <div
                      v-else
                      class="relative-position bg-white"
                      style="
                        overflow-y: auto;
                        display: grid;
                        grid-template-rows: min-content auto;
                      "
                    >
                      <q-virtual-scroll
                        style="
                          height: auto;
                          border-top: 1px solid rgba(0, 0, 0, 0.1);
                          border-left: 1px solid rgba(0, 0, 0, 0.1);
                          border-right: 1px solid rgba(0, 0, 0, 0.1);
                        "
                        :items="pendingVisits"
                        v-slot="{ item, index }"
                      >
                        <q-item
                          class="full-width q-pa-md"
                          :key="index"
                          clickable
                          @click="showPxVisitInfo(item)"
                        >
                          <q-item-section>
                            <q-item-label caption class="ellipsis">{{
                              formatDate(item.dateTimeCreated)
                            }}</q-item-label>
                            <q-item-label overline class="q-mb-sm">{{
                              item.patientIdentificationCode
                            }}</q-item-label>
                            <q-item-label
                              class="text-weight-medium text-uppercase"
                              style="gap: 8px"
                            >
                              {{
                                formatName(
                                  item.patientFirstName,
                                  item.patientMiddleName,
                                  item.patientLastName,
                                  item.patientExtName
                                )
                              }}
                            </q-item-label>
                            <q-item-label caption>
                              <div class="row items-center" style="gap: 6px">
                                <q-icon
                                  size="xs"
                                  :color="
                                    item.patientGender === 'M'
                                      ? 'blue-4'
                                      : 'pink-4'
                                  "
                                  :name="
                                    item.patientGender === 'M'
                                      ? 'fa-solid fa-mars'
                                      : 'fa-solid fa-venus'
                                  "
                                />
                                <q-badge
                                  v-if="item.patientDeptCode"
                                  class="bg-grey"
                                >
                                  {{
                                    departmentsMap[item.patientDeptCode]?.name
                                  }}
                                </q-badge>
                                <q-badge
                                  v-if="item.patientYearLevel"
                                  class="bg-grey"
                                  >{{
                                    yearLevels.find(
                                      (l) =>
                                        l.code === Number(item.patientYearLevel)
                                    )?.name
                                  }}</q-badge
                                >
                              </div>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section v-if="examsMap" side>
                            <q-btn
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              class="bg-white"
                              unelevated
                              outline
                              :color="
                                item.dateTimeCompleted
                                  ? 'positive'
                                  : 'text-grey-8'
                              "
                              @click.stop="
                                () => {
                                  currentVisit = item;
                                  statusHistoryVisible = true;
                                }
                              "
                              label="DIAG EXAMS"
                            />
                            <q-btn
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              unelevated
                              class="q-mt-sm text-black"
                              color="accent"
                              label="DETAILS"
                              @click.stop="showPxVisitInfo(item)"
                            />
                            <q-btn
                              v-if="
                                item.exams?.some((e) => e.dateTimeCompleted)
                              "
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              unelevated
                              class="q-mt-sm text-black"
                              color="accent"
                              label="PRINT"
                              @click.stop="showPxVisitPrintout(item)"
                            />
                          </q-item-section>
                        </q-item>
                        <q-separator />
                      </q-virtual-scroll>
                    </div>
                  </template>
                  <NoResult v-else message="No pending visits found." />
                </template>
              </div>
            </div>
            <div :class="$q.screen.gt.md ? 'col-3' : 'full-width'">
              <div class="row items-center q-mb-md">
                <div
                  class="col text-primary text-weight-medium text-uppercase"
                  style="
                    font-size: 16px;
                    line-height: 16px;
                    letter-spacing: 0.8pt;
                  "
                >
                  COMPLETED VISITS:
                </div>
                <div class="col-auto">
                  <q-btn
                    :disable="completedVisitsLoading"
                    color="primary"
                    round
                    flat
                    dense
                    @click="completedVisitsFilterVisible = true"
                  >
                    <q-icon
                      style="font-weight: bold"
                      name="fa-solid fa-magnifying-glass"
                      size="xs"
                    />
                  </q-btn>
                </div>
              </div>
              <div>
                <FetchingData v-if="completedVisitsLoading" />
                <template v-else>
                  <q-form @submit="getCompletedVisits">
                    <div
                      :class="
                        $q.screen.gt.md ? 'row items-start' : 'column q-mb-lg'
                      "
                      :style="$q.screen.gt.md ? { gap: '10px' } : {}"
                    >
                      <q-input
                        :disable="completedVisitsLoading"
                        class="col"
                        :class="$q.screen.gt.md ? '' : 'full-width'"
                        :style="$q.screen.gt.md ? { width: '200px' } : {}"
                        :dense="$q.screen.gt.md"
                        outlined
                        label="Patient Name"
                        maxlength="255"
                        hint=""
                        :rules="[
                          (v) =>
                            v.length > 0 && v.length < 3
                              ? 'At least 3 letters is required.'
                              : undefined,
                        ]"
                        v-model.trim="completedVisitsFilters.patientFullName"
                      >
                        <template v-slot:append>
                          <q-icon
                            v-if="completedVisitsFilters.patientFullName !== ''"
                            size="xs"
                            name="close"
                            class="cursor-pointer"
                            @click="completedVisitsFilters.patientFullName = ''"
                          />
                        </template>
                      </q-input>
                      <q-btn
                        :disable="completedVisitsLoading"
                        :class="$q.screen.gt.md ? '' : 'full-width'"
                        class="q-px-md q-py-sm col-auto"
                        unelevated
                        color="primary"
                        label="SEARCH"
                        type="submit"
                      />
                    </div>
                  </q-form>
                  <template
                    v-if="completedVisits && completedVisits.length > 0"
                  >
                    <div
                      class="relative-position bg-white"
                      style="
                        overflow-y: auto;
                        display: grid;
                        grid-template-rows: min-content auto;
                      "
                    >
                      <q-virtual-scroll
                        bordered
                        style="
                          height: auto;
                          border-top: 1px solid rgba(0, 0, 0, 0.1);
                          border-left: 1px solid rgba(0, 0, 0, 0.1);
                          border-right: 1px solid rgba(0, 0, 0, 0.1);
                        "
                        :style="
                          $q.screen.gt.md
                            ? { maxHeight: 'calc(100vh - 400px)' }
                            : {}
                        "
                        :items="completedVisits"
                        v-slot="{ item, index }"
                      >
                        <q-item
                          class="full-width q-pa-md"
                          :key="index"
                          clickable
                          @click="showPxVisitInfo(item)"
                        >
                          <q-item-section>
                            <q-item-label caption class="ellipsis q-mb-xs">{{
                              formatDate(item.dateTimeCreated)
                            }}</q-item-label>
                            <q-item-label overline class="q-mb-sm">{{
                              item.patientIdentificationCode
                            }}</q-item-label>
                            <q-item-label
                              class="text-weight-medium text-uppercase"
                              style="gap: 8px"
                            >
                              {{
                                formatName(
                                  item.patientFirstName,
                                  item.patientMiddleName,
                                  item.patientLastName,
                                  item.patientExtName
                                )
                              }}
                            </q-item-label>
                            <q-item-label caption>
                              <div class="row items-center" style="gap: 6px">
                                <q-icon
                                  size="xs"
                                  :color="
                                    item.patientGender === 'M'
                                      ? 'blue-4'
                                      : 'pink-4'
                                  "
                                  :name="
                                    item.patientGender === 'M'
                                      ? 'fa-solid fa-mars'
                                      : 'fa-solid fa-venus'
                                  "
                                />
                                <q-badge
                                  v-if="item.patientCampusCode"
                                  class="bg-grey"
                                  >{{
                                    campusesMap[item.patientCampusCode].name
                                  }}</q-badge
                                >
                                <q-badge
                                  v-if="item.patientAffiliationCode"
                                  class="bg-grey"
                                  >{{
                                    affiliationsMap[item.patientAffiliationCode]
                                      .name
                                  }}</q-badge
                                >
                              </div>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section v-if="examsMap" side>
                            <q-btn
                              outline
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              unelevated
                              color="primary"
                              label="DETAILS"
                              @click.stop="showPxVisitInfo(item)"
                            />
                            <q-btn
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              unelevated
                              class="text-black q-mt-sm"
                              color="accent"
                              label="PRINT"
                              @click.stop="showPxVisitPrintout(item)"
                            />
                          </q-item-section>
                        </q-item>
                        <q-separator />
                      </q-virtual-scroll>
                    </div>
                  </template>
                  <NoResult v-else message="No completed visits found." />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <MinimizedDialog
      v-if="statusHistoryVisible"
      title="DIAGNOSITC EXAMS"
      widthOnDesktop="500px"
      @close="statusHistoryVisible = false"
    >
      <template v-slot:body>
        <div class="q-pa-lg">
          <q-table
            class="fit"
            hide-bottom
            flat
            bordered
            separator="cell"
            :rows-per-page-options="[0]"
            :rows="currentVisit.exams"
            :columns="[
              {
                name: 'examCode',
                label: 'Exam Name',
                field: 'examCode',
                align: 'left',
                format: getExamName,
              },
              {
                name: 'createdBy',
                label: 'Added By',
                field: 'createdBy',
                align: 'left',
              },
              {
                name: 'dateTimeCompleted',
                label: 'Date & Time Completed',
                field: 'dateTimeCompleted',
                format: (val) => {
                  if (!val) return '-';
                  return formatDate(val);
                },
                align: 'left',
              },
            ]"
          />
        </div>
      </template>
    </MinimizedDialog>
    <AdvanceSearch
      v-if="completedVisitsFilterVisible"
      :initialValue="completedVisitsFilters"
      @close="completedVisitsFilterVisible = false"
      @valueChanged="
        (val) => {
          completedVisitsFilters = { ...completedVisitsFilters, ...val };
          completedVisitsFilterVisible = false;
        }
      "
    />
    <VisitDetails
      v-if="visitInfoVisible"
      :visit="currentVisit"
      :tabCode="visitInfoTabCode"
      @close="
        () => {
          visitInfoTabCode = null;
          visitInfoVisible = false;
        }
      "
      @saved="
        () => {
          getPendingVisits();
          getCompletedVisits();
        }
      "
    />
    <MaximizedDialog
      v-if="visitPrintoutVisible"
      title="PRINT VISIT"
      @close="visitPrintoutVisible = false"
    >
      <template v-slot:body>
        <PrintoutVisitDetails
          v-if="currentVisit && visitPrintoutVisible"
          :visitId="currentVisit.id"
        />
      </template>
    </MaximizedDialog>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  delay,
  formatDate,
  showMessage,
  formatName,
} from "src/helpers/util.js";

import {
  affiliationsMap,
  affiliations,
  campusesMap,
  campuses,
  examsMap,
  exams,
  yearLevelsMap,
  yearLevels,
} from "src/helpers/constants.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "VisitsPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // ReminderCard: defineAsyncComponent(() =>
    //   import("src/components/core/ReminderCard.vue")
    // ),
    DateRange: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DateRange.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    MinimizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
    ),
    MaximizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MaximizedDialog.vue")
    ),
    VisitDetails: defineAsyncComponent(() =>
      import("src/components/visit-page/VisitDetails.vue")
    ),
    NoResult: defineAsyncComponent(() =>
      import("src/components/core/NoResult.vue")
    ),
    PrintoutVisitDetails: defineAsyncComponent(() =>
      import("src/components/printouts/VisitDetails.vue")
    ),
    AdvanceSearch: defineAsyncComponent(() =>
      import("src/components/visit-page/AdvancedSearch.vue")
    ),
  },
  setup() {
    return {
      affiliations,
      affiliationsMap,
      campuses,
      campusesMap,
      exams,
      examsMap,

      yearLevelsMap,
      yearLevels,

      showMessage,
      formatDate,
      formatName,
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
      columns: [
        {
          name: "action",
          label: "",
          field: "action",
          align: "center",
        },
        {
          name: "dateTimeCreated",
          field: "dateTimeCreated",
          label: "DATE/TIME REGISTERED",
          align: "left",
        },
        {
          name: "patientIdentificationCode",
          field: "patientIdentificationCode",
          label: "STU/EMP NO.",
          align: "left",
        },
        // {
        //   name: "patientCampusCode",
        //   field: "patientCampusCode",
        //   label: "CAMPUS",
        //   align: "center",
        // },
        // {
        //   name: "patientAffiliationCode",
        //   field: "patientAffiliationCode",
        //   label: "AFFILIATION",
        //   align: "center",
        // },
        {
          name: "patientFullName",
          label: "PATIENT NAME",
          align: "center",
        },
        {
          name: "patientGender",
          label: "PATIENT GENDER",
          align: "center",
        },
        {
          name: "patientDeptCode",
          field: "patientDeptCode",
          label: "DEPARTMENT",
          align: "center",
        },
        {
          name: "patientYearLevel",
          field: "patientYearLevel",
          label: "YEAR LEVEL",
          align: "center",
        },
        {
          name: "visitExams",
          field: "visitExams",
          label: "DIAGNOSTIC EXAMS",
          align: "center",
        },
      ],
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      departmentsMap: null,

      pendingVisitsFilters: {
        status: "PENDING",
        year: new Date().getFullYear(),
        // visitDateRange: {
        //   from: jsDateToISOString(subtractDay(new Date(), 7), true).replace(
        //     /-/g,
        //     "/"
        //   ),
        //   to: jsDateToISOString(new Date(), true).replace(/-/g, "/"),
        // },
        patientFullName: "",
        patientCampusCode: campusesMap.CAL.code,
        patientAffiliationCode: affiliationsMap.STU.code,

        // patientDeptCode: null,
        // patientYearLevel: null,
      },

      completedVisitsFilters: {
        status: "COMPLETED",
        year: new Date().getFullYear(),
        patientFullName: "",
        patientCampusCode: campusesMap.CAL.code,
        patientAffiliationCode: affiliationsMap.STU.code,
      },

      pendingVisitsLoading: false,
      completedVisitsLoading: false,

      pendingVisits: [],
      completedVisits: [],

      statusHistoryVisible: false,
      visitPrintoutVisible: false,

      visitInfoTabCode: null,
      visitInfoVisible: false,

      completedVisitsFilterVisible: false,

      currentVisit: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  async mounted() {
    if (!this.user) return;

    this.departmentsMap = (await this.$store.dispatch("ape/getDepartments"))[1];
    this.getPendingVisits();
    this.getCompletedVisits();
  },
  methods: {
    getExamName(code) {
      return this.examsMap[code].name;
    },
    async showPxVisitInfo(visit) {
      this.currentVisit = visit;
      this.visitInfoVisible = true;
    },
    async showPxVisitPrintout(visit) {
      this.currentVisit = visit;
      this.visitPrintoutVisible = true;
    },
    formatRows(rows) {
      const map = {};

      for (const row of rows) {
        if (!map[row.id]) {
          map[row.id] = {
            id: row.id,
            patientId: row.patientId,
            physicianCode: row.physicianCode,
            createdBy: row.createdBy,
            dateTimeCreated: row.dateTimeCreated,
            completedBy: row.completedBy,
            dateTimeCompleted: row.dateTimeCompleted,
            remarks: row.remarks,

            patientIdentificationCode: row.patientIdentificationCode,

            patientCampusCode: row.patientCampusCode,
            patientAffiliationCode: row.patientAffiliationCode,
            patientDeptCode: row.patientDeptCode || row.patientCollegeCode,
            patientYearLevel: row.patientYearLevel,

            patientFirstName: row.patientFirstName,
            patientMiddleName: row.patientMiddleName,
            patientLastName: row.patientLastName,
            patientExtName: row.patientExtName,
            patientGender: row.patientGender,

            exams: [],
          };
        }

        if (row.visitExamId) {
          map[row.id].exams.push({
            id: row.visitExamId,
            visitId: row.visitExamVisitId,
            examCode: row.visitExamExamCode,
            createdBy: row.visitExamCreatedBy,
            dateTimeCreated: row.visitExamDateTimeCreated,
            acceptedBy: row.visitExamAcceptedBy,
            dateTimeAccepted: row.visitExamDateTimeAccepted,
            completedBy: row.visitExamCompletedBy,
            dateTimeCompleted: row.visitExamDateTimeCompleted,
          });
        }
      }

      return Object.values(map);
    },
    async getPendingVisits() {
      this.pendingVisitsLoading = true;

      const payload = Object.entries(this.pendingVisitsFilters).reduce(
        (acc, e) => {
          if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
          return acc;
        },
        {}
      );

      const response = await this.$store.dispatch("ape/getVisits", payload);

      if (response.error) {
        showMessage(this.$q, false, "Unable to fetch visits. Please try again");
        return;
      }

      await delay(1000);

      const formattedResponse = this.formatRows(response.body);
      this.pendingVisits = formattedResponse;
      this.pendingVisitsLoading = false;
    },
    async getCompletedVisits() {
      this.completedVisitsLoading = true;

      const response = await this.$store.dispatch(
        "ape/getVisits",
        this.completedVisitsFilters
      );

      if (response.error) {
        showMessage(this.$q, false, "Unable to fetch visits. Please try again");
        return;
      }

      await delay(1000);

      const formattedResponse = this.formatRows(response.body);
      this.completedVisits = formattedResponse;
      this.completedVisitsLoading = false;
    },
  },
});
</script>

<style>
#uerm-infirmary__visits-page__q-table {
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%;
}

#uerm-infirmary__visits-page__q-table thead tr:first-child th:first-child {
  /* bg color is important for th; just specify one */
  background-color: #f5f5f5;
}

#uerm-infirmary__visits-page__q-table td:first-child {
  /* background-color: #ffd600; */
  background-color: #f5f5f5;
}

#uerm-infirmary__visits-page__q-table th:first-child,
#uerm-infirmary__visits-page__q-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
}
</style>
