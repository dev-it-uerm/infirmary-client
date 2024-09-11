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
            :disable="ready === false"
            :required="true"
            v-model="filter.year"
          />
          <div class="row justify-end q-mb-md">
            <q-toggle
              :disable="ready === false"
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
              :disable="ready === false || !rows || rows.length === 0"
              unelevated
              color="accent"
              icon="download"
              class="text-black q-mt-lg"
              label="DOWNLOAD"
              @click="
                downloadExcel(
                  `INFIRMARY-APE__DR-PATIENT-COUNT__${String(filter.year)}`,
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
  delay,
  showMessage,
  downloadExcel,
  formatDate,
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

      filter: {
        includeDate: 0,
        year: null,
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
        this.filter
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
  },
});
</script>
