<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card borderless class="shadow-0" style="width: 500px">
      <PageHeader text="EXAM CHECKER" icon="fa-solid fa-list-check" />
      <div style="padding: 32px">
        <div v-if="forbidden">FORBIDDEN</div>
        <div v-else>
          <ReminderCard v-if="exam" :exitable="false" class="q-mb-md">
            <template v-slot:body>
              <div v-if="qrMode">
                Scan the <strong>Visit QR Code</strong> to mark the patient as
                DONE in the
                <b class="text-uppercase"> {{ exam.name.toUpperCase() }} </b>.
              </div>
              <div v-else>
                Enter the <strong>Visit Reference Number</strong> to mark the
                patient as DONE in the
                <b class="text-uppercase"> {{ exam.name.toUpperCase() }} </b>.
              </div>
            </template>
          </ReminderCard>
          <div
            class="q-pa-xs q-mb-md"
            style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 4px"
          >
            <q-toggle
              class="text-overline"
              v-model="qrMode"
              :label="
                qrMode ? 'SCAN VISIT QR CODE' : 'ENTER VISIT CODE MANUALLY'
              "
            />
          </div>
          <q-select
            outlined
            stack-label
            :options="exams"
            option-value="code"
            option-label="name"
            label="Examinations"
            v-model="exam"
            hint=""
          />
          <div v-show="qrMode" id="divQRCodeScanner" width="600px"></div>
          <div v-if="!qrMode" class="q-mb-md">
            <q-input
              debounce="750"
              :loading="loading"
              :disable="loading"
              outlined
              stack-label
              label="Visit Code"
              v-model.trim="visitCode"
            />
          </div>
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
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage } from "src/helpers/util.js";
import { Html5QrcodeScanner } from "html5-qrcode";

export default defineComponent({
  name: "ExamCheckerPage",
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
      exams: [],
      exam: null,
      qrMode: true,
      visitCode: null,
      loading: false,
      // recentEntries: [],

      forbidden: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      visitPhasesMap: "app/visitPhasesMap",
    }),
  },
  watch: {
    // "$route.params.sectionCode": {
    //   handler(val) {
    //     if (val) this.clear();
    //   },
    //   immediate: true,
    // },
    visitCode(val) {
      if (val && val.length === 22) this.changeVisitPhase();
    },
  },
  mounted() {
    this.exams = Object.values(this.visitPhasesMap).filter(
      (v) =>
        !["REG", "FIN"].includes(v.code) &&
        (this.user.allowedPhases ?? []).includes(v.code)
    );

    if (this.exams.length === 0) {
      this.forbidden = true;
      return;
    }
    this.exam = this.exams[0];
    this.initQRScanner();
  },
  methods: {
    clear() {
      this.visitCode = "";
      // this.recentEntries = [];
    },
    initQRScanner() {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "divQRCodeScanner",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const thisSFC = this;

      html5QrcodeScanner.render(
        function (decodedText, decodedResult) {
          thisSFC.visitCode = decodedText;
        },
        function (error) {
          // handle scan failure, usually better to ignore and keep scanning.
          console.warn("Code scan error:", error);
        }
      );
    },
    async changeVisitPhase() {
      const visitCode = this.visitCode.replace(/ /g, "");
      let success = true;
      let message = `Patient has been marked as done in the ${this.exam.name.toUpperCase()} phase.`;

      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("visit/changePhase", {
        visitCode,
        phaseCode: this.exam.code,
      });

      if (response.error) {
        success = false;
        message = response.body;
      }

      showMessage(this.$q, success, message);

      // MAX 10 ITEMS
      // if (this.recentEntries.length === 10) this.recentEntries.pop();

      // this.recentEntries.unshift({
      //   success,
      //   visitCode,
      //   message,
      // });

      this.visitCode = "";
      this.loading = false;
    },
  },
});
</script>
