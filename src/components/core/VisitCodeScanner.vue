<template>
  <div>
    <div
      class="q-pa-xs q-mb-md"
      style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 4px"
    >
      <q-toggle
        :disable="loading"
        true-value="QR"
        false-value="MANUAL"
        class="text-overline"
        v-model="inputMode"
        :label="
          inputMode === 'QR'
            ? 'SCAN VISIT QR CODE'
            : 'ENTER VISIT CODE MANUALLY'
        "
      />
    </div>
    <div v-show="inputMode === 'QR'" id="divQRCodeScanner" width="600px"></div>
    <q-input
      v-if="inputMode !== 'QR'"
      debounce="750"
      :loading="loading"
      :disable="loading"
      maxlength="22"
      outlined
      stack-label
      label="Visit Code"
      v-model.trim="visitCode"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Html5QrcodeScanner } from "html5-qrcode";

export default defineComponent({
  name: "ExamStatusAssignment",

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["visitCodeChanged", "inputModeChanged"],
  data() {
    return {
      inputMode: "QR",
      visitCode: null,
    };
  },
  watch: {
    inputMode: {
      handler(val) {
        this.$emit("inputModeChanged", val);
      },
      immediate: true,
    },
    visitCode: {
      handler(val) {
        const v = val?.replace(/ /g, "");
        this.$emit("visitCodeChanged", v && v.length === 22 ? v : null);
      },
      immediate: true,
    },
  },
  mounted() {
    // Initialize QR Code Scanner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "divQRCodeScanner",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    const thisSFC = this;

    html5QrcodeScanner.render(
      function (decodedText, decodedResult) {
        thisSFC.visitCode = decodedText;
      },
      function (error) {
        // handle scan failure, usually better to ignore and keep scanning.
        console.warn("Code scan error:", error);
      }
    );
  },
  methods: {
    reset() {
      this.visitCode = null;
    },
  },
});
</script>
