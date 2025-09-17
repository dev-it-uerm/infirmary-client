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
        <q-list>
          <template v-for="(g, idx) in optionGroups" :key="idx">
            <q-expansion-item
              :group="String(idx)"
              header-class="text-uppercase text-overline text-grey-6"
              :label="g.label"
            >
              <q-item
                clickable
                v-for="(o, idx) in g.children"
                :key="idx"
                @click="
                  () => {
                    const v = `(+) ${o}`;

                    if (value?.includes(v)) {
                      return;
                    }

                    value = value ? `${value}\n${v}` : v;
                  }
                "
              >
                <q-item-section class="q-ml-md">
                  <q-item-label>{{ o }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-separator v-if="idx !== optionGroups.length - 1" />
          </template>
        </q-list>
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
      optionGroups: [
        {
          label: "Blood",
          children: ["Anemia", "Thalassemia", "Thrombocytopenia"],
        },
        {
          label: "Skin",
          children: ["Dermatoses", "Psoriasis", "Acne", "Scabies"],
        },
        {
          label: "Eye",
          children: [
            "Blurring of vision",
            "Myopia",
            "Hyperopia",
            "Astigmatism",
            "Color Blindness",
          ],
        },
        {
          label: "Ear",
          children: ["Ear infection", "Poor Hearing"],
        },
        {
          label: "Lung",
          children: ["Asthma", "Pneumonia", "Tuberculosis/Primary Complex"],
        },
        {
          label: "Heart",
          children: [
            "Congenital Heart Defect",
            "Rheumatic Heart Disease",
            "Hypertension",
          ],
        },
        {
          label: "Abdomen",
          children: ["Amoebiasis", "Hepatitis", "PCOS"],
        },
        {
          label: "Genito Urinary",
          children: ["Urinary Tract Infection", "Hernia", "Kidney Disease"],
        },
        {
          label: "Endocrine",
          children: ["Diabetes", "Thyroid (Hyper/Hypo)"],
        },
        {
          label: "Neurologic",
          children: ["Seizures/Convulsions", "Migraines"],
        },
        {
          label: "Infectious",
          children: [
            "Varicella/Chicken Pox",
            "Rubeolar/Measles",
            "Rubellar/Germal Measles",
            "Dengue",
            "Covid",
            "STD",
          ],
        },
        {
          label: "Emotional",
          children: ["Depression", "Generalized Anxiety Disorder"],
        },
        {
          label: "Learning",
          children: ["ADHD", "Dyslexia"],
        },
        {
          label: "Genetic",
          children: ["G6PD Deficiency"],
        },
        {
          label: "Others",
          children: [
            "Arthritis",
            "Bleeding Disorder",
            "Clotting Disorder",
            "Enlarged Adenoids",
            "Fainting History",
            "Sinus Problem",
            "Stomach Ulcer",
            "Hay Fever",
          ],
        },
      ],
      // options: [
      //   "Allergies",
      //   "Anemia",
      //   "Arthritis",
      //   "Asthma",
      //   "Bleeding Disorder",
      //   "Clotting Disorder",
      //   "Diabetes",
      //   "Enlarged Adenoids",
      //   "Epilepsy",
      //   "Fainting History",
      //   "Glaucoma",
      //   "Hay Fever",
      //   "Heart Condition",
      //   "Hepatitis",
      //   "High Blood Pressure",
      //   "Kidney Disease",
      //   "Liver Disease",
      //   "Nervous Disorder",
      //   "Rheumatic Fever",
      //   "Rheumatism",
      //   "Sinus Problem",
      //   "Stomach Ulcer",
      //   "Thyroid Disease",
      //   "Tonsilitis",
      //   "Tuberculosis",
      //   "Venereal Disease",
      // ],
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
