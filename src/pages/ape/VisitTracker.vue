<template>
  <q-page class="flex flex-center q-pa-lg">
    <div
      class="column"
      style="gap: 16px"
      :style="{ width: $q.screen.lt.md ? '100%' : '500px' }"
    >
      <PageHeader
        text="VISIT TRACKER"
        icon="fa-solid fa-solid fa-magnifying-glass"
      />
      <CardComponent>
        <template v-slot:body>
          <QRCodeScanner
            ref="visitCodeScanner"
            class="full-width"
            :loading="loading"
            @patientCodeChanged="(val) => (patientCode = val)"
            @inputModeChanged="(val) => (inputMode = val)"
          />
        </template>
      </CardComponent>
      <CardComponent>
        <template v-slot:body>
          <div
            v-if="loading"
            class="full-width flex flex-center"
            style="height: 100px"
          >
            <q-spinner-dots size="lg" />
          </div>
          <div v-else class="fit flex flex-center">
            <div
              v-if="patient && visit"
              class="full-width column q-pa-lg q-mb-md"
              style="gap: 2px; border: solid rgba(0, 0, 0, 0.15) 1px"
            >
              <div>
                <span class="text-grey-7">Visit Date & Time:</span>
                <span class="q-ml-sm">{{
                  formatDate(visit.dateTimeCreated)
                }}</span>
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
                <div v-if="patient.schoolYear">
                  <span class="text-grey-7">School Year:</span>
                  <span class="q-ml-sm">{{ patient.schoolYear }}</span>
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
            <!-- <div class="row justify-center q-py-md">
              <q-separator style="width: 100px" spaced />
            </div> -->
            <q-list
              class="full-width"
              separator
              v-if="exams && exams.length > 0"
            >
              <template v-for="(exam, idx) in exams" :key="idx">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>
                      {{
                        exam.dateTimeCompleted
                          ? formatDate(exam.dateTimeCompleted)
                          : "NOT YET COMPLETED"
                      }}
                    </q-item-label>
                    <q-item-label>
                      {{ examsMap[exam.examCode].name }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon
                      :name="
                        exam.dateTimeCompleted
                          ? 'fa-solid fa-circle-check'
                          : 'fa-solid fa-circle-xmark'
                      "
                      :color="exam.dateTimeCompleted ? 'positive' : 'negative'"
                      size="xs"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
            <div v-else class="column items-center">
              <q-icon class="q-mb-sm" name="info" size="sm" />
              <div class="text-center">
                Scan/enter the visit code to see its status.
              </div>
            </div>
          </div>
        </template>
      </CardComponent>
    </div>
  </q-page>
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
  affiliationsMap,
  campusesMap,
  collegesMap,
  yearLevels,
  departmentsMap,
} from "src/helpers/constants.js";

export default defineComponent({
  name: "VisitTracker",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    QRCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/QRCodeScanner.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
  },
  setup() {
    return {
      examsMap,
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
      // recentEntries: [],
      loading: false,
      inputMode: null,
      patientCode: null,
      exams: [],

      patient: null,
      visit: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    patientCode(val) {
      if (val) this.track(val);
    },
  },
  methods: {
    async track(patientCode) {
      this.loading = true;
      this.patient = null;
      this.visit = null;
      this.exams = [];

      const response = await this.$store.dispatch("ape/track", patientCode);
      await delay(2000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.$refs.visitCodeScanner.reset();
        this.loading = false;
        return;
      }

      this.patient = response.body.patient;
      this.visit = response.body.visit;

      const exams = response.body.exams;
      sortStringArr(exams, "dateTimeCompleted");

      this.exams = exams;

      this.$refs.visitCodeScanner.reset();
      this.loading = false;
    },
  },
});
</script>
