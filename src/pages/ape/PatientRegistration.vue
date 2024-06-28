<template>
  <q-page class="flex flex-center q-pa-xl">
    <div
      class="column"
      style="gap: 16px"
      :style="{ width: $q.screen.gt.sm ? '420px' : '300px' }"
    >
      <PageHeader text="ADD PATIENT" icon="fa-solid fa-user" />
      <CardComponent>
        <template v-slot:body>
          <q-form
            ref="qForm"
            @submit="(evt) => (yesNoDialogVisible = true)"
            @reset="reset"
          >
            <div class="column items-center">
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="255"
                label="Student/Employee Number"
                :rules="[requiredRule]"
                v-model.trim="code"
                hint=""
              />
              <q-select
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                :options="campuses"
                label="Campus"
                emit-value
                map-options
                option-label="name"
                option-value="code"
                :rules="[requiredRule]"
                v-model="campusCode"
                hint=""
              />
              <q-select
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                :options="affiliations"
                label="Affiliation"
                emit-value
                map-options
                option-label="name"
                option-value="code"
                :rules="[requiredRule]"
                v-model="affiliationCode"
                hint=""
              />
              <q-input
                v-if="affiliationCode === affiliationsMap.EMP.code"
                debounce="700"
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="4"
                label="Dept Code"
                :rules="[requiredRule]"
                v-model.trim="deptCode"
                hint=""
              />
              <template v-if="affiliationCode === affiliationsMap.STU.code">
                <q-separator style="width: 50px; margin: 8px 0 24px 0" />
                <q-input
                  debounce="700"
                  class="full-width"
                  :disable="loading"
                  stack-label
                  outlined
                  maxlength="4"
                  label="School Year"
                  :rules="[requiredRule, yearRule]"
                  v-model.trim="schoolYearFrom"
                  hint=""
                />
                <!-- <div class="row full-width" style="gap: 16px">
                  <q-input
                    class="col"
                    :disable="loading"
                    stack-label
                    outlined
                    maxlength="4"
                    label="School Year (From)"
                    :rules="[requiredRule, yearRule]"
                    v-model.trim="schoolYearFrom"
                    hint=""
                  />
                  <q-input
                    class="col"
                    :disable="loading"
                    stack-label
                    outlined
                    readonly
                    maxlength="4"
                    label="School Year (To)"
                    v-model.trim="schoolYearTo"
                    hint=""
                  />
                </div> -->
                <q-select
                  class="full-width"
                  :disable="loading"
                  stack-label
                  outlined
                  :options="colleges"
                  label="College"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="code"
                  :rules="[requiredRule]"
                  v-model="collegeCode"
                  hint=""
                />
                <q-select
                  class="full-width"
                  :disable="loading"
                  stack-label
                  outlined
                  :options="yearLevels"
                  label="Year Level"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="code"
                  :rules="[requiredRule]"
                  v-model="yearLevel"
                  hint=""
                />
              </template>
              <q-separator style="width: 50px; margin: 8px 0 24px 0" />
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="255"
                label="First Name"
                :rules="[requiredRule]"
                v-model.trim="firstName"
                hint=""
              />
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="255"
                label="Middle Name"
                v-model.trim="middleName"
                hint=""
              />
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="255"
                label="Last Name"
                :rules="[requiredRule]"
                v-model.trim="lastName"
                hint=""
              />
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="255"
                label="Extension Name (Jr., II, etc.)"
                v-model.trim="extName"
                hint=""
              />
              <q-select
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                :options="[
                  { value: 'M', label: 'MALE' },
                  { value: 'F', label: 'FEMALE' },
                ]"
                label="Gender"
                emit-value
                map-options
                :rules="[requiredRule]"
                v-model="gender"
                hint=""
              />
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                readonly
                label="Date of Birth"
                :rules="[requiredRule]"
                :model-value="birthDate"
                hint=""
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover :breakpoint="600" ref="qPopUpProxy">
                      <div class="column">
                        <q-date
                          style="border-color: rgba(0, 0, 0, 0.25)"
                          v-model="birthDate"
                          minimal
                          mask="YYYY/MM/DD"
                        >
                          <div class="row justify-end">
                            <q-btn
                              dense
                              unelevated
                              color="primary"
                              label="CLOSE"
                              class="q-px-sm"
                              v-close-popup
                            />
                          </div>
                        </q-date>
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-separator style="width: 50px; margin: 8px 0 24px 0" />
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="255"
                label="Email Address"
                :rules="[requiredRule]"
                v-model.trim="emailAddress"
                hint=""
              />
              <q-input
                class="full-width"
                :disable="loading"
                stack-label
                outlined
                maxlength="255"
                label="Mobile Phone Number"
                :rules="[requiredRule]"
                v-model.trim="mobileNumber"
                hint=""
              />
              <div class="row justify-end full-width">
                <q-btn
                  :loading="loading"
                  :disable="loading"
                  unelevated
                  color="primary"
                  label="REGISTER"
                  type="submit"
                />
              </div>
            </div>
          </q-form>
        </template>
      </CardComponent>
    </div>
    <ConfirmationDialog
      v-if="yesNoDialogVisible"
      question="Are you sure you want to register this patient?"
      @cancel="(evt) => (yesNoDialogVisible = false)"
      @ok="save"
    />
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage, empty } from "src/helpers/util.js";
import {
  campusesMap,
  campuses,
  collegesMap,
  colleges,
  yearLevelsMap,
  yearLevels,
  affiliationsMap,
  affiliations,
} from "src/helpers/constants.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "PatientRegistration",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // FetchingData: defineAsyncComponent(() =>
    //   import("src/components/core/FetchingData.vue")
    // ),
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
  },
  setup() {
    return {
      campusesMap,
      campuses,
      affiliationsMap,
      affiliations,
      collegesMap,
      colleges,
      yearLevelsMap,
      yearLevels,
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
    };
  },
  data() {
    return {
      loading: false,
      yesNoDialogVisible: false,

      campusCode: null,
      affiliationCode: null,
      code: null,
      deptCode: null,

      schoolYearFrom: null,
      // schoolYearTo: null,
      collegeCode: null,
      yearLevel: null,

      firstName: null,
      middleName: null,
      lastName: null,
      extName: null,
      birthDate: null,
      gender: null,

      emailAddress: null,
      mobileNumber: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    affiliationCode(val) {
      if (val === affiliationsMap.EMP.code) {
        this.schoolYearFrom = null;
        // this.schoolYearTo = null;
        this.collegeCode = null;
        this.yearLevel = null;
      }
    },
    // schoolYearFrom(val) {
    //   if (!val) {
    //     this.schoolYearTo = null;
    //     return;
    //   }

    //   this.schoolYearTo = Number(this.schoolYearFrom) + 1;
    // },
  },
  methods: {
    reset() {
      this.campusCode = null;
      this.affiliationCode = null;
      this.code = null;
      this.deptCode = null;

      this.schoolYearFrom = null;
      this.collegeCode = null;
      this.yearLevel = null;

      this.firstName = null;
      this.middleName = null;
      this.lastName = null;
      this.extName = null;
      this.birthDate = null;
      this.gender = null;

      this.emailAddress = null;
      this.mobileNumber = null;
    },
    async save() {
      this.yesNoDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("ape/addPatient", {
        campusCode: this.campusCode,
        affiliationCode: this.affiliationCode,
        identificationCode: this.code,
        deptCode: this.deptCode,

        schoolYear: this.schoolYearFrom,
        collegeCode: this.collegeCode,
        yearLevel: this.yearLevel,

        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        extName: this.extName,
        birthDate: this.birthDate,
        gender: this.gender,

        emailAddress: this.emailAddress,
        mobileNumber: this.mobileNumber,
      });

      if (response.error) {
        showMessage(
          this.$q,
          false,
          response.body ?? "Unable to register patient. Please try again."
        );

        this.loading = false;
        return;
      }

      showMessage(this.$q, true, "Patient has been registered.");
      this.loading = false;
      this.$refs.qForm.reset();
    },
  },
});
</script>
