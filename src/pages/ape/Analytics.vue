<template>
  <q-page :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
    <CardComponent class="full-width">
      <template v-slot:header>
        <PageHeader text="ANALYTICS" icon="fa-solid fa-chart-pie" />
      </template>
      <template v-slot:body>
        <q-tabs
          v-model="tab"
          inline-label
          outside-arrows
          mobile-arrows
          class="text-primary"
        >
          <q-tab name="patientsRegistered" label="Patients Registered" />
          <q-tab name="patientsSeen" label="Patients Seen by Doctors" />
          <q-tab name="doctorPatients" label="Doctor Patients" />
        </q-tabs>
        <q-tab-panels
          class="full-width"
          animated
          swipeable
          transition-prev="jump-up"
          transition-next="jump-up"
          v-model="tab"
        >
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="patientsRegistered"
          >
            <PatientsRegistered />
          </q-tab-panel>
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="patientsSeen"
          >
            <PatientsSeen />
          </q-tab-panel>
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="doctorPatients"
          >
            <DoctorPatients />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </CardComponent>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
// import ApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "AnalyticsPage",
  components: {
    // ApexCharts,
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    PatientsRegistered: defineAsyncComponent(() =>
      import("src/components/analytics-page/PatientsRegistered.vue")
    ),
    PatientsSeen: defineAsyncComponent(() =>
      import("src/components/analytics-page/PatientsSeen.vue")
    ),
    DoctorPatients: defineAsyncComponent(() =>
      import("src/components/analytics-page/DoctorPatients.vue")
    ),
  },
  data() {
    return {
      tab: "patientsRegistered",

      // chartOptions: {
      //   chart: {
      //     type: "bar",
      //     height: 350,
      //   },
      //   plotOptions: {
      //     bar: {
      //       borderRadius: 4,
      //       horizontal: true,
      //     },
      //   },
      //   dataLabels: {
      //     enabled: false,
      //   },
      //   xaxis: {
      //     categories: [],
      //     tickAmount: 1, // minimum x points
      //     labels: {
      //       formatter: (val) => {
      //         return val.toFixed(0);
      //       },
      //     },
      //   },
      //   tooltip: {
      //     y: {
      //       formatter: (val) => {
      //         return val.toFixed(0);
      //       },
      //     },
      //   },
      //   fill: { colors: ["#ffd600"] },
      // },
      // chartSeries: [{ data: [] }],

      // chartDataReady: null,
    };
  },
});
</script>
