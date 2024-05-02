<template>
  <q-select
    dense
    style="min-width: 200px"
    stack-label
    outlined
    label-slot
    emit-value
    map-options
    option-label="name"
    option-value="code"
    :options="qSelectOptions"
    :disable="disabled || loading"
    v-model="value"
  >
    <template v-slot:label>
      Diagnostic
      <span class="text-weight-bold text-red" v-if="required"> *</span>
    </template>
  </q-select>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { delay } from "src/helpers/util.js";

export default defineComponent({
  name: "FormFieldDiagSelect",
  props: {
    diagTypeCode: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    initialValue: {
      type: Array,
      default: null,
    },
  },
  emits: ["busy", "ready", "valueChanged"],
  data() {
    return {
      loading: false,
      value: "ALL",
      diags: [],
    };
  },
  computed: {
    ...mapGetters({
      diagnostics: "app/diagnostics",
    }),
    qSelectOptions() {
      return [{ code: "ALL", name: "ALL" }, ...this.diags];
    },
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("valueChanged", val);
      },
      immediate: true,
    },
  },
  async mounted() {
    this.$emit("busy");
    this.loading = true;

    await delay(750);
    await this.$store.dispatch("app/getDiagnostics");

    this.diags = this.diagnostics.filter((diag) => {
      return diag.typeCode === this.diagTypeCode;
    });

    this.loading = false;
    this.$emit("ready");
  },
});
</script>
