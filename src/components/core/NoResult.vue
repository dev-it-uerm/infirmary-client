<template>
  <div
    class="full-width"
    :style="bordered ? 'border: 1px solid rgba(0, 0, 0, 0.12)' : ''"
  >
    <div class="full-width q-pa-md column items-center">
      <q-icon :name="iconName" size="1.25em" color="grey-6" />
      <span class="text-grey-7" style="font-size: 13px">{{ message }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "NoResult",
  props: {
    message: {
      type: String,
      default: "No result.",
    },
    iconName: {
      type: String,
      default: "fa fa-sad-cry",
    },
    bordered: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
