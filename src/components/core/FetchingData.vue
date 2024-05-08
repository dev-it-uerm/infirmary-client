<template>
  <div
    class="absolute fit bg-white flex flex-center"
    style="z-index: 999; opacity: 0.8"
  >
    <q-spinner-cube color="black" size="md" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FetchingData",
});
</script>
