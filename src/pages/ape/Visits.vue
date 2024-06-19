<template>
  <q-page
    class="row justify-center"
    :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'"
  >
    <div
      class="column justify-start"
      style="gap: 16px"
      :style="$q.screen.gt.md ? { minWidth: '1440px' } : { minWidth: '100%' }"
    >
      <PageHeader icon="fa-solid fa-house-medical" text="VISITS" />
      <CardComponent>
        <template v-slot:body>
          <div class="text-primary text-weight-medium q-mb-md">FILTER:</div>
          <div
            class="row item-center"
            :style="$q.screen.lt.md ? {} : { gap: '16px' }"
          >
            <!-- :options="[{ code: null, name: 'All' }, ...campuses]" -->
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
              :options="campuses"
              label="Campus"
              hint=""
              v-model="filters.patientCampusCode"
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
              :options="affiliations"
              label="Affiliation"
              hint=""
              v-model="filters.patientAffiliationCode"
            />
            <template
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
            </template>
            <DateRange
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
            />
            <q-input
              :class="$q.screen.lt.md ? 'col-12' : 'col'"
              :dense="$q.screen.gt.sm"
              :disable="loading"
              debounce="750"
              stack-label
              outlined
              label="Patient Name"
              hint=""
              v-model="filters.patientName"
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
                @click="getVisits"
              />
            </div>
          </div>
          <div>
            <q-badge
              color="accent"
              class="text-black q-pa-sm"
              :class="$q.screen.lt.md ? 'q-mt-md' : ''"
            >
              <span class="text-weight-bold">{{ visits.length }}</span
              >&nbsp;items found.
            </q-badge>
          </div>
        </template>
      </CardComponent>
      <CardComponent>
        <template v-slot:body>
          <FetchingData v-if="loading" />
          <template v-else>
            <div class="text-primary text-weight-medium q-mb-md">
              VISIT LIST:
            </div>
            <template v-if="visits && visits.length > 0">
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
                  v-if="visits && visits.length > 0"
                  style="
                    max-height: 100%;
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
                      <q-item-label class="text-weight-medium text-uppercase">
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
                        <div class="row" style="gap: 6px">
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
                              affiliationsMap[item.patientAffiliationCode].name
                            }}</q-badge
                          >
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section v-if="visitPhasesMap" side>
                      <q-btn
                        dense
                        style="padding-left: 10px; padding-right: 10px"
                        class="q-mb-sm bg-white"
                        unelevated
                        outline
                        @click.stop="
                          () => {
                            currentVisit = item;
                            statusHistoryVisible = true;
                          }
                        "
                        :label="getLatestPhase(item.phases).name"
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
                <div v-else style="height: 150px" class="flex flex-center">
                  <NoResult :bordered="false" message="No patient found." />
                </div>
              </div>
              <template v-else>
                <q-separator />
                <q-table :rows="visits" :columns="columns" hide-bottom>
                  <template v-slot:body="props">
                    <q-tr
                      class="cursor-pointer"
                      @click.stop="showPxVisitInfo(props.row)"
                    >
                      <template v-for="column of columns">
                        <q-td
                          v-if="column.name === 'phases'"
                          class="row justify-center"
                        >
                          <template
                            v-for="latestPhase in [
                              getLatestPhase(props.row.phases),
                            ]"
                          >
                            <q-btn
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              :class="phaseClassesMap[latestPhase.code]"
                              unelevated
                              outline
                              @click.stop="
                                () => {
                                  currentVisit = props.row;
                                  statusHistoryVisible = true;
                                }
                              "
                              :label="latestPhase.name.toUpperCase()"
                            />
                          </template>
                        </q-td>
                        <q-td v-else-if="column.name === 'dateTimeCreated'">
                          <span class="text-grey-7">
                            {{ formatDate(props.row.dateTimeCreated) }}
                          </span>
                        </q-td>
                        <q-td v-else-if="column.name === 'action'">
                          <div class="row justify-center">
                            <q-btn
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              unelevated
                              color="primary"
                              label="DETAILS"
                              @click.stop="showPxVisitInfo(props.row)"
                            />
                          </div>
                        </q-td>
                        <q-td v-else-if="column.name === 'patientCampusCode'">
                          <div class="row justify-center">
                            <q-badge
                              v-if="props.row.patientCampusCode"
                              class="bg-grey"
                            >
                              {{
                                campusesMap[props.row.patientCampusCode].name
                              }}
                            </q-badge>
                          </div>
                        </q-td>
                        <q-td
                          v-else-if="column.name === 'patientAffiliationCode'"
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
                                    y.code === Number(props.row[column.name])
                                ).name
                              : ""
                          }}
                        </q-td>
                        <q-td v-else class="text-center">
                          {{ props.row[column.name] }}
                        </q-td>
                      </template>
                    </q-tr>
                  </template>
                </q-table>
                <q-separator />
              </template>
            </template>
            <NoResult v-else message="No visits found." />
          </template>
        </template>
      </CardComponent>
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
            :rows="currentVisit.phases"
            :columns="[
              {
                name: 'phaseCode',
                label: 'Phase',
                field: 'phaseCode',
                align: 'left',
                format: getPhaseName,
              },
              {
                name: 'createdBy',
                label: 'Added By',
                field: 'createdBy',
                align: 'left',
              },
              {
                name: 'dateTimeCreated',
                label: 'Date & Time Added',
                field: 'dateTimeCreated',
                format: formatDate,
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
  visitPhasesMap,
  visitPhases,
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
      visitPhases,
      visitPhasesMap,
      collegesMap,
      colleges,
      yearLevelsMap,
      yearLevels,
      showMessage,
      formatDate,
      yearRule: inputRules.year,
      formatName,
      phaseClassesMap: {
        REG: "text-grey-8",
        PE: "text-grey-8",
        LABCBC: "text-grey-8",
        LABURI: "text-grey-8",
        LABFCL: "text-grey-8",
        RADXRCHST: "text-grey-8",
        FIN: "text-positive",
      },
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
        {
          name: "phases",
          field: "phases",
          label: "LAST EXAM COMPLETED",
          align: "center",
        },
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
        visitDateRange: {
          from: jsDateToISOString(subtractDay(new Date(), 7), true).replace(
            /-/g,
            "/"
          ),
          to: jsDateToISOString(new Date(), true).replace(/-/g, "/"),
        },
        patientCampusCode: campusesMap.UERM.code,
        patientAffiliationCode: affiliationsMap.STU.code,
        patientName: null,

        patientCollegeCode: null,
        patientSchoolYear: null,
        patientYearLevel: null,
      },
      loading: false,
      visits: [],

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
    "filters.patientAffiliationCode": {
      handler(val) {
        if (val === affiliationsMap.STU.code) {
          this.filters.patientCollegeCode = collegesMap.MED.code;
          this.filters.patientYearLevel = yearLevelsMap.FIRST.code;
          this.filters.patientSchoolYear = new Date().getFullYear();
          return;
        }

        this.filters.patientCollegeCode = null;
        this.filters.patientYearLevel = null;
        this.filters.patientSchoolYear = null;
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.user) this.getVisits();
  },
  methods: {
    getPhaseName(phaseCode) {
      return this.visitPhasesMap[phaseCode].name;
    },
    getLatestPhase(phases) {
      const latestPhase = phases.reduce((acc, s) => {
        if (!acc) return s;
        if (acc.id < s.id) return s;
      }, null);

      if (latestPhase) return this.visitPhasesMap[latestPhase.phaseCode];
      return { code: "na", name: "N/A" };
    },
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

      const visits = response.body[0];
      const visitPhases = response.body[1];

      this.visits = visits.map((row) => {
        return {
          ...row,
          phases: visitPhases.filter((s) => s.visitId === row.id),
        };
      });

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
