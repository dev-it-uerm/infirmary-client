<template>
  <q-page class="flex flex-center bg-grey-3">
    <div class="column q-pa-md" style="gap: 16px; width: 1020px">
      <q-card borderless class="shadow-0">
        <PageHeader
          text="VISIT TRACKER"
          icon="fa-solid fa-solid fa-magnifying-glass"
        />
      </q-card>
      <div
        :class="$q.screen.lt.md ? 'column justify-start' : 'row items-start'"
        style="gap: 16px"
      >
        <q-card
          borderless
          class="shadow-0"
          :style="{
            width: $q.screen.lt.md ? '100%' : '400px',
            maxWidth: $q.screen.lt.md ? '100%' : '400px',
          }"
        >
          <div style="padding: 32px">
            <VisitCodeScanner
              ref="visitCodeScanner"
              :loading="loading"
              @visitCodeChanged="(val) => (visitCode = val)"
            />
          </div>
        </q-card>
        <q-card borderless class="shadow-0 col q-pa-lg">
          <q-list separator="" v-if="phases && phases.length > 0">
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
              <!-- <q-separator spaced inset /> -->
            </template>
          </q-list>
          <NoResult v-else :bordered="true" message="Visit not found." />
        </q-card>
      </div>
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

export default defineComponent({
  name: "VisitTracker",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    NoResult: defineAsyncComponent(() =>
      import("src/components/core/NoResult.vue")
    ),
    VisitCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/VisitCodeScanner.vue")
    ),
  },
  setup() {
    return {
      formatDate,
    };
  },
  data() {
    return {
      // recentEntries: [],
      loading: false,
      visitCode: null,
      phases: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      visitPhasesMap: "app/visitPhasesMap",
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
