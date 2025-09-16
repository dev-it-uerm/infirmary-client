<template>
  <q-input
    debounce="750"
    :disable="disable || loading"
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
    v-model="value"
    hint=""
  >
    <template v-slot:label>
      {{ label }}
      <span v-if="required" class="text-weight-bold text-red"> *</span>
    </template>
    <template v-slot:append>
      <q-btn-dropdown rounded flat class="text-primary" icon="sym_o_book_2">
        <q-item
          clickable
          v-for="(o, idx) in options"
          :key="idx"
          @click="
            () => {
              if (!value) {
                value = `\n* ${o}`;
                return;
              }

              value += `\n* ${o}`;
            }
          "
        >
          <q-item-section>
            {{ o }}
          </q-item-section>
        </q-item>
      </q-btn-dropdown>
    </template>
  </q-input>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldExamTextArea",
  props: {
    disable: {
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
    modelValue: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup() {
    return {
      options: [
        "Allergies",
        "Anemia",
        "Arthritis",
        "Asthma",
        "Bleeding Disorder",
        "Clotting Disorder",
        "Diabetes",
        "Enlarged Adenoids",
        "Epilepsy",
        "Fainting History",
        "Glaucoma",
        "Hay Fever",
        "Heart Condition",
        "Hepatitis",
        "High Blood Pressure",
        "Kidney Disease",
        "Liver Disease",
        "Nervous Disorder",
        "Rheumatic Fever",
        "Rheumatism",
        "Sinus Problem",
        "Stomach Ulcer",
        "Thyroid Disease",
        "Tonsilitis",
        "Tuberculosis",
        "Venereal Disease",
      ],
    };
  },
  data() {
    return {
      value: null,
    };
  },
  created() {
    if (this.modelValue) {
      this.value = this.modelValue.value;
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("update:modelValue", {
          value: val == null || val === "" ? null : val,
        });
      },
      immediate: true,
    },
  },
});
</script>
