<template>
  <div class="column" style="gap: 16px">
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
      <div v-else class="fit flex flex-center">
        <div
          v-if="visit && patient && exam"
          class="full-width column q-pa-lg q-mb-md"
          style="gap: 2px; border: solid rgba(0, 0, 0, 0.15) 1px"
        >
          <div>
            <span class="text-grey-7">Visit Date & Time:</span>
            <span class="q-ml-sm">{{ formatDate(visit.dateTimeCreated) }}</span>
          </div>
          <div class="q-mt-sm">
            <span class="text-grey-7">Exam Name:</span>
            <span class="q-ml-sm">{{ exam.name }}</span>
          </div>
          <div class="q-mt-sm">
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
          <div v-if="patient.deptCode" class="q-mt-sm">
            <div>
              <span class="text-grey-7">Deparment:</span>
              <span class="q-ml-sm">{{
                departmentsMap[patient.deptCode].name
              }}</span>
            </div>
          </div>
          <div v-if="patient.collegeCode" class="q-mt-sm">
            <div>
              <span class="text-grey-7">College:</span>
              <span class="q-ml-sm">{{
                collegesMap[patient.collegeCode].name
              }}</span>
            </div>
            <div v-if="patient.yearLevel">
              <span class="text-grey-7">Year Level:</span>
              <span class="q-ml-sm">{{
                yearLevels.find((l) => l.code === Number(patient.yearLevel))
                  .name ?? ""
              }}</span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="column items-center q-pa-md"
          style="border: 1px solid rgba(0, 0, 0, 0.15)"
        >
          <q-icon class="q-mb-sm" name="info" size="sm" />
          <div class="text-center">
            Scan or enter patient code to tag the patient as
            <strong>received/accepted</strong> in the
            <strong>{{ exam.name }}</strong> section.
          </div>
        </div>
      </div>
    </div>
  </div>
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
  collegesMap,
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
  },
  props: {
    scannerId: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      examsMap,
      exams: exams.filter((e) => e.code !== examsMap.MED_HIST.code),
      affiliationsMap,
      campusesMap,
      collegesMap,
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
      exam: examsMap.PE,
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
  methods: {
    async accept(patientCode) {
      this.loading = true;

      this.visit = null;
      this.patient = null;

      const response = await this.$store.dispatch("ape/acceptExam", {
        identificationCode: patientCode,
        examCode: this.exam.code,
      });
      await delay(2000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.$refs.visitCodeScanner.reset();
        this.loading = false;
        return;
      }

      this.visit = response.body.visit;
      this.patient = response.body.patient;

      this.$refs.visitCodeScanner.reset();
      this.loading = false;
    },
  },
});
</script>
