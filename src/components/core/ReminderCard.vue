<template>
  <!-- :class="exitable ? 'q-pt-lg q-pb-xl' : 'q-py-lg'" -->
  <div
    class="column items-center q-pa-md full-width"
    :style="bordered ? { border: '1px solid rgba(0, 0, 0, 0.3)' } : {}"
  >
    <div :class="$q.screen.gt.sm ? 'col' : 'col-12'">
      <!-- <div v-if="exitable" class="row justify-end">
        <q-btn color="grey-7" round flat dense @click="$emit('close')">
          <q-icon style="font-weight: bold" name="close" size="xs" />
        </q-btn>
      </div> -->
      <div class="column text-center items-center">
        <div class="column items-center q-mb-sm text-weight-medium">
          <q-icon
            v-if="iconName"
            :size="iconSize"
            :name="iconName"
            :color="iconColor"
          />
          <span v-if="title" style="letter-spacing: 0.2px">
            {{ title }}
          </span>
        </div>
        <slot name="body">
          <!-- fallback content -->
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ReminderCard",
  props: {
    // exitable: {
    //   type: Boolean,
    //   default: true,
    // },
    bordered: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String,
      default: "info",
    },
    iconColor: {
      type: String,
      default: "black",
    },
    iconSize: {
      type: String,
      default: "sm",
    },
    title: {
      type: String,
      default: "",
    },
  },
  // emits: ["close"],
});
</script>
