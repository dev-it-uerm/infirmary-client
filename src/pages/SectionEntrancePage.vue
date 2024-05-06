<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card v-if="ready" borderless class="shadow-0">
      <PageHeader
        :text="
          visitSectionsMap[$route.params.sectionCode].name.concat(' SECTION')
        "
        :icon="visitSectionsMap[$route.params.sectionCode].icon"
      />
      <div style="padding: 32px; width: 450px">
        <ReminderCard :exitable="false" class="q-mb-md">
          <template v-slot:body>
            <div>
              Enter the <b>Patient Number</b> to accept the patient to the
              <b class="text-uppercase"
                >{{ visitSectionsMap[$route.params.sectionCode].name }}.</b
              >
            </div>
          </template>
        </ReminderCard>
        <q-input
          debounce="750"
          :disable="loading"
          outlined
          stack-label
          label="Patient Number"
          v-model.trim="patientCode"
        />
        <div class="q-mt-md">
          <div class="text-primary text-weight-medium q-mb-sm">
            Recent entries:
          </div>
          <q-list
            bordered
            style="
              min-height: 150px;
              height: 150px;
              max-height: 150px;
              overflow-y: auto;
            "
          >
            <template v-if="recentEntries && recentEntries.length > 0">
              <template v-for="(entry, idx) in recentEntries" :key="idx">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ entry.patientCode }}</q-item-label>
                    <q-item-label caption>{{ entry.message }}</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-badge
                      :color="entry.success ? 'positive' : 'negative'"
                      :label="entry.success ? 'SUCCESS' : 'ERROR'"
                    />
                  </q-item-section>
                </q-item>
                <q-separator />
              </template>
            </template>
            <div
              v-else
              class="fit flex flex-center"
              style="border: solid 1px rgba(255, 255, 255, 0.25)"
            >
              <q-item-label class="text-center" caption>
                No entry yet.
              </q-item-label>
            </div>
          </q-list>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "SectionEntrancePage",
  components: {
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
  },
  data() {
    return {
      patientCode: null,
      loading: false,
      recentEntries: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      visitSectionsMap: "app/visitSectionsMap",
    }),
    ready() {
      return this.$route.params.sectionCode && this.visitSectionsMap;
    },
  },
  watch: {
    "$route.params.sectionCode": {
      handler(val) {
        if (val) this.clear();
      },
      immediate: true,
    },
    patientCode(val) {
      if (this.ready && val && val.length > 3) this.changeVisitStatus();
    },
  },
  methods: {
    clear() {
      this.patientCode = "";
      this.recentEntries = [];
    },
    async changeVisitStatus() {
      const patientCode = this.patientCode.replace(/ /g, "");
      let success = true;
      let message = `Patient has entered ${this.visitSectionsMap[
        this.$route.params.sectionCode
      ].name.toUpperCase()} successfully.`;

      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("visit/changeStatus", {
        patientCode,
        statusCode:
          this.visitSectionsMap[this.$route.params.sectionCode].statusCode,
      });

      if (response.error) {
        success = false;
        message = response.body;
      }

      showMessage(this.$q, success, message);

      // MAX 10 ITEMS
      if (this.recentEntries.length === 10) this.recentEntries.pop();

      this.recentEntries.unshift({
        success,
        patientCode,
        message,
      });

      this.patientCode = "";
      this.loading = false;
    },
  },
});
</script>
