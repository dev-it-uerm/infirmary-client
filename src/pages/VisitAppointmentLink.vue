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
          <q-select
            stack-label
            outlined
            :options="Object.values(campusesMap)"
            label="Campus"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            :rules="[requiredRule]"
            v-model="campusCode"
            hint=""
          />
          <q-select
            stack-label
            outlined
            :options="Object.values(affiliationsMap)"
            label="Affiliation"
            emit-value
            map-options
            option-label="name"
            option-value="code"
            :rules="[requiredRule]"
            v-model="affiliationCode"
            hint=""
          />
          <q-input
            :disable="loading"
            outlined
            stack-label
            label="Student No. / Employee No."
            v-model.trim="identificationCode"
            :rules="[requiredRule]"
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
import { mapGetters } from "vuex";

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
  setup() {
    return {
      requiredRule: (val) =>
        val == null || val === "" ? "This field is required." : undefined,
    };
  },
  data() {
    return {
      affiliationCode: "STU",
      campusCode: "MNL",
      identificationCode: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      campusesMap: "app/campusesMap",
      affiliationsMap: "app/affiliationsMap",
    }),
  },
  methods: {
    async sendLink() {
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch(
        "visit/sendVisitAppointmentLink",
        {
          campusCode: this.campusCode,
          affiliationCode: this.affiliationCode,
          identificationCode: this.identificationCode,
        }
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
