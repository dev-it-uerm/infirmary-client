<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column" style="gap: 16px; width: 500px">
      <PageHeader text="TRIAGE" icon="fa-solid fa-list-check" />
      <CardComponent>
        <template v-slot:body>
          <MessageBanner v-if="forbidden" :success="false">
            <template v-slot:error-body>
              <div>You are not allowed to access this page.</div>
            </template>
          </MessageBanner>
          <div>
            <div
              style="border: 1px solid rgba(0, 0, 0, 0.15)"
              class="row justify-center q-mb-md q-pa-sm"
            >
              <q-btn
                :disable="loading"
                unelevated
                label="REGISTRATION"
                :color="registrationMode === 'REG' ? 'primary' : 'transparent'"
                :class="
                  registrationMode === 'REG' ? 'text-white' : 'text-black'
                "
                @click="() => (registrationMode = 'REG')"
              />
              <q-btn
                :disable="loading"
                unelevated
                label="ATTENDANCE"
                :color="registrationMode === 'ATT' ? 'primary' : 'transparent'"
                :class="
                  registrationMode === 'ATT' ? 'text-white' : 'text-black'
                "
                @click="() => (registrationMode = 'ATT')"
              />
            </div>
            <QRCodeScanner
              v-show="!forbidden"
              ref="REGISTRATION_PAGE__qrCodeScanner"
              :loading="loading"
              @patientCodeChanged="(val) => (patientCode = val)"
              @inputModeChanged="(val) => (inputMode = val)"
            />
          </div>
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
                      <q-item-label>{{ entry.patientCode }}</q-item-label>
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
      <CardComponent v-if="lastPatientRegistered">
        <template v-slot:body>
          <div class="text-primary text-weight-medium q-mb-md">
            {{
              registrationMode === "REG"
                ? "LAST PATIENT REGISTERED"
                : "LAST EMPLOYEE ATTENDANCE"
            }}:
          </div>
          <!-- <div
            v-if="loading"
            class="full-width flex flex-center"
            style="height: 100px"
          >
            <q-spinner-dots size="lg" />
          </div> -->
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
