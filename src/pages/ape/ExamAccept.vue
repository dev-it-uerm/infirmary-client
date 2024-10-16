<template>
  <q-page class="flex flex-center q-pa-xl">
    <div
      class="column"
      style="gap: 16px"
      :style="{ width: $q.screen.lt.md ? '100%' : '500px' }"
    >
      <CardComponent>
        <template v-slot:header>
          <PageHeader text="RECEIVE PATIENT" icon="fa-solid fa-door-open" />
        </template>
        <template v-slot:body>
          <ExamAccept scannerId="qrCodeScanner__exam-accept_page" />
        </template>
      </CardComponent>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "ExamAcceptPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    CardComponent: defineAsyncComponent(() =>
      import("src/components/core/Card.vue")
    ),
    ExamAccept: defineAsyncComponent(() =>
      import("src/components/ExamAccept.vue")
    ),
  },
  mounted() {
    this.$store.dispatch("ape/getAppData");
  },
});
</script>
