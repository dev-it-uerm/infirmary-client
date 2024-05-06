<template>
  <div
    class="row items-center justify-center text-weight-bold text-h6 q-pa-md bg-accent text-black text-center text-uppercase"
  >
    <q-icon size="sm" :name="icon" style="margin-right: 12px" />
    <span>{{ text }}</span>
  </div>
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
