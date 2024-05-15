<template>
  <div
    class="column q-pa-lg"
    :class="success ? 'text-positive' : 'text-negative'"
    style="border-radius: 4px"
    :style="{
      border: success
        ? '1px solid rgba(0, 128, 0, 0.2)'
        : '1px solid rgba(210, 43, 43, 0.4)',
    }"
  >
    <div class="row justify-center q-mb-md">
      <q-icon
        size="md"
        :name="success ? successIconName : errorIconName"
        :color="success ? 'positive' : 'negative'"
      />
    </div>
    <div class="text-center">
      <div class="column items-center" style="gap: 12px">
        <slot name="body">
          <div>{{ success ? "Success" : "Error" }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageBanner",
  props: {
    success: {
      type: Boolean,
      default: true,
    },
    successIconName: {
      type: String,
      default: "fa-solid fa-circle-check",
    },
    errorIconName: {
      type: String,
      default: "fa-solid fa-circle-xmark",
    },
  },
});
</script>
