<template>
  <q-page class="flex flex-center q-pa-xl">
    <div :style="{ width: $q.screen.gt.sm ? '420px' : '300px' }">
      <CardComponent>
        <template v-slot:header>
          <PageHeader text="ADD PATIENT" icon="fa-solid fa-user" />
        </template>
        <template v-slot:body>
          <div>
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
                <q-select
                  class="full-width"
                  :disable="loading"
                  stack-label
                  outlined
                  :options="departments"
                  label="Department"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="code"
                  :rules="[requiredRule]"
                  v-model="deptCode"
                  hint=""
                />
                <template v-if="affiliationCode === affiliationsMap.STU.code">
                  <q-separator style="width: 50px; margin: 8px 0 24px 0" />
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
                    :rules="[
                      (v) =>
                        v === undefined || v === ''
                          ? 'This field is required'
                          : undefined,
                    ]"
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
                  v-model.trim="mobileNumber"
                  hint=""
                />
                <div class="row justify-end full-width">
                  <q-btn
                    :loading="loading"
                    :disable="loading"
                    unelevated
                    color="accent"
                    class="text-black"
                    label="REGISTER"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
          </div>
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
  yearLevelsMap,
  yearLevels,
  affiliationsMap,
  affiliations,
  departments,
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
      affiliationsMap,
      affiliations,
      yearLevelsMap,
      yearLevels,
      departments,
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
    };
  },
  data() {
    return {
      campuses: [],
      campusesMap: {},

      loading: false,
      yesNoDialogVisible: false,

      campusCode: null,
      affiliationCode: null,
      code: null,
      deptCode: null,

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
        this.deptCode = null;
        this.yearLevel = null;
      }
    },
  },
  async mounted() {
    this.loading = true;

    const [campuses, campusesMap] = await this.$store.dispatch(
      "ape/getCampuses"
    );

    await delay(1000);

    this.campuses = campuses;
    this.campusesMap = campusesMap;

    this.loading = false;
  },
  methods: {
    reset() {
      this.campusCode = null;
      this.affiliationCode = null;
      this.code = null;
      this.deptCode = null;

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
