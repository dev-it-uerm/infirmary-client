<template>
  <div>
    <FetchingData v-if="loading" />
    <q-form v-else ref="qFormVisitDetails" @submit="confDialogVisible = true">
      <div
        class="fit"
        style="display: grid; grid-template-rows: auto min-content"
      >
        <div
          class="q-pa-lg scroll"
          style="height: auto; max-height: 70vh; min-height: 100px"
        >
          <template v-for="field in examFieldsMap[examCode]" :key="field.code">
            <div>
              <q-input
                v-if="field.type === 'TEXT'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                stack-label
                outlined
                :rules="generateRules(field.required)"
                :label="field.name"
                v-model.trim="value[field.code]"
                hint=""
              />
              <q-input
                v-if="field.type === 'TEXTAREA'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                type="textarea"
                stack-label
                outlined
                :rules="generateRules(field.required)"
                :label="field.name"
                v-model.trim="value[field.code]"
                hint=""
              />
              <UserSelect
                v-if="field.type === 'PHYSICIANSELECT'"
                label="Physician"
                :roleCode="userRolesMap.DR.code"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <FormFieldExam
                v-if="field.type === 'EXAM'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                :label="field.name"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <FormFieldExamText
                v-if="field.type === 'EXAMTEXT'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                :required="field.required"
                :label="field.name"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <FormFieldExamTextArea
                v-if="field.type === 'EXAMTEXTAREA'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                :required="field.required"
                :label="field.name"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <FormFieldExamSelect
                v-if="field.type === 'EXAMSELECT'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                :options="field.options"
                :required="field.required"
                :label="field.name"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
              <FormFieldXrayImpression
                v-if="field.type === 'XRAYIMPRESSION'"
                :disable="
                  visitIsCompleted ||
                  examIsCompleted ||
                  field.disable ||
                  loading
                "
                :label="field.name"
                :required="field.required"
                :initialValue="value[field.code]?.value || null"
                @valueChanged="
                  (val) => {
                    value[field.code] = { code: field.code, value: val };
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
            :label="visitIsCompleted || examIsCompleted ? 'COMPLETED' : 'SAVE'"
            type="submit"
          />
        </div>
      </div>
    </q-form>
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
import { examFieldsMap, userRolesMap } from "src/helpers/constants.js";
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
      examFieldsMap,
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
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
      handler(val) {
        this.getInitialValue();
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
      return fields.reduce((acc, field) => {
        if (obj[field.code] == null || obj[field.code] === "") {
          acc[field.code] = field.default ?? null;
          return acc;
        }

        acc[field.code] = field.format
          ? field.format(obj[field.code])
          : obj[field.code];

        return acc;
      }, {});
    },
    async getInitialValue() {
      this.loading = true;

      // SUPPLY DEFAULT VALUE
      this.value = this.getMergedExamFieldsAndDetails(
        this.examFieldsMap[this.examCode],
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
        this.examFieldsMap[this.examCode],
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
