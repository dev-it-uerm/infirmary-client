<template>
  <div>
    <div class="row items-center q-mb-sm">
      <div class="text-overline">
        {{
          inputMode === "QR"
            ? "SCAN VISIT QR CODE"
            : "ENTER VISIT CODE MANUALLY"
        }}
      </div>
      <q-toggle
        :disable="loading"
        true-value="QR"
        false-value="MANUAL"
        class="text-overline"
        v-model="inputMode"
      />
    </div>
    <div
      v-if="inputMode === 'QR' && loading"
      class="full-width flex flex-center"
      style="height: 100px"
    >
      <q-spinner-dots size="lg" />
    </div>
    <div
      v-show="inputMode === 'QR' && !loading"
      :disable="loading"
      id="divQrCodeScanner"
      width="600px"
    ></div>
    <q-input
      v-if="inputMode !== 'QR'"
      debounce="750"
      :loading="loading"
      :disable="loading"
      maxlength="22"
      outlined
      stack-label
      label="Visit Code"
      v-model.trim="patientCode"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Html5QrcodeScanner } from "html5-qrcode";

export default defineComponent({
  name: "VisitCodeScanner",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["patientCodeChanged", "inputModeChanged"],
  data() {
    return {
      inputMode: "QR",
      patientCode: null,
      scanner: null,
    };
  },
  watch: {
    inputMode: {
      handler(val) {
        this.$emit("inputModeChanged", val);

        if (this.scanner) {
          if (val === "QR") this.scanner.resume();
          else this.scanner.pause();
        }
      },
      immediate: true,
    },
    loading: {
      handler(val) {
        if (this.scanner && this.inputMode === "QR") {
          if (val) this.scanner.pause();
          else this.scanner.resume();
        }
      },
      immediate: true,
    },
    patientCode: {
      handler(val) {
        const v = val?.replace(/ /g, "");
        // this.$emit("patientCodeChanged", v && v.length === 22 ? v : null);
        this.$emit("patientCodeChanged", v && v.length > 3 ? v : null);
      },
      immediate: true,
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      // this.scanner.clear();
      this.patientCode = null;

      // Initialize QR Code Scanner
      this.scanner = new Html5QrcodeScanner(
        "divQrCodeScanner",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      const me = this;

      this.scanner.render(
        (decodedText, decodedResult) => {
          me.patientCode = decodedText;
        },
        (error) => {
          // handle scan failure, usually better to ignore and keep scanning.
          // console.warn("Code scan error:", error);
        }
      );
    },
  },
});
</script>
