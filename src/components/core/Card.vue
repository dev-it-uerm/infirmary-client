<template>
  <div class="bg-white full-width" style="border-radius: 6px; overflow: hidden">
    <slot name="header">
      <!-- fallback content -->
    </slot>
    <div :class="padded ? ($q.screen.gt.md ? 'q-pa-xl' : 'q-pa-lg') : ''">
      <slot name="body">
        <!-- fallback content -->
      </slot>
    </div>
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
