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
          <!-- :options="[{ code: null, name: 'ALL' }, ...campuses]" -->
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
            :rules="[inputRuleRequired]"
            v-model="filter.campusCode"
          />
          <q-select
            :disable="ready === false"
            stack-label
            outlined
            :options="[{ code: null, name: 'ALL' }, ...affiliations]"
            label="Affiliation"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            v-model="filter.affiliationCode"
            hint=""
          />
          <q-select
            :disable="ready === false"
            stack-label
            outlined
            :options="[{ code: null, name: 'ALL' }, ...departments]"
            label="Department"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            v-model="filter.deptCode"
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
            PATIENT VISIT PROGRESS
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
                  `INFIRMARY-APE__PATIENT-VISIT-PROGRESS__${String(
                    filter.year
                  )}${
                    filter.campusCode ? '-' + String(filter.campusCode) : ''
                  }${
                    filter.affiliationCode
                      ? '-' + String(filter.affiliationCode)
                      : ''
                  }${filter.deptCode ? '-' + String(filter.deptCode) : ''}`,
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
  formatDate,
} from "src/helpers/util.js";
import * as inputRules from "src/helpers/input-rules.js";
import { campuses, affiliations, departments } from "src/helpers/constants.js";

const columnsMap = {
  patientCampusName: {
    name: "patientCampusName",
    field: "patientCampusName",
    label: "CAMPUS",
    align: "center",
  },
  patientAffiliationName: {
    name: "patientAffiliationName",
    field: "patientAffiliationName",
    label: "AFFILIATION",
    align: "center",
  },
  patientDeptName: {
    name: "patientDeptName",
    field: "patientDeptName",
    label: "AFFILIATION",
    align: "center",
  },
  patientCode: {
    name: "patientCode",
    field: "patientCode",
    label: "PATIENT CODE",
    align: "center",
  },
  patientName: {
    name: "patientName",
    field: "patientName",
    label: "PATIENT NAME",
    align: "center",
  },
  visitDateTimeCreated: {
    name: "visitDateTimeCreated",
    field: "visitDateTimeCreated",
    label: "DATE & TIME REGISTERED",
    align: "center",
    format: formatDate,
  },
  visitPhysicianName: {
    name: "visitPhysicianName",
    field: "visitPhysicianName",
    label: "PHYSICIAN",
    align: "center",
  },
  examMedicalHistory: {
    name: "examMedicalHistory",
    field: "examMedicalHistory",
    label: "MEDICAL HISTORY",
    align: "center",
    format: formatDate,
  },
  examPhysicalExam: {
    name: "examPhysicalExam",
    field: "examPhysicalExam",
    label: "PHYSICAL EXAM",
    align: "center",
    format: formatDate,
  },
  examLabCbc: {
    name: "examLabCbc",
    field: "examLabCbc",
    label: "LAB - CBC",
    align: "center",
    format: formatDate,
  },
  examLabUrinalysis: {
    name: "examLabUrinalysis",
    field: "examLabUrinalysis",
    label: "LAB - URINALYSIS",
    align: "center",
    format: formatDate,
  },
  examLabFecalysis: {
    name: "examLabFecalysis",
    field: "examLabFecalysis",
    label: "LAB - FECALYSIS",
    align: "center",
    format: formatDate,
  },
  examRadXrayChest: {
    name: "examRadXrayChest",
    field: "examRadXrayChest",
    label: "RAD - XRAY (CHEST)",
    align: "center",
    format: formatDate,
  },
};

export default defineComponent({
  name: "AnalyticsPatientVisitProgress",
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
      affiliations,
      departments,
    };
  },
  data() {
    return {
      ready: null,

      filter: {
        year: null,
        campusCode: null,
        affiliationCode: null,
        deptCode: null,
      },

      columns: [],
      rows: [],
    };
  },
  methods: {
    async getData() {
      this.ready = false;
      this.columns = [];

      const payload = Object.entries(this.filter).reduce((acc, e) => {
        if (e[1] === null) return acc;
        acc[e[0]] = e[1];
        return acc;
      }, {});

      const response = await this.$store.dispatch(
        "ape/getAnalyticsPatientVisitProgress",
        payload
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
