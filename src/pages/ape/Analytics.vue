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
          <!-- <div
            class="q-pa-lg bordered-grey"
            :class="$q.screen.gt.md ? 'col' : ''"
          >
            <div class="text-primary text-weight-medium q-mb-lg">
              NUMBER OF PATIENT
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
          </div> -->
          <div
            class="full-width q-pa-lg bordered-grey flex flex-center"
            :class="$q.screen.gt.md ? 'col' : ''"
            style="min-height: 100px"
          >
            <ReminderCard v-if="chartDataReady === null">
              <template v-slot:body>
                <div class="full-width">
                  Choose a date range then click the
                  <strong>GENERATE</strong> button to see the graph.
                </div>
              </template>
            </ReminderCard>
            <FetchingData v-else-if="chartDataReady === false" />
            <div v-else-if="chartDataReady === true" class="full-width">
              <div class="q-pa-lg bordered-grey q-mb-lg full-width">
                <div class="row items-center q-mb-lg">
                  <div class="col text-primary text-weight-medium">
                    NUMBER OF PATIENTS REGISTERED
                  </div>
                  <div class="col-auto">
                    <q-btn
                      :disable="
                        !chartDataReady ||
                        !rowsChart1 ||
                        rowsChart1.length === 0
                      "
                      unelevated
                      color="accent"
                      class="text-black"
                      label="EXPORT"
                      @click="
                        downloadExcel(
                          'INFIRMARY-APE__PATIENTS-REGISTERED__',
                          rowsChart1,
                          columnsChart1
                        )
                      "
                    />
                  </div>
                </div>
                <q-table
                  style="max-height: 500px"
                  class="shadow-0"
                  :rows="rowsChart1"
                  :columns="columnsChart1"
                  :rows-per-page-options="[0]"
                  hide-bottom
                />
              </div>
              <div
                class="q-pa-lg bordered-grey full-width"
                :class="$q.screen.gt.md ? 'col' : ''"
              >
                <div class="row items-center q-mb-lg">
                  <div class="col text-primary text-weight-medium">
                    NUMBER OF PATIENTS SEEN BY PHYSICIANS
                  </div>
                  <div class="col-auto">
                    <q-btn
                      :disable="
                        !chartDataReady ||
                        !rowsChart2 ||
                        rowsChart2.length === 0
                      "
                      unelevated
                      color="accent"
                      class="text-black"
                      label="EXPORT"
                      @click="
                        downloadExcel(
                          'INFIRMARY-APE__PATIENTS-SEEN-BY-DR__',
                          rowsChart2,
                          columnsChart2
                        )
                      "
                    />
                  </div>
                </div>
                <q-table
                  style="max-height: 500px"
                  class="shadow-0"
                  :rows="rowsChart2"
                  :columns="columnsChart2"
                  :rows-per-page-options="[0]"
                  hide-bottom
                />
              </div>
            </div>
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
import * as ExcelJS from "exceljs";
import { Buffer } from "buffer";

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

      columnsChart1: [
        {
          name: "visitDate",
          field: "visitDate",
          label: "DATE OF VISIT",
          align: "center",
          format: (v) => formatDate(v, { dateOnly: true }),
        },
        {
          name: "patientAffiliation",
          field: "patientAffiliation",
          label: "AFFILIATION",
          align: "center",
        },
        {
          name: "patientCampus",
          field: "patientCampus",
          label: "CAMPUS",
          align: "center",
        },
        {
          name: "patientDepartment",
          field: "patientDepartment",
          label: "DEPARTMENT",
          align: "center",
        },
        {
          name: "patientCount",
          field: "patientCount",
          label: "PATIENT COUNT",
          align: "center",
        },
      ],
      rowsChart1: [],

      columnsChart2: [
        {
          name: "physician",
          field: "physician",
          label: "PHYSICIAN",
          align: "left",
        },
        {
          name: "patientCount",
          field: "patientCount",
          label: "PATIENT COUNT",
          align: "center",
        },
      ],
      rowsChart2: [],
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

      const payload = isStr(this.dateRange)
        ? { from: this.dateRange, to: this.dateRange }
        : this.dateRange;

      // const response = await this.$store.dispatch(
      //   "ape/getAnalyticsCompletedVisitsPerDay",
      //   payload
      // );

      const response1 = await this.$store.dispatch(
        "ape/getPatientsPerDateRange",
        payload
      );

      const response2 = await this.$store.dispatch(
        "ape/getDoctorPatients",
        payload
      );

      await delay(2000);

      if (response1.error || response2.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        return;
      }

      this.rowsChart1 = response1.body;
      this.rowsChart2 = response2.body;

      // this.chartOptions.xaxis.categories = response.body.map((r) =>
      //   formatDate(r.dateCompleted, { dateOnly: true })
      // );

      // this.chartSeries = [
      //   {
      //     name: "Number of Visits",
      //     data: response.body.map((r) => r.cnt),
      //   },
      // ];

      this.chartDataReady = true;
      this.loading = false;
    },
    async downloadExcel(fileNamePrefix, rows, columns) {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("INFIRMARY APE REPORT");

      sheet.columns = columns.map((c) => {
        return {
          key: c.field,
          header: c.label,
          width: 50,
        };
      });

      //  COLUMN STYLE
      // const borderStyle = { style: "thin", color: { argb: "00000000" } };

      columns.forEach((c, idx) => {
        sheet.getColumn(idx + 1).numFmt = "@";

        sheet.getColumn(idx + 1).alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };

        // sheet.getColumn(idx + 1).border = {
        //   top: borderStyle,
        //   left: borderStyle,
        //   bottom: borderStyle,
        //   right: borderStyle,
        // };
      });

      // COLUMN HEADER STYLE
      sheet.getRow(1).font = { bold: true };

      sheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      for (const row of rows) {
        sheet.addRow(
          columns.reduce((acc, c) => {
            acc[c.field] = c.format ? c.format(row[c.field]) : row[c.field];
            return acc;
          }, {})
        );
      }

      // Download File
      const fileName = `${fileNamePrefix}${this.dateRangeStr
        .replace(" - ", "-TO-")
        .replace(/\//g, "-")}`;

      const fileBuffer = await workbook.xlsx.writeBuffer();
      const base64 = Buffer.from(fileBuffer).toString("base64");

      const a = document.createElement("a");
      a.href = "data:application/xlsx;base64," + base64;
      a.download = `${fileName}.xls`;
      a.click();
    },
  },
});
</script>
