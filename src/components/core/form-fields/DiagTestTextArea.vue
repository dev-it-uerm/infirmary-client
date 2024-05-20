<template>
  <q-input
    :disable="loading"
    type="textarea"
    stack-label
    outlined
    label-slot
    :rules="[
      (val) =>
        required && (val == null || val === '')
          ? 'This field is required.'
          : undefined,
    ]"
    v-model.trim="value"
    hint=""
  >
    <template v-slot:label>
      {{ label }}
      <span class="text-weight-bold text-red" v-if="required"> *</span>
    </template>
  </q-input>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldDiagTestTextArea",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    label: {
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
  created() {
    if (this.initialValue) this.value = this.initialValue.value;
  },
  watch: {
    value: {
      handler(val) {
        this.$emit(
          "valueChanged",
          val == null
            ? null
            : {
                code: this.diagParamCode,
                value: val,
              }
        );
      },
      immediate: true,
    },
  },
});
</script>
