<template>
  <!-- class="row justify-center" -->
  <q-page :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
    <CardComponent class="full-width">
      <template v-slot:header>
        <PageHeader text="VISITS" icon="fa-solid fa-house-medical" />
      </template>
      <template v-slot:body>
        <div v-if="initialized">
          <div class="column full-width" style="gap: 36px">
            <div
              class="full-width"
              :class="$q.screen.gt.sm ? 'row' : 'column'"
              style="gap: 56px"
            >
              <div class="full-width">
                <div class="row items-start q-mb-md" style="gap: 16px">
                  <div
                    class="col-auto"
                    :class="$q.screen.gt.sm ? 'col' : 'col-12'"
                  >
                    <div
                      class="text-primary text-weight-medium text-uppercase q-pt-sm"
                      style="
                        font-size: 16px;
                        line-height: 16px;
                        letter-spacing: 0.8pt;
                      "
                    >
                      FILTER:
                    </div>
                  </div>
                  <div class="col">
                    <q-form @submit="getVisits">
                      <div
                        class="row items-start justify-end"
                        :class="$q.screen.gt.sm ? '' : 'q-mb-lg'"
                        :style="$q.screen.gt.sm ? { gap: '8px' } : {}"
                      >
                        <!-- <q-input
                        :disable="visitsLoading"
                        :class="$q.screen.gt.sm ? '' : 'full-width'"
                        :style="$q.screen.gt.sm ? { width: '100px' } : {}"
                        dense
                        stack-label
                        outlined
                        label="Year"
                        maxlength="4"
                        :rules="[requiredRule, yearRule]"
                        v-model.trim="visitsFilters.year"
                      /> -->
                        <q-select
                          :disable="visitsLoading"
                          debounce="750"
                          :class="$q.screen.gt.sm ? '' : 'full-width'"
                          :style="$q.screen.gt.sm ? { width: '100px' } : {}"
                          dense
                          stack-label
                          outlined
                          :options="
                            Array(1000)
                              .fill(null)
                              .map((e, idx) => 2024 + idx)
                          "
                          label="Year"
                          hint=""
                          :rules="[requiredRule, yearRule]"
                          v-model="visitsFilters.year"
                        />
                        <q-select
                          :disable="visitsLoading"
                          :class="$q.screen.gt.sm ? '' : 'full-width'"
                          dense
                          stack-label
                          outlined
                          emit-value
                          map-options
                          option-label="name"
                          option-value="code"
                          :options="campuses"
                          label="Campus"
                          hint=""
                          v-model="visitsFilters.patientCampusCode"
                        />
                        <q-select
                          :disable="visitsLoading"
                          :class="$q.screen.gt.sm ? '' : 'full-width'"
                          dense
                          stack-label
                          outlined
                          emit-value
                          map-options
                          option-label="name"
                          option-value="code"
                          :options="affiliations"
                          label="Affiliation"
                          hint=""
                          v-model="visitsFilters.patientAffiliationCode"
                        />
                        <q-input
                          :disable="visitsLoading"
                          :class="$q.screen.gt.sm ? '' : 'full-width'"
                          :style="$q.screen.gt.sm ? { width: '200px' } : {}"
                          dense
                          outlined
                          label="Patient Name"
                          maxlength="255"
                          debounce="250"
                          hint=""
                          :rules="[
                            (v) =>
                              v.length > 0 && v.length < 3
                                ? 'At least 3 letters is required.'
                                : undefined,
                          ]"
                          v-model.trim="visitsFilters.patientFullName"
                        >
                          <template v-slot:append>
                            <q-icon
                              v-if="visitsFilters.patientFullName !== ''"
                              size="xs"
                              name="close"
                              class="cursor-pointer"
                              @click="visitsFilters.patientFullName = ''"
                            />
                          </template>
                        </q-input>
                        <q-btn
                          :disable="visitsLoading"
                          :class="$q.screen.gt.sm ? '' : 'full-width'"
                          dense
                          class="text-black q-px-md q-py-sm"
                          unelevated
                          icon="sym_o_search"
                          color="accent"
                          label="SEARCH"
                          type="submit"
                        />
                      </div>
                    </q-form>
                  </div>
                </div>
                <div>
                  <FetchingData v-if="visitsLoading" />
                  <template v-else>
                    <template v-if="visits && visits.length > 0">
                      <div
                        v-if="$q.screen.gt.sm"
                        class="full-width relative-position"
                      >
                        <q-table
                          bordered
                          style="border-radius: 0"
                          id="uerm-infirmary__visits-page__q-table"
                          class="shadow-0"
                          :rows="visits"
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
                                <q-td v-else-if="column.name === 'visitExams'">
                                  <div
                                    class="row items-center no-wrap"
                                    style="gap: 6px"
                                  >
                                    <!-- :class="
                                        e.dateTimeAccepted
                                          ? 'text-positive'
                                          : 'text-negative'
                                      " -->
                                    <q-btn
                                      v-for="(e, idx) in props.row.exams"
                                      :key="idx"
                                      dense
                                      unelevated
                                      class="q-px-sm text-grey-8"
                                      style="font-size: 9pt"
                                      @click.stop="
                                        () => {
                                          visitInfoTabCode = e.examCode;
                                          showPxVisitInfo(props.row);
                                        }
                                      "
                                      :label="examsMap[e.examCode].name"
                                    />
                                  </div>
                                </q-td>
                                <q-td v-else-if="column.name === 'action'">
                                  <div
                                    class="row justify-center"
                                    style="gap: 8px; width: 100px"
                                  >
                                    <q-btn
                                      outline
                                      dense
                                      color="primary"
                                      style="
                                        padding-left: 10px;
                                        padding-right: 10px;
                                      "
                                      unelevated
                                      icon="sym_o_checklist"
                                      @click.stop="showPxVisitInfo(props.row)"
                                    />
                                    <q-btn
                                      dense
                                      class="bg-accent text-black"
                                      style="
                                        padding-left: 10px;
                                        padding-right: 10px;
                                      "
                                      unelevated
                                      icon="sym_o_print"
                                      @click.stop="
                                        showPxVisitPrintout(props.row)
                                      "
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
                                          .name
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
                          :items="visits"
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
                                  <q-badge class="bg-grey overflow-hidden">
                                    <span class="ellipsis">
                                      {{
                                        departmentsMap[item.patientDeptCode]
                                          .name
                                      }}
                                    </span>
                                  </q-badge>
                                  <q-badge
                                    v-if="item.patientYearLevel"
                                    class="bg-grey"
                                    >{{
                                      yearLevels.find(
                                        (l) =>
                                          l.code ===
                                          Number(item.patientYearLevel)
                                      )?.name
                                    }}</q-badge
                                  >
                                </div>
                              </q-item-label>
                            </q-item-section>
                            <q-item-section v-if="examsMap" side>
                              <!-- <q-btn
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
                            /> -->
                              <q-btn
                                outline
                                dense
                                style="
                                  padding-left: 10px;
                                  padding-right: 10px;
                                  min-width: 110px;
                                "
                                unelevated
                                class="q-mt-sm text-primary"
                                icon="sym_o_checklist"
                                label="EXAMS"
                                @click.stop="showPxVisitInfo(item)"
                              />
                              <q-btn
                                v-if="
                                  item.exams?.some((e) =>
                                    Boolean(e.dateTimeAccepted)
                                  )
                                "
                                dense
                                style="
                                  padding-left: 10px;
                                  padding-right: 10px;
                                  min-width: 110px;
                                "
                                unelevated
                                class="q-mt-sm bg-accent text-black"
                                icon="sym_o_print"
                                label="PRINT"
                                @click.stop="showPxVisitPrintout(item)"
                              />
                            </q-item-section>
                          </q-item>
                          <q-separator />
                        </q-virtual-scroll>
                      </div>
                      <div class="row items-center justify-between q-mt-md">
                        <q-badge color="grey-3" class="text-black q-pa-sm">
                          <span class="text-weight-bold">
                            {{ visits.length }}
                          </span>
                          &nbsp;item(s)
                        </q-badge>
                        <div
                          v-if="!visitsFilters?.patientFullName"
                          class="text-caption text-primary text-italic"
                        >
                          Only latest 20 visits are shown when patient name is
                          not supplied.
                        </div>
                      </div>
                    </template>
                    <NoResult v-else message="No visits found." />
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FetchingData v-else />
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
                name: 'dateTimeAccepted',
                label: 'Date & Time Added',
                field: 'dateTimeAccepted',
                format: (v) => {
                  if (!v) {
                    return '-';
                  }

                  return formatDate(v);
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
      :tabCode="visitInfoTabCode"
      :examsMap="examsMap"
      @close="
        () => {
          visitInfoTabCode = null;
          visitInfoVisible = false;
        }
      "
      @saved="getVisits()"
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
import { DateTime } from "luxon";

import {
  delay,
  formatDate,
  showMessage,
  // subtractDay,
  // jsDateToISOString,
  formatName,
} from "src/helpers/util.js";

import {
  affiliationsMap,
  affiliations,
  yearLevelsMap,
  yearLevels,
} from "src/helpers/constants.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "VisitsPage",
  components: {
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
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
      yearLevelsMap,
      yearLevels,

      showMessage,
      formatDate: (v) => {
        return DateTime.fromJSDate(v).toFormat("MMM d, yyyy h:mm a");
      },
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
          label: "DEPT/COLLEGE",
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
    };
  },
  data() {
    return {
      examsMap: null,
      visitsFilters: {
        year: new Date().getFullYear(),
        // visitDateRange: {
        //   from: jsDateToISOString(subtractDay(new Date(), 7), true).replace(
        //     /-/g,
        //     "/"
        //   ),
        //   to: jsDateToISOString(new Date(), true).replace(/-/g, "/"),
        // },
        patientFullName: "",
        patientCampusCode: null,
        patientAffiliationCode: null,
        // patientDeptCode: null,
        // patientYearLevel: null,
      },

      visitsLoading: false,
      visits: [],

      statusHistoryVisible: false,
      visitPrintoutVisible: false,

      visitInfoTabCode: null,
      visitInfoVisible: false,

      currentVisit: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      appConfig: "ape/appConfig",
      campuses: "ape/campuses",
      campusesMap: "ape/campusesMap",
      departments: "ape/departments",
      departmentsMap: "ape/departmentsMap",
    }),
    initialized() {
      return (
        this.user &&
        this.appConfig &&
        this.campuses &&
        this.campuses.length > 0 &&
        this.campusesMap &&
        this.departments &&
        this.departments.length > 0 &&
        this.departmentsMap
      );
    },
  },
  watch: {
    initialized: {
      async handler(val) {
        if (!val) {
          return;
        }

        this.visitsFilters.patientCampusCode =
          this.campusesMap.CAL?.code || null;

        this.visitsFilters.patientAffiliationCode =
          this.affiliationsMap.STU?.code || null;

        if (this.appConfig.visitsDefaultFiltersMap) {
          this.visitsFilters = {
            ...this.visitsFilters,
            ...this.appConfig.visitsDefaultFiltersMap,
          };
        }

        if (this.examsMap === null) {
          const examsResponse = await this.$store.dispatch("ape/getExams");

          if (examsResponse?.error) {
            this.showMessage(this.$q, false, "Error fetching exams.");
            return;
          }

          this.examsMap = examsResponse[1];
        }

        this.getVisits();
      },
      immediate: true,
    },
  },
  methods: {
    getExamName(code) {
      return this.examsMap[code].name;
    },
    showPxVisitInfo(visit) {
      this.currentVisit = visit;
      this.visitInfoVisible = true;
    },
    showPxVisitPrintout(visit) {
      this.currentVisit = visit;
      this.visitPrintoutVisible = true;
    },
    formatResponse(rows) {
      const map = {};

      for (const row of rows) {
        if (!map[row.id]) {
          map[row.id] = {
            id: row.id,
            patientId: row.patientId,
            physicianCode: row.physicianCode,
            createdBy: row.createdBy,
            dateTimeCreated: new Date(row.dateTimeCreated),
            completedBy: row.completedBy,
            dateTimeCompleted: new Date(row.dateTimeCompleted),
            remarks: row.remarks,

            patientCampusCode: row.patientCampusCode,
            patientAffiliationCode: row.patientAffiliationCode,
            patientIdentificationCode: row.patientIdentificationCode,
            patientFirstName: row.patientFirstName,
            patientMiddleName: row.patientMiddleName,
            patientLastName: row.patientLastName,
            patientExtName: row.patientExtName,
            patientGender: row.patientGender,
            patientDeptCode: row.patientDeptCode,
            patientYearLevel: row.patientYearLevel,

            exams: [],
          };
        }

        if (row.visitExamId) {
          map[row.id].exams.push({
            id: row.visitExamId,
            visitId: row.visitExamVisitId,
            examCode: row.visitExamExamCode,
            createdBy: row.visitExamCreatedBy,
            dateTimeCreated: new Date(row.visitExamDateTimeCreated),
            acceptedBy: row.visitExamAcceptedBy,
            dateTimeAccepted: new Date(row.visitExamDateTimeAccepted),
            completedBy: row.visitExamCompletedBy,
            dateTimeCompleted: new Date(row.visitExamDateTimeCompleted),
          });
        }
      }

      return Object.values(map).sort(
        (a, b) =>
          DateTime.fromJSDate(b.dateTimeCreated) -
          DateTime.fromJSDate(a.dateTimeCreated)
      );
    },
    async getVisits() {
      this.visitsLoading = true;

      const payload = Object.entries(this.visitsFilters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") {
          acc[e[0]] = e[1];
        }

        return acc;
      }, {});

      const response = await this.$store.dispatch("ape/getVisits", payload);
      await delay(1000);

      if (response.error) {
        this.showMessage(
          this.$q,
          false,
          "Unable to fetch visits. Please try again"
        );
        return;
      }

      this.visits = this.formatResponse(response.body);
      this.visitsLoading = false;
    },
  },
  mounted() {
    this.$store.dispatch("ape/getAppData");
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
