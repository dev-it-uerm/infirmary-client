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
      <PageHeader icon="visits" text="VISITS" />
      <div class="full-width q-pa-xl">
        <ReminderCard
          v-if="reminderVisible"
          title="REMINDER"
          :paragraphs="['test', 'test 2']"
          @close="reminderVisible = false"
        />
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
              separator
              :items="visits"
              v-slot="{ item, index }"
            >
              <q-item class="full-width" :key="index">
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
                </q-item-section>
                <q-item-section v-if="visitStatusesMap" side>
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
            </q-virtual-scroll>
          </div>
          <div v-else style="height: 150px" class="flex flex-center bg-white">
            <NoResult :bordered="false" message="No diagnostic found." />
          </div>
        </template>
        <q-separator class="q-my-xl" />
      </div>
    </q-card>
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
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    MinimizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
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
      filters: { createdBy: "8225" },
      loading: false,
      uploading: false,
      visits: [],
      columns: [
        {
          name: "paymentChannel",
          field: "paymentChannel",
          required: true,
          label: "Payment Channel",
          align: "center",
          sortable: false,
          style: "width: 150px; max-width: 150px;",
          format: (val) => (!val ? "-" : val),
        },
        {
          name: "dateTimeUploaded",
          field: "dateTimeUploaded",
          required: true,
          label: "Date & Time Uploaded",
          align: "center",
          sortable: false,
          format: (val) => formatDate(val),
        },
        {
          name: "referenceNo",
          field: "referenceNo",
          label: "Reference Number",
          align: "center",
          sortable: false,
          style: "text-align: left; width: 150px; max-width: 150px;",
        },
        {
          name: "transactionDate",
          field: "transactionDate",
          label: "Transaction Date",
          align: "center",
          sortable: false,
          style: "width: 150px; max-width: 150px;",
          format: (val) => (!val ? "-" : formatDate(val, { dateOnly: true })),
        },
        {
          name: "amount",
          field: "amount",
          required: true,
          label: "Amount",
          align: "center",
          sortable: false,
          style: "text-align: right; width: 150px; max-width: 150px;",
          format: (val) =>
            val == null || val === 0 ? "-" : String(new Money(val)),
        },
        {
          name: "orNo",
          field: "orNo",
          label: "OR Number",
          align: "center",
          sortable: false,
          style: "width: 150px; max-width: 150px;",
          format: (val) => (!val ? "-" : val),
        },
        {
          name: "remarks",
          field: "remarks",
          label: "Remarks",
          align: "center",
          sortable: false,
          style: "width: 200px; max-width: 200px;",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      apiHost: "app/apiHost",
      visitStatusesMap: "app/visitStatusesMap",
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

      if (latestStatus) return this.visitStatusesMap[latestStatus.status].name;
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
  },
});
</script>
