<template>
  <div
    class="column full-width q-px-md q-pt-md q-pb-sm"
    style="
      border: 1px solid rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      margin-bottom: 20px;
    "
  >
    <div class="q-mb-sm" style="color: rgba(0, 0, 0, 0.65)">{{ label }}</div>
    <div
      class="full-width"
      :class="$q.screen.lt.md ? 'column' : 'row'"
      :style="$q.screen.lt.md ? {} : { gap: '20px' }"
    >
      <q-input
        :disable="disable"
        filled
        borderless
        square
        :class="$q.screen.lt.md ? 'col-12' : 'col'"
        dense
        stack-label
        label="Result"
        v-model.trim="value.value"
        hint=""
      />
      <q-input
        :disable="disable"
        filled
        borderless
        square
        :class="$q.screen.lt.md ? 'col-12' : 'col'"
        dense
        stack-label
        :rules="rules"
        label="Unit"
        v-model.trim="value.unit"
        hint=""
      />
      <q-input
        :disable="disable"
        filled
        borderless
        square
        :class="$q.screen.lt.md ? 'col-12' : 'col'"
        dense
        stack-label
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

export default defineComponent({
  name: "FormFieldExam",
  props: {
    label: {
      type: String,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
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
      this.value = this.initialValue;
      return;
    }

    this.value = {
      value: null,
      unit: null,
      normalRange: null,
    };
  },
});
</script>
