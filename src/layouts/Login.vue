<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "LoginLayout",
  components: {
    MinimizedComponent: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
    ),
  },
});
</script>
