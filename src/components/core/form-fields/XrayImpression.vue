<template>
  <q-input
    debounce="750"
    :disable="disable"
    type="textarea"
    stack-label
    outlined
    :rules="[
      (val) =>
        required && (val == null || val === '')
          ? 'This field is required.'
          : undefined,
    ]"
    label-slot
    v-model.trim="value"
    hint=""
  >
    <template v-slot:label>
      {{ label }}
      <span class="text-weight-bold text-red" v-if="required"> *</span>
    </template>
    <template v-slot:append>
      <q-icon
        name="fa-solid fa-book cursor-pointer"
        color="primary"
        @click="templateVisible = true"
      />
    </template>
  </q-input>
  <MinimizedDialog
    v-if="templateVisible"
    title="X-RAY IMPRESSION TEMPLATES"
    widthOnDesktop="600px"
    @close="templateVisible = false"
  >
    <template v-slot:body>
      <div
        class="q-pa-lg"
        style="
          display: flex;
          flex-direction: column;
          max-height: 50vh;
          gap: 16px;
          overflow: hidden auto;
        "
      >
        <div
          v-for="(template, idx) in templates"
          :key="idx"
          flat
          bordered
          class="q-pa-lg my-card cursor-pointer text-primary full-width"
          style="border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 6px"
          @click="
            (val) => {
              value = template;
              templateVisible = false;
            }
          "
        >
          <!-- <q-card-section>
            <div class="text-h6">Our Changing Planet</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </q-card-section>

          <q-separator inset /> -->

          <div class="text-primary">
            {{ template }}
          </div>
        </div>
      </div>
    </template>
  </MinimizedDialog>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

export default defineComponent({
  name: "XrayImpression",
  components: {
    MinimizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
    ),
  },
  props: {
    initialValue: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "User",
    },
  },
  emits: ["valueChanged"],
  data() {
    return {
      value: null,
      templateVisible: false,
      templates: [
        "Present study (PA) again shows clear lung fields.\n\nHeart and great vessels are within normal size configuration.\n\nOther chest structures are not remarkable.\n\n\nIMPRESSION: Normal chest.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      ],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("valueChanged", val);
      },
      immediate: true,
    },
  },
  created() {
    this.value = this.initialValue;
  },
});
</script>
