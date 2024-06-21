<template>
  <MinimizedDialog
    title="Visit Details"
    widthOnDesktop="720px"
    @close="$emit('close')"
  >
    <template v-slot:title>
      <div class="row items-center justify-between" style="gap: 16px">
        <div class="col text-weight-medium ellipsis">{{ patientName }}</div>
        <q-btn-dropdown
          v-if="tab"
          :disable="loading"
          class="col-auto"
          unelevated
          split
          color="accent"
          text-color="black"
        >
          <template v-slot:label>
            <div class="text-black">{{ tab.name }}</div>
          </template>
          <q-list separator>
            <q-item
              v-for="item in tabs"
              :key="item.code"
              clickable
              v-close-popup
              @click="tab = item"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" color="black" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
                <!-- <q-item-label caption>February 22, 2016</q-item-label> -->
              </q-item-section>
              <!-- <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section> -->
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </template>
    <template v-slot:body>
      <template v-if="tabs && tab">
        <template v-for="item in tabs" :key="item.code">
          <VisitDetailsForm
            v-if="item.code === tab.code"
            :visitId="visitId"
            :patientId="patientId"
            :tab="tab"
            @busy="loading = true"
            @ready="loading = false"
          />
        </template>
      </template>
    </template>
  </MinimizedDialog>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import {
  // exams,
  examsMap,
} from "src/helpers/constants.js";

export default defineComponent({
  name: "VisitDetails",
  components: {
    ReminderCard: defineAsyncComponent(() =>
      import("src/components/core/ReminderCard.vue")
    ),
    MinimizedDialog: defineAsyncComponent(() =>
      import("src/components/core/MinimizedDialog.vue")
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
    patientId: {
      type: Number,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  data() {
    return {
      loading: false,
      tab: null,
      tabs: [
        {
          code: "MEDHIST",
          name: "Medical History",
          icon: "fa-solid fa-notes-medical",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
    // tabs() {
    //   return [
    //     {
    //       code: "MEDHIST",
    //       name: "Medical History",
    //       icon: "fa-solid fa-notes-medical",
    //     },
    //     ...exams,
    //   ];
    // },
  },
  async mounted() {
    const response = await this.$store.dispatch(
      "ape/getVisitExams",
      this.visitId
    );

    if (!response.error && response.body?.length > 0) {
      const examsAllowedForPx = response.body.map((e) => {
        return examsMap[e.examCode];
      });

      const examsToShow = examsAllowedForPx.filter((e) => {
        return this.user.examsHandled.includes(e.code);
      });

      this.tabs = [...this.tabs, ...examsToShow];
    }

    this.tab = this.tabs[0];
  },
});
</script>
