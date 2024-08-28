<template>
  <q-input
    debounce="500"
    stack-label
    outlined
    label="Year"
    maxlength="4"
    :rules="[yearRule, ...(required ? [requiredRule] : [])]"
    v-model.trim="value"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldYear",
  props: {
    modelValue: {
      type: String,
      // default: String(new Date().getFullYear()),
      default: "",
    },
    required: {
      type: String,
      default: false,
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
      yearRule: (val) => {
        if (!val || /[1-9]{1}[0-9]{3}/.test(val)) return;
        return "Invalid year.";
      },
      requiredRule: (val) => {
        return val ? undefined : "This field is required.";
      },
    };
  },
});
</script>
