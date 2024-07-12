<template>
  <!-- class="row justify-center" -->
  <q-page :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
    <CardComponent>
      <template v-slot:header>
        <PageHeader icon="fa-solid fa-house-medical" text="VISITS" />
      </template>
      <template v-slot:body>
        <div class="column full-width" style="gap: 36px">
          <div class="full-width">
            <div class="text-primary text-weight-medium">FILTER:</div>
            <div class="q-mt-md">
              <q-form @submit="getVisits">
                <div
                  class="row item-center"
                  :style="$q.screen.lt.md ? {} : { gap: '16px' }"
                >
                  <!-- :options="[{ code: null, name: 'All' }, ...campuses]" -->
                  <q-input
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :style="{
                      minWidth: $q.screen.lt.md ? '100%' : '100px',
                    }"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    debounce="750"
                    stack-label
                    outlined
                    label="Limit Items To"
                    hint=""
                    :rules="[
                      requiredRule,
                      (val) =>
                        Number(val) < 1 || Number(val) > 100
                          ? 'Should be 1 to 100 only.'
                          : undefined,
                    ]"
                    v-model.trim="filters.limit"
                  />
                  <q-input
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :style="{
                      minWidth: $q.screen.lt.md ? '100%' : '100px',
                    }"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    debounce="750"
                    stack-label
                    outlined
                    label="Year"
                    hint=""
                    :rules="[requiredRule, yearRule]"
                    v-model.trim="filters.year"
                  />
                  <!-- <q-select
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :style="{ minWidth: $q.screen.lt.md ? '100%' : '150px' }"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    stack-label
                    outlined
                    emit-value
                    map-options
                    :options="[
                      { value: null, label: 'All' },
                      { value: 'PENDING', label: 'Pending' },
                      { value: 'COMPLETED', label: 'Completed' },
                    ]"
                    label="Status"
                    hint=""
                    v-model="filters.status"
                  /> -->
                  <q-select
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :style="{
                      minWidth: $q.screen.lt.md ? '100%' : '150px',
                    }"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    stack-label
                    outlined
                    emit-value
                    map-options
                    option-label="name"
                    option-value="code"
                    :options="campuses"
                    label="Campus"
                    hint=""
                    v-model="filters.patientCampusCode"
                  />
                  <q-select
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :style="{
                      minWidth: $q.screen.lt.md ? '100%' : '150px',
                    }"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    stack-label
                    outlined
                    emit-value
                    map-options
                    option-label="name"
                    option-value="code"
                    :options="affiliations"
                    label="Affiliation"
                    hint=""
                    v-model="filters.patientAffiliationCode"
                  />
                  <!-- <template
                  v-if="filters.patientAffiliationCode === affiliationsMap.STU.code"
                >
                  <q-input
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :dense="$q.screen.gt.sm"
                    class="col-auto"
                    :disable="loading"
                    stack-label
                    outlined
                    maxlength="4"
                    label="School Year"
                    :rules="[yearRule]"
                    v-model.trim="filters.patientSchoolYear"
                  />
                  <q-select
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    stack-label
                    outlined
                    emit-value
                    map-options
                    option-label="name"
                    option-value="code"
                    :options="colleges"
                    label="College"
                    v-model="filters.patientCollegeCode"
                    hint=""
                  />
                  <q-select
                    :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    stack-label
                    outlined
                    emit-value
                    map-options
                    option-label="name"
                    option-value="code"
                    :options="yearLevels"
                    label="Year Level"
                    v-model="filters.patientYearLevel"
                    hint=""
                  />
                </template> -->
                  <!-- <DateRange
                  :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                  :dense="$q.screen.gt.sm"
                  :disable="loading"
                  stack-label
                  outlined
                  :subtractDaysCount="7"
                  label="Visit Date Range"
                  hint=""
                  :initialValue="filters.visitDateRange"
                  @valueChanged="(val) => (filters.visitDateRange = val)"
                /> -->
                  <!-- <q-input
                  :class="$q.screen.lt.md ? 'col-12' : 'col'"
                  :dense="$q.screen.gt.sm"
                  :disable="loading"
                  debounce="750"
                  stack-label
                  outlined
                  label="Patient Name"
                  hint=""
                  v-model.trim="filters.patientName"
                /> -->
                  <q-input
                    :class="$q.screen.lt.md ? 'col-12' : 'col'"
                    :dense="$q.screen.gt.sm"
                    :disable="loading"
                    debounce="750"
                    stack-label
                    outlined
                    label="Employee/Student Number"
                    hint=""
                    v-model.trim="identificationCodeFilter"
                  />
                  <div
                    class="row items-start justify-end"
                    :class="$q.screen.lt.md ? 'full-width' : ''"
                  >
                    <q-btn
                      style="height: 40px"
                      color="primary"
                      class="q-px-md q-py-xs"
                      :disable="loading"
                      :loading="loading"
                      unelevated
                      stack-label
                      label="FILTER"
                      type="submit"
                    />
                  </div>
                </div>
              </q-form>
            </div>
          </div>
          <div
            class="full-width"
            :class="$q.screen.gt.md ? 'row' : 'column'"
            style="gap: 46px"
          >
            <div :class="$q.screen.gt.md ? 'col' : 'full-width'">
              <FetchingData v-if="loading" />
              <template v-else>
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-primary text-weight-medium">
                    PENDING VISITS:
                  </div>
                </div>
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
                              v-else-if="column.name === 'examsCompleted'"
                              class="flex flex-center"
                            >
                              <div>{{ props.row.examNames }}</div>
                              <!-- <q-btn
                                  dense
                                  style="
                                    padding-left: 10px;
                                    padding-right: 10px;
                                  "
                                  :class="
                                    props.row.dateTimeCompleted
                                      ? 'text-positive'
                                      : 'text-grey-8'
                                  "
                                  unelevated
                                  outline
                                  @click.stop="
                                    () => {
                                      currentVisit = props.row;
                                      statusHistoryVisible = true;
                                    }
                                  "
                                  :label="
                                    props.row.dateTimeCompleted
                                      ? 'COMPLETED'
                                      : 'NOT COMPLETED'
                                  "
                                /> -->
                            </q-td>
                            <q-td v-else-if="column.name === 'action'">
                              <div class="row justify-center">
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
                              </div>
                            </q-td>
                            <q-td
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
                            </q-td>
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
                              v-else-if="column.name === 'patientCollegeCode'"
                              class="text-center"
                            >
                              {{
                                props.row[column.name]
                                  ? collegesMap[props.row[column.name]].name
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
                            dense
                            style="padding-left: 10px; padding-right: 10px"
                            class="q-mb-sm bg-white"
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
                            color="primary"
                            label="DETAILS"
                            @click.stop="showPxVisitInfo(item)"
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
            <div :class="$q.screen.gt.md ? 'col-3' : 'full-width'">
              <FetchingData v-if="loading" />
              <template v-else>
                <div class="text-primary text-weight-medium q-mb-md">
                  COMPLETED VISITS:
                </div>
                <template v-if="completedVisits && completedVisits.length > 0">
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
                      :style="$q.screen.gt.md ? { maxHeight: '500px' } : {}"
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
                          <!-- <q-item-label overline class="q-mb-sm">{{
                              item.patientIdentificationCode
                            }}</q-item-label> -->
                          <q-item-label caption class="ellipsis q-mb-xs">{{
                            formatDate(item.dateTimeCreated)
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
                            class="q-mb-sm"
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
                            color="primary"
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
      </template>
    </CardComponent>
    <MinimizedDialog
      v-if="statusHistoryVisible"
      title="HISTORY"
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
                label: 'Exam',
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
    <VisitDetails
      v-if="visitInfoVisible"
      :visit="currentVisit"
      @close="visitInfoVisible = false"
      @visitCompleted="getVisits"
    />
    <MaximizedDialog
      v-if="visitPrintoutVisible"
      title="PRINT VISIT"
      @close="() => (visitPrintoutVisible = false)"
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
  subtractDay,
  jsDateToISOString,
  allPropsEmpty,
  formatName,
} from "src/helpers/util.js";

import {
  affiliationsMap,
  affiliations,
  campusesMap,
  campuses,
  examsMap,
  exams,
  collegesMap,
  colleges,
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
      import("src/components/VisitDetails.vue")
    ),
    NoResult: defineAsyncComponent(() =>
      import("src/components/core/NoResult.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    PrintoutVisitDetails: defineAsyncComponent(() =>
      import("src/components/printouts/VisitDetails.vue")
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
      collegesMap,
      colleges,
      yearLevelsMap,
      yearLevels,
      showMessage,
      formatDate,
      formatName,
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
      // phaseClassesMap: {
      //   REG: "text-grey-8",
      //   PE: "text-grey-8",
      //   LABCBC: "text-grey-8",
      //   LABURI: "text-grey-8",
      //   LABFCL: "text-grey-8",
      //   RADXRCHST: "text-grey-8",
      //   FIN: "text-positive",
      // },
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
        {
          name: "patientCampusCode",
          field: "patientCampusCode",
          label: "CAMPUS",
          align: "center",
          // format: (val) => `${val}`,
          // sortable: true,
        },
        {
          name: "patientAffiliationCode",
          field: "patientAffiliationCode",
          label: "AFFILIATION",
          align: "center",
        },
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
          name: "patientCollegeCode",
          field: "patientCollegeCode",
          label: "COLLEGE",
          align: "center",
        },
        {
          name: "patientSchoolYear",
          field: "patientSchoolYear",
          label: "SCHOOL YEAR",
          align: "center",
        },
        {
          name: "patientYearLevel",
          field: "patientYearLevel",
          label: "YEAR LEVEL",
          align: "center",
        },
        {
          name: "examsCompleted",
          field: "examNames",
          label: "EXAMS COMPLETED",
          align: "center",
        },
      ],
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      filters: {
        limit: 50,
        status: null,
        year: new Date().getFullYear(),
        // visitDateRange: {
        //   from: jsDateToISOString(subtractDay(new Date(), 7), true).replace(
        //     /-/g,
        //     "/"
        //   ),
        //   to: jsDateToISOString(new Date(), true).replace(/-/g, "/"),
        // },

        patientCampusCode: campusesMap.UERM.code,
        patientAffiliationCode: affiliationsMap.STU.code,
        // patientName: null,

        // patientCollegeCode: null,
        // patientSchoolYear: null,
        // patientYearLevel: null,
      },

      identificationCodeFilter: "",

      loading: false,

      pendingVisits: [],
      completedVisits: [],

      statusHistoryVisible: false,
      visitInfoVisible: false,
      visitPrintoutVisible: false,

      currentVisit: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    // "filters.patientAffiliationCode": {
    //   handler(val) {
    //     if (val === affiliationsMap.STU.code) {
    //       this.filters.patientCollegeCode = collegesMap.MED.code;
    //       this.filters.patientYearLevel = yearLevelsMap.FIRST.code;
    //       this.filters.patientSchoolYear = new Date().getFullYear();
    //       return;
    //     }
    //     this.filters.patientCollegeCode = null;
    //     this.filters.patientYearLevel = null;
    //     this.filters.patientSchoolYear = null;
    //   },
    //   immediate: true,
    // },
  },
  mounted() {
    if (this.user) this.getVisits();
  },
  methods: {
    getExamName(code) {
      return this.examsMap[code].name;
    },
    // getLastExamCompleted(exams) {
    //   const completedExams = exams.filter((e) => e.dateTimeCompleted);

    //   const latestExam = completedExams.reduce((acc, s) => {
    //     if (!acc) return s;
    //     if (acc.id < s.id) return s;
    //   }, null);

    //   if (latestExam) return this.examsMap[latestExam.examCode];
    //   return { code: "na", name: "N/A" };
    // },
    async getVisits() {
      this.loading = true;

      const sanitizedFilters = Object.entries(this.filters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
        return acc;
      }, {});

      const response = await this.$store.dispatch("ape/get", sanitizedFilters);

      if (response.error) {
        showMessage(this.$q, false, "Unable to fetch visits. Please try again");
        return;
      }

      await delay(1000);

      const rows1 = response.body[0];
      const rows2 = response.body[1];

      const formattedResponse = rows1.map((row) => {
        const exams = rows2.filter((r) => r.visitId === row.id);

        const examNames = exams
          .filter((e) => e.dateTimeCompleted)
          .map((e) => examsMap[e.examCode].name)
          .join(", ");

        return {
          ...row,
          exams,
          examNames,
        };
      });

      const visits = formattedResponse.reduce(
        (acc, v) => {
          if (v.dateTimeCompleted) {
            acc[1].push(v);
            return acc;
          }

          if (!this.identificationCodeFilter) {
            acc[0].push(v);
            return acc;
          }

          if (this.identificationCodeFilter === v.patientIdentificationCode) {
            acc[0].push(v);
            return acc;
          }

          return acc;
        },
        [[], []]
      );

      this.pendingVisits = visits[0];
      // this.pendingVisits = Array(50).fill(visits[0][0]);
      this.completedVisits = visits[1];

      this.loading = false;
    },
    async showPxVisitInfo(visit) {
      this.currentVisit = visit;
      this.visitInfoVisible = true;
    },
    async showPxVisitPrintout(visit) {
      this.currentVisit = visit;
      this.visitPrintoutVisible = true;
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
