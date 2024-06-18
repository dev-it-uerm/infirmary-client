<template>
  <q-page class="flex flex-center">
    <div class="column">
      <AppLogo :inverted="true" size="lg" />
      <!-- <UermCopyright class="q-mt-xl" /> -->
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "MainPage",
  components: {
    AppLogo: defineAsyncComponent(() =>
      import("src/components/core/AppLogo.vue")
    ),
    // UermCopyright: defineAsyncComponent(() =>
    //   import("src/components/UermCopyright.vue")
    // ),
  },
});
</script>
