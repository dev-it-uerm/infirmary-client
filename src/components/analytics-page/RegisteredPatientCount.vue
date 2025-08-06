<template>
  <div
    class="full-width"
    :class="$q.screen.gt.md ? 'row items-start' : 'column'"
    style="gap: 36px"
  >
    <div
      class="bordered-grey q-pa-lg"
      :class="$q.screen.gt.md ? 'col-2' : 'full-width'"
    >
      <div class="text-primary text-weight-medium q-mb-lg">FILTER:</div>
      <div>
        <q-form @submit="getData">
          <q-select
            :disable="ready === false || downloading"
            stack-label
            outlined
            multiple
            use-chips
            :options="[
              { code: 'CAMPUS', name: 'CAMPUS' },
              { code: 'AFFILIATION', name: 'AFFILIATION' },
              { code: 'DEPARTMENT', name: 'DEPARTMENT' },
            ]"
            label="Columns"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            v-model="reportColumns"
            hint=""
          />
          <FormFieldYear
            :disable="ready === false || downloading"
            label="APE Year"
            :required="true"
            v-model="filter.year"
          />
          <FormFieldDateRange
            :disable="!filter.year || ready === false || downloading"
            stack-label
            outlined
            label="Visit Date"
            hint=""
            :required="true"
            :initialValue="filter.dateRange"
            @valueChanged="(v) => (filter.dateRange = v)"
          />
          <div class="row justify-end">
            <q-btn
              :disable="ready === false || downloading"
              type="submit"
              label="GENERATE"
              icon="sym_o_insert_chart"
              class="text-black"
              color="accent"
              unelevated
            />
          </div>
        </q-form>
      </div>
    </div>
    <div
      class="q-pa-lg bordered-grey flex flex-center"
      :class="$q.screen.gt.md ? 'col' : 'full-width'"
      style="min-height: 100px"
    >
      <ReminderCard v-if="ready === null">
        <template v-slot:body>
          <div class="full-width">
            Complete the filter controls then click the
            <strong>GENERATE</strong> button to see the report.
          </div>
        </template>
      </ReminderCard>
      <FetchingData v-else-if="ready === false" />
      <div v-else-if="ready === true" class="full-width">
        <div class="full-width">
          <q-table
            style="max-height: 500px"
            class="shadow-0"
            :rows="rows"
            :columns="columns"
            :rows-per-page-options="[0]"
            hide-bottom
          />
          <div class="row justify-end q-mt-lg">
            <q-btn
              :disable="!ready || !rows || rows.length === 0 || downloading"
              unelevated
              :loading="downloading"
              color="accent"
              icon="download"
              class="text-black"
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
  isStr,
  formatDate,
  delay,
  showMessage,
  downloadExcel,
  downloadExcelAsync,
} from "src/helpers/util.js";

const columnsMap = {
  visitDate: {
    name: "visitDate",
    field: "visitDate",
    label: "DATE OF VISIT",
    align: "center",
    format: (v) => formatDate(v, { dateOnly: true }),
    type: "string", // FOR `downloadExcel` UTIL
    isISODate: true, // FOR `excel-gen` WEB WORKER
  },
  patientCampus: {
    name: "patientCampus",
    field: "patientCampus",
    label: "CAMPUS",
    align: "left",
    type: "string",
  },
  patientAffiliation: {
    name: "patientAffiliation",
    field: "patientAffiliation",
    label: "AFFILIATION",
    align: "left",
    type: "string",
  },
  patientDepartment: {
    name: "patientDepartment",
    field: "patientDepartment",
    label: "DEPARTMENT",
    align: "left",
    type: "string",
  },
  patientCount: {
    name: "patientCount",
    field: "patientCount",
    label: "PATIENT COUNT",
    align: "center",
    type: "integer",
  },
};

export default defineComponent({
  name: "AnalyticsRegisteredPatientCount",
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

      reportColumns: ["CAMPUS", "AFFILIATION", "DEPARTMENT"],

      filter: {
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
      this.columns = [];

      const payload = {
        columns: this.reportColumns,
        filter: {
          year: this.filter.year,
          dateRange: isStr(this.filter.dateRange)
            ? { from: this.filter.dateRange, to: this.filter.dateRange }
            : this.filter.dateRange,
        },
      };

      const response1 = await this.$store.dispatch(
        "ape/getAnalyticsRegisteredPatientCount",
        payload
      );

      await delay(1000);

      if (response1.error) {
        showMessage(this.$q, false, response1.body.error ?? response1.body);
        this.ready = true;
        return;
      }

      this.rows = response1.body;

      this.columns = response1.body[0]
        ? Object.keys(response1.body[0]).map((k) => columnsMap[k])
        : [];

      this.ready = true;
    },
    async download() {
      this.downloading = true;
      await delay(1000);

      const fileName = `INFIRMARY-APE__REGISTERED-PATIENT-COUNT__${
        this.filter.dateRange
          ? Object.values(this.filter.dateRange)
              .map((d) => d.replace(/\//g, "-"))
              .join("-TO-")
          : String(this.filter.year)
      }.xls`;

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
