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
      <template v-if="tab">
        <VisitInfoForm
          v-if="tab.code === 'VISIT'"
          :visitId="visit.id"
          @busy="loading = true"
          @ready="loading = false"
          @saved="$emit('saved')"
        />
        <VisitExamDetailsForm
          v-else
          :visitId="visit.id"
          :examCode="tab.code"
          @busy="loading = true"
          @ready="loading = false"
          @saved="$emit('saved')"
        />
      </template>
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
    VisitInfoForm: defineAsyncComponent(() =>
      import("src/components/visit-page/VisitInfoForm.vue")
    ),
    VisitExamDetailsForm: defineAsyncComponent(() =>
      import("src/components/visit-page/VisitExamDetailsForm.vue")
    ),
  },
  props: {
    visit: {
      type: Object,
      required: true,
    },
    tabCode: {
      type: String,
      default: null,
    },
  },
  emits: ["close", "saved"],
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
    if (!this.user) return;

    const tabs = [
      {
        code: "VISIT",
        name: "Visit Info.",
        icon: "fa-solid fa-circle-info",
      },
    ];

    if (this.user.examsHandled) {
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

        tabs.push(...examsToShow);
      }
    }

    this.tabs = tabs;

    this.tab = this.tabCode
      ? this.tabs.find((t) => t.code === this.tabCode) ?? this.tabs[0]
      : this.tabs[0];
  },
});
</script>
