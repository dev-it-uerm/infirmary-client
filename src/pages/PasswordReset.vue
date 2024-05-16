<template>
  <q-page class="flex flex-center bg-grey-3">
    <div class="column" style="gap: 16px; min-width: 400px">
      <AppLogo :inverted="true" size="sm" />
      <q-card borderless class="shadow-0" style="overflow: hidden">
        <PageHeader text="RESET PASSWORD" icon="fa-solid fa-user" />
      </q-card>
      <q-card borderless class="shadow-0" style="overflow: hidden">
        <div class="relative-position">
          <div v-if="!$route.query.accessToken" class="q-pa-lg">
            <MessageBanner :success="false">
              <template v-slot:body class="q-pa-lg">
                <div>Access token in URL query is required.</div>
              </template>
            </MessageBanner>
          </div>
          <template v-else>
            <FetchingData v-if="loading" />
            <q-form
              style="min-height: 200px"
              :style="{ width: $q.screen.gt.sm ? '420px' : '300px' }"
              ref="qForm"
              @submit="submit"
              @reset="reset"
            >
              <div style="padding: 32px">
                <q-banner
                  v-if="messageText"
                  class="q-pa-md"
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
                <FormFieldPassword
                  outlined
                  v-model="newPassword1"
                  label="New Password"
                />
                <FormFieldPassword
                  outlined
                  v-model="newPassword2"
                  label="New Password Confirmation"
                />
                <div class="row justify-end">
                  <q-btn
                    :disable="loading"
                    unelevated
                    color="primary"
                    label="CHANGE"
                    type="submit"
                  />
                </div>
              </div>
            </q-form>
          </template>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "PasswordReset",
  components: {
    AppLogo: defineAsyncComponent(() =>
      import("src/components/core/AppLogo.vue")
    ),
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    FormFieldPassword: defineAsyncComponent(() =>
      import("src/components/core/form-fields/Password.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    MessageBanner: defineAsyncComponent(() =>
      import("src/components/core/MessageBanner.vue")
    ),
  },
  data() {
    return {
      loading: false,
      messageBgColor: "grey-3",
      messageTextColor: "black",
      messageIcon: "error",
      messageText:
        "Please assign a new password which is at least 8 characters, containing lowercase and uppercase letters, numbers and special characters.",

      newPassword1: "",
      newPassword2: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  methods: {
    clearBanner() {
      this.messageBgColor = "";
      this.messageTextColor = "";
      this.messageIcon = "";
      this.messageText = "";
    },
    reset() {
      this.newPassword1 = "";
      this.newPassword2 = "";
    },
    showBanner(successful, message) {
      this.messageBgColor = successful ? "positive" : "negative";
      this.messageTextColor = "white";
      this.messageIcon = successful ? "info" : "error";
      this.messageText = message;
    },
    async submit() {
      if (this.newPassword1 !== this.newPassword2) {
        this.showBanner(
          false,
          "New Password and New Password Confirmation do not match."
        );
        return;
      }

      const pwIsStrong =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
          this.newPassword1
        );

      if (!pwIsStrong) {
        this.showBanner(
          false,
          "New password must be at least 8 characters, containing lowercase and uppercase letters, numbers and special characters."
        );
        return;
      }

      this.loading = true;
      await delay(2000);

      const payload = {
        accessToken: this.$route.query.accessToken,
        newPassword: this.newPassword1,
      };

      const response = await this.$store.dispatch("app/resetPassword", payload);

      if (response.error) {
        this.showBanner(
          false,
          response.body ?? "Unable to change the password. Please try again."
        );
        this.loading = false;
        return;
      }

      this.loading = false;
      this.$refs.qForm.reset();

      this.showBanner(true, "Password has been reset successfully.");
      return;
    },
  },
});
</script>
