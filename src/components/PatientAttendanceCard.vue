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
          @patientCodeChanged="(v) => register(v)"
          @inputModeChanged="(val) => (inputMode = val)"
        />
        <div v-if="lastPatientAttended">
          <q-separator class="q-my-lg" />
          <div class="text-primary text-weight-medium q-mb-md">
            <div>PATIENT/EMPLOYEE REGISTERED:</div>
          </div>
          <table class="full-width" style="border-collapse: collapse">
            <tr v-for="(val, key) in lastPatientAttended" :key="key">
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
              v-if="lastPatientAttended['Student Number']"
              class="q-mt-md bg-accent text-black"
              unelevated
              icon="print"
              label="PRINT CHECKLIST"
              @click="checklistDialogVisible = true"
            />
          </div>
        </div>
      </div>
      <FetchingData v-else />
    </div>
    <q-dialog v-model="checklistDialogVisible">
      <q-card class="fit">
        <q-card-section class="fit">
          <PrintoutChecklist :patient="lastPatientAttended" />
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
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // ReminderCard: defineAsyncComponent(() =>
    //   import("src/components/core/ReminderCard.vue")
    // ),
    MessageBanner: defineAsyncComponent(() =>
      import("src/components/core/MessageBanner.vue")
    ),
    QRCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/QRCodeScanner.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    PrintoutChecklist: defineAsyncComponent(() =>
      import("src/components/printouts/Checklist.vue")
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
      lastPatientAttended: null,
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
    formatLastPatientRegistered(row) {
      const patient = row.patient || row.employee;
      const registration = row.visit || row.attendance;

      return {
        ["Date & Time Registered"]: formatDate(registration.dateTimeCreated),
        ["Student Number"]: patient.code || patient.identificationCode,
        Fullname: formatName(
          patient.firstName,
          patient.middleName,
          patient.lastName,
          patient.extName
        ),
        Campus: this.campusesMap[patient.campusCode]?.name || "Unknown",
        Affiliation: affiliationsMap[patient.affiliationCode].name,
        Department: this.departmentsMap[patient.deptCode].name,
      };
    },
    async register(patientCode) {
      if (!patientCode) {
        return;
      }

      this.loading = true;
      this.$emit("busy");

      let success = true;
      let message = "Patient attendance has been recorded.";

      const response = await this.$store.dispatch("ape/schedule", patientCode);
      await delay(1000);

      if (response.error) {
        success = false;
        message = response.body.errorMessage || response.body;
      }

      if (
        (response.body.visit && response.body.patient) ||
        (response.body.attendance && response.body.employee)
      ) {
        this.lastPatientAttended = this.formatLastPatientRegistered(
          response.body
        );
      }

      this.$refs.PATIENT_ATTENDANCE_PAGE__qrCodeScanner.reset();
      showMessage(this.$q, success, message);
      this.loading = false;
      this.$emit("ready");
    },
  },
});
</script>
