<template>
  <div class="column full-width">
    <div style="color: rgba(0, 0, 0, 0.75)">{{ label }}</div>
    <div class="row items-center full-width" style="gap: 12px">
      <q-input
        class="col"
        dense
        :disable="disable"
        stack-label
        outlined
        label="Result"
        v-model.trim="value.value"
        hint=""
      />
      <q-input
        class="col"
        dense
        :disable="disable"
        stack-label
        outlined
        :rules="rules"
        label="Unit"
        v-model.trim="value.unit"
        hint=""
      />
      <q-input
        class="col"
        dense
        :disable="disable"
        stack-label
        outlined
        :rules="rules"
        label="Reference Normal Range"
        v-model.trim="value.normalRange"
        hint=""
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  empty,
  isStr,
  isObj,
  jsDateToISOString,
  subtractDay,
} from "src/helpers/util.js";

export default defineComponent({
  name: "DiagTest",
  props: {
    label: {
      type: String,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    diagCenterCode: {
      type: String,
      required: true,
    },
    diagCode: {
      type: String,
      required: true,
    },
    diagParamCode: {
      type: String,
      required: true,
    },
    initialValue: {
      type: Object,
      default: null,
    },
  },
  emits: ["valueChanged"],
  data() {
    return {
      value: null,
    };
  },
  computed: {
    rules() {
      return this.value.value == null || this.value.value === ""
        ? []
        : [
            (val) =>
              val == null || val === "" ? "This field is required." : undefined,
          ];
    },
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("valueChanged", val);
      },
      immediate: false,
    },
  },
  created() {
    if (this.initialValue) {
      this.value = {
        diagCode: this.diagCode,
        code: this.diagParamCode,
        ...this.initialValue,
      };
      return;
    }

    this.value = {
      diagCode: this.diagCode,
      code: this.diagParamCode,
      value: null,
      unit: null,
      normalRange: null,
    };
  },
});
</script>
