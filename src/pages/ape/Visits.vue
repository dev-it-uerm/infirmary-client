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
                    :disable="pendingVisitsLoading"
                    color="primary"
                    round
                    flat
                    dense
                    @click="getPendingVisits"
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
                      if (!pendingVisitsLoading)
                        pendingVisitsFilterVisible = true;
                    }
                  "
                >
                  <div
                    class="row text-uppercase"
                    style="gap: 6px; letter-spacing: 0.8pt"
                  >
                    <q-badge class="bg-grey" style="padding: 8px">
                      SHOWING {{ pendingVisitsFilters.limit }} VISITS
                    </q-badge>
                    <q-badge class="bg-grey" style="padding: 8px">
                      {{
                        campusesMap[pendingVisitsFilters.patientCampusCode]
                          ?.name
                      }}
                    </q-badge>
                    <q-badge class="bg-grey" style="padding: 8px">
                      {{
                        affiliationsMap[
                          pendingVisitsFilters.patientAffiliationCode
                        ]?.name
                      }}
                    </q-badge>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      :disable="pendingVisitsLoading"
                      color="primary"
                      round
                      flat
                      dense
                      @click.stop="pendingVisitsFilterVisible = true"
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
                <FetchingData v-if="pendingVisitsLoading" />
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
                            filteredPendingVisits.length
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
                        :items="filteredPendingVisits"
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
                    :disable="completedVisitsLoading"
                    color="primary"
                    round
                    flat
                    dense
                    @click="getCompletedVisits"
                  >
                    <q-icon
                      style="font-weight: bold"
                      name="fa-solid fa-arrows-rotate"
                      size="xs"
                    />
                  </q-btn>
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
    <AdvanceSearch
      v-if="pendingVisitsFilterVisible"
      :initialValue="pendingVisitsFilters"
      @close="pendingVisitsFilterVisible = false"
      @valueChanged="
        (val) => {
          pendingVisitsFilterVisible = false;
          pendingVisitsFilters = val;
          getPendingVisits();
        }
      "
    />
    <AdvanceSearch
      v-if="completedVisitsFilterVisible"
      :initialValue="completedVisitsFilters"
      @close="completedVisitsFilterVisible = false"
      @valueChanged="
        (val) => {
          completedVisitsFilterVisible = false;
          completedVisitsFilters = val;
          getCompletedVisits();
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
      @visitCompleted="
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
      pendingVisitsFilters: {
        limit: 99999,
        status: "PENDING",
        year: new Date().getFullYear(),
        // visitDateRange: {
        //   from: jsDateToISOString(subtractDay(new Date(), 7), true).replace(
        //     /-/g,
        //     "/"
        //   ),
        //   to: jsDateToISOString(new Date(), true).replace(/-/g, "/"),
        // },

        patientCampusCode: campusesMap.CAL.code,
        patientAffiliationCode: affiliationsMap.EMP.code,
        // patientName: null,

        // patientCollegeCode: null,
        // patientYearLevel: null,
      },

      completedVisitsFilters: {
        limit: 99999,
        status: "COMPLETED",
        year: new Date().getFullYear(),
        patientCampusCode: campusesMap.CAL.code,
        patientAffiliationCode: affiliationsMap.EMP.code,
      },

      pendingVisitsFilterStr: "",
      completedVisitsFilterStr: "",

      pendingVisitsLoading: false,
      completedVisitsLoading: false,

      pendingVisits: [],
      completedVisits: [],

      statusHistoryVisible: false,
      visitPrintoutVisible: false,

      visitInfoTabCode: null,
      visitInfoVisible: false,

      pendingVisitsFilterVisible: false,
      completedVisitsFilterVisible: false,

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
    if (this.user) {
      this.getPendingVisits();
      this.getCompletedVisits();
    }
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
    async getPendingVisits() {
      this.pendingVisitsLoading = true;

      const response = await this.$store.dispatch(
        "ape/getVisits",
        this.pendingVisitsFilters
      );

      if (response.error) {
        showMessage(this.$q, false, "Unable to fetch visits. Please try again");
        return;
      }

      await delay(1000);

      const responseRows1 = response.body[0];
      const responseRows2 = response.body[1];

      const formattedResponse1 = this.formatResponse(
        responseRows1,
        responseRows2
      );

      // const formattedResponse1 = Array(10)
      //   .fill(this.formatResponse(responseRows1, responseRows2))
      //   .flatMap((a) => a);

      this.pendingVisits = formattedResponse1;
      this.pendingVisitsFilterStr = "";
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

      const responseRows1 = response.body[0];
      const responseRows2 = response.body[1];

      const formattedResponse = this.formatResponse(
        responseRows1,
        responseRows2
      );

      this.completedVisits = formattedResponse;
      this.completedVisitsFilterStr = "";
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
