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
                <div
                  class="row items-center q-mb-md"
                  :style="$q.screen.lt.md ? {} : { gap: '16px' }"
                >
                  <q-input
                    :class="$q.screen.lt.md ? 'col-12' : 'col'"
                    :style="{
                      minWidth: $q.screen.lt.md ? '100%' : '100px',
                    }"
                    :dense="$q.screen.gt.sm"
                    :disable="saving"
                    debounce="750"
                    stack-label
                    outlined
                    label="Year"
                    hint=""
                    :rules="[requiredRule, yearRule]"
                    v-model="filters.year"
                  />
                  <q-select
                    :class="$q.screen.lt.md ? 'col-12' : 'col'"
                    :dense="$q.screen.gt.sm"
                    :disable="saving"
                    stack-label
                    outlined
                    emit-value
                    map-options
                    option-label="name"
                    option-value="code"
                    :options="campuses"
                    label="Campus"
                    v-model="filters.campusCode"
                    hint=""
                  />
                  <q-select
                    :class="$q.screen.lt.md ? 'col-12' : 'col'"
                    :dense="$q.screen.gt.sm"
                    :disable="saving"
                    stack-label
                    outlined
                    emit-value
                    map-options
                    option-label="name"
                    option-value="code"
                    :options="affiliations"
                    label="Affiliation"
                    v-model="filters.affiliationCode"
                    hint=""
                  />
                </div>
                <div>
                  <q-input
                    debounce="750"
                    :disable="saving"
                    bordered
                    stack-label
                    outlined
                    type="textarea"
                    label="Student/Employee Numbers (separated by new line)"
                    :rules="[requiredRule]"
                    v-model.trim="studempNumbersStr"
                  />
                  <q-virtual-scroll
                    v-if="visits && visits.length > 0"
                    style="
                      border-top: 1px solid rgba(0, 0, 0, 0.1);
                      border-left: 1px solid rgba(0, 0, 0, 0.1);
                      border-right: 1px solid rgba(0, 0, 0, 0.1);
                      max-height: 100%;
                    "
                    :items="visits"
                    v-slot="{ item, index }"
                  >
                    <q-item class="full-width q-pa-md" :key="index">
                      <q-item-section>
                        <div>
                          <q-badge color="grey-7">
                            {{ item.identificationCode }}
                          </q-badge>
                        </div>
                      </q-item-section>
                      <q-item-section side>
                        <div v-if="item.loading" class="q-pa-sm">
                          <q-spinner size="sm" color="primary" />
                        </div>
                        <div class="row items-center">
                          <div class="q-mr-sm">Status:</div>
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
                          <div v-else class="text-caption">PENDING</div>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                  </q-virtual-scroll>
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
                      visits && visits.length > 0
                        ? ""
                        : "Please add at least one student/employee number to start saving."
                    }}
                  </div>
                  <q-btn
                    style="height: 40px"
                    color="accent"
                    class="q-px-md q-py-xs text-black"
                    :disable="!visits || visits.length === 0 || saving"
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
      question="Save X-Ray impression to selected visits?"
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
  campusesMap,
  campuses,
  affiliationsMap,
  affiliations,
  collegesMap,
  colleges,
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
    DateRange: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DateRange.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
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
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
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
      campuses,
      campusesMap,
      affiliations,
      affiliationsMap,
      collegesMap,
      colleges,
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
      filters: {
        identificationCode: "",
        campusCode: campusesMap.UERM.code,
        affiliationCode: affiliationsMap.STU.code,
        year: new Date().getFullYear(),
      },

      columns: [],

      filtering: false,
      saving: false,

      studempNumbersStr: "",
      visits: [],

      xrayImpression: "",
      radiologist: null,

      confirmationDialogVisible: false,
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
        this.visits = [];
        return;
      }

      this.visits = val
        .split("\n")
        .map((e) => {
          return {
            identificationCode: e.trim(),
            status: null,
            loading: false,
          };
        })
        .filter((e) => e.identificationCode !== "");
    },
  },
  methods: {
    async saveXrayImpression() {
      this.saving = true;

      const sanitizedFilters = Object.entries(this.filters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
        return acc;
      }, {});

      const selected = this.visits.filter((v) => this.selected.includes(v.id));

      for (const row of selected) {
        row.loading = true;

        const response = await this.$store.dispatch("ape/saveExamDetails", {
          visitId: row.id,
          examCode: examsMap.RAD_XRCHST.code,
          details: [
            {
              code: examFieldsMap[examsMap.RAD_XRCHST.code][0].code,
              value: this.xrayImpression,
            },
          ],
          markAsCompletedOnSave: true,
          creator: this.radiologist,
        });

        await delay(1000);

        if (response.error) {
          row.status = { code: response.status, name: response.body };
          row.loading = false;
          continue;
        }

        row.status = { code: 200, name: "Success." };
        row.loading = false;
      }

      this.selected = [];
      this.saving = false;
    },
  },
});
</script>
