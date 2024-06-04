<template>
  <q-page class="flex flex-center q-pa-md">
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
          <div class="fit flex flex-center">
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
} from "src/helpers/util.js";

import { visitPhasesMap } from "src/helpers/constants.js";

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
      formatDate,
    };
  },
  data() {
    return {
      // recentEntries: [],
      loading: false,
      inputMode: null,
      visitCode: null,
      phases: [],
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
      await delay(2000);

      const response = await this.$store.dispatch("visit/track", visitCode);

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
