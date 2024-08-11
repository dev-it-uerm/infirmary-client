<template>
  <div>
    <div class="row items-center q-mb-sm">
      <div class="text-overline">
        {{
          inputMode === "QR"
            ? "SCAN PATIENT QR CODE"
            : "ENTER PATIENT CODE MANUALLY"
        }}
      </div>
      <q-toggle
        :disable="loading"
        true-value="QR"
        false-value="MANUAL"
        class="text-overline"
        color="primary"
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
      :id="scannerId"
      width="600px"
    ></div>
    <q-input
      v-if="inputMode !== 'QR'"
      debounce="2000"
      :loading="loading"
      :disable="loading"
      maxlength="22"
      outlined
      stack-label
      autofocus
      label="Patient Code"
      v-model.trim="patientCode"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Html5QrcodeScanner } from "html5-qrcode";

export default defineComponent({
  name: "QRCodeScanner",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    scannerId: {
      type: String,
      required: true,
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
          if (val === "QR") this.resumeScanner();
          else this.pauseScanner();
        }
      },
      immediate: true,
    },
    loading: {
      handler(val) {
        if (this.inputMode === "QR") {
          if (val) this.pauseScanner();
          else this.resumeScanner();
        }
      },
      immediate: true,
    },
    patientCode: {
      handler(val) {
        const v = val ? val.replace(/[^\w]/g, "").replace(/ /g, "") : null;
        this.$emit("patientCodeChanged", v && v.length > 2 ? v : null);
      },
      immediate: true,
    },
  },
  mounted() {
    // Initialize QR Code Scanner
    this.scanner = new Html5QrcodeScanner(
      this.scannerId,
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
  methods: {
    pauseScanner() {
      // UNKNOWN = 0, NOT_STARTED = 1, SCANNING = 2, PAUSED = 3
      if (this.scanner && this.scanner.getState() === 2) {
        // console.log("Pausing QR Code scanner...");
        this.scanner.pause();
      }
    },
    resumeScanner() {
      // UNKNOWN = 0, NOT_STARTED = 1, SCANNING = 2, PAUSED = 3
      if (this.scanner && this.scanner.getState() === 3) {
        // console.log("Resuming QR Code scanner...");
        this.scanner.resume();
      }
    },
    reset() {
      // this.scanner.clear();
      this.patientCode = null;
    },
  },
});
</script>

<style>
button#html5-qrcode-button-camera-start,
button#html5-qrcode-button-camera-stop {
  background-color: white;
  border: solid 1px #0d47a1;
  color: #0d47a1;
  padding: 8px 14px;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
}

/* div#divQrCodeScanner__dashboard_section {
  padding: 16px !important;
} */
</style>
