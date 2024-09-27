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
          <q-tab
            name="registeredPatientCount"
            label="Registered Patient Count"
          />
          <q-tab
            name="seenNotSeenPatientCount"
            label="Seen/Not Seen Patient Count"
          />
          <q-tab name="notSeenPatientNames" label="Not Seen Patients" />
          <q-tab name="xraysRead" label="Xrays Read Count" />
          <q-tab name="doctorPatientCount" label="Doctor Patient Count" />
          <q-tab name="patientVisitProgress" label="Patient Visit Progress" />
        </q-tabs>
        <q-tab-panels
          class="full-width"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
          v-model="tab"
        >
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="registeredPatientCount"
          >
            <RegisteredPatientCount />
          </q-tab-panel>
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="seenNotSeenPatientCount"
          >
            <SeenNotSeenPxCount />
          </q-tab-panel>
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="notSeenPatientNames"
          >
            <NotSeenPatients />
          </q-tab-panel>
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="xraysRead"
          >
            <DoctorXraysReadCount />
          </q-tab-panel>
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="doctorPatientCount"
          >
            <DoctorPatientCount />
          </q-tab-panel>
          <q-tab-panel
            class="full-width q-pa-none q-pt-xl no-scroll"
            name="patientVisitProgress"
          >
            <PatientVisitProgress />
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
    RegisteredPatientCount: defineAsyncComponent(() =>
      import("src/components/analytics-page/RegisteredPatientCount.vue")
    ),
    SeenNotSeenPxCount: defineAsyncComponent(() =>
      import("src/components/analytics-page/SeenNotSeenPxCount.vue")
    ),
    NotSeenPatients: defineAsyncComponent(() =>
      import("src/components/analytics-page/NotSeenPatients.vue")
    ),
    DoctorXraysReadCount: defineAsyncComponent(() =>
      import("src/components/analytics-page/DoctorXraysReadCount.vue")
    ),
    DoctorPatientCount: defineAsyncComponent(() =>
      import("src/components/analytics-page/DoctorPatientCount.vue")
    ),
    PatientVisitProgress: defineAsyncComponent(() =>
      import("src/components/analytics-page/PatientVisitProgress.vue")
    ),
  },
  data() {
    return {
      tab: "registeredPatientCount",

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
