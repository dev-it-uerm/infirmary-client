<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column" style="gap: 16px">
      <PageHeader text="VISIT APPOINTMENT" icon="fa-regular fa-id-card" />
      <CardComponent>
        <template v-slot:body>
          <div
            v-if="loading"
            style="min-height: 100px; width: 400px; max-width: 400px"
          >
            <FetchingData />
          </div>
          <div
            v-show="!loading"
            class="q-pa-md"
            style="padding: 32px; width: 400px; max-width: 400px"
          >
            <MessageBanner :success="!error">
              <template v-slot:body>
                <div v-show="error">{{ errorMsg }}</div>
                <div v-show="!error" class="row justify-center">
                  <div>You have successfully scheduled a visit.</div>
                  <div>
                    For your reference, below is your
                    <strong>Visit Reference Number</strong> which is also sent
                    to your email.
                  </div>
                  <q-separator
                    style="
                      background-color: rgba(0, 128, 0, 0.2);
                      margin: 20px 0;
                      width: 200px;
                    "
                  />
                  <div class="column items-center q-mt-md" style="gap: 12px">
                    <img
                      id="imgVisitQrCode"
                      style="border: 1px solid rgba(0, 0, 0, 0.2)"
                    />
                    <div class="text-black text-weight-medium">
                      {{ visitCode }}
                    </div>
                  </div>
                </div>
              </template>
            </MessageBanner>
          </div>
        </template>
      </CardComponent>
    </div>
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
    MessageBanner: defineAsyncComponent(() =>
      import("src/components/core/MessageBanner.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
  },
  data() {
    return {
      visitCode: "",

      error: true,
      errorMsg: "",
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
        "ape/scheduleSelf",
        this.$route.query.accessToken
      );

      if (response.error) {
        this.errorMsg = response.body;
        this.loading = false;
        return;
      }

      this.error = false;
      this.loading = false;
      this.visitCode = response.body.code;
      this.renderVisitQRCode(response.body.code);
    },
  },
});
</script>
