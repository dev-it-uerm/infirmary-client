<template>
  <q-card class="shadow-0" square>
    <div
      class="column items-center bg-grey-2 q-px-lg"
      :class="exitable ? 'q-pt-lg q-pb-xl' : 'q-py-lg'"
    >
      <div :class="$q.screen.gt.sm ? 'col' : 'col-12'">
        <div v-if="exitable" class="row justify-end">
          <q-btn color="grey-7" round flat dense @click="$emit('close')">
            <q-icon style="font-weight: bold" name="close" size="xs" />
          </q-btn>
        </div>

        <div class="column">
          <div v-if="title" class="row items-center q-pb-md">
            <q-icon v-if="!hideIcon" class="q-mr-sm" size="xs" name="info" />
            <span
              class="col text-weight-bold"
              :class="$q.screen.gt.sm ? '' : 'text-center'"
              style="font-size: 16px; letter-spacing: 0.2px"
            >
              {{ title }}
            </span>
          </div>
          <slot name="body">
            <!-- fallback content -->
          </slot>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ReminderCard",
  props: {
    exitable: {
      type: Boolean,
      default: true,
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
});
</script>
