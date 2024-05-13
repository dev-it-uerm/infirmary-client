<template>
  <div class="fit">
    <FetchingData v-if="loading" style="min-height: 100px" />
    <div v-else class="fit q-pa-lg scroll">
      <q-form ref="qFormVisitDetails" @submit="save">
        <template v-for="field in fieldGroupsMap[tab.code]" :key="field.code">
          <div>
            <q-input
              v-if="field.type === 'TEXT'"
              :disable="loading"
              stack-label
              outlined
              :rules="generateRules(field.required)"
              :label="field.name"
              v-model.trim="value[field.code]"
              hint=""
            />
            <q-input
              v-if="field.type === 'TEXTAREA'"
              :disable="loading"
              type="textarea"
              stack-label
              outlined
              :rules="generateRules(field.required)"
              :label="field.name"
              v-model.trim="value[field.code]"
              hint=""
            />
            <DiagTestSelect
              v-if="field.type === 'DIAGTESTSELECT'"
              :disabled="loading"
              :options="field.options"
              :required="field.required"
              :label="field.name"
              :diagParamCode="field.code"
              :initialValue="value[field.code]"
              @valueChanged="(val) => (value[field.code] = val)"
            />
            <DiagTest
              v-if="field.type === 'DIAGTEST'"
              :disabled="loading"
              :label="field.name"
              :diagParamCode="field.code"
              :initialValue="value[field.code]"
              @valueChanged="(val) => (value[field.code] = val)"
            />
          </div>
        </template>
        <q-input
          :disable="loading"
          type="textarea"
          stack-label
          outlined
          label="Remarks"
          v-model.trim="value.REMARKS"
          hint=""
        />
        <div class="row justify-end">
          <q-btn
            unelevated
            class="text-black bg-accent"
            :loading="loading"
            label="SAVE"
            @click="submitForm"
          />
        </div>
      </q-form>
    </div>
    <ConfirmationDialog
      v-if="confDialogVisible"
      question="Are you sure you want to save visit details?"
      @ok="this.$refs.qFormVisitDetails.submit"
      @cancel="confDialogVisible = false"
    />
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, formatDate, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "VisitDetailsForm",
  components: {
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    DiagTest: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DiagTest.vue")
    ),
    DiagTestSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DiagTestSelect.vue")
    ),
  },
  props: {
    visitId: {
      type: Number,
      required: true,
    },
    patientId: {
      type: Number,
      required: true,
    },
    tab: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      generateRules(required) {
        return required
          ? [
              (val) => {
                if (val == null || val === "") return "This field is required.";
              },
            ]
          : [];
      },
      showMessage,
      formatDate,
      fieldGroupsMap: {
        MEDHIST: [
          {
            code: "PRESENTSYMPTOMS",
            name: "Present Symptoms",
            type: "TEXTAREA",
          },
          {
            code: "PASTILLNESSES",
            name: "Past Illnesses",
            type: "TEXTAREA",
          },
          {
            code: "ALLERGIES",
            name: "Allergies",
            type: "TEXTAREA",
          },
          {
            code: "MEDICATIONS",
            name: "Medications",
            type: "TEXTAREA",
          },
          {
            code: "MENSHISTLMP",
            name: "Menstrual History (LMP)",
            type: "TEXTAREA",
          },
          {
            code: "OPERATIONS",
            name: "Surgeries/Operations",
            type: "TEXTAREA",
          },
        ],
        PE: [
          {
            code: "VSIGNBP",
            name: "Blood Pressure",
            type: "TEXT",
            required: true,
          },
          {
            code: "VSIGNRR",
            name: "Respiratory Rate",
            type: "TEXT",
            required: true,
          },
          {
            code: "VSIGNHR",
            name: "Heart Rate",
            type: "TEXT",
            required: true,
          },
          {
            code: "HEIGHT",
            name: "height",
            type: "TEXT",
            required: true,
          },
          {
            code: "WEIGHT",
            name: "weight",
            type: "TEXT",
            required: true,
          },
          {
            code: "SKIN",
            name: "Skin",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "HEENT",
            name: "HEENT",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "NECK",
            name: "Neck",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "CHEST",
            name: "Chest",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "BREAST",
            name: "Breast",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "HEART",
            name: "Heart",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "ABDOMEN",
            name: "Abdomen",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "GENITOURINARY",
            name: "Genitourinary",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "ANUS",
            name: "Anus",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "REFLEXES",
            name: "Reflexes",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "EXTREMITIES",
            name: "Extremities",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
        ],
        LABCBC: [
          {
            code: "LABCBCHGB",
            name: "HGB",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "g/L",
              normalRange: "140-160m / 120-140f",
            },
          },
          {
            code: "LABCBCHCT",
            name: "HCT",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "%",
              normalRange: "0.40-0.54m / 0.37-0.47f",
            },
          },
          {
            code: "LABCBCRBC",
            name: "RBC",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "x10^12/L",
              normalRange: "4.5-5.0",
            },
          },
          {
            code: "LABCBCMCHC",
            name: "MCHC",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "pg",
              normalRange: "32-37",
            },
          },
          {
            code: "LABCBCMCV",
            name: "MCV",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "fL",
              normalRange: "80-94",
            },
          },
          {
            code: "LABCBCRDWCV",
            name: "RDW-CV",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "",
              normalRange: "",
            },
          },
          {
            code: "LABCBCRDWSD",
            name: "RDW-SD",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "",
              normalRange: "",
            },
          },
          {
            code: "LABCBCWBC",
            name: "WBC",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "x10^9/L",
              normalRange: "5-10",
            },
          },
          {
            code: "LABCBCNEUT",
            name: "NEUT",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "%",
              normalRange: "0.40-0.75",
            },
          },
          {
            code: "LABCBCLYMPH",
            name: "LYMPH",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "%",
              normalRange: "0.20-0.45",
            },
          },
          {
            code: "LABCBCMONO",
            name: "MONO",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "%",
              normalRange: "0.02-0.06",
            },
          },
          {
            code: "LABCBCBASO",
            name: "BASO",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "%",
              normalRange: "0.01-0.04",
            },
          },
          {
            code: "LABCBCPLT",
            name: "PLT",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "",
              normalRange: "",
            },
          },
          {
            code: "LABCBCMPV",
            name: "MPV",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "",
              normalRange: "",
            },
          },
          {
            code: "LABCBCMORPH",
            name: "MORPH",
            type: "DIAGTEST",
            default: {
              value: null,
              unit: "",
              normalRange: "",
            },
          },
        ],
        LABURI: [
          {
            code: "LABURICOLOR",
            name: "Color",
            type: "DIAGTESTSELECT",
            options: [
              "Straw",
              "Light Yellow",
              "Yellow",
              "Dark Yellow",
              "Amber",
            ],
            default: { value: null },
          },
          {
            code: "LABURITURB",
            name: "Turbidity",
            type: "DIAGTESTSELECT",
            options: ["Clear", "Slightly Cloudy", "Cloudy", "Turbid"],
            default: { value: null },
          },
          {
            code: "LABURISPGR",
            name: "SP GR",
            type: "DIAGTESTSELECT",
            options: [
              "1.000",
              "1.005",
              "1.010",
              "1.015",
              "1.020",
              "1.025",
              "1.030",
            ],
            default: { value: null },
          },
          {
            code: "LABURIPH",
            name: "PH",
            type: "DIAGTESTSELECT",
            default: { value: null },
          },
          {
            code: "LABURIPRTN",
            name: "Protein",
            type: "DIAGTESTSELECT",
            options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
            default: { value: null },
          },
          {
            code: "LABURISGR",
            name: "Sugar",
            type: "DIAGTESTSELECT",
            options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
            default: { value: null },
          },
          {
            code: "LABURIRBC",
            name: "RBC",
            type: "DIAGTESTSELECT",
            options: ["None"],
            default: { value: null },
          },
          {
            code: "LABURIEPI",
            name: "Epithelial",
            type: "DIAGTESTSELECT",
            options: ["None", "Few", "Many", "Moderate", "Abundant"],
            default: { value: null },
          },
          {
            code: "LABURIMCS",
            name: "Mucus",
            type: "DIAGTESTSELECT",
            options: ["None", "Few", "Many", "Moderate", "Abundant"],
            default: { value: null },
          },
          {
            code: "LABURICRSTL",
            name: "Crystal",
            type: "DIAGTESTSELECT",
            options: ["None", "Few", "Many", "Moderate", "Abundant"],
            default: { value: null },
          },
        ],
        LABFCL: [],
        RADXRCHST: [],
      },
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      loading: false,
      value: {},
      confDialogVisible: false,
    };
  },
  // computed: {
  //   ...mapGetters({
  //     user: "app/user",
  //   }),
  // },
  mounted() {
    this.value = {
      ...this.fieldGroupsMap[this.tab.code].reduce((acc, f) => {
        acc[f.code] = f.default ?? null;
        return acc;
      }, {}),
      REMARKS: null,
    };

    this.getInitialValue();
  },
  methods: {
    formatValue(val) {
      return Object.entries(val).reduce((acc, e) => {
        if (e[1] === "") e[1] = null;
        acc[e[0].toUpperCase()] = e[1];
        return acc;
      }, {});
    },
    formatDiagValue(val) {
      return val.reduce((acc, row) => {
        acc[row.DiagParamCode] = {
          value: row.DiagParamValue,
          ...(row.DiagParamUnit == null ? {} : { unit: row.DiagParamUnit }),
          ...(row.DiagParamNormalRange == null
            ? {}
            : { normalRange: row.DiagParamNormalRange }),
        };

        return acc;
      }, {});
    },
    async getInitialValue() {
      this.loading = true;
      await delay(1000);

      const response = await this.$store.dispatch("visit/getDetails", {
        visitId: this.visitId,
        patientId: this.patientId,
        tabCode: this.tab.code,
      });

      if (response.error) {
        console.log(response.error);
        this.loading = false;
        return;
      }

      if (!response.body || response.body.length === 0) {
        this.loading = false;
        return;
      }

      if (["LABCBC", "LABURI", "LABFCL", "RADXRCHST"].includes(this.tab.code)) {
        this.value = {
          ...this.value,
          ...this.formatDiagValue(response.body),
          REMARKS: response.body[0]?.Remarks ?? null,
        };

        this.loading = false;
        return;
      }

      this.value = {
        ...this.value,
        ...this.formatValue(response.body[0]),
      };

      this.loading = false;
    },
    async submitForm() {
      const valid = await this.$refs.qFormVisitDetails.validate();
      if (valid) this.confDialogVisible = true;
    },
    async save() {
      this.confDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("visit/saveDetails", {
        visitId: this.visitId,
        patientId: this.patientId,
        tabCode: this.tab.code,
        details: this.formatValue(this.value),
      });

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        return;
      }

      showMessage(this.$q, true, "Visit details have been saved successfully.");
      this.loading = false;
    },
  },
});
</script>
