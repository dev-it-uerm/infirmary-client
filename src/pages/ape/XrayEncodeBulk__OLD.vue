<template>
  <q-page
    class="row justify-center"
    :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'"
  >
    <div>
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
            <!-- :class="$q.screen.gt.md ? 'row' : 'column'" -->
            <div v-if="initialized" class="column" style="gap: 46px">
              <!-- <div class="q-mb-lg">
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
                          :style="{
                            minWidth: $q.screen.lt.md ? '100%' : '100px',
                          }"
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
                            color="accent"
                            class="q-px-md q-py-xs text-black"
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
                  <q-separator spaced /> -->
              <!-- class="q-mt-lg" -->
              <div class="full-width">
                <div class="text-primary text-weight-medium q-mb-md row">
                  PATIENT LIST:
                </div>
                <q-form @submit="getVisits">
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
                      :class="$q.screen.lt.md ? 'col-12' : 'col'"
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
                      :class="$q.screen.lt.md ? 'col-12' : 'col'"
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
                      class="row items-start justify-end col-auto"
                      :class="$q.screen.lt.md ? 'full-width' : ''"
                      style="margin-bottom: 20px"
                    >
                      <q-btn
                        style="height: 40px"
                        color="accent"
                        class="q-px-md q-py-xs text-black"
                        :disable="filtering || saving"
                        unelevated
                        stack-label
                        label="SEARCH"
                        type="submit"
                      />
                    </div>
                  </div>
                </q-form>
                <FetchingData v-if="filtering" />
                <div v-else>
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
                  <div
                    class="row full-width justify-between items-center q-mt-md"
                  >
                    <div class="col text-black text-caption">
                      <span class="text-weight-bold">
                        {{ selected?.length ?? 0 }}
                      </span>
                      <span>&nbsp;item/s selected</span>
                    </div>
                    <q-btn
                      :disable="
                        !visits ||
                        visits.length === 0 ||
                        selected.length === visits.length ||
                        saving
                      "
                      dense
                      outline
                      class="col-auto q-px-md q-py-xs text-primary"
                      unelevated
                      stack-label
                      label="SELECT ALL"
                      @click="() => (selected = visits.map((v) => v.id))"
                    />
                  </div>
                </div>
              </div>
              <q-separator />
              <div class="full-width">
                <div class="text-primary text-weight-medium q-mb-md row">
                  X-RAY (CHEST) RESULT:
                </div>
                <q-form @submit="confirmationDialogVisible = true">
                  <FormFieldXrayImpression
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
                    <div class="text-negative text-caption">
                      {{
                        selected && selected.length > 0
                          ? ""
                          : "Please select at least one patient to start saving."
                      }}
                    </div>
                    <q-btn
                      style="height: 40px"
                      color="accent"
                      class="q-px-md q-py-xs text-black"
                      :disable="!selected || selected.length === 0 || saving"
                      unelevated
                      stack-label
                      label="SAVE"
                      type="submit"
                    />
                  </div>
                </q-form>
              </div>
            </div>
            <FetchingData v-else />
          </template>
        </CardComponent>
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
  },
  watch: {
    initialized: {
      handler(v) {
        if (!v) return;
        this.getVisits();
      },
      immediate: true,
    },
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

        const response = await this.$store.dispatch("ape/saveExamDetails", {
          visitId: row.id,
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
