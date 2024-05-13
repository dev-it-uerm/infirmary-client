<template>
  <MinimizedDialog
    title="Visit Details"
    widthOnDesktop="720px"
    @close="$emit('close')"
  >
    <template v-slot:title>
      <div style="min-width: 1000px">
        <q-btn-dropdown
          v-if="tab"
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
      <div style="height: 70vh">
        <template v-if="tabs && tab">
          <template v-for="item in tabs" :key="item.code">
            <VisitDetailsForm
              v-if="item.code === tab.code"
              :visitId="visitId"
              :patientId="patientId"
              :tab="tab"
            />
          </template>
        </template>
      </div>
    </template>
  </MinimizedDialog>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";

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
  },
  emits: ["close"],
  data() {
    return {
      tab: null,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      examsMap: "app/examsMap",
    }),
    tabs() {
      if (this.examsMap) {
        return [
          {
            code: "MEDHIST",
            name: "Medical History",
            icon: "fa-solid fa-notes-medical",
          },
          ...Object.values(this.examsMap),
        ];
      }

      return [];
    },
  },
  mounted() {
    this.tab = this.tabs[0];
  },
});
</script>
