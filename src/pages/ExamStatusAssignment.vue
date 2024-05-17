<template>
  <q-page class="flex flex-center bg-grey-3">
    <div class="column" style="gap: 16px">
      <q-card borderless class="shadow-0" style="width: 500px">
        <PageHeader
          text="EXAM STATUS ASSIGNMENT"
          icon="fa-solid fa-list-check"
        />
      </q-card>
      <q-card borderless class="shadow-0" style="width: 500px">
        <div style="padding: 32px">
          <VisitCodeScanner
            ref="visitCodeScanner"
            :loading="loading"
            @valueChanged="(val) => (value = val)"
          />
          <!-- <div class="q-mt-md">
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
                      <q-item-label>{{ entry.visitCode }}</q-item-label>
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
          </div> -->
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "ExamStatusAssignment",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    VisitCodeScanner: defineAsyncComponent(() =>
      import("src/components/core/VisitCodeScanner.vue")
    ),
  },
  data() {
    return {
      // recentEntries: [],
      loading: false,
      value: null,
    };
  },
  watch: {
    value(val) {
      if (val && val.examCode && val.visitCode && val.visitCode.length === 22) {
        this.changeVisitPhase();
      }
    },
  },
  methods: {
    async changeVisitPhase() {
      const visitCode = this.value.visitCode.replace(/ /g, "");
      const examCode = this.value.examCode;

      let success = true;
      let message = `Patient has been marked as done in the ${examCode} exam.`;

      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("visit/completeExam", {
        visitCode,
        examCode,
      });

      if (response.error) {
        success = false;
        message = response.body.error ?? response.body;
      }

      showMessage(this.$q, success, message);

      // MAX 10 ITEMS
      // if (this.recentEntries.length === 10) this.recentEntries.pop();

      // this.recentEntries.unshift({
      //   success,
      //   visitCode,
      //   message,
      // });

      this.$refs.visitCodeScanner.reset();
      this.loading = false;
    },
  },
});
</script>
