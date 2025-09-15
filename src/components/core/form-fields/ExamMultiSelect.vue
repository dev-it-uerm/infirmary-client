<template>
  <q-select
    stack-label
    outlined
    input-debounce="300"
    label-slot
    multiple
    use-chips
    hint=""
    :options="options"
    :disable="disable"
    :placeholder="placeholder"
    :rules="required ? [arrayRule] : []"
    v-model="value"
  >
    <template v-slot:label>
      {{ label }}
      <span v-if="required" class="text-weight-bold text-red"> *</span>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">No options</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldExamMultiSelect",
  props: {
    label: {
      type: String,
      default: "",
    },
    disable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: String,
      default: null,
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
        if (!v || v.length === 0) {
          return;
        }

        this.value = v.split("\n").map((e) => e.replace("* ", "").trim());
      },
      immediate: true,
    },
    value(v) {
      this.$emit(
        "update:modelValue",
        !v || v.length === 0 ? null : v.map((e) => `* ${e}`).join("\n")
      );
    },
  },
  methods: {
    arrayRule(v) {
      return !v || v.length === 0 ? "This field is required." : true;
    },
  },
});
</script>
