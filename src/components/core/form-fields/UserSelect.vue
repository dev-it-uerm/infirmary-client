<template>
  <div>
    <q-select
      stack-label
      outlined
      use-chips
      use-input
      hide-dropdown-icon
      :loading="loading"
      :disable="disable || loading"
      option-value="code"
      option-label="name"
      :placeholder="value ? '' : 'Type in user name to search'"
      @input-value="search"
      label-slot
      :rules="[
        (val) => (required && !val ? 'This field is required.' : undefined),
      ]"
      v-model="value"
    >
      <template v-slot:label>
        {{ label }}
        <span class="text-weight-bold text-red" v-if="required"> *</span>
      </template>
      <template v-slot:selected-item="scope">
        <q-chip
          removable
          dense
          @remove="scope.removeAtIndex(scope.index)"
          :tabindex="scope.tabindex"
          style="height: auto"
          class="q-py-none"
        >
          <span class="q-pa-xs" style="white-space: pre-wrap">{{
            scope.opt.name
          }}</span>
        </q-chip>
      </template>
    </q-select>
    <template v-if="options.length > 0">
      <div
        class="q-my-sm"
        style="
          border: 1px solid rgba(0, 0, 0, 0.12);
          max-height: 100px;
          height: auto;
          overflow-y: auto;
        "
      >
        <q-list separator>
          <q-item
            clickable
            v-ripple
            @click="add(option)"
            v-for="(option, index) in options"
            :key="index"
          >
            <q-item-section side>
              <q-item-label class="text-weight-">{{
                option.code
              }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ option.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="row justify-end">
        <q-btn
          class="q-pa-xs q-mb-sm"
          flat
          dense
          color="blue-10"
          icon="expand_less"
          @click="() => (options = [])"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { debounce } from "quasar";
import { delay } from "src/helpers/util.js";

export default defineComponent({
  name: "UserSelect",
  props: {
    initialValue: {
      type: Object,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "User",
    },
    roleCode: {
      type: String,
      required: true,
    },
  },
  emits: ["valueChanged"],
  data() {
    return {
      loading: false,
      value: null,
      options: [],
    };
  },
  computed: {
    ...mapGetters({
      apiHost: "app/apiHost",
    }),
  },
  watch: {
    initialValue: {
      handler(val) {
        this.value = val;
      },
      immediate: true,
    },
    value: {
      handler(val) {
        this.$emit("valueChanged", val);
      },
      immediate: true,
    },
  },
  created() {
    // For some reason, QSelect's input-debounce prop does not work on its @input-value event
    // Manage debouncing ourselves
    this.search = debounce(this.search, 750);
  },
  methods: {
    async search(val) {
      const searchStr = val.trim();
      if (searchStr.length < 3) return;

      this.options = [];
      this.loading = true;

      const response = await this.$store.dispatch("app/getUsers", {
        searchStr,
        roleCode: this.roleCode,
      });

      await delay(1000);

      if (!response || response.error) {
        console.log(response.error);
        this.loading = false;
        return;
      }

      this.options = response.body;
      this.loading = false;
    },
    add(option) {
      this.value = option;
      this.options = [];
    },
    clear() {
      this.value = null;
    },
    clearOptions() {
      this.options = [];
    },
  },
});
</script>
