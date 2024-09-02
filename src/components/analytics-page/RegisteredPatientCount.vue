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
            :disable="ready === false"
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
          <q-select
            :disable="ready === false"
            stack-label
            outlined
            :options="[
              { code: 'YEAR', name: 'YEAR' },
              { code: 'DATERANGE', name: 'DATE RANGE' },
            ]"
            label="Date Type"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            v-model="dateType"
            hint=""
          />
          <FormFieldYear
            v-if="dateType === 'YEAR'"
            :disable="ready === false"
            :required="true"
            v-model="filter.year"
          />
          <DateRange
            v-if="dateType === 'DATERANGE'"
            :disable="ready === false"
            stack-label
            outlined
            label="Date Range"
            hint=""
            :initialValue="filter.dateRange"
            @valueChanged="(val) => (filter.dateRange = val)"
          />
          <div class="row justify-end">
            <q-btn
              :disable="ready === false"
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
              :disable="!ready || !rows || rows.length === 0"
              unelevated
              color="accent"
              icon="download"
              class="text-black"
              label="DOWNLOAD"
              @click="
                downloadExcel(
                  `INFIRMARY-APE__REGISTERED-PATIENT-COUNT__${
                    filter.dateRange
                      ? Object.values(filter.dateRange)
                          .map((d) => d.replace(/\//g, '-'))
                          .join('-TO-')
                      : String(filter.year)
                  }`,
                  rows,
                  columns
                )
              "
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
} from "src/helpers/util.js";

const columnsMap1 = {
  visitDate: {
    name: "visitDate",
    field: "visitDate",
    label: "DATE OF VISIT",
    align: "center",
    format: (v) => formatDate(v, { dateOnly: true }),
    type: "string", // FOR `downloadExcel` UTIL
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
    DateRange: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DateRange.vue")
    ),
  },
  setup() {
    return {
      inputRuleRequired: inputRules.required,
      downloadExcel,
    };
  },
  data() {
    return {
      ready: null,

      reportColumns: ["CAMPUS", "AFFILIATION", "DEPARTMENT"],
      dateType: "YEAR",

      filter: {
        year: null,
        dateRange: null,
      },

      columns: [],
      rows: [],
    };
  },
  watch: {
    dateType() {
      this.filter.dateRange = null;
      this.filter.year = null;
    },
  },
  methods: {
    async getData() {
      this.ready = false;
      this.columns = [];

      const payload = {
        columns: this.reportColumns,
        filter: this.filter.dateRange
          ? {
              dateRange: isStr(this.filter.dateRange)
                ? { from: this.filter.dateRange, to: this.filter.dateRange }
                : this.filter.dateRange,
            }
          : { year: this.filter.year },
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
        ? Object.keys(response1.body[0]).map((k) => columnsMap1[k])
        : [];

      this.ready = true;
    },
  },
});
</script>
