<template>
  <div class="text-primary column items-center text-center">
    <div class="column items-center text-weight-bold">
      <q-img
        no-native-menu
        src="public/uerm-logo.png"
        alt="UERM Logo"
        class="img-fluid q-mx-sm"
        style="height: 24px; width: 24px"
      />
      <span>UERMMMCI</span>
    </div>
    <q-separator class="q-my-sm" style="width: 100px" />
    <span class="text-weight-bold">
      Copyright &#169; {{ currentYear }}. All Rights Reserved.
    </span>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UermCopyright",
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
});
</script>
