<template>
  <q-input
    debounce="500"
    stack-label
    outlined
    label="Year"
    maxlength="4"
    :rules="[requiredRule, yearRule]"
    v-model.trim="value"
  />
</template>

<script>
import { defineComponent } from "vue";
import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "FormFieldYear",
  props: {
    modelValue: {
      type: String,
      // default: String(new Date().getFullYear()),
      default: "",
    },
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  setup() {
    return {
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
    };
  },
});
</script>
