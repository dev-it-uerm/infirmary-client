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
                @click="showPxVisitInfo(item.id, item.patientCode)"
              >
                <q-item-section>
                  <q-item-label caption class="ellipsis">{{
                    formatDate(item.dateTimeCreated)
                  }}</q-item-label>
                  <q-item-label overline class="q-mb-sm">{{
                    item.patientCode
                  }}</q-item-label>
                  <q-item-label class="text-weight-medium">{{
                    `${item.lastName}, ${item.firstName} ${
                      item.middleName ? item.middleName[0].concat(".") : ""
                    }`.trim()
                  }}</q-item-label>
                  <q-item-label caption>
                    <div class="row" style="gap: 6px">
                      <q-badge v-if="item.type" class="bg-grey">{{
                        pxTypesMap[item.type].name
                      }}</q-badge>
                      <q-badge v-if="item.campus" class="bg-grey">{{
                        campusesMap[item.campus].name
                      }}</q-badge>
                    </div>
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="visitStatusMap" side>
                  <q-btn
                    unelevated
                    outline
                    :label="getLatestStatus(item.statuses)"
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
    <MaximizedDialog
      v-if="visitInfoVisible"
      title="Visit Details"
      @close="visitInfoVisible = false"
    >
      <template v-slot:body>
        <VisitDetails
          :visitId="currentVisitId"
          :patientCode="currentPatientCode"
        />
      </template>
    </MaximizedDialog>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, formatDate, showMessage } from "src/helpers/util.js";
import MaximizedDialog from "src/components/core/MaximizedDialog.vue";

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
    MaximizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MaximizedDialog.vue")
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
      filters: { patientCode: "px456" },
      loading: false,
      visits: [],

      visitInfoVisible: false,
      currentVisitId: 0,
      currentPatientCode: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      apiHost: "app/apiHost",
      pxTypesMap: "app/pxTypesMap",
      campusesMap: "app/campusesMap",
      visitStatusMap: "app/visitStatusMap",
    }),
  },
  async mounted() {
    this.getVisits();
  },
  methods: {
    getLatestStatus(statuses) {
      const latestStatus = statuses.reduce((acc, s) => {
        if (!acc) return s;
        if (acc.id < s.id) return s;
      }, null);

      if (latestStatus) return this.visitStatusMap[latestStatus.status].name;
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
      const visitStatuses = response.body[1];

      this.visits = visits.map((row) => {
        return {
          ...row,
          statuses: visitStatuses.filter((s) => s.visitId === row.id),
        };
      });

      this.loading = false;
    },
    async showPxVisitInfo(visitId, patientCode) {
      this.visitInfoVisible = true;
      this.currentVisitId = visitId;
      this.currentPatientCode = patientCode;
    },
  },
});
</script>
