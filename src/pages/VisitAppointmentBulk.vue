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
      <PageHeader icon="fa-solid fa-calendar-days" text="VISIT APPOINTMENT" />
      <CardComponent>
        <template v-slot:body>
          <div class="column" style="gap: 16px">
            <div class="text-primary text-weight-medium">FILTER:</div>
            <q-form @submit="getPatients">
              <div class="row items-center" style="gap: 16px">
                <q-select
                  :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
                  :dense="$q.screen.gt.sm"
                  :disable="filtering || scheduling"
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
                  :disable="filtering || scheduling"
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
                <template
                  v-if="filters.affiliationCode === affiliationsMap.STU.code"
                >
                  <q-input
                    dense
                    class="col-auto"
                    :disable="filtering || scheduling"
                    stack-label
                    outlined
                    maxlength="4"
                    label="School Year"
                    :rules="[yearRule]"
                    v-model.trim="filters.schoolYear"
                  />
                  <CollegeSelect
                    :disable="filtering || scheduling"
                    class="col-auto"
                    dense
                    v-model="filters.collegeCode"
                    hint=""
                  />
                  <YearLevelSelect
                    :disable="filtering || scheduling"
                    class="col-auto"
                    dense
                    v-model="filters.yearLevel"
                    hint=""
                  />
                </template>
                <q-input
                  :class="$q.screen.lt.md ? 'col-12' : 'col'"
                  :dense="$q.screen.gt.sm"
                  :disable="filtering || scheduling"
                  debounce="750"
                  stack-label
                  outlined
                  label="Patient Name"
                  v-model="filters.fullName"
                  hint=""
                />
                <div
                  class="row items-start justify-end"
                  style="margin-bottom: 20px"
                >
                  <q-btn
                    style="height: 40px"
                    color="primary"
                    class="q-px-md q-py-xs"
                    :disable="filtering || scheduling"
                    unelevated
                    stack-label
                    label="GO"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
            <div>
              <!-- Extra div parent is a visual bug workaround -->
              <q-badge color="accent" class="text-black q-pa-sm">
                <span class="text-weight-bold">
                  {{ patients.length }}
                </span>
                <span>&nbsp;items found.</span>
              </q-badge>
            </div>
          </div>
        </template>
      </CardComponent>
      <CardComponent>
        <template v-slot:body>
          <!-- <div v-if="filtering" class="full-width flex flex-center" style="height: 100px">
            <q-spinner-dots size="md" color="primary" />
          </div> -->
          <FetchingData v-if="filtering" />
          <div v-else>
            <div class="text-primary text-weight-medium q-mb-md">
              PATIENT LIST:
            </div>
            <template v-if="patients && patients.length > 0">
              <q-separator />
              <q-table
                class="shadow-0"
                selection="multiple"
                v-model:selected="selected"
                :rows="patients"
                row-key="id"
                :columns="columns"
                hide-bottom
              >
                <template v-slot:header-selection="scope">
                  <q-checkbox :disable="scheduling" v-model="scope.selected" />
                </template>
                <template v-slot:body="props">
                  <q-tr class="cursor-pointer">
                    <q-td>
                      <q-checkbox
                        :disable="scheduling"
                        v-model="props.selected"
                      />
                    </q-td>
                    <q-td v-for="column of props.cols">
                      <span
                        v-if="column.name === 'identificationCode'"
                        class="text-grey-7"
                      >
                        {{ props.row.identificationCode }}
                      </span>
                      <div v-else-if="column.name === 'campusCode'">
                        <q-badge v-if="props.row.campusCode" class="bg-grey">
                          {{ campusesMap[props.row.campusCode].name }}
                        </q-badge>
                      </div>
                      <div v-else-if="column.name === 'affiliationCode'">
                        <q-badge v-if="props.row.campusCode" class="bg-grey">
                          {{ affiliationsMap[props.row.affiliationCode].name }}
                        </q-badge>
                      </div>
                      <span
                        v-else-if="column.name === 'patientFullName'"
                        class="text-weight-bold text-uppercase"
                      >
                        {{
                          formatName(
                            props.row.firstName,
                            props.row.middleName,
                            props.row.lastName
                          )
                        }}
                      </span>
                      <div
                        v-else-if="column.name === 'status'"
                        class="row justify-center"
                      >
                        <q-spinner v-if="props.row.loading" size="xs" />
                        <template v-else>
                          <span
                            v-if="props.row.status"
                            :class="
                              props.row.status.code === 200
                                ? 'text-positive'
                                : props.row.status.code > 200
                                ? 'text-negative'
                                : ''
                            "
                          >
                            {{ props.row.status.name ?? "-" }}
                          </span>
                          <span v-else>-</span>
                        </template>
                      </div>
                      <!-- <div
                        v-else-if="column.name === 'visitCode'"
                        class="text-center"
                      >
                        {{ props.row[column.name] ?? "-" }}
                      </div>
                      <div
                        v-else-if="column.name === 'dateHired'"
                        class="text-center"
                      >
                        {{
                          props.row[column.name]
                            ? formatDate(props.row[column.name], {
                                dateOnly: true,
                              })
                            : "-"
                        }}
                      </div> -->
                      <div v-else class="text-center">
                        <span v-if="column.name === 'dateHired'">
                          {{
                            props.row[column.name]
                              ? formatDate(props.row[column.name], {
                                  dateOnly: true,
                                })
                              : "-"
                          }}
                        </span>
                        <span v-else>
                          {{ props.row[column.name] ?? "-" }}
                        </span>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
              <q-separator />
            </template>
            <NoResult v-else message="No student/employee found." />
            <div class="row items-start justify-end q-mt-md">
              <q-btn
                style="height: 40px"
                color="primary"
                class="q-px-md q-py-xs"
                :disable="!selected || selected.length === 0 || scheduling"
                unelevated
                stack-label
                label="SCHEDULE VISIT"
                @click="confirmationDialogVisible = true"
              />
            </div>
          </div>
        </template>
      </CardComponent>
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
import { delay, formatDate, showMessage, sliceObj } from "src/helpers/util.js";

import {
  campuses,
  campusesMap,
  affiliations,
  affiliationsMap,
} from "src/helpers/constants.js";

import * as inputRules from "src/helpers/input-rules.js";

export default defineComponent({
  name: "VisitAppointmentBulk",
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
    CollegeSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/CollegeSelect.vue")
    ),
    YearLevelSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/YearLevelSelect.vue")
    ),
  },
  setup() {
    return {
      campuses,
      campusesMap,
      affiliations,
      affiliationsMap,
      showMessage,
      formatDate,
      formatName: (patientFirstName, patientMiddleName, patientLastName) => {
        return `${patientLastName}, ${patientFirstName} ${
          patientMiddleName ? patientMiddleName[0].concat(".") : ""
        }`.trim();
      },
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
        campusCode: campusesMap.UERM.code,
        affiliationCode: affiliationsMap.EMP.code,
        fullName: "",

        collegeCode: null,
        schoolYear: null,
        yearLevel: null,
      },

      columns: [],

      filtering: false,
      scheduling: false,
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
  watch: {
    "filters.affiliationCode": {
      handler(val) {
        if (val === affiliationsMap.STU.code) {
          this.filters.collegeCode = "MED";
          return;
        }

        this.filters.collegeCode = null;
      },
    },
  },
  mounted() {
    this.getPatients();
  },
  methods: {
    updateColumns() {
      this.columns = [
        {
          name: "campusCode",
          field: "campusCode",
          label: "CAMPUS",
          align: "left",
        },
        {
          name: "affiliationCode",
          field: "affiliationCode",
          label: "AFFILIATION",
          align: "left",
        },
        {
          name: "identificationCode",
          field: "identificationCode",
          label:
            this.filters.affiliationCode === this.affiliationsMap.STU.code
              ? "STUDENT NO."
              : "EMPLOYEE NO.",
          align: "left",
        },
        ...(this.filters.affiliationCode === this.affiliationsMap.STU.code
          ? [
              {
                name: "schoolYear",
                field: "schoolYear",
                label: "SCHOOL YEAR",
                align: "center",
              },
              {
                name: "collegeCode",
                field: "collegeCode",
                label: "COLLEGE",
                align: "center",
              },
              {
                name: "yearLevel",
                field: "yearLevel",
                label: "YEAR LEVEL",
                align: "center",
              },
            ]
          : []),
        {
          name: "patientFullName",
          label: "PATIENT NAME",
          align: "left",
        },
        {
          name: "status",
          field: "status",
          label: "STATUS",
          align: "center",
        },
        {
          name: "visitCode",
          field: "visitCode",
          label: "VISIT CODE",
          align: "center",
        },
      ];
    },
    async getPatients() {
      this.filtering = true;
      this.selected = [];

      const sanitizedFilters = Object.entries(this.filters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
        return acc;
      }, {});

      const response = await this.$store.dispatch(
        "app/getPatients",
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

      this.updateColumns();

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
      this.scheduling = true;

      for (const row of this.selected) {
        row.loading = true;
        row.status = { code: null, name: "-" };
        row.visitCode = null;

        const response = await this.$store.dispatch(
          "visit/schedule",
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
      this.scheduling = false;
    },
  },
});
</script>
