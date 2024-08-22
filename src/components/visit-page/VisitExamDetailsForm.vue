<template>
  <div>
    <!-- <div class="bg-white flex flex-center" style="height: 200px; opacity: 0.8">
      <q-spinner-dots color="black" size="md" />
    </div> -->
    <FetchingData v-if="loading" />
    <q-form
      v-if="!loading && examCode && examsMap && examsMap[examCode]"
      ref="qFormVisitDetails"
      @submit="save"
    >
      <div
        class="fit"
        style="display: grid; grid-template-rows: auto min-content"
      >
        <div
          class="q-pa-lg scroll"
          style="height: auto; max-height: 70vh; min-height: 100px"
        >
          <template
            v-for="param in examsMap[examCode].params"
            :key="param.code"
          >
            <div>
              <q-input
                v-if="param.fieldType === 'TEXT'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                stack-label
                outlined
                :rules="generateRules(param.required)"
                :label="param.name"
                v-model.trim="value[param.code]"
                hint=""
              />
              <q-input
                v-if="param.fieldType === 'TEXTAREA'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                type="textarea"
                stack-label
                outlined
                :rules="generateRules(param.required)"
                :label="param.name"
                v-model.trim="value[param.code]"
                hint=""
              />
              <UserSelect
                v-if="param.fieldType === 'PHYSICIANSELECT'"
                label="Physician"
                :roleCode="userRolesMap.DR.code"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                :initialValue="value[param.code]"
                @valueChanged="(val) => (value[param.code] = val)"
              />
              <FormFieldExam
                v-if="param.fieldType === 'EXAM'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                :label="param.name"
                :initialValue="value[param.code]"
                @valueChanged="(val) => (value[param.code] = val)"
              />
              <FormFieldExamText
                v-if="param.fieldType === 'EXAMTEXT'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                :required="param.required"
                :label="param.name"
                :initialValue="value[param.code]"
                @valueChanged="(val) => (value[param.code] = val)"
              />
              <FormFieldExamTextArea
                v-if="param.fieldType === 'EXAMTEXTAREA'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                :required="param.required"
                :label="param.name"
                :initialValue="value[param.code]"
                @valueChanged="(val) => (value[param.code] = val)"
              />
              <FormFieldExamSelect
                v-if="param.fieldType === 'EXAMSELECT'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                :options="param.options"
                :required="param.required"
                :label="param.name"
                :initialValue="value[param.code]"
                @valueChanged="(val) => (value[param.code] = val)"
              />
              <FormFieldXrayImpression
                v-if="param.fieldType === 'XRAYIMPRESSION'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  param.disable ||
                  loading
                "
                :label="param.name"
                :required="param.required"
                :initialValue="value[param.code]?.value || null"
                @valueChanged="
                  (val) => {
                    value[param.code] = { code: param.code, value: val };
                  }
                "
              />
            </div>
          </template>
        </div>
        <q-separator />
        <div
          class="row q-pa-lg"
          :class="
            markAsCompletedOnSave != null &&
            !visitIsCompleted &&
            !examIsCompleted
              ? 'justify-between'
              : 'justify-end'
          "
          style="gap: 12px"
        >
          <q-checkbox
            v-if="
              markAsCompletedOnSave != null &&
              !visitIsCompleted &&
              !examIsCompleted
            "
            v-model="markAsCompletedOnSave"
            label="Mark Exam As COMPLETED On Save"
          />
          <q-btn
            unelevated
            icon="save"
            :disable="visitIsCompleted || examIsCompleted"
            class="text-white bg-primary"
            :loading="loading"
            :label="visitIsCompleted || examIsCompleted ? 'COMPLETED' : 'SAVE'"
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
import { userRolesMap } from "src/helpers/constants.js";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "VisitExamDetailsForm",
  components: {
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    FormFieldExam: defineAsyncComponent(() =>
      import("src/components/core/form-fields/Exam.vue")
    ),
    FormFieldExamText: defineAsyncComponent(() =>
      import("src/components/core/form-fields/ExamText.vue")
    ),
    FormFieldExamTextArea: defineAsyncComponent(() =>
      import("src/components/core/form-fields/ExamTextArea.vue")
    ),
    FormFieldExamSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/ExamSelect.vue")
    ),
    FormFieldXrayImpression: defineAsyncComponent(() =>
      import("src/components/core/form-fields/XrayImpression.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    UserSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/UserSelect.vue")
    ),
  },
  props: {
    visitId: {
      type: Number,
      required: true,
    },
    examCode: {
      type: String,
      required: true,
    },
  },
  emits: ["busy", "ready", "saved", "error"],
  setup() {
    return {
      userRolesMap,
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
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      examsMap: null,

      loading: false,
      value: {},
      markAsCompletedOnSave: null,
      confDialogVisible: false,

      visitIsCompleted: false,
      examIsCompleted: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    examCode: {
      async handler(val) {
        if (!this.examsMap) {
          this.loading = true;
          const examsMap = (await this.$store.dispatch("ape/getExams"))[1];
          await delay(500);
          this.loading = false;

          await this.getInitialValue(val, examsMap);
          this.examsMap = examsMap;
          return;
        }

        await this.getInitialValue(val, this.examsMap);
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
    formatResponseBody(arr) {
      if (!arr) return {};

      return arr.reduce((acc, row) => {
        acc[row.code] = {
          value: row.value,
          ...(row.unit == null ? {} : { unit: row.unit }),
          ...(row.normalRange == null ? {} : { normalRange: row.normalRange }),
        };

        return acc;
      }, {});
    },
    mergeFieldsAndVal(fields, obj) {
      return fields.reduce((acc, field) => {
        if (obj[field.code] == null || obj[field.code] === "") {
          acc[field.code] = field.defaultValue ?? null;
          return acc;
        }

        acc[field.code] = field.format
          ? field.format(obj[field.code])
          : obj[field.code];

        return acc;
      }, {});
    },
    async getInitialValue(examCode, examsMap) {
      this.loading = true;

      // SUPPLY DEFAULT VALUE
      this.value = this.mergeFieldsAndVal(
        examsMap[examCode].params,
        this.formatResponseBody([])
      );

      const response = await this.$store.dispatch("ape/getVisitExamDetails", {
        visitId: this.visitId,
        examCode,
      });

      await delay(1000);

      if (response.error) {
        this.loading = false;
        this.$emit("error");
        return;
      }

      if (!response.body || response.body.length === 0) {
        this.loading = false;
        return;
      }

      this.visitIsCompleted = Boolean(response.body.visit.dateTimeCompleted);
      this.examIsCompleted = Boolean(response.body.exam.dateTimeCompleted);

      this.value = this.mergeFieldsAndVal(
        examsMap[examCode].params,
        this.formatResponseBody(response.body.details)
      );

      if (!this.visitIsCompleted && !this.examIsCompleted) {
        this.markAsCompletedOnSave = false;
      }

      this.loading = false;
    },
    async submitForm() {
      const valid = await this.$refs.qFormVisitDetails.validate();

      if (!valid) {
        // TO DO: SCROLL TO INVALID FIELD
        return;
      }

      this.confDialogVisible = true;
    },
    async save() {
      // TEMPORARY CODE. REMOVE AFTER FEATURE IS ADDED. [START]
      if (
        this.user?.roleCode === "RADTECH" &&
        this.examCode === "RAD_XR_CHST"
      ) {
        showMessage(this.$q, false, "Please use the X-RAY BATCH ENCODE page.");
        return;
      }
      // TEMPORARY CODE. REMOVE AFTER FEATURE IS ADDED. [END]

      this.confDialogVisible = false;
      this.loading = true;
      await delay(2000);

      // MAKE SURE EVERY `detail` HAS A `code` PROP
      const payload = {
        visitId: this.visitId,
        examCode: this.examCode,
        details: Object.entries(this.value).map((e) => ({
          code: e[0],
          ...e[1],
        })),
      };

      if (this.markAsCompletedOnSave === true) {
        payload.markAsCompletedOnSave = true;
      }

      const response = await this.$store.dispatch(
        "ape/saveExamDetails",
        payload
      );

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        this.$emit("error");
        return;
      }

      this.visitIsCompleted = Boolean(response.body.visit.dateTimeCompleted);
      this.examIsCompleted = Boolean(response.body.exam.dateTimeCompleted);

      if (this.visitIsCompleted || this.examIsCompleted) {
        this.markAsCompletedOnSave = null;
      }

      showMessage(
        this.$q,
        true,
        "Visit exam details have been saved successfully."
      );

      this.loading = false;
      this.$emit("saved");
    },
  },
});
</script>
