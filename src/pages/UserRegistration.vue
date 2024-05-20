<template>
  <q-page class="flex flex-center bg-grey-3">
    <div class="column" style="gap: 16px">
      <q-card borderless class="shadow-0" style="overflow: hidden">
        <PageHeader text="ADD/UPDATE USER" icon="fa-solid fa-user" />
      </q-card>
      <q-card borderless class="shadow-0" style="overflow: hidden">
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
                stack-label
                outlined
                maxlength="255"
                label="Employee Number"
                :rules="[requiredRule]"
                v-model.trim="code"
                hint=""
              />
              <q-select
                stack-label
                outlined
                :options="Object.values(userRolesMap)"
                label="Role"
                emit-value
                map-options
                option-label="name"
                option-value="code"
                :rules="[requiredRule]"
                v-model="roleCode"
                hint=""
              />
              <q-input
                stack-label
                outlined
                maxlength="255"
                label="First Name"
                :rules="[requiredRule]"
                v-model.trim="firstName"
                hint=""
              />
              <q-input
                stack-label
                outlined
                maxlength="255"
                label="Middle Name"
                v-model.trim="middleName"
                hint=""
              />
              <q-input
                stack-label
                outlined
                maxlength="255"
                label="Last Name"
                :rules="[requiredRule]"
                v-model.trim="lastName"
                hint=""
              />
              <q-input
                stack-label
                outlined
                maxlength="255"
                label="Email Address"
                :rules="[requiredRule]"
                v-model.trim="email"
                hint=""
              />
              <q-input
                stack-label
                outlined
                maxlength="255"
                label="Mobile Phone Number"
                :rules="[requiredRule]"
                v-model.trim="mobileNumber"
                hint=""
              />
              <div class="row justify-end">
                <q-btn
                  :disable="loading"
                  unelevated
                  color="primary"
                  label="SAVE"
                  type="submit"
                />
              </div>
            </div>
          </q-form>
        </div>
      </q-card>
    </div>
    <ConfirmationDialog
      v-if="yesNoDialogVisible"
      question="Are you sure you want to add/update this user?"
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
  name: "UserRegistration",
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
  },
  setup() {
    return {
      requiredRule: (val) =>
        val == null || val === "" ? "This field is required." : undefined,
    };
  },
  data() {
    return {
      loading: false,
      yesNoDialogVisible: false,

      code: null,
      roleCode: null,

      firstName: null,
      middleName: null,
      lastName: null,

      email: null,
      mobileNumber: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      userRolesMap: "app/userRolesMap",
    }),
  },
  methods: {
    reset() {
      this.code = null;
      this.roleCode = null;

      this.firstName = null;
      this.middleName = null;
      this.lastName = null;

      this.email = null;
      this.mobileNumber = null;
    },
    async save() {
      this.yesNoDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("app/add", {
        code: this.code,
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,

        roleCode: this.roleCode,

        email: this.email,
        mobileNumber: this.mobileNumber,
      });

      if (response.error) {
        showMessage(
          this.$q,
          false,
          response.body ?? "Unable to save user. Please try again."
        );

        this.loading = false;
        return;
      }

      showMessage(this.$q, true, "User has been saved successfully.");
      this.loading = false;
    },
  },
});
</script>
