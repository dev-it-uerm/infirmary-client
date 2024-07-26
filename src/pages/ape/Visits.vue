<template>
  <!-- class="row justify-center" -->
  <q-page :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
    <CardComponent>
      <template v-slot:header>
        <PageHeader icon="fa-solid fa-house-medical" text="VISITS" />
      </template>
      <template v-slot:body>
        <div class="column full-width" style="gap: 36px">
          <div
            class="full-width"
            :class="$q.screen.gt.md ? 'row' : 'column'"
            style="gap: 56px"
          >
            <div :class="$q.screen.gt.md ? 'col' : 'full-width'">
              <div class="row items-center q-mb-md" style="gap: 16px">
                <div
                  class="row items-center no-wrap"
                  :class="$q.screen.gt.md ? 'col' : 'col-12'"
                  style="gap: 12px"
                >
                  <div
                    class="text-primary text-weight-medium text-uppercase"
                    style="
                      font-size: 16px;
                      line-height: 16px;
                      letter-spacing: 0.8pt;
                    "
                  >
                    PENDING VISITS:
                  </div>
                  <q-btn
                    :disable="loading"
                    color="primary"
                    round
                    flat
                    dense
                    @click="getVisits"
                  >
                    <q-icon
                      style="font-weight: bold"
                      name="fa-solid fa-arrows-rotate"
                      size="xs"
                    />
                  </q-btn>
                </div>
                <div
                  class="row items-center justify-end"
                  :class="$q.screen.gt.md ? 'col-auto' : 'col-12'"
                  style="gap: 10px; cursor: pointer"
                  @click="
                    () => {
                      if (!loading) filterDialogVisible = true;
                    }
                  "
                >
                  <div
                    class="row text-uppercase"
                    style="gap: 6px; letter-spacing: 0.8pt"
                  >
                    <q-badge class="bg-grey" style="padding: 8px">
                      SHOWING {{ filters.limit }} VISITS
                    </q-badge>
                    <q-badge class="bg-grey" style="padding: 8px">
                      {{ campusesMap[filters.patientCampusCode]?.name }}
                    </q-badge>
                    <q-badge class="bg-grey" style="padding: 8px">
                      {{
                        affiliationsMap[filters.patientAffiliationCode]?.name
                      }}
                    </q-badge>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      :disable="loading"
                      color="primary"
                      round
                      flat
                      dense
                      @click.stop="filterDialogVisible = true"
                    >
                      <q-icon
                        style="font-weight: bold"
                        name="fa-solid fa-magnifying-glass"
                        size="xs"
                      />
                    </q-btn>
                  </div>
                </div>
              </div>
              <div>
                <FetchingData v-if="loading" />
                <template v-else>
                  <q-input
                    :style="$q.screen.gt.md ? { maxWidth: '200px' } : {}"
                    dense
                    outlined
                    debounce="750"
                    label="Filter"
                    maxlength="255"
                    hint=""
                    v-model.trim="pendingVisitsFilterStr"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="pendingVisitsFilterStr !== ''"
                        size="xs"
                        name="close"
                        class="cursor-pointer"
                        @click="pendingVisitsFilterStr = ''"
                      />
                      <q-icon name="filter_alt" size="xs" />
                    </template>
                  </q-input>
                  <template
                    v-if="
                      filteredPendingVisits && filteredPendingVisits.length > 0
                    "
                  >
                    <div
                      class="full-width relative-position"
                      v-if="$q.screen.gt.md"
                    >
                      <q-table
                        bordered
                        style="border-radius: 0"
                        id="uerm-infirmary__visits-page__q-table"
                        class="shadow-0"
                        :rows="filteredPendingVisits"
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
                                  v-if="
                                    item.patientCollegeCode ||
                                    item.patientDeptCode
                                  "
                                  class="bg-grey"
                                  >{{
                                    collegesMap[item.patientCollegeCode]
                                      ?.name ??
                                    departmentsMap[item.patientDeptCode]?.name
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
                              class="text-black"
                              color="accent"
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
                    class="col-auto"
                    :disable="loading"
                    color="primary"
                    round
                    flat
                    dense
                    @click="getVisits"
                  >
                    <q-icon
                      style="font-weight: bold"
                      name="fa-solid fa-arrows-rotate"
                      size="xs"
                    />
                  </q-btn>
                  <q-btn
                    :disable="loading"
                    color="primary"
                    round
                    flat
                    dense
                    @click="filterDialogVisible = true"
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
                <FetchingData v-if="loading" />
                <template v-else>
                  <q-input
                    dense
                    outlined
                    debounce="750"
                    label="Filter"
                    maxlength="255"
                    hint=""
                    v-model.trim="completedVisitsFilterStr"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="completedVisitsFilterStr !== ''"
                        size="xs"
                        name="close"
                        class="cursor-pointer"
                        @click="completedVisitsFilterStr = ''"
                      />
                      <q-icon name="filter_alt" size="xs" />
                    </template>
                  </q-input>
                  <template
                    v-if="
                      filteredCompletedVisits &&
                      filteredCompletedVisits.length > 0
                    "
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
                        :items="filteredCompletedVisits"
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
                              class="text-black"
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
      </template>
    </CardComponent>
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
    <MinimizedDialog
      v-if="filterDialogVisible"
      title="ADVANCE SEARCH"
      widthOnDesktop="400px"
      @close="filterDialogVisible = false"
    >
      <template v-slot:body>
        <div>
          <q-form
            @submit="
              () => {
                filterDialogVisible = false;
                getVisits();
              }
            "
          >
            <div class="column q-pa-lg" style="padding: 36px">
              <!-- :options="[{ code: null, name: 'All' }, ...campuses]" -->
              <q-input
                :disable="loading"
                debounce="750"
                stack-label
                outlined
                label="Limit Result To"
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
                  <q-select
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
                  :disable="loading"
                  debounce="750"
                  stack-label
                  outlined
                  label="Patient Name"
                  hint=""
                  v-model.trim="filters.patientName"
                /> -->
              <div class="row items-start justify-end">
                <q-btn
                  style="height: 40px"
                  color="accent"
                  class="q-px-md q-py-xs text-black"
                  :disable="loading"
                  :loading="loading"
                  unelevated
                  icon="search"
                  stack-label
                  label="SEARCH"
                  type="submit"
                />
              </div>
            </div>
          </q-form>
        </div>
      </template>
    </MinimizedDialog>
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
      @visitCompleted="getVisits"
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
  departmentsMap,
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
      departmentsMap,
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
          name: "patientCollegeCode",
          field: "patientCollegeCode",
          label: "COLLEGE",
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

        patientCampusCode: campusesMap.CAL.code,
        patientAffiliationCode: affiliationsMap.STU.code,
        // patientName: null,

        // patientCollegeCode: null,
        // patientYearLevel: null,
      },

      pendingVisitsFilterStr: "",
      completedVisitsFilterStr: "",

      loading: false,

      pendingVisits: [],
      completedVisits: [],

      statusHistoryVisible: false,
      visitPrintoutVisible: false,

      visitInfoTabCode: null,
      visitInfoVisible: false,

      filterDialogVisible: false,
      currentVisit: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
    filteredPendingVisits() {
      return this.getFilteredVisits(
        this.pendingVisits,
        this.pendingVisitsFilterStr
      );
    },
    filteredCompletedVisits() {
      return this.getFilteredVisits(
        this.completedVisits,
        this.completedVisitsFilterStr
      );
    },
  },
  mounted() {
    if (this.user) this.getVisits();
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
    getFilteredVisits(visits, searchStr) {
      if (!searchStr || searchStr.length < 3) return [...visits];

      const lowerCasedSearchStr = searchStr.toLowerCase();

      return visits.filter((v) => {
        return Boolean(
          v.patientIdentificationCode.includes(searchStr) ||
            v.patientFirstName.toLowerCase().includes(lowerCasedSearchStr) ||
            v.patientMiddleName?.toLowerCase().includes(lowerCasedSearchStr) ||
            v.patientLastName.toLowerCase().includes(lowerCasedSearchStr) ||
            v.patientExtName?.toLowerCase().includes(lowerCasedSearchStr)
        );
      });
    },
    formatResponse(rows1, rows2) {
      return rows1.map((row) => {
        return {
          ...row,
          exams: rows2.filter((r) => r.visitId === row.id),
        };
      });
    },
    async getVisits() {
      this.loading = true;

      const sanitizedFilters = Object.entries(this.filters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
        return acc;
      }, {});

      const response1 = await this.$store.dispatch(
        "ape/getVisitsPending",
        sanitizedFilters
      );

      const response2 = await this.$store.dispatch(
        "ape/getVisitsCompleted",
        sanitizedFilters
      );

      if (response1.error || response2.error) {
        showMessage(this.$q, false, "Unable to fetch visits. Please try again");
        return;
      }

      await delay(1000);

      const response1Rows1 = response1.body[0];
      const response1Rows2 = response1.body[1];
      const response2Rows1 = response2.body[0];
      const response2Rows2 = response2.body[1];

      const formattedResponse1 = this.formatResponse(
        response1Rows1,
        response1Rows2
      );

      const formattedResponse2 = this.formatResponse(
        response2Rows1,
        response2Rows2
      );

      this.pendingVisits = formattedResponse1;
      this.completedVisits = formattedResponse2;

      this.pendingVisitsFilterStr = "";
      this.completedVisitsFilterStr = "";
      this.loading = false;
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
