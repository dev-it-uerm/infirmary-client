<template>
  <div
    class="column items-center text-weight-medium q-px-md cursor-pointer"
    style="padding-top: 16px; padding-bottom: 12px"
    @click="$router.push('/')"
  >
    <div
      class="column"
      :class="inverted ? 'bg-primary' : 'bg-white'"
      :style="{
        borderRadius: dimension.borderRadius,
        padding: dimension.outerPadding,
        gap: dimension.innerPadding,
      }"
    >
      <div class="row" :style="{ gap: dimension.innerPadding }">
        <q-icon
          name="fa-solid fa-heart-pulse"
          :size="dimension.iconSize"
          :color="inverted ? 'white' : 'primary'"
        />
        <q-icon
          name="fa-solid fa-weight-scale"
          :size="dimension.iconSize"
          color="accent"
        />
      </div>
      <div class="row" :style="{ gap: dimension.innerPadding }">
        <q-icon
          name="fa-solid fa-x-ray"
          :size="dimension.iconSize"
          color="accent"
        />
        <q-icon
          name="fa-solid fa-flask"
          :size="dimension.iconSize"
          :color="inverted ? 'white' : 'primary'"
        />
      </div>
    </div>
    <span
      v-if="showTitle"
      :class="
        inverted
          ? 'text-primary ' + 'q-mt-'.concat(size)
          : 'text-white ' + 'q-mt-'.concat(size)
      "
      style="line-height: 1em"
      :style="titleStyle"
    >
      {{ app.name }}
    </span>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { app } from "src/helpers/constants.js";

export default defineComponent({
  name: "AppLogo",
  props: {
    size: {
      type: String,
      default: "sm",
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    inverted: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return { app };
  },
  data() {
    return {
      dimension: {},
      titleClass: "",
      titleStyle: null,
    };
  },
  created() {
    const sizeToDimensionMap = {
      xs: {
        borderRadius: "2px",
        outerPadding: "4px 6px",
        innerPadding: "4px",
        iconSize: "14px",
      },
      sm: {
        borderRadius: "4px",
        outerPadding: "8px 8px",
        innerPadding: "6px",
        iconSize: "20px",
      },
      md: {
        borderRadius: "4px",
        outerPadding: "10px 12px",
        innerPadding: "6px",
        iconSize: "24px",
      },
      lg: {
        borderRadius: "8px",
        outerPadding: "16px 18px",
        innerPadding: "8px",
        iconSize: "26px",
      },
    };

    const sizeToTitleStyleMap = {
      sm: { fontSize: "14px" },
      md: { fontSize: "20px" },
      lg: { fontSize: "24px", textTransform: "uppercase", fontWeight: "bold" },
    };

    this.dimension = sizeToDimensionMap[this.size];
    this.titleStyle = sizeToTitleStyleMap[this.size];
  },
});
</script>
