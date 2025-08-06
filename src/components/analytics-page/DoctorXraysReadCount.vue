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
            label="APE Year"
            :required="true"
            v-model="filter.year"
          />
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
            Enter a year then click the
            <strong>GENERATE</strong> button to see the report.
          </div>
        </template>
      </ReminderCard>
      <FetchingData v-else-if="ready === false" />
      <div v-else-if="ready === true" class="full-width">
        <div class="full-width" :class="$q.screen.gt.md ? 'col' : ''">
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
              :loading="downloading"
              unelevated
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
} from "src/helpers/util.js";

export default defineComponent({
  name: "AnalyticsDrXraysReadCount",
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
      ready: null,
      downloading: false,

      filter: {
        year: null,
      },

      columns: [
        {
          name: "radiologist",
          field: "radiologist",
          label: "RADIOLOGIST",
          align: "left",
          type: "text", // FOR `downloadExcel` UTIL
        },
        {
          name: "patientCount",
          field: "patientCount",
          label: "PATIENT COUNT",
          align: "center",
          type: "integer", // FOR `downloadExcel` UTIL
        },
      ],

      rows: [],
    };
  },
  methods: {
    async getData() {
      this.ready = false;

      const response = await this.$store.dispatch(
        "ape/getAnalyticsDrXraysReadCount",
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

      const fileName = `INFIRMARY-APE__DR-XRAYS-READ-COUNT__${String(
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
