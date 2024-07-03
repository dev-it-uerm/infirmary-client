<template>
  <q-page
    class="row justify-center"
    :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'"
  >
    <div
      class="column justify-start"
      style="gap: 16px"
      :style="$q.screen.gt.md ? { minWidth: '1440px' } : { minWidth: '100%' }"
    >
      <PageHeader icon="fa-solid fa-calendar-days" text="X-RAY BATCH ENCODE" />
      <div :class="$q.screen.gt.md ? 'row' : 'column'" style="gap: 16px">
        <div :class="$q.screen.gt.md ? 'col' : 'full-width'">
          <CardComponent>
            <template v-slot:body>
              <div class="q-mb-lg">
                <div class="text-primary text-weight-medium q-mb-md">
                  FILTER:
                </div>
                <q-form @submit="getVisits">
                  <div
                    class="row items-center"
                    :style="$q.screen.lt.md ? {} : { gap: '16px' }"
                  >
                    <q-input
                      :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                      :style="{ minWidth: $q.screen.lt.md ? '100%' : '100px' }"
                      :dense="$q.screen.gt.sm"
                      :disable="filtering || saving"
                      debounce="750"
                      stack-label
                      outlined
                      label="Year"
                      hint=""
                      :rules="[requiredRule, yearRule]"
                      v-model="filters.year"
                    />
                    <q-select
                      :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                      :dense="$q.screen.gt.sm"
                      :disable="filtering || saving"
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
                      :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                      :dense="$q.screen.gt.sm"
                      :disable="filtering || saving"
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
                    <div
                      class="row items-start justify-end"
                      :class="$q.screen.lt.md ? 'full-width' : ''"
                      style="margin-bottom: 20px"
                    >
                      <q-btn
                        style="height: 40px"
                        color="primary"
                        class="q-px-md q-py-xs"
                        :disable="filtering || saving"
                        unelevated
                        stack-label
                        label="SEARCH"
                        type="submit"
                      />
                    </div>
                  </div>
                </q-form>
              </div>
              <q-separator spaced />
              <!-- <div v-if="filtering" class="full-width flex flex-center" style="height: 100px">
                <q-spinner-dots size="md" color="primary" />
              </div> -->
              <div class="q-mt-lg">
                <FetchingData v-if="filtering" />
                <div v-else>
                  <div>
                    <div class="text-primary text-weight-medium q-mb-md row">
                      PATIENT LIST:
                    </div>
                    <div
                      class="relative-position bg-white"
                      style="
                        overflow-y: auto;
                        display: grid;
                        grid-template-rows: min-content auto;
                      "
                    >
                      <q-virtual-scroll
                        v-if="visits && visits.length > 0"
                        style="
                          max-height: 100%;
                          height: auto;
                          border-top: 1px solid rgba(0, 0, 0, 0.1);
                          border-left: 1px solid rgba(0, 0, 0, 0.1);
                          border-right: 1px solid rgba(0, 0, 0, 0.1);
                        "
                        :items="visits"
                        v-slot="{ item, index }"
                      >
                        <q-item
                          class="full-width q-pa-md"
                          :key="index"
                          clickable
                          @click="showPxVisitInfo(item)"
                        >
                          <q-item-section>
                            <q-item-label caption class="ellipsis q-mb-sm">{{
                              formatDate(item.dateTimeCreated)
                            }}</q-item-label>
                            <q-item-label
                              class="row items-center"
                              style="gap: 8px"
                            >
                              <div class="text-weight-medium text-uppercase">
                                {{
                                  formatName(
                                    item.patientFirstName,
                                    item.patientMiddleName,
                                    item.patientLastName,
                                    item.patientExtName
                                  )
                                }}
                              </div>
                              <div class="text-grey-6">
                                ({{ item.patientIdentificationCode }})
                              </div>
                            </q-item-label>
                            <q-item-label caption>
                              <div class="row items-center" style="gap: 6px">
                                <q-icon
                                  size="xs"
                                  :color="
                                    item.patientGender === 'M'
                                      ? 'blue-4'
                                      : 'pink-4'
                                  "
                                  :name="
                                    item.patientGender === 'M'
                                      ? 'fa-solid fa-mars'
                                      : 'fa-solid fa-venus'
                                  "
                                />
                                <q-badge
                                  v-if="item.patientCampusCode"
                                  class="bg-grey"
                                  >{{
                                    campusesMap[item.patientCampusCode].name
                                  }}</q-badge
                                >
                                <q-badge
                                  v-if="item.patientAffiliationCode"
                                  class="bg-grey"
                                  >{{
                                    affiliationsMap[item.patientAffiliationCode]
                                      .name
                                  }}</q-badge
                                >
                              </div>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <div v-if="item.loading" class="q-pa-sm">
                              <q-spinner size="sm" color="primary" />
                            </div>

                            <q-checkbox
                              v-if="
                                item.status == null || item.status.code !== 200
                              "
                              :disable="saving"
                              v-show="!item.loading"
                              :val="item.id"
                              v-model="selected"
                            />
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
                          </q-item-section>
                        </q-item>
                        <q-separator />
                      </q-virtual-scroll>
                      <NoResult v-else message="No patient found." />
                    </div>
                  </div>
                  <div
                    v-if="selected && selected.length > 0"
                    class="row full-width justify-end q-mt-md"
                  >
                    <q-badge color="accent" class="text-black">
                      <span class="text-weight-bold">
                        {{ selected.length }}
                      </span>
                      <span>&nbsp;item/s selected</span>
                    </q-badge>
                  </div>
                </div>
              </div>
            </template>
          </CardComponent>
        </div>
        <div :class="$q.screen.gt.md ? 'col' : 'full-width'">
          <CardComponent>
            <template v-slot:body>
              <div>
                <q-form @submit="confirmationDialogVisible = true">
                  <XrayImpression
                    :disable="filtering || saving"
                    label="Impression"
                    :required="true"
                    @value-changed="(val) => (xrayImpression = val)"
                  />
                  <UserSelect
                    label="Radiologist"
                    :roleCode="userRolesMap.RAD.code"
                    :disable="filtering || saving"
                    @valueChanged="
                      (val) => {
                        radiologist = val;
                      }
                    "
                  />
                  <div class="row items-center justify-between q-mt-md">
                    <div class="text-negative">
                      {{
                        selected && selected.length > 0
                          ? ""
                          : "Please select at least one patient to start saving."
                      }}
                    </div>
                    <q-btn
                      style="height: 40px"
                      color="primary"
                      class="q-px-md q-py-xs"
                      :disable="!selected || selected.length === 0 || saving"
                      unelevated
                      stack-label
                      label="SAVE"
                      type="submit"
                    />
                  </div>
                </q-form>
              </div>
            </template>
          </CardComponent>
        </div>
      </div>
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
    XrayImpression: defineAsyncComponent(() =>
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
      phaseClassesMap: {
        REG: "text-grey-8",
        PE: "text-grey-8",
        LABCBC: "text-grey-8",
        LABURI: "text-grey-8",
        LABFCL: "text-grey-8",
        RADXRCHST: "text-grey-8",
        FIN: "text-positive",
      },
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

      selected: [],
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
  mounted() {
    this.getVisits();
  },
  methods: {
    async getVisits() {
      this.filtering = true;
      this.selected = [];

      const sanitizedFilters = Object.entries(this.filters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
        return acc;
      }, {});

      const response = await this.$store.dispatch(
        "ape/getVisitsWithXray",
        sanitizedFilters
      );

      if (response.error) {
        showMessage(
          this.$q,
          false,
          "Unable to fetch visits. Please try again."
        );

        this.filtering = false;
        return;
      }

      await delay(2000);

      this.visits =
        response.body && response.body.length > 0
          ? response.body.map((row) => {
              return {
                ...row,
                status: null,
                loading: false,
              };
            })
          : [];

      this.filtering = false;
    },
    async saveXrayImpression() {
      this.saving = true;

      const selected = this.visits.filter((v) => this.selected.includes(v.id));

      for (const row of selected) {
        row.loading = true;

        const response = await this.$store.dispatch("ape/saveDetails", {
          visitId: row.id,
          patientId: row.patientId,
          tabCode: examsMap.RADXRCHST.code,
          details: [
            {
              code: examFieldsMap[examsMap.RADXRCHST.code][0].code,
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
