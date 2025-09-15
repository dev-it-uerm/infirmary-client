<template>
  <q-page class="flex flex-center q-pa-md">
    <div style="width: 500px">
      <CardComponent>
        <template v-slot:header>
          <PageHeader
            text="EMPLOYEE ATTENDANCE"
            icon="fa-solid fa-calendar-days"
          />
        </template>
        <template v-slot:body>
          <div>
            <div v-if="initialized">
              <MessageBanner v-if="forbidden" :success="false">
                <template v-slot:error-body>
                  <div>You are not allowed to access this page.</div>
                </template>
              </MessageBanner>
              <div>
                <QRCodeScanner
                  v-show="!forbidden"
                  ref="EMPLOYEE_ATTENDANCE_PAGE__qrCodeScanner"
                  scannerId="EMPLOYEE_ATTENDANCE_PAGE__qrCodeScanner"
                  inputLabel="Employee Code"
                  submitBtnIcon="sym_o_alarm_add"
                  submitBtnLabel="TIME IN/OUT"
                  :loading="loading"
                  @patientCodeChanged="(v) => (patientCode = v)"
                  @inputModeChanged="(v) => (inputMode = v)"
                />
              </div>
              <div v-if="lastEmployeeTimedInOrOut">
                <q-separator class="q-my-lg" />
                <div class="text-primary text-weight-medium q-mb-md">
                  <div>EMPLOYEE TIMED IN/OUT:</div>
                </div>
                <table class="full-width" style="border-collapse: collapse">
                  <tr v-for="(val, key) in lastEmployeeTimedInOrOut" :key="key">
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
            <FetchingData v-else />
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

import { affiliationsMap, yearLevels } from "src/helpers/constants.js";

export default defineComponent({
  name: "EmployeeAttendancePage",
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
      formatName,
      formatDate,
      affiliationsMap,
      yearLevels,
    };
  },
  data() {
    return {
      forbidden: false,
      inputMode: null,

      loading: false,
      patientCode: null,

      lastEmployeeTimedInOrOut: null,
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
    value() {
      if (this.patientCode) {
        return this.patientCode;
      }

      return null;
    },
  },
  watch: {
    value(v) {
      if (!v) {
        return;
      }

      this.timeInOrOut(v);
    },
  },
  mounted() {
    this.$store.dispatch("ape/getAppData");
  },
  methods: {
    formatLastEmployeeTimedInOrOut(row) {
      const patient = row.employee;
      const registration = row.attendance;

      return {
        "Date & Time IN/OUT": formatDate(registration.dateTimeCreated),
        "Employee Number": patient.code || patient.identificationCode,
        Fullname: formatName(
          patient.firstName,
          patient.middleName,
          patient.lastName,
          patient.extName
        ),
        Campus: this.campusesMap[patient.campusCode].name,
        Department: this.departmentsMap[patient.deptCode].name,
      };
    },
    async timeInOrOut(patientCode) {
      this.loading = true;
      this.$emit("busy");

      let success = true;
      let message = "Employee attendance has been saved.";

      const response = await this.$store.dispatch("ape/timeInOut", patientCode);
      await delay(2000);

      if (response.error) {
        success = false;
        message = response.body.errorMessage || response.body;
      }

      if (
        (response.body.visit && response.body.patient) ||
        (response.body.attendance && response.body.employee)
      ) {
        this.lastEmployeeTimedInOrOut = this.formatLastEmployeeTimedInOrOut(
          response.body
        );
      }

      this.$refs.EMPLOYEE_ATTENDANCE_PAGE__qrCodeScanner.reset();
      this.showMessage(this.$q, success, message);
      this.loading = false;
      this.$emit("ready");
    },
  },
});
</script>
