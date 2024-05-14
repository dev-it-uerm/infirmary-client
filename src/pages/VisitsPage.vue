<template>
  <q-page
    class="row justify-center bg-grey-3"
    :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'"
  >
    <q-card
      :style="
        $q.screen.lt.md
          ? { width: '100%' }
          : {
              width: '900px',
              maxWidth: '900px',
            }
      "
      class="column shadow-0 relative-position"
    >
      <PageHeader icon="info" text="VISITS" />
      <div class="full-width q-pa-xl">
        <div class="row" style="gap: 16px">
          <div
            class="col-auto q-pa-md"
            style="
              border: solid 1px rgba(0, 0, 0, 0.15);
              border-radius: 4px;
              width: 200px;
            "
          >
            <div class="text-primary text-weight-medium q-mb-md">FILTER:</div>
            <q-input
              :disable="loading"
              debounce="750"
              stack-label
              outlined
              label="Patient Name"
              v-model="filters.patientName"
              hint=""
            />
            <DateRange
              :disable="loading"
              stack-label
              outlined
              :subtractDaysCount="7"
              label="Date Range"
              :initialValue="filters.visitDateRange"
              @valueChanged="(val) => (filters.visitDateRange = val)"
            />
            <q-select
              :disable="loading"
              stack-label
              outlined
              emit-value
              map-options
              :options="[
                { value: null, label: 'All' },
                { value: 'EMP', label: 'Employee/Faculty' },
                { value: 'STU', label: 'Student' },
              ]"
              label="Patient Type"
              v-model="filters.patientTypeCode"
              hint=""
            />
            <div class="row justify-end">
              <q-btn
                color="primary"
                class="q-px-md q-py-xs"
                :disable="loading"
                :loading="loading"
                unelevated
                stack-label
                label="GO"
                hint=""
                @click="getVisits"
              />
            </div>
          </div>
          <div class="col">
            <!-- <ReminderCard
              v-if="reminderVisible"
              title="REMINDER"
              @close="reminderVisible = false"
            >
              <template v-slot:body> hello </template>
            </ReminderCard> -->
            <div
              class="relative-position bg-white"
              style="
                overflow-y: auto;
                display: grid;
                grid-template-rows: min-content auto;
                border: 1px solid rgba(0, 0, 0, 0.15);
                border-radius: 4px;
              "
            >
              <div v-if="loading" style="height: 150px">
                <div></div>
                <FetchingData />
              </div>
              <div v-else class="q-pa-md">
                <div v-if="visits && visits.length > 0">
                  <div class="q-pb-sm">
                    <q-badge color="accent" class="text-black q-pa-sm">
                      <span class="text-weight-bold">{{ visits.length }}</span
                      >&nbsp;items found.
                    </q-badge>
                  </div>
                  <q-virtual-scroll
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
                      class="full-width"
                      :key="index"
                      clickable
                      @click="showPxVisitInfo(item)"
                    >
                      <q-item-section>
                        <q-item-label caption class="ellipsis">{{
                          formatDate(item.dateTimeCreated)
                        }}</q-item-label>
                        <q-item-label overline class="q-mb-sm">{{
                          item.patientCode
                        }}</q-item-label>
                        <q-item-label class="text-weight-medium">{{
                          `${item.patientLastName}, ${item.patientFirstName} ${
                            item.patientMiddleName
                              ? item.patientMiddleName[0].concat(".")
                              : ""
                          }`.trim()
                        }}</q-item-label>
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
                              v-if="item.patientTypeCode"
                              class="bg-grey"
                              >{{
                                pxTypesMap[item.patientTypeCode].name
                              }}</q-badge
                            >
                          </div>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section v-if="visitPhasesMap" side>
                        <q-btn
                          class="bg-white"
                          unelevated
                          outline
                          color="primary"
                          @click.stop="
                            () => {
                              currentVisit = item;
                              statusHistoryVisible = true;
                            }
                          "
                          :label="getLatestPhase(item.phases)"
                        />
                      </q-item-section>
                      <!-- <q-item-section side top>
    <q-item-label caption>{{ formatDate(item.date, { dateOnly: true }) }}</q-item-label>
  </q-item-section> -->
                    </q-item>
                    <q-separator />
                  </q-virtual-scroll>
                </div>
                <div
                  v-else
                  style="height: 150px"
                  class="flex flex-center bg-white"
                >
                  <NoResult :bordered="false" message="No patient found." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
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
} from "src/helpers/util.js";

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
  },
  setup() {
    return {
      showMessage,
      formatDate,
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      filters: {
        patientName: null,
        visitDateRange: {
          from: jsDateToISOString(subtractDay(new Date(), 7), true).replace(
            /-/g,
            "/"
          ),
          to: jsDateToISOString(new Date(), true).replace(/-/g, "/"),
        },
        patientTypeCode: null,
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
      pxTypesMap: "app/pxTypesMap",
      campusesMap: "app/campusesMap",
      visitPhasesMap: "app/visitPhasesMap",
    }),
  },
  // watch: {
  //   filters: {
  //     handler(val) {
  //       console.log(val);
  //       if (!allPropsEmpty(val)) this.getVisits();
  //     },
  //     immediate: true,
  //     deep: true,
  //   },
  // },
  mounted() {
    this.getVisits();
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

      if (latestPhase) return this.visitPhasesMap[latestPhase.phaseCode].name;
      return "N/A";
    },
    async getVisits() {
      this.loading = true;

      const sanitizedFilters = Object.entries(this.filters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
        return acc;
      }, {});

      const response = await this.$store.dispatch(
        "visit/get",
        sanitizedFilters
      );

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
