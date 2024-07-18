<template>
  <q-page :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
    <CardComponent class="full-width">
      <template v-slot:header>
        <PageHeader text="ANALYTICS" icon="fa-solid fa-chart-pie" />
      </template>
      <template v-slot:body>
        <div
          :class="$q.screen.gt.md ? 'row items-start' : 'column'"
          style="gap: 36px"
        >
          <div
            class="bordered-grey q-pa-lg"
            :class="$q.screen.gt.md ? 'col-2' : ''"
          >
            <div class="text-primary text-weight-medium q-mb-lg">FILTER:</div>
            <div>
              <q-form @submit="getData">
                <q-input
                  :disable="loading"
                  class="bg-white"
                  stack-label
                  outlined
                  label="Duration"
                  :model-value="dateRangeStr"
                  :rules="[inputRule]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        :breakpoint="600"
                        ref="dateRangePopUp"
                      >
                        <q-date
                          style="border-color: rgba(0, 0, 0, 0.25)"
                          v-model="dateRange"
                          range
                          minimal
                          mask="YYYY/MM/DD"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="row justify-end">
                  <q-btn
                    :disable="loading"
                    type="submit"
                    label="GENERATE"
                    class="text-black"
                    color="accent"
                    unelevated
                  />
                </div>
              </q-form>
            </div>
          </div>
          <div
            class="q-pa-lg bordered-grey"
            :class="$q.screen.gt.md ? 'col' : ''"
          >
            <div class="text-primary text-weight-medium q-mb-lg">
              NUMBER OF VISITS PER DAY
            </div>
            <ApexCharts
              v-if="chartDataReady === true"
              type="bar"
              height="350"
              :options="chartOptions"
              :series="chartSeries"
            />
            <FetchingData v-else-if="chartDataReady === false" />
            <ReminderCard v-else>
              <template v-slot:body>
                <div class="full-width">
                  Choose a date range then click the
                  <strong>GENERATE</strong> button to see the graph.
                </div>
              </template>
            </ReminderCard>
          </div>
        </div>
      </template>
    </CardComponent>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import ApexCharts from "vue3-apexcharts";
import { isStr, formatDate, delay, showMessage } from "src/helpers/util.js";
import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "AnalyticsPage",
  components: {
    ApexCharts,
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
  },
  setup() {
    return {
      inputRule: inputRules.required,
    };
  },
  data() {
    return {
      loading: false,
      dateRange: null,

      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
          tickAmount: 1, // minimum x points
          labels: {
            formatter: (val) => {
              return val.toFixed(0);
            },
          },
        },
        tooltip: {
          y: {
            formatter: (val) => {
              return val.toFixed(0);
            },
          },
        },
        fill: { colors: ["#ffd600"] },
      },
      chartSeries: [{ data: [] }],
      chartDataReady: null,
    };
  },
  computed: {
    dateRangeStr() {
      if (this.dateRange) {
        if (isStr(this.dateRange)) {
          return `${this.dateRange} - ${this.dateRange}`;
        }

        return `${this.dateRange.from} - ${this.dateRange.to}`;
      }

      return "";
    },
  },
  watch: {
    dateRange(val) {
      this.$refs.dateRangePopUp.hide();
    },
  },
  methods: {
    async getData() {
      this.loading = true;
      this.chartDataReady = false;

      const response = await this.$store.dispatch(
        "ape/getAnalyticsCompletedVisitsPerDay",
        isStr(this.dateRange)
          ? { from: this.dateRange, to: this.dateRange }
          : this.dateRange
      );

      await delay(2000);

      if (response.error) {
        showMessage(this.$q, success, response.body.error ?? response.body);
        return;
      }

      this.chartOptions.xaxis.categories = response.body.map((r) =>
        formatDate(r.dateCompleted, { dateOnly: true })
      );

      this.chartSeries = [
        {
          name: "Number of Visits",
          data: response.body.map((r) => r.cnt),
        },
      ];

      this.chartDataReady = true;
      this.loading = false;
    },
  },
});
</script>
