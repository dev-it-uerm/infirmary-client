<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column" style="gap: 16px; width: 500px">
      <CardComponent>
        <template v-slot:header>
          <PageHeader text="COMPLETE EXAM" icon="fa-solid fa-list-check" />
        </template>
        <template v-slot:body>
          <div v-if="exams && exams.length > 0">
            <!-- <ReminderCard v-if="exam" :exitable="false" class="q-mb-md">
              <template v-slot:body>
                <div v-if="qrCodeMode">
                  Scan the <strong>Visit QR Code</strong> to mark the patient as
                  DONE in the
                  <b class="text-uppercase"> {{ exam.name.toUpperCase() }} </b>.
                </div>
                <div v-else>
                  Enter the <strong>Visit Reference Number</strong> to mark the
                  patient as DONE in the
                  <b class="text-uppercase"> {{ exam.name.toUpperCase() }} </b>.
                </div>
              </template>
            </ReminderCard> -->
            <q-select
              :disable="loading"
              outlined
              stack-label
              :options="exams"
              option-value="code"
              option-label="name"
              label="Examination"
              v-model="exam"
              hint=""
            />
            <QRCodeScanner
              ref="visitCodeScanner"
              :scannerId="scannerId"
              submitBtnLabel="COMPLETE"
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
              <div v-else class="fit column">
                <template v-if="patient && visit && visitExam">
                  <span class="text-primary text-weight-medium q-mb-md"
                    >LAST SCAN:</span
                  >
                  <div
                    class="full-width column q-pa-lg q-mb-md"
                    style="gap: 2px; border: solid rgba(0, 0, 0, 0.15) 1px"
                  >
                    <div class="q-mb-sm">
                      <span class="text-grey-7">Patient Code:</span>
                      <span class="q-ml-sm">{{ patient.code }}</span>
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
                    <div class="q-mt-sm">
                      <div>
                        <span class="text-grey-7">Department:</span>
                        <span class="q-ml-sm">{{
                          departmentsMap[patient.deptCode]
                        }}</span>
                      </div>
                      <div v-if="patient.yearLevel">
                        <span class="text-grey-7">Year Level:</span>
                        <span class="q-ml-sm">{{
                          yearLevels.find(
                            (l) => l.code === Number(patient.yearLevel)
                          ).name ?? ""
                        }}</span>
                      </div>
                    </div>
                    <div class="q-mt-sm">
                      <div>
                        <span class="text-grey-7">Exam:</span>
                        <span class="q-ml-sm">{{
                          examsMap[visitExam.code].name
                        }}</span>
                      </div>
                      <div>
                        <span class="text-grey-7"
                          >Date & Time Exam Completed:</span
                        >
                        <span class="q-ml-sm">{{
                          formatDate(visitExam.dateTimeCreated)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </template>
                <ReminderCard v-else>
                  <template v-slot:body>
                    <div>
                      <div v-if="qrCodeMode">
                        Scan the <strong>Visit QR Code</strong> to mark the
                        patient as DONE in the
                        <strong>{{ exam.name.toUpperCase() }}</strong
                        >.
                      </div>
                      <div v-else>
                        Enter the <strong>Visit Reference Number</strong> to
                        mark the patient as DONE in the
                        <strong>{{ exam.name.toUpperCase() }}</strong
                        >.
                      </div>
                    </div>
                  </template>
                </ReminderCard>
              </div>
            </div>
          </div>
          <ReminderCard
            v-else
            iconName="fa-solid fa-ban"
            iconColor="negative"
            bordered
          >
            <template v-slot:body>
              <div class="text-negative">
                You are not allowed to complete any diagnostic exams.
              </div>
            </template>
          </ReminderCard>
          <!-- <div class="q-mt-md">
            <div class="text-primary text-weight-medium q-mb-sm">
              Recent entries:
            </div>
            <q-list
              bordered
              style="
                min-height: 150px;
                height: 150px;
                max-height: 150px;
                overflow-y: auto;
              "
            >
              <template v-if="recentEntries && recentEntries.length > 0">
                <template v-for="(entry, idx) in recentEntries" :key="idx">
                  <q-item>
                    <q-item-section>
                      <q-item-label>{{ entry.visitCode }}</q-item-label>
                      <q-item-label caption>{{ entry.message }}</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-badge
                        :color="entry.success ? 'positive' : 'negative'"
                        :label="entry.success ? 'SUCCESS' : 'ERROR'"
                      />
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </template>
              </template>
              <div
                v-else
                class="fit flex flex-center"
                style="border: solid 1px rgba(255, 255, 255, 0.25)"
              >
                <q-item-label class="text-center" caption>
                  No entry yet.
                </q-item-label>
              </div>
            </q-list>
          </div> -->
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
  formatName,
  formatDate,
} from "src/helpers/util.js";

import {
  affiliationsMap,
  campusesMap,
  yearLevels,
} from "src/helpers/constants.js";

export default defineComponent({
  name: "CompleteExam",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    MessageBanner: defineAsyncComponent(() =>
      import("src/components/core/MessageBanner.vue")
    ),
    QRCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/QRCodeScanner.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
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
  setup() {
    return {
      formatName,
      formatDate,
      affiliationsMap,
      campusesMap,
      yearLevels,
    };
  },
  data() {
    return {
      departmentsMap: null,
      examsMap: null,
      exams: [],

      inputMode: null,

      exam: null,
      loading: false,
      visitCode: null,

      patient: null,
      visit: null,
      visitExam: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
    qrCodeMode() {
      return this.inputMode === "QR";
    },
    value() {
      if (this.exam && this.visitCode) {
        return {
          visitCode: this.visitCode,
          examCode: this.exam.code,
        };
      }

      return null;
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.changeVisitExam(val.visitCode, val.examCode);
      }
    },
  },
  async mounted() {
    if (!this.user || !this.user.examsHandled) return;

    this.loading = true;

    const [departments, departmentsMap] = await this.$store.dispatch(
      "ape/getDepartments"
    );

    const [exams, examsMap] = await this.$store.dispatch("ape/getExams");
    await delay(1000);

    const examsHandled = exams.filter((e) =>
      this.user.examsHandled.includes(e.code)
    );

    this.departmentsMap = departmentsMap;
    this.examsMap = examsMap;
    this.exams = examsHandled;
    this.exam = examsHandled[0] ?? null;
    this.loading = false;
  },
  methods: {
    async changeVisitExam(visitCode, examCode) {
      let success = true;
      let message = `Patient has been marked as done in the ${examCode} exam.`;

      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("ape/completeExam", {
        visitCode,
        examCode,
      });

      if (response.error) {
        success = false;
        message = response.body.error ?? response.body;
      }

      showMessage(this.$q, success, message);

      // MAX 10 ITEMS
      // if (this.recentEntries.length === 10) this.recentEntries.pop();

      // this.recentEntries.unshift({
      //   success,
      //   visitCode,
      //   message,
      // });

      this.patient = response.body.patient;
      this.visit = response.body.visit;
      this.visitExam = response.body.exam;

      this.$refs.visitCodeScanner.reset();
      this.loading = false;
    },
  },
});
</script>
