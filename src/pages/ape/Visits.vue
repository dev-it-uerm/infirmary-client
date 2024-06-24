<template>
  <q-page class="row justify-center">
    <div
      :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'"
      :style="
        $q.screen.gt.md
          ? { minWidth: '1440px', maxWidth: '1440px' }
          : { minWidth: '100%' }
      "
      style="
        display: grid;
        grid-template-rows: min-content min-content auto;
        height: calc(100vh - 70px);
        gap: 16px;
      "
    >
      <PageHeader icon="fa-solid fa-house-medical" text="VISITS" />
      <CardComponent>
        <template v-slot:body>
          <div>
            <div class="text-primary text-weight-medium q-mb-md">FILTER:</div>
            <q-form @submit="getVisits">
              <div
                class="row item-center"
                :style="$q.screen.lt.md ? {} : { gap: '16px' }"
              >
                <!-- :options="[{ code: null, name: 'All' }, ...campuses]" -->
                <q-input
                  :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                  :style="{ minWidth: $q.screen.lt.md ? '100%' : '100px' }"
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
                      Number(val) <= 0
                        ? 'Should be a number more than 0.'
                        : undefined,
                  ]"
                  v-model.trim="filters.limit"
                />
                <q-input
                  :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                  :style="{ minWidth: $q.screen.lt.md ? '100%' : '100px' }"
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
                  :style="{ minWidth: $q.screen.lt.md ? '100%' : '150px' }"
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
                  :style="{ minWidth: $q.screen.lt.md ? '100%' : '150px' }"
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
                  v-model.trim="filters.identificationCode"
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
                    label="GO"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
          </div>
        </template>
      </CardComponent>
      <div class="row items-between" style="gap: 16px">
        <div
          class="full-height bg-red"
          :class="$q.screen.gt.md ? 'col-8' : 'col-12'"
        >
          <CardComponent class="full-height">
            <template v-slot:body>
              <div>
                <FetchingData v-if="loading" />
                <template v-else>
                  <div class="row items-center justify-between q-mb-md">
                    <div class="text-primary text-weight-medium">
                      PENDING VISITS:
                    </div>
                  </div>
                  <template v-if="pendingVisits && pendingVisits.length > 0">
                    <div
                      v-if="$q.screen.lt.md"
                      class="relative-position bg-white"
                      style="
                        overflow-y: auto;
                        display: grid;
                        grid-template-rows: min-content auto;
                      "
                    >
                      <q-virtual-scroll
                        style="
                          max-height: 100%;
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
                              :label="
                                item.dateTimeCompleted
                                  ? 'COMPLETED'
                                  : 'NOT COMPLETED'
                              "
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
                    <template v-else>
                      <q-separator />
                      <q-table
                        class="shadow-0"
                        :rows="pendingVisits"
                        :columns="columns"
                        hide-bottom
                      >
                        <template v-slot:body="props">
                          <q-tr
                            class="cursor-pointer"
                            @click.stop="showPxVisitInfo(props.row)"
                          >
                            <template v-for="column of columns">
                              <q-td
                                v-if="column.name === 'status'"
                                class="row justify-center"
                              >
                                <!-- <template
                                    v-for="latestPhase in [
                                      getLastExamCompleted(props.row.exams),
                                    ]"
                                  > -->
                                <!-- :label="latestPhase.name.toUpperCase()" -->
                                <!-- :class="phaseClassesMap[latestPhase.code]" -->
                                <q-btn
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
                                />
                                <!-- </template> -->
                              </q-td>
                              <q-td
                                v-else-if="column.name === 'dateTimeCreated'"
                              >
                                <span class="text-grey-7">
                                  {{ formatDate(props.row.dateTimeCreated) }}
                                </span>
                              </q-td>
                              <q-td v-else-if="column.name === 'action'">
                                <div class="row justify-center">
                                  <q-btn
                                    dense
                                    style="
                                      padding-left: 10px;
                                      padding-right: 10px;
                                    "
                                    unelevated
                                    color="primary"
                                    label="VIEW DETAILS"
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
                      <q-separator />
                      <div class="row justify-end q-mt-md">
                        <q-badge
                          color="accent"
                          class="text-black q-pa-sm"
                          :class="$q.screen.lt.md ? 'q-mt-md' : ''"
                        >
                          <span class="text-weight-bold">{{
                            pendingVisits.length
                          }}</span
                          >&nbsp;item/s.
                        </q-badge>
                      </div>
                    </template>
                  </template>
                  <NoResult v-else message="No pending visits found." />
                </template>
              </div>
            </template>
          </CardComponent>
        </div>
        <div :class="$q.screen.gt.md ? 'col' : 'col-12'">
          <CardComponent class="full-height">
            <template v-slot:body>
              <div>
                <FetchingData v-if="loading" />
                <template v-else>
                  <div class="text-primary text-weight-medium q-mb-md">
                    COMPLETED VISITS:
                  </div>
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
                        style="
                          max-height: 100%;
                          height: auto;
                          border-top: 1px solid rgba(0, 0, 0, 0.1);
                          border-left: 1px solid rgba(0, 0, 0, 0.1);
                          border-right: 1px solid rgba(0, 0, 0, 0.1);
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
                              @click.stop="showPxVisitInfo(item)"
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
            </template>
          </CardComponent>
        </div>
      </div>
    </div>
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
      :visitId="currentVisit.id"
      :patientId="currentVisit.patientId"
      :patientName="
        formatName(
          currentVisit.patientFirstName,
          currentVisit.patientMiddleName,
          currentVisit.patientLastName,
          currentVisit.patientExtName
        )
      "
      @close="visitInfoVisible = false"
    />
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
    VisitDetails: defineAsyncComponent(() =>
      import("src/components/VisitDetails.vue")
    ),
    NoResult: defineAsyncComponent(() =>
      import("src/components/core/NoResult.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
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
        // {
        //   name: "status",
        //   field: "status",
        //   label: "STATUS",
        //   align: "center",
        // },
        {
          name: "action",
          label: "ACTION",
          field: "action",
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
        identificationCode: "",

        // patientCollegeCode: null,
        // patientSchoolYear: null,
        // patientYearLevel: null,
      },
      loading: false,

      pendingVisits: [],
      completedVisits: [],

      statusHistoryVisible: false,
      visitInfoVisible: false,

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
        return {
          ...row,
          exams: rows2.filter((s) => s.visitId === row.id),
        };
      });

      const visits = formattedResponse.reduce(
        (acc, v) => {
          if (v.dateTimeCompleted) acc[1].push(v);
          else acc[0].push(v);

          return acc;
        },
        [[], []]
      );

      this.pendingVisits = visits[0];
      this.completedVisits = visits[1];

      this.loading = false;
    },
    async showPxVisitInfo(visit) {
      this.visitInfoVisible = true;
      this.currentVisit = visit;
      this.currentPatientId = visit.patientId;
    },
  },
});
</script>
