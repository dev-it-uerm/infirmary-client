<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BlankLayout",
});
</script>
