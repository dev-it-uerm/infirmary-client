<template>
  <div v-if="exams && exams.length > 0" class="column" style="gap: 16px">
    <q-select
      stack-label
      outlined
      label="Exam"
      option-value="code"
      option-label="name"
      :options="exams"
      :disable="loading"
      v-model="exam"
    />
    <QRCodeScanner
      ref="visitCodeScanner"
      :scannerId="scannerId"
      submitBtnLabel="RECEIVE"
      class="full-width"
      :loading="loading"
      @patientCodeChanged="(val) => (patientCode = val)"
      @inputModeChanged="(val) => (inputMode = val)"
    />
    <div class="q-mt-md">
      <div
        v-if="loading"
        class="full-width flex flex-center"
        style="height: 100px"
      >
        <q-spinner-dots size="lg" />
      </div>
      <div v-else class="full-width">
        <div
          v-if="visit && patient && exam"
          class="full-width column q-pa-lg q-mb-md"
          style="gap: 2px; border: solid rgba(0, 0, 0, 0.15) 1px"
        >
          <div>
            <span class="text-grey-7">Date & Time Visited:</span>
            <span class="q-ml-sm">{{ formatDate(visit.dateTimeCreated) }}</span>
          </div>
          <div class="q-mt-md">
            <div>
              <span class="text-grey-7">Exam Name:</span>
              <span class="q-ml-sm">{{ exam.name }}</span>
            </div>
            <div>
              <span class="text-grey-7">Date & Time Exam Accepted:</span>
              <span class="q-ml-sm">{{ dateTimeExamAccepted }}</span>
            </div>
          </div>
          <div class="q-mt-md">
            <div>
              <span class="text-grey-7">Patient Code:</span>
              <span class="q-ml-sm">{{ patient.identificationCode }}</span>
            </div>
            <div>
              <span class="text-grey-7">Patient Name:</span>
              <span class="q-ml-sm">{{
                formatName(
                  patient.firstName,
                  patient.middleName,
                  patient.lastName,
                  patient.extName
                )
              }}</span>
            </div>
          </div>
          <div class="q-mt-md">
            <div>
              <span class="text-grey-7">Patient Campus:</span>
              <span class="q-ml-sm">{{
                campusesMap[patient.campusCode].name
              }}</span>
            </div>
            <div>
              <span class="text-grey-7">Patient Affiliation:</span>
              <span class="q-ml-sm">{{
                affiliationsMap[patient.affiliationCode].name
              }}</span>
            </div>
            <div>
              <span class="text-grey-7">Patient Deparment/College:</span>
              <span class="q-ml-sm">{{
                departmentsMap[patient.deptCode].name
              }}</span>
            </div>
            <div v-if="patient.yearLevel">
              <span class="text-grey-7">Patient Year Level:</span>
              <span class="q-ml-sm">{{
                yearLevels.find((l) => l.code === Number(patient.yearLevel))
                  .name ?? ""
              }}</span>
            </div>
          </div>
        </div>
        <ReminderCard v-else bordered>
          <template v-slot:body>
            <div>
              Scan or enter patient code to tag the patient as
              <strong>received/accepted</strong> in the
              <strong>{{ exam.name }}</strong> section.
            </div>
          </template>
        </ReminderCard>
      </div>
    </div>
  </div>
  <ReminderCard v-else iconName="fa-solid fa-ban" iconColor="negative" bordered>
    <template v-slot:body>
      <div class="text-negative">
        You are not allowed to receive any diagnostic exams.
      </div>
    </template>
  </ReminderCard>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  delay,
  showMessage,
  sortStringArr,
  formatDate,
  formatName,
} from "src/helpers/util.js";

import {
  examsMap,
  exams,
  affiliationsMap,
  campusesMap,
  yearLevels,
  departmentsMap,
} from "src/helpers/constants.js";

export default defineComponent({
  name: "ExamAccept",
  components: {
    QRCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/QRCodeScanner.vue")
    ),
    MaximizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MaximizedDialog.vue")
    ),
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
  },
  props: {
    scannerId: {
      type: String,
      required: true,
    },
  },
  emits: ["busy", "ready"],
  setup() {
    return {
      examsMap,
      affiliationsMap,
      campusesMap,
      yearLevels,
      departmentsMap,
      formatDate,
      formatName,
    };
  },
  data() {
    return {
      loading: false,
      inputMode: null,

      patientCode: null,

      visit: null,
      patient: null,
      dateTimeExamAccepted: null,

      exams: [],
      exam: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    patientCode(val) {
      if (val) this.accept(val);
    },
  },
  mounted() {
    if (!this.user) return;

    this.exams = exams.filter((e) => {
      return (
        e.code !== examsMap.MED_HIST.code &&
        this.user.examsHandled &&
        this.user.examsHandled.includes(e.code)
      );
    });

    if (this.exams.length > 0) this.exam = this.exams[0];
  },
  methods: {
    async accept(patientCode) {
      this.loading = true;
      this.$emit("busy");
      this.visit = null;
      this.patient = null;
      this.dateTimeExamAccepted = null;

      const response = await this.$store.dispatch("ape/acceptExam", {
        identificationCode: patientCode,
        examCode: this.exam.code,
      });

      await delay(2000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.$refs.visitCodeScanner.reset();
        this.loading = false;
        this.$emit("ready");
        return;
      }

      this.visit = response.body.visit;
      this.patient = response.body.patient;
      this.dateTimeExamAccepted = formatDate(
        response.body.visitExam.dateTimeAccepted
      );

      this.$refs.visitCodeScanner.reset();
      this.loading = false;
      this.$emit("ready");
    },
  },
});
</script>
