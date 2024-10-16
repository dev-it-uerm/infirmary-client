<template>
  <div>
    <div
      v-if="initialized"
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
            <!-- :options="[{ code: null, name: 'ALL' }, ...campuses]" -->
            <q-select
              :disable="ready === false || downloading"
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
              :disable="ready === false || downloading"
              stack-label
              outlined
              :options="affiliations"
              label="Affiliation"
              emit-value
              map-options
              option-label="name"
              option-value="code"
              :rules="[inputRuleRequired]"
              v-model="filter.affiliationCode"
              hint=""
            />
            <q-select
              :disable="ready === false || downloading"
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
    <FetchingData v-else />
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";

import {
  delay,
  showMessage,
  downloadExcel,
  downloadExcelAsync,
  formatDate,
} from "src/helpers/util.js";

import * as inputRules from "src/helpers/input-rules.js";
import { affiliations } from "src/helpers/constants.js";

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
      affiliations,
    };
  },
  data() {
    return {
      ready: null,
      downloading: false,

      filter: {
        year: null,
        campusCode: null,
        affiliationCode: null,
        deptCode: null,
      },

      columns: [
        {
          name: "patientCampusName",
          field: "patientCampusName",
          label: "CAMPUS",
          align: "center",
        },
        {
          name: "patientAffiliationName",
          field: "patientAffiliationName",
          label: "AFFILIATION",
          align: "center",
        },
        {
          name: "patientDeptName",
          field: "patientDeptName",
          label: "DEPARTMENT",
          align: "center",
        },
        {
          name: "patientCode",
          field: "patientCode",
          label: "PATIENT CODE",
          align: "center",
        },
        {
          name: "patientName",
          field: "patientName",
          label: "PATIENT NAME",
          align: "center",
        },
        {
          name: "visitPhysicianName",
          field: "visitPhysicianName",
          label: "PHYSICIAN",
          align: "center",
        },
        {
          name: "visitDateTimeCreated",
          field: "visitDateTimeCreated",
          label: "DATE & TIME REGISTERED",
          align: "center",
          format: formatDate,
          isISODate: true, // FOR `excel-gen` WEB WORKER
        },
        {
          name: "examMedicalHistory",
          field: "examMedicalHistory",
          label: "MEDICAL HISTORY",
          align: "center",
          format: formatDate,
          isISODate: true, // FOR `excel-gen` WEB WORKER
        },
        {
          name: "examPhysicalExam",
          field: "examPhysicalExam",
          label: "PHYSICAL EXAM",
          align: "center",
          format: formatDate,
          isISODate: true, // FOR `excel-gen` WEB WORKER
        },
        {
          name: "examLabCbc",
          field: "examLabCbc",
          label: "LAB - CBC",
          align: "center",
          format: formatDate,
          isISODate: true, // FOR `excel-gen` WEB WORKER
        },
        {
          name: "examLabUrinalysis",
          field: "examLabUrinalysis",
          label: "LAB - URINALYSIS",
          align: "center",
          format: formatDate,
          isISODate: true, // FOR `excel-gen` WEB WORKER
        },
        {
          name: "examLabFecalysis",
          field: "examLabFecalysis",
          label: "LAB - FECALYSIS",
          align: "center",
          format: formatDate,
          isISODate: true, // FOR `excel-gen` WEB WORKER
        },
        {
          name: "examRadXrayChest",
          field: "examRadXrayChest",
          label: "RAD - XRAY (CHEST)",
          align: "center",
          format: formatDate,
          isISODate: true, // FOR `excel-gen` WEB WORKER
        },
      ],
      rows: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      campuses: "ape/campuses",
      campusesMap: "ape/campusesMap",
      departments: "ape/departments",
      departmentsMap: "ape/departmentsMap",
    }),
    initialized() {
      return (
        this.user &&
        this.campuses &&
        this.campuses.length > 0 &&
        this.campusesMap &&
        this.departments &&
        this.departments.length > 0 &&
        this.departmentsMap
      );
    },
  },
  methods: {
    async getData() {
      this.ready = false;

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

      this.rows = response.body;
      this.ready = true;
    },
    async download() {
      this.downloading = true;
      await delay(1000);

      const fileName = `INFIRMARY-APE__PATIENT-VISIT-PROGRESS__${String(
        this.filter.year
      )}${this.filter.campusCode ? "-" + String(this.filter.campusCode) : ""}${
        this.filter.affiliationCode
          ? "-" + String(this.filter.affiliationCode)
          : ""
      }${this.filter.deptCode ? "-" + String(this.filter.deptCode) : ""}.xls`;

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
