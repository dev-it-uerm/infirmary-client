<template>
  <q-card
    class="shadow-0 bg-white full-width"
    style="
      padding: 30px;
      border-radius: 0;
      border: 2px solid rgba(0, 0, 0, 0.1);
    "
  >
    <slot name="body">
      <!-- fallback content -->
    </slot>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CardComponent",
});
</script>
