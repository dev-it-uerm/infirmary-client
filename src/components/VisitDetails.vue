<template>
  <MinimizedDialog
    title="Visit Details"
    :loading="loading"
    widthOnDesktop="720px"
    @close="$emit('close')"
  >
    <template v-slot:title>
      <div class="row items-center justify-between" style="gap: 16px">
        <div class="col text-weight-medium ellipsis">
          {{
            formatName(
              visit.patientFirstName,
              visit.patientMiddleName,
              visit.patientLastName,
              visit.patientExtName
            )
          }}
        </div>
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
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </template>
    <template v-slot:body>
      <VisitDetailsForm
        v-if="tab"
        :visitId="visit.id"
        :patientId="visit.patientId"
        :tab="tab"
        :visitIsCompleted="Boolean(visit.dateTimeCompleted)"
        @busy="loading = true"
        @ready="loading = false"
        @success="$emit('success')"
        @error="$emit('error')"
      />
    </template>
  </MinimizedDialog>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { examsMap } from "src/helpers/constants.js";
import { formatName } from "src/helpers/util.js";

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
    visit: {
      type: Object,
      required: true,
    },
  },
  emits: ["close", "success", "error"],
  setup() {
    return { formatName };
  },
  data() {
    return {
      loading: false,
      tab: null,
      tabs: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
  },
  async mounted() {
    const response = await this.$store.dispatch(
      "ape/getVisitExams",
      this.visit.id
    );

    if (!response.error && response.body?.length > 0) {
      const examsAllowedForPx = response.body.map((e) => {
        return examsMap[e.examCode];
      });

      const examsToShow = examsAllowedForPx.filter((e) => {
        return this.user.examsHandled.includes(e.code);
      });

      this.tabs = [
        {
          code: "VISIT",
          name: "Visit Info.",
          icon: "fa-solid fa-notes-medical",
        },
        {
          code: "MEDHIST",
          name: "Medical History",
          icon: "fa-solid fa-notes-medical",
        },
        ...examsToShow,
      ];
    }

    this.tab = this.tabs[0];
  },
});
</script>
