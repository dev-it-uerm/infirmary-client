<template>
  <q-dialog :model-value="true" persistent>
    <!-- max-width of div inside a q-dialog is set to 560px by default -->
    <q-card borderless class="shadow-0" style="overflow: hidden" :style="style">
      <div
        style="gap: 20px"
        class="row items-center text-uppercase text-weight-medium text-h6 q-py-md q-pl-lg q-pr-md"
      >
        <span class="col ellipsis">{{ title }}</span>
        <div v-if="!hideExitButton" class="col-auto cursor-pointer">
          <q-btn
            :disable="loading"
            color="grey-7"
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

      <q-separator />

      <slot name="header"></slot>

      <slot name="body">
        <!-- fallback content -->
      </slot>

      <slot name="footer"></slot>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MinimizedDialog",
  components: {},
  props: {
    title: {
      type: String,
      required: true,
    },
    /* Add/Set widthOnDesktop to override the default max-width of div inside a q-dialog */
    widthOnDesktop: {
      type: String,
      default: "auto",
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
  computed: {
    style() {
      if (this.widthOnDesktop !== "auto" && this.$q.screen.gt.sm)
        return {
          minWidth: this.widthOnDesktop + " !important",
          maxWidth: this.widthOnDesktop + " !important",
          width: this.widthOnDesktop + " !important",
        };

      return {};
    },
  },
});
</script>
