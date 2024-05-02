<template>
  <MinimizedDialog
    title="CONFIRMATION"
    widthOnDesktop="400px"
    @close="(evt) => $emit('cancel')"
  >
    <template v-slot:body>
      <div class="text-black q-pa-lg">{{ question }}</div>
      <q-separator />
      <q-card-section class="row justify-end">
        <q-btn
          flat
          :label="cancelBtnLabel"
          class="text-black q-mr-sm"
          @click="(evt) => $emit('cancel')"
        />
        <q-btn
          unelevated
          color="accent"
          :label="okBtnLabel"
          class="text-black"
          @click="(evt) => $emit('ok')"
        />
      </q-card-section>
    </template>
  </MinimizedDialog>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "ConfirmationDialog",
  components: {
    MinimizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
    ),
  },
  props: {
    question: {
      type: String,
      default: "Are you sure?",
    },
    okBtnLabel: {
      type: String,
      default: "OK",
    },
    cancelBtnLabel: {
      type: String,
      default: "CANCEL",
    },
  },
  emits: ["ok", "cancel"],
});
</script>
