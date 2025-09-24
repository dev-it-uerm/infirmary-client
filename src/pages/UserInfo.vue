<template>
  <q-page class="flex flex-center q-pa-md">
    <div
      class="column"
      style="gap: 16px"
      :style="{ width: $q.screen.gt.sm ? '420px' : '300px' }"
    >
      <CardComponent>
        <template v-slot:header>
          <PageHeader text="ACCOUNT INFORMATION" icon="fa-solid fa-user-pen" />
        </template>
        <template v-slot:body>
          <FetchingData v-if="loading" />
          <q-form
            ref="qForm"
            @submit="(evt) => (yesNoDialogVisible = true)"
            @reset="reset"
          >
            <q-input
              outlined
              v-model="emailAddress"
              maxlength="255"
              label="Email Address"
              hint=""
            />
            <q-input
              outlined
              v-model="mobileNumber"
              maxlength="255"
              label="Mobile Phone Number"
              :rules="[
                (val) =>
                  val == null || val === ''
                    ? 'This field is required.'
                    : undefined,
              ]"
            />
            <div class="row justify-end">
              <q-btn
                :disable="loading"
                unelevated
                color="accent"
                icon="edit"
                label="UPDATE"
                class="text-black"
                type="submit"
              />
            </div>
          </q-form>
        </template>
      </CardComponent>
    </div>
    <ConfirmationDialog
      v-if="yesNoDialogVisible"
      question="Are you sure you want to update your information?"
      @cancel="(evt) => (yesNoDialogVisible = false)"
      @ok="save"
    />
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage, empty } from "src/helpers/util.js";

export default defineComponent({
  name: "UserInfoPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
  },
  data() {
    return {
      loading: false,
      yesNoDialogVisible: false,
      emailAddress: "",
      mobileNumber: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  created() {
    this.emailAddress = this.user.emailAddress;
    this.mobileNumber = this.user.mobileNumber;
  },
  methods: {
    reset() {
      this.emailAddress = "";
      this.mobileNumber = "";
    },
    async save() {
      this.yesNoDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("app/changeUserInfo", {
        emailAddress: this.emailAddress,
        mobileNumber: this.mobileNumber,
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
        emailAddress: this.emailAddress,
        mobileNumber: this.mobileNumber,
      });

      showMessage(this.$q, true, "Information has been updated successfully.");
      this.loading = false;
    },
  },
});
</script>
