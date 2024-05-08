<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card v-if="ready" borderless class="shadow-0">
      <PageHeader
        :text="
          visitSectionsMap[$route.params.sectionCode].name.concat(' SECTION')
        "
        :icon="visitSectionsMap[$route.params.sectionCode].icon"
      />
      <div style="padding: 32px; width: 400px">
        <ReminderCard :exitable="false" class="q-mb-md">
          <template v-slot:body>
            <div v-if="qrMode">
              Scan the <b>Visit QR Code</b> to mark the patient as SEEN in the
              <b class="text-uppercase"
                >{{
                  visitSectionsMap[$route.params.sectionCode].name
                }}
                section.</b
              >
            </div>
            <div v-else>
              Enter the <strong>Visit Reference Number</strong> to mark the
              patient as SEEN in the
              <b class="text-uppercase">
                {{ visitSectionsMap[$route.params.sectionCode].name }} section.
              </b>
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
            :label="qrMode ? 'QR CODE MODE' : 'MANUAL MODE'"
          />
        </div>

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
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage } from "src/helpers/util.js";
import { Html5QrcodeScanner } from "html5-qrcode";

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
      qrMode: true,
      visitCode: null,
      loading: false,
      // recentEntries: [],
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
    visitCode(val) {
      if (this.ready && val && val.length > 3) this.changeVisitStatus();
    },
  },
  mounted() {
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
    async changeVisitStatus() {
      const visitCode = this.visitCode.replace(/ /g, "");
      let success = true;
      let message = `Patient has been marked as SEEN in ${this.visitSectionsMap[
        this.$route.params.sectionCode
      ].name.toUpperCase()}.`;

      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("visit/changeStatus", {
        visitCode,
        statusCode:
          this.visitSectionsMap[this.$route.params.sectionCode].statusCode,
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
