<template>
  <q-page class="flex flex-center bg-grey-3">
    <div class="column" style="gap: 12px">
      <q-card borderless class="shadow-0" style="overflow: hidden">
        <div
          style="gap: 20px"
          class="row items-center text-weight-medium text-h6 q-pa-md bg-primary text-white"
        >
          <span class="col">CHANGE INFORMATION</span>
        </div>

        <div class="relative-position">
          <FetchingData v-if="loading" />
          <q-form
            ref="qForm"
            style="min-height: 200px"
            :style="{ width: $q.screen.gt.sm ? '420px' : '300px' }"
            @submit="(evt) => (yesNoDialogVisible = true)"
            @reset="reset"
          >
            <div style="padding: 32px">
              <q-input
                outlined
                v-model="email"
                maxlength="255"
                label="Email Address"
                hint=""
              />
              <q-input
                outlined
                v-model="mobileNo"
                maxlength="255"
                label="Mobile Phone Number"
                :rules="[
                  (val) =>
                    val == null || val === ''
                      ? 'This field is required.'
                      : undefined,
                ]"
              />
            </div>
            <q-separator />
            <q-card-section class="row justify-end">
              <q-btn
                :disable="loading"
                unelevated
                color="accent"
                label="UPDATE"
                type="submit"
                class="text-black"
              />
            </q-card-section>
          </q-form>
        </div>
      </q-card>
      <ConfirmationDialog
        v-if="yesNoDialogVisible"
        question="Are you sure you want to update your information?"
        @cancel="(evt) => (yesNoDialogVisible = false)"
        @ok="save"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage, empty } from "src/helpers/util.js";

export default defineComponent({
  name: "UserInfoPage",
  components: {
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
  },
  data() {
    return {
      loading: false,
      yesNoDialogVisible: false,
      email: "",
      mobileNo: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  created() {
    this.email = this.user.email;
    this.mobileNo = this.user.mobileNo;
  },
  methods: {
    reset() {
      this.email = "";
      this.mobileNo = "";
    },
    async save() {
      this.yesNoDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("app/changeUserInfo", {
        email: this.email,
        mobileNo: this.mobileNo,
      });

      if (response.error) {
        showMessage(
          this.$q,
          false,
          response.body ?? "Unable to change information. Please try again."
        );
        this.loading = false;
        return;
      }

      await this.$store.dispatch("app/setUser", {
        ...this.user,
        email: this.email,
        mobileNo: this.mobileNo,
      });

      showMessage(this.$q, true, "Information has been updated successfully.");
      this.loading = false;
    },
  },
});
</script>
