<template>
  <div class="full-width q-pa-md" :class="outerDivClasses">
    <div class="row items-center justify-center" :class="innerDivClasses">
      <q-icon
        v-if="icon"
        size="sm"
        :name="icon"
        :color="colorInverted ? 'primary' : 'white'"
        style="margin-right: 12px"
      />
      <span
        class="text-weight-bold text-h6 text-center text-uppercase"
        style="letter-spacing: 1pt"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageHeader",
  props: {
    colorInverted: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: true,
    },
  },
  computed: {
    outerDivClasses() {
      return [this.colorInverted ? "bg-white" : "bg-primary"];
    },
    innerDivClasses() {
      return [this.colorInverted ? "text-primary" : "text-white"];
    },
  },
});
</script>
