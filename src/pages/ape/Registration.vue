<template>
  <q-page class="flex flex-center q-pa-md">
    <div style="width: 500px">
      <CardComponent>
        <template v-slot:header>
          <PageHeader text="TRIAGE" icon="fa-solid fa-list-check" />
        </template>
        <template v-slot:body>
          <!-- @busy="loading = true"
          @ready="loading = false" -->
          <VisitPageAttendance scannerId="REGISTRATION_PAGE__qrCodeScanner" />
        </template>
      </CardComponent>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "RegistrationPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // ReminderCard: defineAsyncComponent(() =>
    //   import("src/components/core/ReminderCard.vue")
    // ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    VisitPageAttendance: defineAsyncComponent(() =>
      import("src/components/visit-page/Attendance.vue")
    ),
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
});
</script>
