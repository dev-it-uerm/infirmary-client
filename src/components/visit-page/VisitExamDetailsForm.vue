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
            style="height: auto; max-height: 65vh; min-height: 100px"
          >
            <div v-for="p in examsMap[examCode]?.params || []" :key="p.code">
              <q-input
                v-if="p.fieldType === 'TEXT'"
                :disable="p.disable || loading"
                stack-label
                outlined
                :rules="generateRules(p.required)"
                :label="p.name"
                v-model.trim="value[p.code]"
                hint=""
              />
              <q-input
                v-if="p.fieldType === 'TEXTAREA'"
                :disable="p.disable || loading"
                type="textarea"
                stack-label
                outlined
                :rules="generateRules(p.required)"
                :label="p.name"
                v-model.trim="value[p.code]"
                hint=""
              />
              <FormFieldExam
                v-if="p.fieldType === 'EXAM'"
                :disable="p.disable || loading"
                :required="p.required"
                :label="p.name"
                :initialValue="value[p.code]"
                @valueChanged="(val) => (value[p.code] = val)"
              />
              <FormFieldExamText
                v-if="p.fieldType === 'EXAMTEXT'"
                :disable="p.disable || loading"
                :required="p.required"
                :label="p.name"
                :initialValue="value[p.code]"
                @valueChanged="(val) => (value[p.code] = val)"
              />
              <FormFieldExamTextArea
                v-if="p.fieldType === 'EXAMTEXTAREA'"
                :disable="p.disable || loading"
                :required="p.required"
                :label="p.name"
                :initialValue="value[p.code]"
                @valueChanged="(val) => (value[p.code] = val)"
              />
              <FormFieldExamSelect
                v-if="p.fieldType === 'EXAMSELECT'"
                :disable="p.disable || loading"
                :options="p.options"
                :required="p.required"
                :label="p.name"
                :initialValue="value[p.code]"
                @valueChanged="(val) => (value[p.code] = val)"
              />
              <FormFieldChestXrayImpression
                v-if="p.fieldType === 'XRAYIMPRESSION'"
                :disable="p.disable || loading"
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
                v-if="p.fieldType === 'EXAMMULTISELECT'"
                :disable="p.disable || loading"
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
              <FormFieldExamDentalChart
                v-if="p.fieldType === 'EXAMDENTALCHART'"
                :disable="p.disable || loading"
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
              <FormFieldExamIllnesses
                v-if="p.fieldType === 'EXAMILLNESSES'"
                :disable="p.disable || loading"
                :required="p.required"
                :label="p.name"
                :model-value="value[p.code]"
                @update:model-value="(val) => (value[p.code] = val)"
              />
              <FormFieldExamDentalCondition
                v-if="p.fieldType === 'EXAMDNTLCOND'"
                :disable="p.disable || loading"
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
            <UserSelect
              v-if="!isUserADoctorForThisExam"
              :label="doctorRole?.name"
              :roleCode="doctorRole?.code"
              :disable="loading"
              :required="true"
              v-model="doctor"
            />
          </div>
          <q-separator />
          <div class="row q-pa-lg justify-end" style="gap: 12px">
            <q-btn
              unelevated
              icon="save"
              class="text-white bg-primary"
              :loading="loading"
              label="SAVE"
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
import { defineComponent, defineAsyncComponent, ref, onMounted } from "vue";
import { delay, formatDate, showMessage } from "src/helpers/util.js";
import { mapGetters } from "vuex";
import { USER_ROLES, userRolesMap } from "src/helpers/constants";

export default defineComponent({
  name: "VisitExamDetailsForm",
  components: {
    ConfirmationDialog: defineAsyncComponent(
      () => import("src/components/core/ConfirmationDialog.vue"),
    ),
    FormFieldExam: defineAsyncComponent(
      () => import("src/components/core/form-fields/Exam.vue"),
    ),
    FormFieldExamText: defineAsyncComponent(
      () => import("src/components/core/form-fields/ExamText.vue"),
    ),
    FormFieldExamTextArea: defineAsyncComponent(
      () => import("src/components/core/form-fields/ExamTextArea.vue"),
    ),
    FormFieldExamSelect: defineAsyncComponent(
      () => import("src/components/core/form-fields/ExamSelect.vue"),
    ),
    FormFieldChestXrayImpression: defineAsyncComponent(
      () => import("src/components/core/form-fields/ChestXrayImpression.vue"),
    ),
    FormFieldExamMultiSelect: defineAsyncComponent(
      () => import("src/components/core/form-fields/ExamMultiSelect.vue"),
    ),
    FormFieldExamDentalChart: defineAsyncComponent(
      () => import("src/components/core/form-fields/ExamDentalChart.vue"),
    ),
    FormFieldExamIllnesses: defineAsyncComponent(
      () => import("src/components/core/form-fields/ExamIllnesses.vue"),
    ),
    FormFieldExamDentalCondition: defineAsyncComponent(
      () => import("src/components/core/form-fields/ExamDentalCondition.vue"),
    ),
    FetchingData: defineAsyncComponent(
      () => import("src/components/core/FetchingData.vue"),
    ),
    UserSelect: defineAsyncComponent(
      () => import("src/components/core/form-fields/UserSelectV2.vue"),
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
    EXAMS: {
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

      doctorRole: null,
      doctor: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
    isUserADoctorForThisExam() {
      if (!this.user || !this.examCode) {
        return false;
      }

      if (
        this.user.roleCode === USER_ROLES.DR &&
        [this.EXAMS.PE, this.EXAMS.MED_HIST].includes(this.examCode)
      ) {
        return true;
      }

      if (
        this.user.roleCode === USER_ROLES.LAB &&
        [this.EXAMS.LAB_CBC, this.EXAMS.LAB_URI, this.EXAMS.LAB_FCL].includes(
          this.examCode,
        )
      ) {
        return true;
      }

      if (
        this.user.roleCode === USER_ROLES.RAD &&
        this.examCode === this.EXAMS.RAD_XR_CHST
      ) {
        return true;
      }

      if (
        this.user.roleCode === USER_ROLES.DENTIST &&
        this.examCode === this.EXAMS.DENTAL
      ) {
        return true;
      }

      return false;
    },
  },
  watch: {
    examCode: {
      handler() {
        this.setInitialValue();
        this.setDoctorRole();
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
    setDoctorRole() {
      if (
        [this.EXAMS.LAB_CBC, this.EXAMS.LAB_URI, this.EXAMS.LAB_FCL].includes(
          this.examCode,
        )
      ) {
        this.doctorRole = userRolesMap[USER_ROLES.LAB];
        return;
      }

      if ([this.EXAMS.MED_HIST, this.EXAMS.PE].includes(this.examCode)) {
        this.doctorRole = userRolesMap[USER_ROLES.DR];
        return;
      }

      if (this.examCode === this.EXAMS.RAD_XR_CHST) {
        this.doctorRole = userRolesMap[USER_ROLES.RAD];
        return;
      }
    },
    async setInitialValue() {
      this.loading = true;

      // RESET DOCTOR
      this.doctor = null;

      // SUPPLY DEFAULT VALUE
      this.value = this.getMergedExamFieldsAndDetails(
        this.examsMap[this.examCode]?.params || [],
        this.getVisitExamDetailsMap([]),
      );

      const response = await this.$store.dispatch("ape/getVisitExamDetails", {
        visitId: this.visitId,
        examCode: this.examCode,
      });

      // if (
      //   ["LAB_CBC", "LAB_URI", "LAB_FCL"].includes(this.examCode) &&
      //   this.user?.roleCode !== "LAB"
      // ) {
      //   const response2 = await this.$store.dispatch("ape/getHeadDoctor", {
      //     specialtyCode: "LAB",
      //   });

      //   if (response2?.error) {
      //     this.loading = false;
      //     this.$emit("error");
      //     return;
      //   }

      //   this.doctor = response2.body;
      // }

      await delay(1000);

      if (response?.error) {
        this.loading = false;
        this.$emit("error");
        return;
      }

      if (!response.body || response.body.length === 0) {
        this.loading = false;
        return;
      }

      if (
        !this.isUserADoctorForThisExam &&
        response.body.exam?.completedBy &&
        response.body.exam?.completedByName &&
        response.body.exam?.dateTimeCompleted
      ) {
        this.doctor = {
          code: response.body.exam.completedBy,
          name: response.body.exam.completedByName,
        };
      }

      this.value = this.getMergedExamFieldsAndDetails(
        this.examsMap[this.examCode]?.params || [],
        this.getVisitExamDetailsMap(response.body.details),
      );

      this.loading = false;
    },
    async save() {
      this.confDialogVisible = false;
      this.loading = true;

      const response = await this.$store.dispatch("ape/saveExamDetails", {
        visitId: this.visitId,
        examCode: this.examCode,
        doctor: this.doctor,
        // MAKE SURE EVERY `detail` HAS A `code` PROP
        details: Object.entries(this.value).map((e) => ({
          code: e[0],
          ...e[1],
        })),
      });

      await delay(2000);

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        this.$emit("error");
        return;
      }

      showMessage(
        this.$q,
        true,
        "Visit exam details have been saved successfully.",
      );

      this.loading = false;
      this.$emit("saved");
    },
  },
});
</script>
