<template>
  <q-page class="flex flex-center q-pa-lg">
    <div
      class="column"
      style="gap: 16px"
      :style="{ width: $q.screen.lt.md ? '100%' : '500px' }"
    >
      <PageHeader
        text="VISIT TRACKER"
        icon="fa-solid fa-solid fa-magnifying-glass"
      />
      <CardComponent>
        <template v-slot:body>
          <VisitCodeScanner
            class="full-width"
            ref="visitCodeScanner"
            :loading="loading"
            @visitCodeChanged="(val) => (visitCode = val)"
            @inputModeChanged="(val) => (inputMode = val)"
          />
        </template>
      </CardComponent>
      <CardComponent>
        <template v-slot:body>
          <div
            v-if="loading"
            class="full-width flex flex-center"
            style="height: 100px"
          >
            <q-spinner-dots size="lg" />
          </div>
          <div v-else class="fit flex flex-center">
            <div
              v-if="patient && visit"
              class="full-width column q-pa-lg q-mb-md"
              style="gap: 2px; border: solid rgba(0, 0, 0, 0.15) 1px"
            >
              <div class="q-mb-sm">
                <span class="text-grey-7">Visit Code:</span>
                <span class="q-ml-sm">{{ visit.code }}</span>
              </div>
              <div>
                <span class="text-grey-7">Patient Name:</span>
                <span class="q-ml-sm">{{
                  formatName(
                    patient.firstName,
                    patient.middleName,
                    patient.lastName,
                    patient.extName
                  )
                }}</span>
              </div>
              <div>
                <span class="text-grey-7">Patient Campus:</span>
                <span class="q-ml-sm">{{
                  campusesMap[patient.campusCode].name
                }}</span>
              </div>
              <div>
                <span class="text-grey-7">Patient Affiliation:</span>
                <span class="q-ml-sm">{{
                  affiliationsMap[patient.affiliationCode].name
                }}</span>
              </div>
              <div v-if="patient.collegeCode" class="q-mt-sm">
                <div>
                  <span class="text-grey-7">College:</span>
                  <span class="q-ml-sm">{{
                    collegesMap[patient.collegeCode].name
                  }}</span>
                </div>
                <div v-if="patient.schoolYear">
                  <span class="text-grey-7">School Year:</span>
                  <span class="q-ml-sm">{{ patient.schoolYear }}</span>
                </div>
                <div v-if="patient.yearLevel">
                  <span class="text-grey-7">Year Level:</span>
                  <span class="q-ml-sm">{{
                    yearLevels.find((l) => l.code === Number(patient.yearLevel))
                      .name ?? ""
                  }}</span>
                </div>
              </div>
            </div>
            <!-- <div class="row justify-center q-py-md">
              <q-separator style="width: 100px" spaced />
            </div> -->
            <q-list
              class="full-width"
              separator
              v-if="phases && phases.length > 0"
            >
              <template v-for="(phase, idx) in phases" :key="idx">
                <q-item>
                  <q-item-section>
                    <q-item-label caption>
                      {{
                        phase.dateTimeCreated
                          ? formatDate(phase.dateTimeCreated)
                          : "NOT YET COMPLETED"
                      }}
                    </q-item-label>
                    <q-item-label>
                      {{ visitPhasesMap[phase.code].name }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon
                      :name="
                        phase.dateTimeCreated
                          ? 'fa-solid fa-circle-check'
                          : 'fa-solid fa-circle-xmark'
                      "
                      :color="phase.dateTimeCreated ? 'positive' : 'negative'"
                      size="xs"
                    />
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
            <div v-else class="column items-center">
              <q-icon class="q-mb-sm" name="info" size="sm" />
              <div class="text-center">
                Scan/enter the visit code to see its status.
              </div>
            </div>
          </div>
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
  sortStringArr,
  formatDate,
  formatName,
} from "src/helpers/util.js";

import {
  visitPhasesMap,
  affiliationsMap,
  campusesMap,
  collegesMap,
  yearLevels,
} from "src/helpers/constants.js";

export default defineComponent({
  name: "VisitTracker",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    VisitCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/VisitCodeScanner.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
  },
  setup() {
    return {
      visitPhasesMap,
      affiliationsMap,
      campusesMap,
      collegesMap,
      yearLevels,
      formatDate,
      formatName,
    };
  },
  data() {
    return {
      // recentEntries: [],
      loading: false,
      inputMode: null,
      visitCode: null,
      phases: [],

      patient: null,
      visit: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    visitCode(val) {
      if (val) this.track(val);
    },
  },
  methods: {
    async track(visitCode) {
      this.loading = true;
      this.patient = null;
      this.visit = null;

      const response = await this.$store.dispatch("ape/track", visitCode);
      await delay(2000);

      if (response.error) {
        showMessage(this.$q, false, response.body.error ?? response.body);
        this.$refs.visitCodeScanner.reset();
        this.loading = false;
        return;
      }

      const examsToCompleteMap = response.body.examCodesToComplete.reduce(
        (acc, e) => {
          acc[e] = null;
          return acc;
        },
        {}
      );

      const completedPhasesMap = response.body.completedPhases.reduce(
        (acc, p) => {
          acc[p.phaseCode] = p.dateTimeCreated;
          return acc;
        },
        {}
      );

      this.patient = response.body.patient;
      this.visit = response.body.visit;

      const phasesMap = {
        ...examsToCompleteMap,
        ...completedPhasesMap,
      };

      const phases = Object.entries(phasesMap).map((e) => ({
        code: e[0],
        dateTimeCreated: e[1],
      }));

      sortStringArr(phases, "dateTimeCreated");

      this.phases = phases;

      this.$refs.visitCodeScanner.reset();
      this.loading = false;
    },
  },
});
</script>
