<template>
  <q-select
    stack-label
    outlined
    input-debounce="300"
    label-slot
    multiple
    use-chips
    hint=""
    emit-value
    map-options
    :options="options"
    :disable="disable"
    :placeholder="placeholder"
    :rules="required ? [arrayRule] : []"
    v-model="selected"
  >
    <template v-slot:label>
      {{ label }}
      <span v-if="required" class="text-weight-bold text-red"> *</span>
    </template>
  </q-select>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldExamDentalCondition",
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
      required: true,
    },
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      selected: [],
      value: null,
    };
  },
  watch: {
    modelValue: {
      handler(v) {
        if (!v || v.trim() === "") {
          this.selected = [];
          return;
        }

        this.selected = v
          .split("\n")
          .filter((e) => e.includes("(+)"))
          .map((e) => {
            return (
              this.options.find((o) => {
                return o.label === e.replace("(+)", "").trim();
              })?.value || 0
            );
          })
          .filter((e) => e !== 0);
      },
      immediate: true,
    },
    selected: {
      handler(v) {
        if (!v || v.length === 0) {
          this.value = "";
          return;
        }

        this.value = this.options
          .map((o) => {
            return `(${v.some((e) => e === o.value) ? "+" : "-"}) ${o.label}`;
          })
          .join("\n");
      },
      immediate: true,
    },
    value(v) {
      this.$emit("update:modelValue", v);
    },
  },
  methods: {
    arrayRule(v) {
      return !v || v.length === 0 ? "This field is required." : true;
    },
  },
});
</script>
