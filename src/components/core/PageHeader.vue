<template>
  <q-card
    class="shadow-0 bg-accent full-width q-pa-md"
    style="border-radius: 0; border: 2px solid rgba(0, 0, 0, 0.1)"
  >
    <div
      class="row items-center justify-center text-weight-bold text-h6 text-black text-center text-uppercase"
    >
      <q-icon size="sm" :name="icon" style="margin-right: 12px" />
      <span>{{ text }}</span>
    </div>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageHeader",
  props: {
    icon: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
});
</script>
