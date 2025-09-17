<template>
  <MinimizedDialog
    title="SEARCH FILTER"
    widthOnDesktop="400px"
    @close="$emit('close')"
  >
    <template v-slot:body>
      <div v-if="initialized">
        <q-form @submit="emitValue">
          <div class="column q-pa-lg" style="padding: 36px">
            <!-- <q-input
              debounce="750"
              stack-label
              outlined
              label="Limit Result To"
              hint=""
              :rules="[
                requiredRule,
                (val) =>
                  Number(val) < 1 || Number(val) > 99999
                    ? 'Should be 1 to 99999 only.'
                    : undefined,
              ]"
              v-model.trim="limit"
            /> -->
            <q-input
              stack-label
              maxlength="4"
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
            <!-- <q-select
              stack-label
              outlined
              emit-value
              map-options
              option-label="name"
              option-value="code"
              :options="departments"
              label="Department"
              v-model="patientDeptCode"
              hint=""
            /> -->
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
                stack-label
                label="CHANGE"
                type="submit"
              />
            </div>
          </div>
        </q-form>
      </div>
      <FetchingData v-else />
    </template>
  </MinimizedDialog>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";

import {
  affiliations,
  affiliationsMap,
  yearLevels,
} from "src/helpers/constants.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "AdvanceSearch",
  components: {
    // DateRange: defineAsyncComponent(() =>
    //   import("src/components/core/form-fields/DateRange.vue")
    // ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
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
      exams,
      yearLevels,
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
    };
  },
  data() {
    return {
      // limit: null,
      status: null,
      year: null,
      // visitDateRange: null,
      patientCampusCode: null,
      patientAffiliationCode: null,
      // patientName: null,

      // patientDeptCode: null,
      // patientYearLevel: null,

      filterProps: [
        // "limit",
        "status",
        "year",
        "patientCampusCode",
        "patientAffiliationCode",
      ],
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
  watch: {
    initialized: {
      handler(v) {
        if (!v) return;

        for (const prop of Object.keys(this.initialValue)) {
          this[prop] = this.initialValue[prop];
        }
      },
      immediate: true,
    },
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
