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
          <template v-for="field in examFieldsMap[tab.code]" :key="field.code">
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
              <DiagTest
                v-if="field.type === 'DIAGTEST'"
                :disabled="loading"
                :label="field.name"
                :diagParamCode="field.code"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <DiagTestTextArea
                v-if="field.type === 'DIAGTESTTEXTAREA'"
                :disabled="loading"
                :required="field.required"
                :label="field.name"
                :diagParamCode="field.code"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
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
import { exams, examFieldsMap } from "src/helpers/constants.js";

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
      examFieldsMap,
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
      // CONVERT "" PROPS TO null
      return Object.entries(val).reduce((acc, e) => {
        const key = e[0].toUpperCase();
        const val = e[1];

        acc[key] = isObj(val)
          ? Object.entries(val).reduce((acc, e) => {
              acc[e[0]] = e[1] === "" ? null : e[1];
              return acc;
            }, {})
          : e[1];

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

      const response = await this.$store.dispatch("ape/getVisitDetails", {
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
    async init() {
      this.markAsCompletedOnSave = null;

      this.value = {
        ...this.examFieldsMap[this.tab.code].reduce((acc, f) => {
          acc[f.code] = f.default ?? null;
          return acc;
        }, {}),
        REMARKS: null,
      };

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
