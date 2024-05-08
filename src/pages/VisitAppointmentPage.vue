<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card borderless class="shadow-0">
      <PageHeader text="VISIT APPOINTMENT" icon="fa-regular fa-id-card" />
      <div
        class="q-pa-md"
        style="padding: 32px; width: 400px; max-width: 400px"
      >
        <div
          class="column q-pa-lg"
          :class="textColorsMap[status]"
          style="border-radius: 4px"
          :style="{
            border: textBordersMap[status],
          }"
        >
          <div class="row justify-center q-mb-md">
            <q-icon
              size="md"
              :name="textIconsMap[status]"
              :color="textColorsMap[status]"
            />
          </div>
          <div class="text-center">
            <div v-if="status === 'LOADING'">
              Scheduling your visit... Please wait.
            </div>
            <div
              v-else-if="status === 'SUCCESS'"
              class="column items-center"
              style="gap: 12px"
            >
              <div>You have successfully scheduled a visit.</div>
              <div>
                For your reference, below is your
                <strong>Visit Reference Number</strong> which is also sent to
                your email.
              </div>
              <q-separator
                style="
                  background-color: rgba(0, 128, 0, 0.2);
                  margin: 20px 0;
                  width: 200px;
                "
              />
            </div>
            <div v-else-if="status === 'ERROR'">
              {{ errorMsg }}
            </div>
          </div>
          <div
            v-show="status === 'SUCCESS'"
            class="fit column items-center q-mt-md"
            style="gap: 12px"
          >
            <img
              id="imgVisitQrCode"
              style="border: 1px solid rgba(0, 0, 0, 0.2)"
            />
            <div class="text-black text-weight-medium">{{ visitCode }}</div>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay } from "src/helpers/util.js";
import QRCode from "qrcode";

export default defineComponent({
  name: "RegistrationPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // FetchingData: defineAsyncComponent(() =>
    //   import("src/components/core/FetchingData.vue")
    // ),
  },
  data() {
    return {
      textColorsMap: {
        LOADING: "text-black",
        ERROR: "text-negative",
        SUCCESS: "text-positive",
      },
      textIconsMap: {
        LOADING: "fa-solid fa-spinner",
        ERROR: "fa-solid fa-circle-xmark",
        SUCCESS: "fa-solid fa-circle-check",
      },
      textBordersMap: {
        LOADING: "1px solid rgba(0, 0, 0, 0.2)",
        ERROR: "1px solid rgba(210, 43, 43, 0.4)",
        SUCCESS: "1px solid rgba(0, 128, 0, 0.2)",
      },
      visitCode: "",
      errorMsg: "",
      status: "LOADING",
      loading: true,
    };
  },
  mounted() {
    this.saveVisit();
  },
  methods: {
    renderVisitQRCode(visitCode) {
      QRCode.toDataURL(visitCode, function (error, url) {
        if (error) {
          console.error(error);
          return;
        }

        const img = document.getElementById("imgVisitQrCode");
        img.src = url;
      });
    },
    async saveVisit() {
      this.loading = true;
      await delay(2000);

      if (!this.$route?.query?.accessToken) {
        this.errorMsg = "`accessToken` in URL is required.";
        return;
      }

      const response = await this.$store.dispatch(
        "visit/schedule",
        this.$route.query.accessToken
      );

      if (response.error) {
        this.errorMsg = response.body;
        this.status = "ERROR";
        this.loading = false;
        return;
      }

      this.status = "SUCCESS";
      this.loading = false;
      this.visitCode = response.body.code;
      this.renderVisitQRCode(response.body.code);
    },
  },
});
</script>
