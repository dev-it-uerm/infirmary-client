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
          <FormFieldYear
            :disable="ready === false"
            :required="true"
            v-model="filter.year"
          />
          <q-select
            :disable="ready === false"
            stack-label
            outlined
            :options="campuses"
            label="Campus"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            v-model="filter.campusCode"
            :rules="[inputRules.required]"
            hint=""
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
              :disable="!rows || rows.length === 0"
              unelevated
              color="accent"
              icon="download"
              class="text-black"
              label="DOWNLOAD"
              @click="
                downloadExcel(
                  `INFIRMARY-APE__NOT-SEEN-PATIENTS__${String(filter.year)}`,
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
import {
  delay,
  showMessage,
  downloadExcel,
  // downloadExcelOnMessage,
  formatDate,
} from "src/helpers/util.js";
import * as inputRules from "src/helpers/input-rules.js";
import { campuses } from "src/helpers/constants.js";

export default defineComponent({
  name: "AnalyticsNotSeenPatients",
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
      campuses,
      inputRules: inputRules,
      downloadExcel,
    };
  },
  data() {
    return {
      ready: null,

      filter: {
        campusCode: null,
        year: null,
      },

      columns: [
        {
          name: "affiliationName",
          field: "affiliationName",
          label: "AFFILIATION",
          align: "left",
          type: "string", // FOR `downloadExcel` UTIL
        },
        {
          name: "deptName",
          field: "deptName",
          label: "DEPARTMENT",
          align: "left",
          type: "string", // FOR `downloadExcel` UTIL
        },
        {
          name: "patientName",
          field: "patientName",
          label: "PATIENT",
          align: "left",
          type: "string", // FOR `downloadExcel` UTIL
        },
        {
          name: "dateTimeRegistered",
          field: "dateTimeRegistered",
          label: "DATE & TIME REGISTERED",
          align: "left",
          type: "string", // FOR `downloadExcel` UTIL
          format: formatDate,
        },
      ],

      rows: [],
    };
  },
  methods: {
    async getData() {
      this.ready = false;

      const response = await this.$store.dispatch(
        "ape/getNotSeenPatients",
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
  },
});
</script>
