<template>
  <q-page class="flex flex-center q-pa-md">
    <div class="column" style="gap: 16px; width: 400px">
      <PageHeader text="VISIT APPOINTMENT" icon="fa-regular fa-id-card" />
      <CardComponent>
        <template v-slot:body>
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
              :disable="loading"
              stack-label
              outlined
              :options="campuses"
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
              :disable="loading"
              stack-label
              outlined
              :options="affiliations"
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
        </template>
      </CardComponent>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay, showMessage } from "src/helpers/util.js";
import { mapGetters } from "vuex";

import {
  EXAMS,
  examsMap,
  exams,
  CAMPUSES,
  campusesMap,
  campuses,
  COLLEGES,
  collegesMap,
  colleges,
  YEAR_LEVELS,
  yearLevelsMap,
  yearLevels,
  AFFILIATIONS,
  affiliationsMap,
  affiliations,
  USER_ROLES,
  userRolesMap,
  userRoles,
  DEPARTMENTS,
  departmentsMap,
  departments,
  examFieldsMap,
} from "src/helpers/constants.js";

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
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
  },
  setup() {
    return {
      EXAMS,
      examsMap,
      exams,
      CAMPUSES,
      campusesMap,
      campuses,
      COLLEGES,
      collegesMap,
      colleges,
      YEAR_LEVELS,
      yearLevelsMap,
      yearLevels,
      AFFILIATIONS,
      affiliationsMap,
      affiliations,
      USER_ROLES,
      userRolesMap,
      userRoles,
      DEPARTMENTS,
      departmentsMap,
      departments,
      examFieldsMap,
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
    }),
  },
  methods: {
    async sendLink() {
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch(
        "ape/sendVisitAppointmentLink",
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
