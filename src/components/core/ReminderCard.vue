<template>
  <q-card class="shadow-0" square>
    <div class="col q-py-md bg-grey-2">
      <div class="row justify-end">
        <q-btn
          class="q-mr-md"
          color="grey-7"
          round
          flat
          dense
          @click="$emit('close')"
        >
          <q-icon style="font-weight: bold" name="close" size="xs" />
        </q-btn>
      </div>
      <div
        class="items-center q-px-lg"
        :class="$q.screen.gt.sm ? 'row' : 'column'"
        style="gap: 18px"
      >
        <q-icon
          :class="$q.screen.gt.sm ? 'col-auto' : 'col-12'"
          size="md"
          name="info"
        />
        <div :class="$q.screen.gt.sm ? 'col' : 'col-12'">
          <p
            class="text-weight-bold"
            :class="$q.screen.gt.sm ? '' : 'text-center'"
            style="font-size: 16px; letter-spacing: 0.2px"
          >
            {{ title }}
          </p>
          <p
            v-for="(paragraph, idx) in paragraphs"
            :key="idx"
            :class="$q.screen.gt.sm ? '' : 'text-justify'"
          >
            {{ paragraph }}
          </p>
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
    title: {
      type: String,
      required: true,
    },
    paragraphs: {
      type: Array,
      required: true,
    },
  },
});
</script>
