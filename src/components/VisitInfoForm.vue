<template>
  <div>
    <!-- <div class="bg-white flex flex-center" style="height: 200px; opacity: 0.8">
      <q-spinner-dots color="black" size="md" />
    </div> -->
    <FetchingData v-if="loading" />
    <q-form v-else ref="qFormVisitDetails" @submit="save">
      <div
        class="fit"
        style="display: grid; grid-template-rows: auto min-content"
      >
        <div
          class="q-pa-lg scroll"
          style="height: auto; max-height: 70vh; min-height: 100px"
        >
          <template v-for="field in fields" :key="field.code">
            <div>
              <q-input
                v-if="field.type === 'TEXT'"
                :disable="visitIsCompleted || field.disable || loading"
                stack-label
                outlined
                :rules="generateRules(field.required)"
                :label="field.name"
                v-model.trim="value[field.code]"
                hint=""
              />
              <q-input
                v-if="field.type === 'TEXTAREA'"
                :disable="visitIsCompleted || field.disable || loading"
                type="textarea"
                stack-label
                outlined
                :rules="generateRules(field.required)"
                :label="field.name"
                v-model.trim="value[field.code]"
                hint=""
              />
              <UserSelect
                v-if="field.type === 'PHYSICIANSELECT'"
                label="Physician"
                :roleCode="userRolesMap.DR.code"
                :disable="visitIsCompleted || field.disable || loading"
                :initialValue="value[field.code]"
                @valueChanged="(val) => (value[field.code] = val)"
              />
            </div>
          </template>
        </div>
        <q-separator />
        <div class="row q-pa-lg justify-end" style="gap: 12px">
          <q-btn
            unelevated
            :disable="visitIsCompleted"
            class="text-white bg-primary"
            :loading="loading"
            :label="visitIsCompleted ? 'COMPLETED' : 'SAVE'"
            @click="submitForm"
          />
        </div>
      </div>
    </q-form>
    <ConfirmationDialog
      v-if="confDialogVisible"
      question="Are you sure you want to save visit details?"
      @ok="this.$refs.qFormVisitDetails.submit"
      @cancel="confDialogVisible = false"
    />
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay, formatDate, showMessage } from "src/helpers/util.js";
import { userRolesMap } from "src/helpers/constants.js";

export default defineComponent({
  name: "VisitInfoForm",
  components: {
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    UserSelect: defineAsyncComponent(() =>
      import("src/components/core/form-fields/UserSelect.vue")
    ),
  },
  props: {
    visitId: {
      type: Number,
      required: true,
    },
  },
  emits: ["busy", "ready", "success", "error"],
  setup() {
    return {
      userRolesMap,
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
      fields: [
        {
          code: "patientName",
          name: "Patient Name",
          type: "TEXT",
          disable: true,
        },
        {
          code: "createdBy",
          name: "Added By",
          type: "TEXT",
          disable: true,
        },
        {
          code: "dateTimeCreated",
          name: "Date & Time Visited",
          type: "TEXT",
          format: formatDate,
          disable: true,
        },
        {
          code: "completedBy",
          name: "Completed By",
          type: "TEXT",
          default: "NOT YET COMPLETED",
          disable: true,
        },
        {
          code: "dateTimeCompleted",
          name: "Date & Time Completed",
          type: "TEXT",
          format: formatDate,
          default: "NOT YET COMPLETED",
          disable: true,
        },
        {
          code: "physician",
          name: "Physician",
          type: "PHYSICIANSELECT",
          required: true,
        },
        {
          code: "remarks",
          name: "Remarks",
          type: "TEXTAREA",
          required: true,
        },
      ],
    };
  },
  data() {
    return {
      loading: false,
      value: {},
      confDialogVisible: false,
      visitIsCompleted: false,
    };
  },
  watch: {
    loading: {
      handler(val) {
        this.$emit(val ? "busy" : "ready");
      },
      immediate: true,
    },
  },
  mounted() {
    this.getInitialValue();
  },
  methods: {
    mergeFieldsAndVal(fields, obj) {
      return fields.reduce((acc, field) => {
        if (obj[field.code] == null || obj[field.code] === "") {
          acc[field.code] = field.default ?? null;
          return acc;
        }

        acc[field.code] = field.format
          ? field.format(obj[field.code])
          : obj[field.code];

        return acc;
      }, {});
    },
    async getInitialValue() {
      this.loading = true;

      // SUPPLY DEFAULT VALUE
      this.value = this.mergeFieldsAndVal(this.fields, {});

      const response = await this.$store.dispatch("ape/getVisit", this.visitId);

      await delay(1000);

      if (response.error) {
        this.loading = false;
        return;
      }

      if (!response.body || response.body.length === 0) {
        this.loading = false;
        return;
      }

      this.visitIsCompleted = Boolean(response.body.dateTimeCompleted);
      this.value = this.mergeFieldsAndVal(this.fields, response.body);
      this.loading = false;
    },
    async submitForm() {
      const valid = await this.$refs.qFormVisitDetails.validate();
      if (valid) this.confDialogVisible = true;
    },
    async save() {
      this.confDialogVisible = false;
      this.loading = true;
      await delay(2000);

      const response = await this.$store.dispatch("ape/updateVisit", {
        id: this.visitId,
        physicianCode: this.value.physician.code,
        remarks: this.value.remarks,
      });

      if (response.error) {
        showMessage(this.$q, false, response.body);
        this.loading = false;
        this.$emit("error");
        return;
      }

      showMessage(this.$q, true, "Visit details have been saved successfully.");
      this.loading = false;
      this.$emit("success");
    },
  },
});
</script>
