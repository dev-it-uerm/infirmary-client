<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card borderless class="shadow-0">
      <PageHeader text="REGISTRATION" icon="fa-regular fa-id-card" />
      <div style="padding: 32px; width: 450px">
        <ReminderCard :exitable="false" class="q-mb-md">
          <template v-slot:body>
            <div>
              After clicking the <b>GET LINK</b> button, you will receive an
              email to confirm your registration.
            </div>
          </template>
        </ReminderCard>
        <q-form @submit="sendLink">
          <q-input
            :disable="loading"
            outlined
            stack-label
            label="Student ID / Employee No. / Patient No."
            v-model.trim="patientCode"
            :rules="[
              (val) =>
                val == null || val === ''
                  ? 'This field is required.'
                  : undefined,
            ]"
            hint=""
          />
          <div :disable="loading" :loading="loading" class="row justify-end">
            <q-btn
              type="submit"
              :loading="loading"
              unelevated
              class="bg-accent text-black"
              label="SEND LINK"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "RegistrationLinkPage",
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
      patientCode: null,
      loading: false,
    };
  },
  methods: {
    async sendLink() {
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch(
        "visit/sendRegistrationLink",
        this.patientCode
      );

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        return;
      }

      showMessage(this.$q, true, "Email has been sent successfully.");
      this.loading = false;
    },
  },
});
</script>
