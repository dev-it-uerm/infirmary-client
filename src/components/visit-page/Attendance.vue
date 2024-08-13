<template>
  <div>
    <div>
      <MessageBanner v-if="forbidden" :success="false">
        <template v-slot:error-body>
          <div>You are not allowed to access this page.</div>
        </template>
      </MessageBanner>
      <div>
        <div
          class="row justify-center q-mb-md q-pa-md"
          style="border: 1px solid rgba(0, 0, 0, 0.1)"
        >
          <q-btn
            :disable="loading"
            unelevated
            label="REGISTRATION"
            :color="registrationMode === 'REG' ? 'accent' : 'transparent'"
            class="text-black"
            @click="() => (registrationMode = 'REG')"
          />
          <q-btn
            :disable="loading"
            unelevated
            label="ATTENDANCE"
            :color="registrationMode === 'ATT' ? 'accent' : 'transparent'"
            class="text-black"
            @click="() => (registrationMode = 'ATT')"
          />
        </div>
        <QRCodeScanner
          v-show="!forbidden"
          ref="REGISTRATION_PAGE__qrCodeScanner"
          :scannerId="scannerId"
          :submitBtnLabel="
            registrationMode === 'REG' ? 'REGISTER' : 'TIME IN/OUT'
          "
          :loading="loading"
          @patientCodeChanged="(val) => (patientCode = val)"
          @inputModeChanged="(val) => (inputMode = val)"
        />
      </div>
      <div v-if="lastPatientRegistered">
        <q-separator class="q-my-lg" />
        <div class="text-primary text-weight-medium q-mb-md">
          <div>PATIENT/EMPLOYEE REGISTERED:</div>
        </div>
        <table class="full-width" style="border-collapse: collapse">
          <tr v-for="(val, key) in lastPatientRegistered" :key="key">
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
            v-if="lastPatientRegistered['Student Number']"
            class="q-mt-md"
            unelevated
            label="PRINT CHECKLIST"
            color="primary"
            @click="checklistDialogVisible = true"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="checklistDialogVisible">
      <q-card class="fit">
        <q-card-section class="fit">
          <Checklist :patientInfo="lastPatientRegistered" />
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
import {
  examsMap,
  affiliationsMap,
  campusesMap,
  collegesMap,
  yearLevels,
} from "src/helpers/constants.js";

export default defineComponent({
  name: "VisitPageAttendance",
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
    Checklist: defineAsyncComponent(() =>
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
      examsMap,
      affiliationsMap,
      campusesMap,
      collegesMap,
      yearLevels,
    };
  },
  data() {
    return {
      checklistDialogVisible: false,
      forbidden: false,

      registrationMode: "REG",
      inputMode: null,

      loading: false,
      patientCode: null,

      lastPatientRegistered: null,
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
      if (this.registrationMode && this.patientCode) {
        return {
          registrationMode: this.registrationMode,
          patientCode: this.patientCode,
        };
      }

      return null;
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.register(val.registrationMode, val.patientCode);
      }
    },
  },
  methods: {
    formatLastPatientRegistered(row) {
      const patient = row.patient || row.employee;
      const registration = row.visit || row.attendance;

      return {
        [this.registrationMode === "REG"
          ? "Date & Time Registered"
          : "Date & Time IN/OUT"]: formatDate(registration.dateTimeCreated),
        [this.registrationMode === "REG"
          ? "Student Number"
          : "Employee Number"]: patient.code || patient.identificationCode,
        Fullname: formatName(
          patient.firstName,
          patient.middleName,
          patient.lastName,
          patient.extName
        ),
        Affiliation: affiliationsMap[patient.affiliationCode].name,
        Campus: campusesMap[patient.campusCode].name,
      };
    },
    async register(registrationMode, patientCode) {
      this.loading = true;
      this.$emit("busy");

      let success = true;
      let message =
        registrationMode === "REG"
          ? `Patient has been registered.`
          : "Employee attendance has been saved.";

      const vuexAction =
        registrationMode === "REG" ? "ape/schedule" : "ape/timeInOut";

      const response = await this.$store.dispatch(vuexAction, patientCode);

      await delay(2000);
      if (response.error) {
        success = false;
        message = response.body.errorMessage || response.body;
      }

      if (
        (response.body.visit && response.body.patient) ||
        (response.body.attendance && response.body.employee)
      ) {
        this.lastPatientRegistered = this.formatLastPatientRegistered(
          response.body
        );
      }

      this.$refs.REGISTRATION_PAGE__qrCodeScanner.reset();
      showMessage(this.$q, success, message);
      this.loading = false;
      this.$emit("ready");
    },
  },
});
</script>
