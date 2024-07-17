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
    v-model="value"
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
        @click="getTemplates"
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
        <div v-if="templateLoading" class="row justify-center">
          <q-spinner color="primary" size="md" />
        </div>
        <div
          v-else
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
import { delay } from "src/helpers/util.js";

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
      templateLoading: false,
      templates: [],
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
  methods: {
    async getTemplates() {
      this.templates = [];
      this.templateVisible = true;
      this.templateLoading = true;

      const response = await this.$store.dispatch(
        "app/getXrayChestResultTemplates"
      );
      await delay(2000);

      if (response.error) {
        this.templateLoading = false;
        return;
      }

      this.templates = response.body.map((t) => t.impression);
      this.templateLoading = false;
    },
  },
});
</script>
