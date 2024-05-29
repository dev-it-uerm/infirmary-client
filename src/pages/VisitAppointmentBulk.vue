<template>
  <q-page
    class="row justify-center bg-grey-3"
    :class="$q.screen.lt.sm ? 'q-pa-md fit' : 'q-pa-lg'"
  >
    <div
      class="column justify-start"
      style="gap: 16px"
      :style="
        $q.screen.lt.md
          ? { width: '100%' }
          : {
              width: '1200px',
              maxWidth: '1200px',
            }
      "
    >
      <q-card class="column shadow-0 relative-position bg-transparent">
        <PageHeader
          icon="fa-solid fa-calendar-days"
          text="VISITS APPOINTMENT"
        />
      </q-card>
      <q-card
        class="column shadow-0 q-pa-lg bg-white items-start"
        style="gap: 16px"
      >
        <div class="text-primary text-weight-medium">FILTER:</div>
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
            :options="Object.values(campusesMap)"
            label="Campus"
            v-model="filters.campusCode"
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
            :options="Object.values(affiliationsMap)"
            label="Affiliation"
            v-model="filters.affiliationCode"
          />
          <q-input
            :class="$q.screen.lt.md ? 'col-12' : 'col-auto'"
            :dense="$q.screen.gt.sm"
            :disable="filtering || scheduling"
            debounce="750"
            stack-label
            outlined
            label="Patient Name"
            v-model="filters.fullName"
          />
          <div class="row items-start justify-end">
            <q-btn
              style="height: 40px"
              color="primary"
              class="q-px-md q-py-xs"
              :disable="filtering || scheduling"
              unelevated
              stack-label
              label="GO"
              @click="getStudEmps"
            />
          </div>
        </div>
        <div>
          <!-- Extra div parent is a visual bug workaround -->
          <q-badge color="accent" class="text-black q-pa-sm">
            <span class="text-weight-bold">
              {{ studemps.length }}
            </span>
            <span>&nbsp;items found.</span>
          </q-badge>
        </div>
      </q-card>
      <q-card class="shadow-0 bg-white q-pa-lg">
        <div v-if="filtering" class="flex flex-center" style="height: 100px">
          <q-spinner size="md" color="primary" />
        </div>
        <div v-else>
          <q-table
            class="shadow-0"
            selection="multiple"
            v-model:selected="selected"
            :rows="studemps"
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
                  <q-checkbox :disable="scheduling" v-model="props.selected" />
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
                    class="text-weight-bold"
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
                    <span
                      v-else
                      :class="
                        props.row.status.code === 200
                          ? 'text-positive'
                          : props.row.status.code > 200
                          ? 'text-negative'
                          : ''
                      "
                    >
                      {{ props.row.status.name }}
                    </span>
                  </div>
                  <div
                    v-else-if="column.name === 'visitCode'"
                    class="text-center"
                  >
                    {{ props.row[column.name] }}
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <q-separator spaced />
          <div class="row items-start justify-end q-mt-md">
            <q-btn
              style="height: 40px"
              color="primary"
              class="q-px-md q-py-xs"
              :disable="!selected || selected.length === 0 || scheduling"
              unelevated
              stack-label
              label="SCHEDULE VISIT"
              @click="scheduleVisits"
            />
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  delay,
  formatDate,
  showMessage,
  subtractDay,
  jsDateToISOString,
  allPropsEmpty,
} from "src/helpers/util.js";

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
  },
  setup() {
    return {
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
      columns: [
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
          label: "STUDENT NO./EMPLOYEE NO.",
          align: "left",
        },
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
          label: "VISIT REF. NO.",
          align: "center",
        },
      ],
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      filters: {
        campusCode: "CAL",
        affiliationCode: "EMP",
        fullName: "JP",
      },

      filtering: false,
      scheduling: false,
      selected: [],
      studemps: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      affiliationsMap: "app/affiliationsMap",
      campusesMap: "app/campusesMap",
    }),
  },
  mounted() {
    this.getStudEmps();
  },
  methods: {
    async getStudEmps() {
      this.filtering = true;

      const sanitizedFilters = Object.entries(this.filters).reduce((acc, e) => {
        if (e[1] != null && e[1] !== "") acc[e[0]] = e[1];
        return acc;
      }, {});

      const response = await this.$store.dispatch(
        "app/getStudemps",
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

      this.studemps =
        response.body && response.body.length > 0
          ? response.body.map((row) => {
              return {
                ...row,
                id: `${row.campusCode}${row.affiliationCode}${row.identificationCode}`,
                visitCode: "-",
                loading: false,
                status: { code: null, name: "-" },
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

        const response = await this.$store.dispatch("visit/schedule", {
          campusCode: row.campusCode,
          affiliationCode: row.affiliationCode,
          identificationCode: row.identificationCode,
        });

        await delay(1000);

        console.log(response);
        if (response.error) {
          row.status = { code: response.status, name: response.body };
          row.loading = false;
          continue;
        }

        row.status = { code: 200, name: "Success. Visit details sent." };
        row.visitCode = response.body.code;
        row.loading = false;
      }

      this.scheduling = false;
    },
  },
});
</script>
