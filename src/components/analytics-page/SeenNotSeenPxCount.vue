<template>
  <div>
    <FetchingData v-if="ready === null" />
    <div
      v-else
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
            <FormFieldYear
              :disable="ready === false || downloading"
              :required="true"
              v-model="filter.year"
            />
            <q-select
              :disable="ready === false || downloading"
              stack-label
              outlined
              :options="[{ code: null, name: 'ALL' }, ...campuses]"
              label="Campus"
              emit-value
              map-options
              option-label="name"
              option-value="code"
              v-model="filter.campusCode"
              hint=""
            />
            <div class="row justify-end">
              <q-btn
                :disable="ready === false || downloading"
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
                :disable="!ready || !rows || rows.length === 0 || downloading"
                :loading="downloading"
                unelevated
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
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

import {
  delay,
  showMessage,
  downloadExcel,
  downloadExcelAsync,
} from "src/helpers/util.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "AnalyticsSeenNotSeenPxCount",
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
    };
  },
  data() {
    return {
      campuses: [],
      campusesMap: {},

      ready: null,
      downloading: false,

      filter: {
        campusCode: null,
        year: null,
      },

      columns: [
        {
          name: "deptName",
          field: "deptName",
          label: "DEPARTMENT",
          align: "left",
          type: "string", // FOR `downloadExcel` UTIL
        },
        {
          name: "patientsSeen",
          field: "patientsSeen",
          label: "SEEN",
          align: "center",
          type: "integer", // FOR `downloadExcel` UTIL
        },
        {
          name: "patientsNotSeen",
          field: "patientsNotSeen",
          label: "NOT SEEN",
          align: "center",
          type: "integer", // FOR `downloadExcel` UTIL
        },
        {
          name: "withdrawnOrResigned",
          field: "withdrawnOrResigned",
          label: "WITHDRAWN/RESIGNED",
          align: "center",
          type: "integer", // FOR `downloadExcel` UTIL
        },
        {
          name: "patientsAll",
          field: "patientsAll",
          label: "ALL",
          align: "center",
          type: "integer", // FOR `downloadExcel` UTIL
        },
      ],

      rows: [],
    };
  },
  async mounted() {
    const [campuses, campusesMap] = await this.$store.dispatch(
      "ape/getCampuses"
    );

    await delay(1000);

    this.campuses = campuses;
    this.campusesMap = campusesMap;

    this.ready = true;
  },
  methods: {
    async getData() {
      this.ready = false;

      const response = await this.$store.dispatch(
        "ape/getAnalyticsSeenPatientCount",
        this.filter
      );

      await delay(1000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.ready = true;
        return;
      }

      this.rows = response.body;
      this.ready = true;
    },
    async download() {
      this.downloading = true;
      await delay(1000);

      const fileName = `INFIRMARY-APE__SEEN-PATIENT-COUNT__${String(
        this.filter.year
      )}${this.filter.campusCode ? "-" + this.filter.campusCode : ""}.xls`;

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
