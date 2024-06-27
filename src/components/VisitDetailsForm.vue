<template>
  <div>
    <!-- <div class="bg-white flex flex-center" style="height: 200px; opacity: 0.8">
      <q-spinner-dots color="black" size="md" />
    </div> -->
    <FetchingData v-if="loading" />
    <q-form v-else ref="qFormVisitDetails" @submit="save">
      <div
        class="fit"
        style="display: grid; grid-template-rows: auto min-content"
      >
        <div
          class="q-pa-lg scroll"
          style="height: auto; max-height: 70vh; min-height: 100px"
        >
          <template v-for="field in tabFieldsMap[tab.code]" :key="field.code">
            <div>
              <q-input
                v-if="field.type === 'TEXT'"
                :disable="loading || field.disabled"
                stack-label
                outlined
                :rules="generateRules(field.required)"
                :label="field.name"
                v-model.trim="value[field.code]"
                hint=""
              />
              <q-input
                v-if="field.type === 'TEXTAREA'"
                :disable="loading || field.disabled"
                type="textarea"
                stack-label
                outlined
                :rules="generateRules(field.required)"
                :label="field.name"
                v-model.trim="value[field.code]"
                hint=""
              />
              <DiagTest
                v-if="field.type === 'DIAGTEST'"
                :disabled="loading || field.disabled"
                :label="field.name"
                :diagParamCode="field.code"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <DiagTestTextArea
                v-if="field.type === 'DIAGTESTTEXTAREA'"
                :disabled="loading || field.disabled"
                :required="field.required"
                :label="field.name"
                :diagParamCode="field.code"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <DiagTestSelect
                v-if="field.type === 'DIAGTESTSELECT'"
                :disabled="loading || field.disabled"
                :options="field.options"
                :required="field.required"
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
        </div>
        <q-separator />
        <div
          class="row q-pa-lg"
          :class="
            markAsCompletedOnSave != null && !visitIsCompleted
              ? 'justify-between'
              : 'justify-end'
          "
          style="gap: 12px"
        >
          <q-checkbox
            v-if="markAsCompletedOnSave != null && !visitIsCompleted"
            v-model="markAsCompletedOnSave"
            label="Mark Exam As Completed On Save"
          />
          <q-btn
            unelevated
            :disable="visitIsCompleted"
            class="text-white bg-primary"
            :loading="loading"
            :label="visitIsCompleted ? 'COMPLETED' : 'SAVE'"
            @click="submitForm"
          />
        </div>
      </div>
    </q-form>
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
import { delay, formatDate, showMessage, isObj } from "src/helpers/util.js";
import { exams, examsMap, examFieldsMap } from "src/helpers/constants.js";

export default defineComponent({
  name: "VisitDetailsForm",
  components: {
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    DiagTest: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DiagTest.vue")
    ),
    DiagTestTextArea: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DiagTestTextArea.vue")
    ),
    DiagTestSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DiagTestSelect.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
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
    visitIsCompleted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["busy", "ready"],
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
      tabFieldsMap: {
        VISIT: [
          // {
          //   code: "PHYSICIAN",
          //   name: "Physician",
          //   type: "TEXT",
          // },
          {
            code: "CREATEDBY",
            name: "Added By",
            type: "TEXT",
            disabled: true,
          },
          {
            code: "DATETIMECREATED",
            name: "Date & Time Visited",
            type: "TEXT",
            format: formatDate,
            disabled: true,
          },
          {
            code: "COMPLETEDBY",
            name: "Completed By",
            type: "TEXT",
            default: "NOT YET COMPLETED",
            disabled: true,
          },
          {
            code: "DATETIMECOMPLETED",
            name: "Date & Time Completed",
            type: "TEXT",
            format: formatDate,
            default: "NOT YET COMPLETED",
            disabled: true,
          },
        ],
        ...examFieldsMap,
      },
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      loading: false,
      value: {},
      markAsCompletedOnSave: null,
      confDialogVisible: false,
    };
  },
  watch: {
    tab: {
      handler(val) {
        this.init();
      },
      immediate: true,
    },
    loading: {
      handler(val) {
        this.$emit(val ? "busy" : "ready");
      },
      immediate: true,
    },
  },
  methods: {
    formatValue(val) {
      if (!val) return {};

      return Object.entries(val).reduce((acc, entry) => {
        const key = entry[0].toUpperCase();
        const val = entry[1];

        // CONVERT "" PROPS TO null
        acc[key] = isObj(val)
          ? Object.entries(val).reduce((acc, e) => {
              acc[e[0]] = e[1] === "" ? null : e[1];
              return acc;
            }, {})
          : val;

        return acc;
      }, {});
    },
    formatDiagValue(val) {
      if (!val) return {};

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
    mergeTempAndVal(template, obj) {
      return template.reduce((acc, field) => {
        if (obj[field.code] == null || obj[field.code] === "") {
          acc[field.code] = field.default ?? null;
        } else {
          acc[field.code] = field.format
            ? field.format(obj[field.code])
            : obj[field.code];
        }

        return acc;
      }, {});
    },
    async getInitialValue() {
      this.loading = true;
      this.value = {};

      const response = await this.$store.dispatch("ape/getVisitDetails", {
        visitId: this.visitId,
        patientId: this.patientId,
        tabCode: this.tab.code,
      });

      await delay(1000);

      if (response.error) {
        this.loading = false;
        return;
      }

      if (!response.body || response.body.length === 0) {
        this.loading = false;
        return;
      }

      if (
        [
          examsMap.LABCBC.code,
          examsMap.LABURI.code,
          examsMap.LABFCL.code,
          examsMap.RADXRCHST.code,
        ].includes(this.tab.code)
      ) {
        this.value = {
          ...this.mergeTempAndVal(
            this.tabFieldsMap[this.tab.code],
            this.formatDiagValue(response.body)
          ),
          REMARKS: response.body[0]?.Remarks ?? null,
        };

        this.loading = false;
        return;
      }

      this.value = this.mergeTempAndVal(
        this.tabFieldsMap[this.tab.code],
        this.formatValue(response.body[0])
      );

      this.loading = false;
    },
    async init() {
      this.markAsCompletedOnSave = null;
      const isExamTab = exams.some((e) => e.code === this.tab.code);

      if (isExamTab && !this.visitIsCompleted) {
        this.markAsCompletedOnSave = true;
      }

      this.getInitialValue();
    },
    async submitForm() {
      const valid = await this.$refs.qFormVisitDetails.validate();
      if (valid) this.confDialogVisible = true;
    },
    async save() {
      this.confDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const payload = {
        visitId: this.visitId,
        patientId: this.patientId,
        tabCode: this.tab.code,
        details: this.formatValue(this.value),
      };

      if (this.markAsCompletedOnSave === true) {
        payload.markAsCompletedOnSave = true;
      }

      const response = await this.$store.dispatch("ape/saveDetails", payload);

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
