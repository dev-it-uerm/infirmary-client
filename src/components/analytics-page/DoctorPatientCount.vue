<template>
  <div
    :class="$q.screen.gt.md ? 'row items-start' : 'column'"
    style="gap: 36px"
  >
    <div class="bordered-grey q-pa-lg" :class="$q.screen.gt.md ? 'col-2' : ''">
      <div class="text-primary text-weight-medium q-mb-lg">FILTER:</div>
      <div>
        <q-form @submit="getData">
          <FormFieldYear
            :disable="ready === false || downloading"
            :required="true"
            v-model="filter.year"
          />
          <FormFieldDateRange
            :disable="!filter.year || ready === false || downloading"
            stack-label
            outlined
            label="Date Range"
            hint=""
            :options="
              (v) =>
                filter.year && Number(v.substring(0, 4)) === Number(filter.year)
            "
            :required="true"
            :initialValue="filter.dateRange"
            @valueChanged="(v) => (filter.dateRange = v)"
          />
          <div class="row justify-end q-mb-md">
            <q-toggle
              :disable="ready === false || downloading"
              class="text-overline"
              :true-value="1"
              :false-value="0"
              label="INCLUDE DATE"
              left-label
              v-model="filter.includeDate"
            />
          </div>
          <div class="row justify-end">
            <q-btn
              :disable="ready === false || downloading"
              type="submit"
              icon="sym_o_insert_chart"
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
      class="full-width q-pa-lg bordered-grey flex flex-center"
      :class="$q.screen.gt.md ? 'col' : ''"
      style="min-height: 100px"
    >
      <ReminderCard v-if="ready === null">
        <template v-slot:body>
          <div class="full-width">
            Choose a date range then click the
            <strong>GENERATE</strong> button to see the report.
          </div>
        </template>
      </ReminderCard>
      <FetchingData v-else-if="ready === false" />
      <div v-else-if="ready === true" class="full-width">
        <div class="full-width" :class="$q.screen.gt.md ? 'col' : ''">
          <div class="text-caption text-grey-8">
            {{
              filter.dateRange
                ? `${filter.dateRange.from} - ${filter.dateRange.to}`
                : ""
            }}
          </div>
          <q-table
            style="max-height: 500px"
            class="shadow-0"
            :rows="rows"
            :columns="columns"
            :rows-per-page-options="[0]"
            hide-bottom
          />
          <div class="row justify-end">
            <q-btn
              :disable="
                ready === false || !rows || rows.length === 0 || downloading
              "
              unelevated
              :loading="downloading"
              color="accent"
              icon="download"
              class="text-black q-mt-lg"
              label="DOWNLOAD"
              @click="download"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import * as inputRules from "src/helpers/input-rules.js";

import {
  delay,
  showMessage,
  downloadExcel,
  downloadExcelAsync,
  formatDate,
  isStr,
} from "src/helpers/util.js";

const allColumnsMap = {
  physician: {
    name: "physician",
    field: "physician",
    label: "PHYSICIAN",
    align: "left",
    type: "string", // FOR `downloadExcel` UTIL
  },
  date: {
    name: "date",
    field: "date",
    label: "DATE",
    align: "left",
    format: (v) => formatDate(v, { dateOnly: true }),
    type: "string", // FOR `downloadExcel` UTIL
    isISODate: true, // FOR `excel-gen` WEB WORKER
  },
  patientCount: {
    name: "patientCount",
    field: "patientCount",
    label: "PATIENT COUNT",
    align: "center",
    type: "integer", // FOR `downloadExcel` UTIL
  },
};

const allColumns = Object.values(allColumnsMap);

export default defineComponent({
  name: "AnalyticsDoctorPatientCount",
  components: {
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
    FormFieldYear: defineAsyncComponent(() =>
      import("src/components/core/form-fields/Year.vue")
    ),
    FormFieldDateRange: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DateRange.vue")
    ),
  },
  setup() {
    return {
      inputRuleRequired: inputRules.required,
    };
  },
  data() {
    return {
      ready: null,
      downloading: false,

      filter: {
        includeDate: 0,
        year: null,
        dateRange: null,
      },

      columns: [],
      rows: [],
    };
  },
  methods: {
    async getData() {
      this.ready = false;
      this.columns = allColumns;

      const response = await this.$store.dispatch(
        "ape/getAnalyticsDoctorPatientCount",
        {
          includeDate: this.filter.includeDate,
          year: this.filter.year,
          dateRange: isStr(this.filter.dateRange)
            ? { from: this.filter.dateRange, to: this.filter.dateRange }
            : this.filter.dateRange,
        }
      );

      await delay(1000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.ready = true;
        return;
      }

      if (response.body.length > 0) {
        this.columns = Object.keys(response.body[0]).map(
          (c) => allColumnsMap[c]
        );
      }

      this.rows = response.body;
      this.ready = true;
    },
    async download() {
      this.downloading = true;
      await delay(1000);

      const fileName = `INFIRMARY-APE__DR-PATIENT-COUNT__${String(
        this.filter.year
      )}.xls`;

      // USE WEB WORKER IF AVAILABLE
      if (window.Worker) {
        const me = this;

        downloadExcelAsync(fileName, this.rows, this.columns, () => {
          me.downloading = false;
        });

        return;
      }

      await downloadExcel(fileName, this.rows, this.columns);
      this.downloading = false;
    },
  },
});
</script>
