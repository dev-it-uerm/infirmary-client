<template>
  <MessageBanner v-if="forbidden" :success="false">
    <template v-slot:error-body>
      <div>You are not allowed to access this page.</div>
    </template>
  </MessageBanner>
  <div v-else>
    <ReminderCard v-if="exam" :exitable="false" class="q-mb-md">
      <template v-slot:body>
        <div v-if="qrMode">
          Scan the <strong>Visit QR Code</strong> to mark the patient as DONE in
          the <b class="text-uppercase"> {{ exam.name.toUpperCase() }} </b>.
        </div>
        <div v-else>
          Enter the <strong>Visit Reference Number</strong> to mark the patient
          as DONE in the
          <b class="text-uppercase"> {{ exam.name.toUpperCase() }} </b>.
        </div>
      </template>
    </ReminderCard>
    <div
      class="q-pa-xs q-mb-md"
      style="border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 4px"
    >
      <q-toggle
        :disable="loading"
        class="text-overline"
        v-model="qrMode"
        :label="qrMode ? 'SCAN VISIT QR CODE' : 'ENTER VISIT CODE MANUALLY'"
      />
    </div>
    <q-select
      :disable="loading"
      outlined
      stack-label
      :options="exams"
      option-value="code"
      option-label="name"
      label="Examinations"
      v-model="exam"
      hint=""
    />
    <div v-show="qrMode" id="divQRCodeScanner" width="600px"></div>
    <div v-if="!qrMode" class="q-mb-md">
      <q-input
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
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { Html5QrcodeScanner } from "html5-qrcode";

export default defineComponent({
  name: "ExamStatusAssignment",
  components: {
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
    MessageBanner: defineAsyncComponent(() =>
      import("src/components/core/MessageBanner.vue")
    ),
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      forbidden: false,
      qrMode: true,
      exams: [],

      exam: null,
      visitCode: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      visitPhasesMap: "app/visitPhasesMap",
    }),
    value() {
      if (this.exam && this.visitCode) {
        return {
          examCode: this.exam.code,
          visitCode: this.visitCode,
        };
      }

      return null;
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
  mounted() {
    const examsHandled = Object.values(this.visitPhasesMap).filter(
      (v) =>
        !["REG", "FIN"].includes(v.code) &&
        (this.user.examsHandled ?? []).includes(v.code)
    );

    if (examsHandled.length === 0) {
      this.forbidden = true;
      return;
    }

    this.exams = examsHandled;
    this.exam = examsHandled[0];

    this.initQRScanner();
  },
  methods: {
    reset() {
      this.visitCode = null;
      // this.recentEntries = [];
    },
    initQRScanner() {
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
  },
});
</script>
