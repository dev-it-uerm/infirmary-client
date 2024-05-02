<template>
  <div
    class="column items-center text-weight-medium q-px-md cursor-pointer"
    style="padding-top: 16px; padding-bottom: 12px"
    @click="$router.push('/')"
  >
    <q-img
      no-native-menu
      :src="source"
      alt="UERM PxPortal Logo"
      class="img-fluid"
      :style="dimension"
    />
    <span
      v-if="showTitle"
      class="q-mt-sm"
      :class="titleClass"
      style="line-height: 1em"
      :style="titleStyle"
    >
      {{ appConfig.name }}
    </span>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

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
    version: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      source: "",
      titleClass: "",
      titleStyle: null,
    };
  },
  computed: {
    ...mapGetters({
      appConfig: "app/config",
    }),
  },
  created() {
    const sizeToDimensionMap = {
      xs: { height: "30px", width: "53px" },
      sm: { height: "50px", width: "88px" },
      md: { height: "100px", width: "173px" },
      lg: { height: "200px", width: "350px" },
    };

    const versionToTitleClassMap = {
      1: "text-primary",
      2: "text-white",
    };

    const sizeToTitleStyleMap = {
      sm: { fontSize: "14px" },
      md: { fontSize: "20px" },
      lg: { fontSize: "24px", textTransform: "uppercase", fontWeight: "bold" },
    };

    this.source = `logo-v${this.version}-${this.size}.png`;
    this.dimension = sizeToDimensionMap[this.size];
    this.titleClass = versionToTitleClassMap[this.version];
    this.titleStyle = sizeToTitleStyleMap[this.size];
  },
});
</script>
