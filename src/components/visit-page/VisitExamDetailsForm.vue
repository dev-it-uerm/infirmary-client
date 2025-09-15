<template>
  <div>
    <FetchingData v-if="loading" />
    <template v-else>
      <q-form
        v-if="examsMap"
        ref="qFormVisitDetails"
        @submit="confDialogVisible = true"
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
              v-for="p in examsMap[examCode]?.params || []"
              :key="p.code"
            >
              <div>
                <q-input
                  v-if="p.fieldType === 'TEXT'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  stack-label
                  outlined
                  :rules="generateRules(p.required)"
                  :label="p.name"
                  v-model.trim="value[p.code]"
                  hint=""
                />
                <q-input
                  v-if="p.fieldType === 'TEXTAREA'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  type="textarea"
                  stack-label
                  outlined
                  :rules="generateRules(p.required)"
                  :label="p.name"
                  v-model.trim="value[p.code]"
                  hint=""
                />
                <UserSelect
                  v-if="p.fieldType === 'PHYSICIANSELECT'"
                  label="Physician"
                  roleCode="DR"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  :initialValue="value[p.code]"
                  @valueChanged="(val) => (value[p.code] = val)"
                />
                <FormFieldExam
                  v-if="p.fieldType === 'EXAM'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  :label="p.name"
                  :initialValue="value[p.code]"
                  @valueChanged="(val) => (value[p.code] = val)"
                />
                <FormFieldExamText
                  v-if="p.fieldType === 'EXAMTEXT'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  :required="p.required"
                  :label="p.name"
                  :initialValue="value[p.code]"
                  @valueChanged="(val) => (value[p.code] = val)"
                />
                <FormFieldExamTextArea
                  v-if="p.fieldType === 'EXAMTEXTAREA'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  :required="p.required"
                  :label="p.name"
                  :initialValue="value[p.code]"
                  @valueChanged="(val) => (value[p.code] = val)"
                />
                <FormFieldExamSelect
                  v-if="p.fieldType === 'EXAMSELECT'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  :options="p.options"
                  :required="p.required"
                  :label="p.name"
                  :initialValue="value[p.code]"
                  @valueChanged="(val) => (value[p.code] = val)"
                />
                <FormFieldXrayImpression
                  v-if="p.fieldType === 'XRAYIMPRESSION'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  :label="p.name"
                  :required="p.required"
                  :initialValue="value[p.code]?.value || null"
                  @valueChanged="
                    (val) => {
                      value[p.code] = { code: p.code, value: val };
                    }
                  "
                />
                <FormFieldExamMultiSelect
                  v-if="p.fieldType === 'MULTISELECT'"
                  :disable="
                    visitIsCompleted || examIsCompleted || p.disable || loading
                  "
                  :options="p.options"
                  :label="p.name"
                  :required="p.required"
                  :model-value="value[p.code]?.value || null"
                  @update:model-value="
                    (v) => {
                      value[p.code] = { code: p.code, value: v };
                    }
                  "
                />
              </div>
            </template>
          </div>
          <q-separator />
          <div class="row q-pa-lg justify-end" style="gap: 12px">
            <q-btn
              unelevated
              icon="save"
              :disable="visitIsCompleted || examIsCompleted"
              class="text-white bg-primary"
              :loading="loading"
              :label="
                visitIsCompleted || examIsCompleted ? 'COMPLETED' : 'SAVE'
              "
              type="submit"
            />
          </div>
        </div>
      </q-form>
    </template>
    <ConfirmationDialog
      v-if="confDialogVisible"
      question="Are you sure you want to save visit details?"
      @ok="save"
      @cancel="confDialogVisible = false"
    />
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay, formatDate, showMessage, isObj } from "src/helpers/util.js";
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
    FormFieldExamMultiSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/ExamMultiSelect.vue")
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
    examsMap: {
      type: Object,
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
    };
  },
  data() {
    return {
      loading: false,
      value: {},
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
      handler() {
        this.getInitialValue();
      },
      immediate: true,
    },
    loading: {
      handler(v) {
        this.$emit(v ? "busy" : "ready");
      },
      immediate: true,
    },
  },
  methods: {
    getVisitExamDetailsMap(arr) {
      if (!arr || arr.length === 0) {
        return {};
      }

      return arr.reduce((acc, row) => {
        acc[row.code] = {
          value: row.value,
          ...(row.unit == null ? {} : { unit: row.unit }),
          ...(row.normalRange == null ? {} : { normalRange: row.normalRange }),
        };

        return acc;
      }, {});
    },
    getMergedExamFieldsAndDetails(fields, obj) {
      return fields.reduce((a, e) => {
        if (obj[e.code] == null || obj[e.code] === "") {
          a[e.code] = e.default ?? null;
          return a;
        }

        a[e.code] = e.format ? e.format(obj[e.code]) : obj[e.code];
        return a;
      }, {});
    },
    async getInitialValue() {
      this.loading = true;

      // SUPPLY DEFAULT VALUE
      this.value = this.getMergedExamFieldsAndDetails(
        this.examsMap[this.examCode]?.params || [],
        this.getVisitExamDetailsMap([])
      );

      const response = await this.$store.dispatch("ape/getVisitExamDetails", {
        visitId: this.visitId,
        examCode: this.examCode,
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

      this.value = this.getMergedExamFieldsAndDetails(
        this.examsMap[this.examCode]?.params || [],
        this.getVisitExamDetailsMap(response.body.details)
      );

      this.loading = false;
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

      // MAKE SURE EVERY `detail` HAS A `code` PROP
      const payload = {
        visitId: this.visitId,
        examCode: this.examCode,
        markAsCompletedOnSave: false,
        details: Object.entries(this.value).map((e) => ({
          code: e[0],
          ...e[1],
        })),
      };

      const response = await this.$store.dispatch(
        "ape/saveExamDetails",
        payload
      );

      await delay(2000);

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        this.$emit("error");
        return;
      }

      this.visitIsCompleted = Boolean(response.body.visit.dateTimeCompleted);
      this.examIsCompleted = Boolean(response.body.exam.dateTimeCompleted);

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
