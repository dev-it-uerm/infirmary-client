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
        <!-- <ReminderCard
          v-if="reminderVisible"
          title="REMINDER"
          @close="reminderVisible = false"
        >
          <template v-slot:body> hello </template>
        </ReminderCard> -->
        <template v-if="loading">
          <div>LOADING...</div>
        </template>
        <template v-else>
          <div
            v-if="visits && visits.length > 0"
            class="fit relative-position q-pa-md bg-white"
            style="
              overflow-y: auto;
              display: grid;
              grid-template-rows: min-content auto;
            "
          >
            <div class="q-pb-sm">
              <q-badge color="accent" class="text-black q-pa-sm">
                <span class="text-weight-bold">{{ visits.length }}</span
                >&nbsp;items found.
              </q-badge>
            </div>
            <q-virtual-scroll
              bordered
              style="max-height: 100%; height: auto"
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
                      <q-badge v-if="item.patientCampusCode" class="bg-grey">{{
                        campusesMap[item.patientCampusCode].name
                      }}</q-badge>
                      <q-badge v-if="item.patientTypeCode" class="bg-grey">{{
                        pxTypesMap[item.patientTypeCode].name
                      }}</q-badge>
                    </div>
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="visitPhasesMap" side>
                  <q-btn
                    class="bg-white"
                    unelevated
                    outline
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
          <div v-else style="height: 150px" class="flex flex-center bg-white">
            <NoResult :bordered="false" message="No diagnostic found." />
          </div>
        </template>
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
                label: 'Assigned By',
                field: 'createdBy',
                align: 'left',
              },
              {
                name: 'dateTimeCreated',
                label: 'Date & Time Assigned',
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
import { delay, formatDate, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "VisitsPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // ReminderCard: defineAsyncComponent(() =>
    //   import("src/components/core/ReminderCard.vue")
    // ),
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
      filters: { patientCode: "px123" },
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
  async mounted() {
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

      await delay(2000);
      const response = await this.$store.dispatch("visit/get", this.filters);

      if (response.error) {
        showMessage(this.$q, false, "Unable to fetch visits. Please try again");
        return;
      }

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
