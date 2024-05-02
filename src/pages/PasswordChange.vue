<template>
  <q-page class="flex flex-center bg-grey-3">
    <div class="column" style="gap: 12px">
      <!-- <AppLogo version="1" size="md" /> -->
      <q-card borderless class="shadow-0" style="overflow: hidden">
        <div
          style="gap: 20px"
          class="row items-center text-weight-medium text-h6 q-pa-md bg-primary text-white"
        >
          <span class="col">CHANGE PASSWORD</span>
        </div>

        <div class="relative-position">
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
                v-if="user && !token"
                outlined
                v-model="oldPassword"
                label="Old Password"
              />
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
            </div>
            <q-separator />
            <q-card-section class="row justify-end">
              <q-btn
                :disable="loading"
                unelevated
                color="accent"
                label="CHANGE"
                type="submit"
                class="text-black"
              />
            </q-card-section>
          </q-form>
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
  name: "PasswordChange",
  components: {
    // AppLogo: defineAsyncComponent(() => import("src/components/core/AppLogo.vue")),
    FormFieldPassword: defineAsyncComponent(() =>
      import("src/components/core/form-fields/Password.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
  },
  data() {
    return {
      loading: false,
      messageBgColor: "",
      messageTextColor: "",
      messageIcon: "",
      messageText: "",

      oldPassword: "",
      token: "",

      newPassword1: "",
      newPassword2: "",
    };
  },
  watch: {
    "$route.query": {
      handler(val) {
        if (val && val.accessToken) this.token = val.accessToken;
        this.$refs.qForm?.reset();
        this.clearBanner();
      },
      immediate: true,
    },
    token: {
      handler(val) {
        if (val && this.user) return this.$store.dispatch("app/clearUser");
        if (!val && !this.user) this.$router.push("/login");
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  mounted() {
    if (this.user && this.user.requirePasswordChange) {
      this.messageBgColor = "accent";
      this.messageTextColor = "black";
      this.messageIcon = "error";
      this.messageText =
        "It is recommended that you change your temporary password to secure your account.";
    }
  },
  methods: {
    clearBanner() {
      this.messageBgColor = "";
      this.messageTextColor = "";
      this.messageIcon = "";
      this.messageText = "";
    },
    reset() {
      this.oldPassword = "";
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
        newPassword: this.newPassword1,
      };

      if (this.oldPassword) {
        payload.userCode = this.user.code;
        payload.oldPassword = this.oldPassword;
      }

      if (this.token) payload.token = this.token;

      const response = await this.$store.dispatch(
        "app/changePassword",
        payload
      );

      if (response.error) {
        this.showBanner(
          false,
          response.body ?? "Unable to change the password. Please try again."
        );
        this.loading = false;
        return;
      }

      // px-portal/user/change-pw route also logs out the user. Clear the user data from the client.
      await this.$store.dispatch("app/clearUser");
      this.loading = false;
      this.$refs.qForm.reset();

      if (this.token) {
        this.showBanner(
          true,
          response.body ?? "Password has been changed successfully"
        );
        return;
      }

      this.$router.push("/login");
      showMessage(
        this.$q,
        true,
        "Successfully changed password. Please login again."
      );
    },
  },
});
</script>
