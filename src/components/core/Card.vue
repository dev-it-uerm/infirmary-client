<template>
  <div
    class="bg-white full-width"
    style="border: 2px solid rgba(0, 0, 0, 0.1)"
    :style="{ padding: padded ? '30px' : '0' }"
  >
    <slot name="body">
      <!-- fallback content -->
    </slot>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CardComponent",
  props: {
    padded: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
