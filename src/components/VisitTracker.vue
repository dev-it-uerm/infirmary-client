<template>
  <div>
    <div>
      <FetchingData v-if="!initialized" />
      <template v-else>
        <div class="column" style="gap: 16px">
          <QRCodeScanner
            ref="visitCodeScanner"
            submitBtnIcon="sym_o_track_changes"
            submitBtnLabel="TRACK"
            class="full-width"
            :scannerId="scannerId"
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
                v-if="patient && lastVisit"
                class="full-width column q-pa-lg q-mb-md"
                style="gap: 2px; border: solid rgba(0, 0, 0, 0.15) 1px"
              >
                <div>
                  <span class="text-grey-7">Last Visit Date & Time:</span>
                  <span class="q-ml-sm">
                    {{ formatDate(lastVisit.dateTimeCreated) }}
                  </span>
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
                  <span class="q-ml-sm">
                    {{ affiliationsMap[patient.affiliationCode].name }}
                  </span>
                </div>
                <div class="q-mt-sm">
                  <div>
                    <span class="text-grey-7">Patient Dept/College:</span>
                    <span class="q-ml-sm">
                      {{ departmentsMap[patient.deptCode].name }}
                    </span>
                  </div>
                </div>
                <div v-if="patient.yearLevel" class="q-mt-sm">
                  <span class="text-grey-7">Year Level:</span>
                  <span class="q-ml-sm">
                    {{
                      yearLevels.find(
                        (l) => l.code === Number(patient.yearLevel)
                      ).name ?? ""
                    }}
                  </span>
                </div>
              </div>
              <q-list
                v-if="lastVisitExams && lastVisitExams.length > 0"
                class="full-width"
                separator
              >
                <template v-for="ve in lastVisitExams" :key="ve.id">
                  <q-item class="q-py-sm q-px-md">
                    <q-item-section>
                      <q-item-label class="q-mb-sm">
                        {{ examsMap[ve.examCode].name }}
                      </q-item-label>
                      <div>
                        <q-item-label caption>
                          {{
                            ve.dateTimeAccepted
                              ? formatDate(ve.dateTimeAccepted)
                              : "NO RESULT YET"
                          }}
                        </q-item-label>
                        <q-item-label caption>
                          {{ ve.acceptedBy }}
                        </q-item-label>
                      </div>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon
                        :name="
                          ve.dateTimeAccepted
                            ? 'fa-solid fa-circle-check'
                            : 'fa-solid fa-circle-xmark'
                        "
                        :color="ve.dateTimeAccepted ? 'positive' : 'negative'"
                        size="xs"
                      />
                    </q-item-section>
                  </q-item>
                </template>
                <div
                  v-if="user && lastVisit?.dateTimeAccepted"
                  class="row justify-center q-mt-lg"
                >
                  <q-btn
                    unelevated
                    color="accent"
                    class="text-black"
                    label="PRINT RESULT"
                    @click="visitPrintoutVisible = true"
                  />
                </div>
              </q-list>
              <ReminderCard v-else bordered>
                <template v-slot:body>
                  <div class="text-center">
                    Scan or enter patient code to see patient's exam status.
                  </div>
                </template>
              </ReminderCard>
            </div>
          </div>
        </div>
      </template>
    </div>
    <MaximizedDialog
      v-if="visitPrintoutVisible"
      title="PRINT VISIT"
      @close="visitPrintoutVisible = false"
    >
      <template v-slot:body>
        <PrintoutVisitDetails
          v-if="lastVisit && visitPrintoutVisible"
          :visitId="lastVisit.id"
        />
      </template>
    </MaximizedDialog>
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

import { affiliationsMap, yearLevels } from "src/helpers/constants.js";

export default defineComponent({
  name: "VisitTracker",
  components: {
    QRCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/QRCodeScanner.vue")
    ),
    MaximizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MaximizedDialog.vue")
    ),
    PrintoutVisitDetails: defineAsyncComponent(() =>
      import("src/components/printouts/VisitDetails.vue")
    ),
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
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
      showMessage,
      affiliationsMap,
      yearLevels,
      formatDate,
      formatName,
    };
  },
  data() {
    return {
      // recentEntries: [],
      examsMap: null,
      loading: false,
      inputMode: null,
      patientCode: null,

      patient: null,
      lastVisit: null,
      lastVisitExams: [],

      visitPrintoutVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      campuses: "ape/campuses",
      campusesMap: "ape/campusesMap",
      departments: "ape/departments",
      departmentsMap: "ape/departmentsMap",
    }),
    initialized() {
      return (
        this.user &&
        this.campuses &&
        this.campuses.length > 0 &&
        this.campusesMap &&
        this.departments &&
        this.departments.length > 0 &&
        this.departmentsMap
      );
    },
  },
  watch: {
    patientCode(v) {
      if (v) {
        this.track(v);
      }
    },
  },
  methods: {
    async track(patientCode) {
      this.loading = true;
      this.$emit("busy");
      this.patient = null;
      this.lastVisit = null;
      this.lastVisitExams = [];

      const response = await this.$store.dispatch("ape/track", patientCode);
      await delay(2000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.$refs.visitCodeScanner.reset();
        this.loading = false;
        this.$emit("ready");
        return;
      }

      this.patient = response.body.patient;
      this.lastVisit = response.body.visit;

      const lastVisitExams = response.body.exams;
      sortStringArr(lastVisitExams, "dateTimeAccepted");

      this.lastVisitExams = lastVisitExams;

      this.$refs.visitCodeScanner.reset();
      this.loading = false;
      this.$emit("ready");
    },
  },
  async mounted() {
    this.loading = true;

    const examsResponse = await this.$store.dispatch("ape/getExams");
    await delay(1000);

    if (examsResponse?.error) {
      this.showMessage(this.$q, false, "Error fetching exams.");
      this.loading = false;
      return;
    }

    this.examsMap = examsResponse[1];
    this.loading = false;
  },
});
</script>
