<template>
  <q-page
    class="flex flex-center q-pa-md"
    style="
      background-image: url('src/assets/bg-uerm.jpg');
      background-repeat: no-repeat;
      background-size: cover;
    "
  >
    <div
      class="absolute"
      style="
        width: 100vw;
        height: 100vh;
        /* background-color: rgba(255, 214, 0, 1); */
        background-color: rgba(255, 255, 255, 0.5);
      "
    />
    <!-- <q-dialog :model-value="true" persistent> -->
    <div
      class="column"
      style="gap: 16px; z-index: 999"
      :style="{ width: $q.screen.gt.sm ? '420px' : '300px' }"
    >
      <AppLogo size="md" :inverted="true" />
      <PageHeader icon="fa-solid fa-unlock-keyhole" text="LOG IN" />
      <CardComponent>
        <template v-slot:body>
          <FetchingData v-if="loading" />
          <q-form v-else @submit="submit">
            <div>
              <q-banner
                v-if="messageText"
                :class="'bg-' + messageBgColor + ' q-mb-lg'"
              >
                <div class="row items-center">
                  <q-icon
                    :name="messageIcon"
                    size="sm"
                    :color="messageTextColor"
                    class="q-mr-sm col-auto"
                  />
                  <span class="col" :class="'text-' + messageTextColor">{{
                    messageText
                  }}</span>
                </div>
              </q-banner>
              <q-input
                outlined
                maxlength="255"
                label="Username"
                :rules="[
                  (val) =>
                    val == null || val === ''
                      ? 'Username is required.'
                      : undefined,
                ]"
                class="q-mb-xs q-mt-sm"
                v-model.trim="username"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
              <FormFieldPassword outlined v-model="password" label="Password" />
              <!-- <div
                  style="color: rgba(0, 0, 0, 0.75)"
                  class="text-center bordered-grey q-pa-md"
                >
                  By logging in, you give consent for cookies to be used.
                  <a href="/apps/patient-portal/#/cookie-policy">Click here</a>
                  to view the {{ appConfig.name }} cookie policy.
                </div> -->
            </div>
            <div class="row justify-end">
              <q-btn
                :disable="loading"
                flat
                label="Forgot Password?"
                class="text-black q-mr-sm"
                @click="(evt) => (forgotPasswordDialogVisible = true)"
              />
              <q-btn
                :disable="loading"
                unelevated
                color="primary"
                label="LOGIN"
                type="submit"
              />
            </div>
          </q-form>
        </template>
      </CardComponent>
      <!-- <q-card borderless>
        <q-card-section>
          <UermCopyright />
        </q-card-section>
      </q-card> -->
    </div>
    <MinimizedDialog
      v-if="forgotPasswordDialogVisible"
      title="SEND PASSWORD RESET LINK"
      widthOnDesktop="400px"
      :loading="forgotPasswordLoading"
      @close="closeForgotPasswordForm"
    >
      <template v-slot:body>
        <div
          class="relative-position"
          style="min-height: 100px; min-width: 200px"
        >
          <FetchingData v-if="forgotPasswordLoading" />
          <q-form
            v-else
            ref="pwResetQForm"
            @submit="submitForgotPasswordForm"
            @reset="resetForgotPasswordForm"
          >
            <div class="q-pa-lg">
              <q-input
                outlined
                maxlength="255"
                label="Username or Employee Number"
                :rules="[
                  (val) =>
                    val == null || val === ''
                      ? 'This field is required.'
                      : undefined,
                ]"
                v-model.trim="forgotPasswordUsername"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
            <q-separator />
            <div class="row justify-end q-pa-md">
              <q-btn
                :disable="loading"
                unelevated
                color="accent"
                label="SEND"
                type="submit"
                class="text-black"
              />
            </div>
          </q-form>
        </div>
      </template>
    </MinimizedDialog>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, decodeUserJWT, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "LoginPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    FormFieldPassword: defineAsyncComponent(() =>
      import("src/components/core/form-fields/Password.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    MinimizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
    ),
    AppLogo: defineAsyncComponent(() =>
      import("src/components/core/AppLogo.vue")
    ),
    UermCopyright: defineAsyncComponent(() =>
      import("src/components/UermCopyright.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
  },
  data() {
    return {
      loading: false,
      messageBgColor: "",
      messageTextColor: "",
      messageIcon: "",
      messageText: "",
      username: "",
      password: "",

      forgotPasswordDialogVisible: false,
      forgotPasswordUsername: "",
      forgotPasswordLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      appConfig: "app/config",
    }),
    currentYear() {
      return new Date().getFullYear();
    },
  },
  methods: {
    async submit() {
      this.loading = true;

      const response = await this.$store.dispatch("app/login", {
        username: this.username,
        password: this.password,
      });

      await delay(1000);

      if (response.error) {
        this.messageBgColor = "negative";
        this.messageTextColor = "white";
        this.messageIcon = "error";
        this.messageText = response.body ?? "Error";
        this.loading = false;
        return;
      }

      const user = decodeUserJWT(response.body);
      await this.$store.dispatch("app/setUser", user);

      this.loading = false;
    },
    resetForgotPasswordForm() {
      this.forgotPasswordUsername = "";
    },
    closeForgotPasswordForm() {
      this.resetForgotPasswordForm();
      this.forgotPasswordDialogVisible = false;
    },
    async submitForgotPasswordForm() {
      this.forgotPasswordLoading = true;

      await delay(1000);

      const response = await this.$store.dispatch("app/sendPasswordResetLink", {
        identification: this.forgotPasswordUsername,
      });

      if (response.error) {
        showMessage(this.$q, false, response.body ?? "Error");
      } else {
        this.forgotPasswordDialogVisible = false;
        this.$refs.pwResetQForm.reset();

        showMessage(
          this.$q,
          true,
          "Password reset link has been sent to your email."
        );
      }

      this.forgotPasswordLoading = false;
    },
  },
});
</script>
