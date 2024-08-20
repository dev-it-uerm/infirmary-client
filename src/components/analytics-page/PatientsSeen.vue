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
            :rules="[inputRuleRequired]"
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
            :rules="[inputRuleRequired]"
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
            Choose a year or date range then click the
            <strong>GENERATE</strong> button to see the report.
          </div>
        </template>
      </ReminderCard>
      <FetchingData v-else-if="ready === false" />
      <div v-else-if="ready === true" class="full-width">
        <div class="full-width">
          <div class="col text-primary text-weight-medium q-mb-lg">
            NUMBER OF PATIENTS SEEN BY DR
          </div>
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
                  `INFIRMARY-APE__PATIENTS-SEEN-BY-DR__${String(
                    filter.campusCode
                  )}__${String(filter.year)}`,
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
import { delay, showMessage, downloadExcel } from "src/helpers/util.js";
import * as inputRules from "src/helpers/input-rules.js";
import { campuses } from "src/helpers/constants.js";

const columnsMap = {
  deptName: {
    name: "deptName",
    field: "deptName",
    label: "DEPARTMENT",
    align: "center",
  },
  patientsSeen: {
    name: "patientsSeen",
    field: "patientsSeen",
    label: "SEEN",
    align: "center",
  },
  patientsNotSeen: {
    name: "patientsNotSeen",
    field: "patientsNotSeen",
    label: "NOT SEEN",
    align: "center",
  },
  patientsAll: {
    name: "patientsAll",
    field: "patientsAll",
    label: "ENROLLED",
    align: "center",
  },
};

export default defineComponent({
  name: "AnalyticsPatientsRegistered",
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
      campuses,
    };
  },
  data() {
    return {
      ready: null,

      filter: {
        campusCode: null,
        year: null,
      },

      columns: [],
      rows: [],
    };
  },
  methods: {
    async getData() {
      this.ready = false;
      this.columns = [];

      const response = await this.$store.dispatch(
        "ape/getAnalyticsPatientsSeenByDr",
        this.filter
      );

      await delay(1000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.ready = true;
        return;
      }

      await delay(1000);

      this.rows = response.body;

      this.columns = response.body[0]
        ? Object.keys(response.body[0]).map((k) => columnsMap[k])
        : [];

      this.ready = true;
    },
  },
});
</script>
