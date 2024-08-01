<template>
  <MinimizedDialog
    title="ADVANCED SEARCH"
    widthOnDesktop="400px"
    @close="$emit('close')"
  >
    <template v-slot:body>
      <div>
        <q-form @submit="emitValue">
          <div class="column q-pa-lg" style="padding: 36px">
            <q-input
              debounce="750"
              stack-label
              outlined
              label="Limit Result To"
              hint=""
              :rules="[
                requiredRule,
                (val) =>
                  Number(val) < 1 || Number(val) > 100
                    ? 'Should be 1 to 100 only.'
                    : undefined,
              ]"
              v-model.trim="limit"
            />
            <q-input
              debounce="750"
              stack-label
              outlined
              label="Year"
              hint=""
              :rules="[requiredRule, yearRule]"
              v-model.trim="year"
            />
            <!-- <q-select
                      stack-label
                      outlined
                      emit-value
                      map-options
                      :options="[
                        { value: null, label: 'All' },
                        { value: 'PENDING', label: 'Pending' },
                        { value: 'COMPLETED', label: 'Completed' },
                      ]"
                      label="Status"
                      hint=""
                      v-model="status"
                    /> -->
            <q-select
              stack-label
              outlined
              emit-value
              map-options
              option-label="name"
              option-value="code"
              :options="campuses"
              label="Campus"
              hint=""
              v-model="patientCampusCode"
            />
            <q-select
              stack-label
              outlined
              emit-value
              map-options
              option-label="name"
              option-value="code"
              :options="affiliations"
              label="Affiliation"
              hint=""
              v-model="patientAffiliationCode"
            />
            <!-- <template
                    v-if="patientAffiliationCode === affiliationsMap.STU.code"
                  >
                    <q-select
                      stack-label
                      outlined
                      emit-value
                      map-options
                      option-label="name"
                      option-value="code"
                      :options="colleges"
                      label="College"
                      v-model="patientCollegeCode"
                      hint=""
                    />
                    <q-select
                      stack-label
                      outlined
                      emit-value
                      map-options
                      option-label="name"
                      option-value="code"
                      :options="yearLevels"
                      label="Year Level"
                      v-model="patientYearLevel"
                      hint=""
                    />
                  </template> -->
            <!-- <DateRange
                    stack-label
                    outlined
                    :subtractDaysCount="7"
                    label="Visit Date Range"
                    hint=""
                    :initialValue="visitDateRange"
                    @valueChanged="(val) => (filters.visitDateRange = val)"
                  /> -->
            <!-- <q-input
                    debounce="750"
                    stack-label
                    outlined
                    label="Patient Name"
                    hint=""
                    v-model.trim="patientName"
                  /> -->
            <div class="row items-start justify-end">
              <q-btn
                style="height: 40px"
                color="accent"
                class="q-px-md q-py-xs text-black"
                unelevated
                icon="search"
                stack-label
                label="SEARCH"
                type="submit"
              />
            </div>
          </div>
        </q-form>
      </div>
    </template>
  </MinimizedDialog>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

import {
  affiliations,
  affiliationsMap,
  campuses,
  exams,
  colleges,
  yearLevels,
} from "src/helpers/constants.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "AdvanceSearch",
  components: {
    // DateRange: defineAsyncComponent(() =>
    //   import("src/components/core/form-fields/DateRange.vue")
    // ),
    MinimizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
    ),
  },
  props: {
    initialValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["valueChanged", "close"],
  setup() {
    return {
      affiliations,
      affiliationsMap,
      campuses,
      exams,
      colleges,
      yearLevels,
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      limit: null,
      status: null,
      year: null,
      // visitDateRange: null,
      patientCampusCode: null,
      patientAffiliationCode: null,
      // patientName: null,

      // patientCollegeCode: null,
      // patientYearLevel: null,

      filterProps: [
        "limit",
        "status",
        "year",
        "patientCampusCode",
        "patientAffiliationCode",
      ],
    };
  },
  created() {
    for (const prop of Object.keys(this.initialValue)) {
      this[prop] = this.initialValue[prop];
    }
  },
  methods: {
    addToObjIfNotEmpty(obj, propName, val) {
      if (val != null && val !== "") obj[propName] = val;
    },
    emitValue() {
      const ret = {};

      for (const prop of this.filterProps) {
        this.addToObjIfNotEmpty(ret, prop, this[prop]);
      }

      this.$emit("valueChanged", ret);
    },
  },
});
</script>
