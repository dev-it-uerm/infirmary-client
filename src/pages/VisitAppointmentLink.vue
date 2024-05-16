<template>
  <q-page class="flex flex-center bg-grey-3">
    <div class="column" style="gap: 16px">
      <q-card borderless class="shadow-0">
        <PageHeader text="VISIT APPOINTMENT" icon="fa-regular fa-id-card" />
      </q-card>
      <q-card borderless class="shadow-0" style="padding: 32px; width: 450px">
        <ReminderCard :exitable="false" class="q-mb-md">
          <template v-slot:body>
            <div>
              After clicking the <b>SCHEDULE A VISIT</b> button, you will
              receive an email to confirm your visit.
            </div>
          </template>
        </ReminderCard>
        <q-form @submit="sendLink">
          <q-input
            :disable="loading"
            outlined
            stack-label
            label="Student No. / Employee No. / Patient No."
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
              color="primary"
              label="SCHEDULE A VISIT"
            />
          </div>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "VisitAppointmentLink",
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
        "visit/sendVisitAppointmentLink",
        this.patientCode
      );

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        return;
      }

      showMessage(
        this.$q,
        true,
        "A Link to schedule a visit has been sent to your email."
      );
      this.loading = false;
    },
  },
});
</script>
