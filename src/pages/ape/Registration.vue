<template>
  <q-page class="flex flex-center q-pa-md">
    <div style="width: 500px">
      <CardComponent>
        <template v-slot:header>
          <PageHeader text="TRIAGE" icon="fa-solid fa-list-check" />
        </template>
        <template v-slot:body>
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
                scannerId="qrCodeScanner__triage_page"
                :loading="loading"
                @patientCodeChanged="(val) => (patientCode = val)"
                @inputModeChanged="(val) => (inputMode = val)"
              />
            </div>
            <div v-if="lastPatientRegistered">
              <q-separator class="q-my-lg" />
              <div class="text-primary text-weight-medium q-mb-md">
                LAST PATIENT/EMPLOYEE REGISTERED:
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
  name: "RegistrationPage",
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
  },
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
          ? "Student Number"
          : "Employee Number"]: patient.code || patient.identificationCode,
        [this.registrationMode === "REG"
          ? "Date & Time Registered"
          : "Date & Time IN/OUT"]: formatDate(registration.dateTimeCreated),
        Fullname: formatName(
          patient.firstName,
          patient.middleName,
          patient.lastName,
          patient.extName
        ),
      };
    },
    async register(registrationMode, patientCode) {
      let success = true;
      let message = `Patient has been registered.`;

      this.loading = true;
      await delay(2000);

      const vuexAction =
        registrationMode === "REG" ? "ape/schedule" : "ape/timeInOut";

      const response = await this.$store.dispatch(vuexAction, patientCode);

      if (response.error) {
        success = false;
        message = response.body.error ?? response.body;
      } else {
        this.lastPatientRegistered = this.formatLastPatientRegistered(
          response.body
        );
      }

      this.$refs.REGISTRATION_PAGE__qrCodeScanner.reset();
      showMessage(this.$q, success, message);
      this.loading = false;
    },
  },
});
</script>
