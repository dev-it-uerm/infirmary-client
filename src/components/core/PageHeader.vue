<template>
  <div class="row justify-center q-pa-md bg-accent">
    <div class="row items-center">
      <q-icon :name="icon" size="md" class="col-auto q-mr-md" />
      <div class="col text-h5 text-weight-bold">
        {{ text }}
      </div>
    </div>
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
