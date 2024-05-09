<template>
  <q-form ref="qFormVisitDetails" @submit="save">
    <template v-for="field in fields" :key="field.code">
      <div>
        <q-input
          v-if="field.type === 'TEXT'"
          :disable="loading"
          stack-label
          outlined
          :rules="generateRules(field.required)"
          :label="field.name"
          v-model.trim="value[field.code]"
          hint=""
        />
        <q-input
          v-if="field.type === 'TEXTAREA'"
          :disable="loading"
          type="textarea"
          stack-label
          outlined
          :rules="generateRules(field.required)"
          :label="field.name"
          v-model.trim="value[field.code]"
          hint=""
        />
        <DiagTest
          v-if="field.type === 'DIAGTEST'"
          :disable="loading"
          :label="field.name"
          :diagCenterCode="field.diagCenterCode"
          :diagCode="field.diagCode"
          :diagParamCode="field.code"
          :initialValue="value[field.code]"
          @valueChanged="(val) => (value[field.code] = val)"
        />
      </div>
    </template>
    <q-input
      :disable="loading"
      type="textarea"
      stack-label
      outlined
      label="Remarks"
      v-model.trim="value.REMARKS"
      hint=""
    />
    <div class="row justify-end">
      <q-btn
        unelevated
        class="text-black bg-accent"
        :loading="loading"
        label="SAVE"
        @click="submitForm"
      />
    </div>
  </q-form>
  <ConfirmationDialog
    v-if="confDialogVisible"
    question="Are you sure you want to save visit details?"
    @ok="this.$refs.qFormVisitDetails.submit"
    @cancel="confDialogVisible = false"
  />
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, formatDate, showMessage } from "src/helpers/util.js";

export default defineComponent({
  name: "VisitDetailsForm",
  components: {
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    DiagTest: defineAsyncComponent(() =>
      import("src/components/core/form-fields/DiagTest.vue")
    ),
  },
  props: {
    visitId: {
      type: Number,
      required: true,
    },
    patientId: {
      type: Number,
      required: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    initialValue: {
      type: Object,
      default: null,
    },
  },
  setup() {
    return {
      generateRules(required) {
        return required
          ? [
              (val) => {
                if (val == null || val === "") return "This field is required.";
              },
            ]
          : [];
      },
      showMessage,
      formatDate,
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  created() {
    this.value = {
      ...this.fields.reduce((acc, f) => {
        acc[f.code] = f.default ?? null;
        return acc;
      }, {}),
      REMARKS: null,
    };

    if (this.initialValue) {
      this.value = {
        ...this.value,
        ...this.formatValue(this.initialValue),
      };
    }
  },
  data() {
    return {
      loading: false,
      value: {},
      confDialogVisible: false,
    };
  },
  // computed: {
  //   ...mapGetters({
  //     user: "app/user",
  //   }),
  // },
  methods: {
    formatValue(val) {
      return Object.entries(val).reduce((acc, e) => {
        if (e[1] === "") e[1] = null;
        acc[e[0].toUpperCase()] = e[1];
        return acc;
      }, {});
    },
    async submitForm() {
      const valid = await this.$refs.qFormVisitDetails.validate();
      if (valid) this.confDialogVisible = true;
    },
    async save() {
      this.confDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("visit/saveDetails", {
        visitId: this.visitId,
        patientId: this.patientId,
        tableName: this.tableName,
        details: this.formatValue(this.value),
      });

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        return;
      }

      showMessage(this.$q, true, "Visit details have been saved successfully.");
      this.loading = false;
    },
  },
});
</script>
