<template>
  <q-input
    debounce="500"
    stack-label
    outlined
    :label="label"
    maxlength="4"
    :rules="required ? [yearRule] : []"
    v-model.trim="value"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldYear",
  props: {
    label: {
      type: String,
      default: "Year",
    },
    modelValue: {
      type: String,
      // default: String(new Date().getFullYear()),
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      value: null,
    };
  },
  watch: {
    modelValue: {
      handler(v) {
        this.value = v;
      },
      immediate: true,
    },
    value(v) {
      this.$emit("update:modelValue", v);
    },
  },
  methods: {
    yearRule(v) {
      if (v && /[1-9]{1}[0-9]{3}/.test(v)) {
        return true;
      }

      return "Invalid year.";
    },
  },
});
</script>
