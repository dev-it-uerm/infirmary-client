<template>
  <div>
    <q-input
      v-bind="$attrs"
      debounce="750"
      type="textarea"
      stack-label
      outlined
      :rules="[
        (val) =>
          $attrs.required && (val == null || val === '')
            ? 'This field is required.'
            : true,
      ]"
      label-slot
      v-model="impression"
      hint=""
    >
      <template v-slot:label>
        {{ $attrs.label || "Impression" }}
        <span v-if="$attrs.required" class="text-weight-bold text-red"> *</span>
      </template>
      <template v-slot:append>
        <q-icon
          name="fa-solid fa-book cursor-pointer"
          color="primary"
          @click="getTemplates"
        />
      </template>
    </q-input>
    <q-select
      stack-label
      outlined
      label-slot
      :options="['NORMAL', 'ABNORMAL']"
      :rules="[(v) => (!v ? 'This field is required.' : true)]"
      v-model="impressionFlag"
    >
      <template v-slot:label>
        Impression Flag
        <span v-if="$attrs.required" class="text-weight-bold text-red"> *</span>
      </template>
    </q-select>
    <MinimizedDialog
      v-if="templateVisible"
      title="CHEST X-RAY IMPRESSION TEMPLATES"
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
            v-for="(t, idx) in templates"
            :key="idx"
            flat
            bordered
            class="q-pa-lg my-card cursor-pointer text-primary full-width"
            style="
              border: 1px solid rgba(0, 0, 0, 0.15);
              border-radius: 6px;
              white-space: pre;
            "
            @click="
              () => {
                impression = t.impression;
                templateVisible = false;
              }
            "
          >
            <div class="text-primary">{{ t.impression }}</div>
          </div>
        </div>
      </template>
    </MinimizedDialog>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay } from "src/helpers/util.js";

export default defineComponent({
  name: "FormFieldChestXrayImpression",
  inheritAttrs: false,
  components: {
    MinimizedDialog: defineAsyncComponent(
      () => import("src/components/core/MinimizedDialog.vue"),
    ),
  },
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      impression: null,
      impressionFlag: "NORMAL",

      templateVisible: false,
      templateLoading: false,
      templates: [],
    };
  },
  computed: {
    value() {
      return {
        value: this.impression,
        flag: this.impressionFlag,
      };
    },
  },
  watch: {
    value: {
      handler(v) {
        if (
          this.modelValue?.value === v?.value &&
          this.modelValue?.flag === v?.flag
        ) {
          return;
        }

        this.$emit("update:modelValue", v);
      },
      immediate: true,
    },
  },
  methods: {
    async getTemplates() {
      this.templates = [];
      this.templateVisible = true;
      this.templateLoading = true;

      const response = await this.$store.dispatch(
        "ape/getXrayChestResultTemplates",
      );
      await delay(1000);

      if (response.error) {
        this.templateLoading = false;
        return;
      }

      this.templates = response.body;
      this.templateLoading = false;
    },
  },
  created() {
    if (this.modelValue?.value) {
      this.impression = this.modelValue.value;
    }

    if (this.modelValue?.flag) {
      this.impressionFlag = this.modelValue.flag;
    }
  },
});
</script>
