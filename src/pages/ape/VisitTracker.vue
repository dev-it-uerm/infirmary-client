<template>
  <q-page class="flex flex-center q-pa-xl">
    <div
      class="column"
      style="gap: 16px"
      :style="{ width: $q.screen.lt.md ? '100%' : '500px' }"
    >
      <CardComponent>
        <template v-slot:header>
          <PageHeader
            text="VISIT TRACKER"
            icon="fa-solid fa-magnifying-glass"
          />
        </template>
        <template v-slot:body>
          <VisitTracker scannerId="qrCodeScanner__visit-tracker_page" />
        </template>
      </CardComponent>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "VisitTrackerPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    VisitTracker: defineAsyncComponent(() =>
      import("src/components/VisitTracker.vue")
    ),
  },
});
</script>
