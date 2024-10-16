<template>
  <q-page
    class="row justify-center"
    :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'"
  >
    <div
      class="column justify-start"
      style="gap: 16px"
      :style="$q.screen.gt.md ? { minWidth: '1080px' } : { minWidth: '100%' }"
    >
      <CardComponent>
        <template v-slot:header>
          <PageHeader
            icon="fa-solid fa-calendar-days"
            text="X-RAY BATCH ENCODE"
          />
        </template>
        <template v-slot:body>
          <div class="column" style="gap: 46px">
            <q-form @submit="confirmationDialogVisible = true">
              <div class="full-width q-mb-xl">
                <div class="text-primary text-weight-medium q-mb-md row">
                  PATIENT LIST:
                </div>
                <q-input
                  :dense="$q.screen.gt.sm"
                  :disable="saving"
                  debounce="750"
                  stack-label
                  outlined
                  label-slot
                  hint=""
                  :rules="[requiredRule, yearRule]"
                  v-model="year"
                >
                  <template v-slot:label>
                    Year
                    <span class="text-weight-bold text-red">*</span>
                  </template>
                </q-input>
                <div class="column" style="gap: 16px">
                  <q-input
                    debounce="750"
                    :disable="saving"
                    bordered
                    stack-label
                    label-slot
                    outlined
                    type="textarea"
                    :rules="[requiredRule]"
                    v-model="studempNumbersStr"
                  >
                    <template v-slot:label>
                      Student/Employee Numbers (separated by new line)
                      <span class="text-weight-bold text-red">*</span>
                    </template>
                  </q-input>
                  <q-list
                    v-if="patients && patients.length > 0"
                    bordered
                    separator
                    style="overflow-y: auto"
                    :style="$q.screen.gt.md ? { maxHeight: '500px' } : {}"
                  >
                    <q-item
                      class="full-width q-pa-md"
                      v-for="(item, index) in patients"
                      :key="index"
                    >
                      <q-item-section>
                        <div class="row items-center">
                          <div
                            class="text-caption text-grey-8"
                            style="min-width: 50px"
                          >
                            {{ index + 1 }}
                          </div>
                          <!-- <q-badge color="grey-7">
                            {{ item.identificationCode }}
                          </q-badge> -->

                          <q-badge
                            color="accent"
                            class="text-black text-weight-medium q-pa-sm"
                          >
                            {{ item.identificationCode }}
                          </q-badge>
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div
                          class="row items-center text-caption text-uppercase"
                          style="gap: 12px"
                        >
                          <!-- <div v-if="item.loading" class="q-pa-sm">
                            <q-spinner-dots color="primary" size="1em" />
                          </div> -->
                          <div v-if="item.loading">SAVING...</div>
                          <div v-else>
                            <div
                              v-if="item.status"
                              :class="
                                item.status.code === 200
                                  ? 'text-positive'
                                  : 'text-negative'
                              "
                            >
                              {{ item.status.name }}
                            </div>
                            <div v-else>PENDING</div>
                          </div>
                          <q-btn
                            :disable="saving"
                            class="q-mr-sm"
                            color="grey-7"
                            round
                            flat
                            dense
                            @click="
                              studempNumbersStr = studempNumbersStr
                                .replace(
                                  new RegExp(
                                    `[\s\n\r]*${item.identificationCode}`
                                  ),
                                  ''
                                )
                                .trim()
                            "
                          >
                            <q-icon
                              style="font-weight: bold"
                              name="close"
                              size="xs"
                            />
                          </q-btn>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div class="row text-caption" style="gap: 12px">
                    <div>ITEM COUNT: {{ patients.length }}</div>
                    <div class="text-positive">SUCCESS: {{ successCount }}</div>
                    <div class="text-negative">ERROR: {{ errorCount }}</div>
                  </div>
                </div>
              </div>
              <div class="full-width">
                <div class="text-primary text-weight-medium q-mb-md row">
                  X-RAY (CHEST) RESULT:
                </div>
                <FormFieldXrayImpression
                  :disable="saving"
                  label="Impression"
                  :required="true"
                  @value-changed="(val) => (xrayImpression = val)"
                />
                <UserSelect
                  label="Radiologist"
                  :roleCode="userRolesMap.RAD.code"
                  :disable="saving"
                  :required="true"
                  @valueChanged="
                    (val) => {
                      radiologist = val;
                    }
                  "
                />
                <div class="row items-center justify-between q-mt-md">
                  <div class="text-negative text-caption">
                    {{
                      patients && patients.length > 0
                        ? ""
                        : "Please add at least one student/employee number to start saving."
                    }}
                  </div>
                  <q-btn
                    icon="save"
                    style="height: 40px"
                    color="accent"
                    class="q-px-md q-py-xs text-black"
                    :disable="!patients || patients.length === 0 || saving"
                    unelevated
                    stack-label
                    label="SAVE"
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
      v-if="confirmationDialogVisible"
      question="Save X-Ray impression to patients?"
      @cancel="(evt) => (confirmationDialogVisible = false)"
      @ok="
        (evt) => {
          confirmationDialogVisible = false;
          saveXrayImpression();
        }
      "
    />
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  delay,
  formatDate,
  showMessage,
  sliceObj,
  formatName,
} from "src/helpers/util.js";

import {
  affiliationsMap,
  affiliations,
  yearLevelsMap,
  yearLevels,
  examsMap,
  examFieldsMap,
  userRolesMap,
} from "src/helpers/constants.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "XrayEncodeBulk",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // ReminderCard: defineAsyncComponent(() =>
    //   import("src/components/core/ReminderCard.vue")
    // ),
    // FetchingData: defineAsyncComponent(() =>
    //   import("src/components/core/FetchingData.vue")
    // ),
    DateRange: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DateRange.vue")
    ),
    NoResult: defineAsyncComponent(() =>
      import("src/components/core/NoResult.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    UserSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/UserSelect.vue")
    ),
    FormFieldXrayImpression: defineAsyncComponent(() =>
      import("src/components/core/form-fields/XrayImpression.vue")
    ),
  },
  setup() {
    return {
      affiliations,
      affiliationsMap,
      yearLevelsMap,
      yearLevels,
      userRolesMap,
      showMessage,
      formatDate,
      formatName,
      requiredRule: inputRules.required,
      yearRule: inputRules.year,
    };
  },
  data() {
    return {
      columns: [],

      saving: false,

      affiliationCode: affiliationsMap.STU.code,
      year: new Date().getFullYear(),

      studempNumbersStr: "",
      patients: [],

      xrayImpression: "",
      radiologist: null,

      confirmationDialogVisible: false,

      successCount: 0,
      errorCount: 0,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    studempNumbersStr(val) {
      if (!val) {
        this.patients = [];
        return;
      }

      this.patients = val
        .split("\n")
        .map((e) => {
          return {
            identificationCode: e.replace(/\W/g, "").trim(),
            status: null,
            loading: false,
          };
        })
        .filter((e) => e.identificationCode !== "");

      this.successCount = 0;
      this.errorCount = 0;
    },
  },
  methods: {
    async saveXrayImpression() {
      this.saving = true;

      this.successCount = 0;
      this.errorCount = 0;

      for (const patient of this.patients) {
        patient.loading = true;

        const response = await this.$store.dispatch("ape/saveExamDetails", {
          identificationCode: patient.identificationCode,
          year: this.year,

          examCode: examsMap.RAD_XR_CHST.code,

          details: [
            {
              code: examFieldsMap[examsMap.RAD_XR_CHST.code][0].code,
              value: this.xrayImpression,
            },
          ],

          markAsCompletedOnSave: true,
          creator: this.radiologist,
        });

        await delay(1000);

        if (response.error) {
          this.errorCount += 1;
          patient.status = { code: response.status, name: response.body };
          patient.loading = false;
          continue;
        }

        this.successCount += 1;
        patient.status = { code: 200, name: "Success." };
        patient.loading = false;
      }

      if (this.errorCount > 0) {
        showMessage(
          this.$q,
          false,
          "Saving done but there are errors encountered."
        );
      } else {
        showMessage(this.$q, true, "Saving done. No errors.");
      }
      this.saving = false;
    },
  },
});
</script>
