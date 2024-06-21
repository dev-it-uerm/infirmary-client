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
      <div class="row" style="gap: 16px">
        <div class="col">
          <CardComponent>
            <template v-slot:body>
              <div class="q-mb-lg">
                <div class="text-primary text-weight-medium q-mb-md">
                  FILTER:
                </div>
                <q-form @submit="getPatients">
                  <div
                    class="row items-center"
                    :style="$q.screen.lt.md ? {} : { gap: '16px' }"
                  >
                    <q-input
                      :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                      :style="{ minWidth: $q.screen.lt.md ? '100%' : '100px' }"
                      :dense="$q.screen.gt.sm"
                      :disable="loading"
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
                <div>
                  <!-- Extra div parent is a visual bug workaround -->
                  <q-badge
                    color="accent"
                    class="text-black q-pa-sm"
                    :class="$q.screen.lt.md ? 'q-mt-md' : ''"
                  >
                    <span class="text-weight-bold">
                      {{ patients.length }}
                    </span>
                    <span>&nbsp;item/s found.</span>
                  </q-badge>
                </div>
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
                      v-if="$q.screen.lt.md"
                      class="relative-position bg-white"
                      style="
                        overflow-y: auto;
                        display: grid;
                        grid-template-rows: min-content auto;
                      "
                    >
                      <q-virtual-scroll
                        v-if="patients && patients.length > 0"
                        style="
                          max-height: 100%;
                          height: auto;
                          border-top: 1px solid rgba(0, 0, 0, 0.1);
                          border-left: 1px solid rgba(0, 0, 0, 0.1);
                          border-right: 1px solid rgba(0, 0, 0, 0.1);
                        "
                        :items="patients"
                        v-slot="{ item, index }"
                      >
                        <q-item
                          class="full-width q-pa-md"
                          :key="index"
                          clickable
                          @click="showPxVisitInfo(item)"
                        >
                          <q-item-section>
                            <q-item-label caption class="ellipsis">{{
                              formatDate(item.dateTimeCreated)
                            }}</q-item-label>
                            <q-item-label overline class="q-mb-sm">{{
                              item.patientIdentificationCode
                            }}</q-item-label>
                            <q-item-label
                              class="text-weight-medium text-uppercase"
                              style="gap: 8px"
                            >
                              {{
                                formatName(
                                  item.patientFirstName,
                                  item.patientMiddleName,
                                  item.patientLastName,
                                  item.patientExtName
                                )
                              }}
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
                          <q-item-section v-if="examsMap" side>
                            <q-btn
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              class="q-mb-sm bg-white"
                              unelevated
                              outline
                              :color="
                                item.dateTimeCompleted
                                  ? 'positive'
                                  : 'text-grey-8'
                              "
                              @click.stop="
                                () => {
                                  currentVisit = item;
                                  statusHistoryVisible = true;
                                }
                              "
                              :label="
                                item.dateTimeCompleted
                                  ? 'COMPLETED'
                                  : 'NOT COMPLETED'
                              "
                            />
                            <q-btn
                              dense
                              style="padding-left: 10px; padding-right: 10px"
                              unelevated
                              color="primary"
                              label="DETAILS"
                              @click.stop="showPxVisitInfo(item)"
                            />
                          </q-item-section>
                        </q-item>
                        <q-separator />
                      </q-virtual-scroll>
                      <div
                        v-else
                        style="height: 150px"
                        class="flex flex-center"
                      >
                        <NoResult
                          :bordered="false"
                          message="No patient found."
                        />
                      </div>
                    </div>

                    <NoResult v-else message="No student/employee found." />
                    <div class="row items-start justify-end q-mt-md">
                      <q-btn
                        style="height: 40px"
                        color="primary"
                        class="q-px-md q-py-xs"
                        :disable="!selected || selected.length === 0 || saving"
                        unelevated
                        stack-label
                        label="SCHEDULE VISIT"
                        @click="confirmationDialogVisible = true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </CardComponent>
        </div>
        <div class="col">
          <CardComponent class="col-6">
            <template v-slot:body>
              <div style="height: 100px; background: red"></div>
            </template>
          </CardComponent>
        </div>
      </div>
    </div>
    <ConfirmationDialog
      v-if="confirmationDialogVisible"
      question="Schedule visit for the selected students/employees?"
      @cancel="(evt) => (confirmationDialogVisible = false)"
      @ok="
        (evt) => {
          confirmationDialogVisible = false;
          scheduleVisits();
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
      patients: [],

      confirmationDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  mounted() {
    this.getPatients();
  },
  methods: {
    async getPatients() {
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
          "Unable to fetch students/employees. Please try again."
        );

        this.filtering = false;
        return;
      }

      await delay(2000);

      this.patients =
        response.body && response.body.length > 0
          ? response.body.map((row, idx) => {
              return {
                ...row,
                id: idx,
                status: { code: null, name: "-" },
                visitCode: null,
                loading: false,
              };
            })
          : [];

      this.filtering = false;
    },
    async scheduleVisits() {
      this.saving = true;

      for (const row of this.selected) {
        row.loading = true;
        row.status = { code: null, name: "-" };
        row.visitCode = null;

        const response = await this.$store.dispatch(
          "ape/schedule",
          sliceObj(row, "id", "status", "visitCode", "loading")
        );

        await delay(1000);

        if (response.error) {
          row.status = { code: response.status, name: response.body };
          row.loading = false;
          continue;
        }

        row.status = { code: 200, name: "Success. Visit details sent." };
        row.visitCode = response.body.code;
        row.loading = false;
      }

      this.selected = [];
      this.saving = false;
    },
  },
});
</script>
