<template>
  <q-splitter
    class="bg-white fit"
    style="height: 250px"
    v-model="splitterModel"
  >
    <template v-slot:before>
      <q-tabs v-model="tab" vertical>
        <q-tab
          :disable="loading"
          name="medicalHistory"
          label="Medical History"
        />
        <q-tab :disable="loading" name="physicalExam" label="Physical Exam" />
        <q-tab
          :disable="loading"
          name="laboratoryTests"
          label="Laboratory Test"
        />
        <q-tab
          :disable="loading"
          name="radiologyTests"
          label="Radiology Test"
        />
        <q-tab :disable="loading" name="fecalysis" label="Fecalysis" />
      </q-tabs>
    </template>
    <template v-slot:after>
      <FetchingData v-if="loading" />
      <q-tab-panels
        v-else
        class="fit"
        v-model="tab"
        animated
        swipeable
        vertical
        transition-prev="jump-up"
        transition-next="jump-up"
      >
        <q-tab-panel class="q-pa-lg" :name="tab">
          <VisitDetailsForm
            :visitId="visitId"
            :patientCode="patientCode"
            :tableName="tab"
            :initialValue="visitDetails"
            :fields="fieldGroupsMap[tab]"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-splitter>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, formatDate, showMessage } from "src/helpers/util.js";
import FetchingData from "./core/FetchingData.vue";

export default defineComponent({
  name: "VisitDetails",
  components: {
    FetchingData: defineAsyncComponent(() =>
      import("src/components/core/FetchingData.vue")
    ),
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
    VisitDetailsForm: defineAsyncComponent(() =>
      import("src/components/VisitDetailsForm.vue")
    ),
  },
  props: {
    visitId: {
      type: Number,
      required: true,
    },
    patientCode: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      showMessage,
      formatDate,
      fieldGroupsMap: {
        medicalHistory: [
          {
            code: "PRESENTSYMPTOMS",
            name: "Present Symptoms",
            type: "TEXTAREA",
          },
          {
            code: "PASTILLNESSES",
            name: "Past Illnesses",
            type: "TEXTAREA",
          },
          {
            code: "ALLERGIES",
            name: "Allergies",
            type: "TEXTAREA",
          },
          {
            code: "MEDICATIONS",
            name: "Medications",
            type: "TEXTAREA",
          },
          {
            code: "MENSHISTLMP",
            name: "Menstrual History (LMP)",
            type: "TEXTAREA",
          },
          {
            code: "OPERATIONS",
            name: "Surgeries/Operations",
            type: "TEXTAREA",
          },
        ],
        physicalExam: [
          {
            code: "VSIGNBP",
            name: "Blood Pressure",
            type: "TEXT",
            required: true,
          },
          {
            code: "VSIGNRR",
            name: "Respiratory Rate",
            type: "TEXT",
            required: true,
          },
          {
            code: "VSIGNHR",
            name: "Heart Rate",
            type: "TEXT",
            required: true,
          },
          {
            code: "HEIGHT",
            name: "height",
            type: "TEXT",
            required: true,
          },
          {
            code: "WEIGHT",
            name: "weight",
            type: "TEXT",
            required: true,
          },
          {
            code: "SKIN",
            name: "Skin",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "HEENT",
            name: "HEENT",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "NECK",
            name: "Neck",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "CHEST",
            name: "Chest",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "BREAST",
            name: "Breast",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "HEART",
            name: "Heart",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "ABDOMEN",
            name: "Abdomen",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "GENITOURINARY",
            name: "Genitourinary",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "ANUS",
            name: "Anus",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "REFLEXES",
            name: "Reflexes",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
          {
            code: "EXTREMITIES",
            name: "Extremities",
            type: "TEXT",
            default: "NORMAL",
            required: true,
          },
        ],
        laboratoryTests: [],
        radiologyTests: [],
        fecalysis: [],
      },
      // inputRule: (val) =>
      //   val == null || val === "" ? "Field is required." : undefined,
    };
  },
  data() {
    return {
      tab: "",
      splitterModel: 20,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  watch: {
    tab(val) {
      if (val) this.getDetails(val);
    },
  },
  mounted() {
    this.tab = "medicalHistory";
  },
  methods: {
    async getDetails() {
      this.loading = true;
      await delay(500);

      const response = await this.$store.dispatch("visit/getDetails", {
        visitId: this.visitId,
        patientCode: this.patientCode,
        tableName: this.tab,
      });

      if (response.error) {
        console.log(response.error);
        this.loading = false;
        return;
      }

      this.visitDetails = response.body;
      this.loading = false;
    },
  },
});
</script>
