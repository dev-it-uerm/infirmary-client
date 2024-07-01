<template>
  <q-select
    stack-label
    outlined
    use-input
    hide-selected
    fill-input
    label-slot
    :options="options"
    :disable="disable"
    :model-value="value"
    @input-value="
      (val) => (value = val == null || val === '' ? null : val.trim())
    "
    hint=""
  >
    <template v-slot:label>
      {{ label }}
      <span class="text-weight-bold text-red" v-if="required"> *</span>
    </template>
  </q-select>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldDiagTestSelect",
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: () => [],
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
  created() {
    if (this.initialValue) this.value = this.initialValue;
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("valueChanged", val);
      },
      immediate: true,
    },
  },
});
</script>
