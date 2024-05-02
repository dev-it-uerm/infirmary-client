<template>
  <q-dialog :model-value="true" persistent maximized>
    <div
      style="
        display: grid;
        grid-template-rows: min-content auto;
        height: 100vh;
        width: 100vw;
      "
    >
      <!-- style="gap: 20px" -->
      <div class="bg-primary row items-center q-py-md q-pl-lg q-pr-md">
        <div
          class="col row ellipsis text-uppercase text-weight-medium text-h6 text-white"
        >
          <slot name="header">
            <!-- fallback content -->
            <div class="q-pr-md">{{ title }}</div>
          </slot>
        </div>
        <div v-if="!hideExitButton" class="col-auto cursor-pointer">
          <q-btn
            :disable="loading"
            color="white"
            round
            flat
            dense
            @click="
              () => {
                $emit('close');
              }
            "
          >
            <q-icon style="font-weight: bold" name="close" size="xs" />
          </q-btn>
        </div>
      </div>
      <slot name="body">
        <!-- fallback content -->
      </slot>
    </div>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MaximizedDialog",
  components: {},
  props: {
    title: {
      type: String,
      required: true,
    },
    hideExitButton: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  computed: {},
});
</script>
