<template>
  <div>
    <div>
      <div v-if="initialized">
        <MessageBanner v-if="forbidden" :success="false">
          <template v-slot:error-body>
            <div>You are not allowed to access this page.</div>
          </template>
        </MessageBanner>
        <QRCodeScanner
          v-show="!forbidden"
          ref="PATIENT_ATTENDANCE_PAGE__qrCodeScanner"
          submitBtnIcon="sym_o_how_to_reg"
          submitBtnLabel="REGISTER"
          :scannerId="scannerId"
          :loading="loading"
          @valueChanged="(v) => register(v?.schoolYear, v?.patientCode)"
          @inputModeChanged="(val) => (inputMode = val)"
        />
        <div v-if="lastPatientVisitInfo">
          <q-separator class="q-my-lg" />
          <div class="text-primary text-weight-medium q-mb-md">
            <div>PATIENT/EMPLOYEE REGISTERED:</div>
          </div>
          <table class="full-width" style="border-collapse: collapse">
            <tr v-for="(val, key) in lastPatientVisitInfo" :key="key">
              <td
                v-for="(v, idx) in [key, val]"
                :key="idx"
                class="q-pa-sm"
                :class="idx === 0 ? 'text-grey-8' : ''"
                :style="{ width: idx === 0 ? '40%' : '60%' }"
                style="border: 1px solid #dddddd"
              >
                {{ v }}
              </td>
            </tr>
          </table>
          <div class="row justify-end">
            <q-btn
              v-if="lastPatientVisit"
              class="q-mt-md bg-accent text-black"
              unelevated
              icon="print"
              label="PRINT CHECKLIST"
              @click="showExamsCheckList"
            />
          </div>
        </div>
      </div>
      <FetchingData v-else />
    </div>
    <q-dialog v-model="checklistDialogVisible">
      <q-card class="fit">
        <q-card-section class="fit">
          <ExamsCheckList
            :patient="lastPatientVisitInfo"
            :allowedExamsForPatient="allowedExamsForPatient"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
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

import { affiliationsMap, yearLevels } from "src/helpers/constants.js";

export default defineComponent({
  name: "PatientAttendanceCard",
  components: {
    PageHeader: defineAsyncComponent(
      () => import("src/components/core/PageHeader.vue"),
    ),
    // ReminderCard: defineAsyncComponent(() =>
    //   import("src/components/core/ReminderCard.vue")
    // ),
    MessageBanner: defineAsyncComponent(
      () => import("src/components/core/MessageBanner.vue"),
    ),
    QRCodeScanner: defineAsyncComponent(
      () => import("src/components/core/QRCodeScanner.vue"),
    ),
    CardComponent: defineAsyncComponent(
      () => import("src/components/core/Card.vue"),
    ),
    FetchingData: defineAsyncComponent(
      () => import("src/components/core/FetchingData.vue"),
    ),
    ExamsCheckList: defineAsyncComponent(
      () => import("src/components/printouts/ExamsCheckList.vue"),
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
      formatName,
      formatDate,
      affiliationsMap,
      yearLevels,
    };
  },
  data() {
    return {
      checklistDialogVisible: false,
      forbidden: false,
      loading: false,
      inputMode: null,

      lastPatientVisit: null,
      lastPatientVisitInfo: null,

      allowedExamsForPatient: [],
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
    qrCodeMode() {
      return this.inputMode === "QR";
    },
  },
  mounted() {
    this.$store.dispatch("ape/getAppData");
  },
  methods: {
    formatLastPatientRegistered(visit) {
      return {
        ["Date & Time Registered"]: formatDate(visit.dateTimeCreated),
        ["Student/Employee Number"]: visit.patientIdentificationCode,
        Fullname: formatName(
          visit.patientFirstName,
          visit.patientMiddleName,
          visit.patientLastName,
          visit.patientExtName,
        ),
        Campus: this.campusesMap[visit.patientCampusCode]?.name || "Unknown",
        Affiliation:
          affiliationsMap[visit.patientAffiliationCode]?.name || "Unknown",
        Department:
          this.departmentsMap[visit.patientDeptCode]?.name || "Unknown",
        ...(visit.patientYearLevel
          ? { ["Year Level"]: visit.patientYearLevel }
          : {}),
      };
    },
    async register(schoolYear, patientCode) {
      if (!schoolYear || !patientCode) {
        return;
      }

      this.loading = true;
      this.$emit("busy");

      let success = true;
      let message = "Student/Employee has been registered.";

      const response = await this.$store.dispatch("ape/registerVisit", {
        schoolYear: schoolYear,
        identificationCode: patientCode,
      });

      await delay(1000);

      if (!response || response.error) {
        success = false;
        message = response.body.errorMessage || response.body || "Error";
      }

      if (response.body?.id) {
        this.lastPatientVisitInfo = this.formatLastPatientRegistered(
          response.body,
        );

        this.lastPatientVisit = response.body;
      }

      this.$refs.PATIENT_ATTENDANCE_PAGE__qrCodeScanner.reset();
      showMessage(this.$q, success, message);
      this.loading = false;
      this.$emit("ready");
    },
    async showExamsCheckList() {
      this.allowedExamsForPatient = [];

      const response = await this.$store.dispatch(
        "ape/getAllowedExams",
        this.lastPatientVisit.patientId,
      );

      if (response?.error) {
        showMessage(
          this.$q,
          false,
          "Unable to get patient exams. Please try again",
        );
        return;
      }

      this.allowedExamsForPatient = response.body.sort(
        (a, b) => b.sequenceNumber - a.sequenceNumber,
      );

      this.checklistDialogVisible = true;
    },
  },
});
</script>
