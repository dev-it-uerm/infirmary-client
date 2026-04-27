<template>
  <q-select
    input-debounce="1000"
    stack-label
    use-chips
    use-input
    :readonly="filtering"
    outlined
    autofocus
    hide-dropdown-icon
    label-slot
    :options="options"
    option-value="code"
    option-label="name"
    color="primary"
    hint=""
    options-selected-class="text-primary"
    :placeholder="
      !modelValue || modelValue.length === 0
        ? `Type at least ${minSearchStrLength} characters to search`
        : ''
    "
    :rules="[
      (v) =>
        required && (v == null || v === '' || v.length === 0)
          ? requiredMessage
          : undefined,
    ]"
    @input-value="(v) => (filterStr = v)"
    @filter="filter"
    @filter-abort="abortFilterFn"
    :model-value="modelValue"
    @update:model-value="(v) => $emit('update:modelValue', v)"
  >
    <template v-slot:selected-item="scope">
      <q-chip
        @remove="scope.removeAtIndex(scope.index)"
        :removable="chipRemovable && !filtering"
        :tabindex="scope.tabindex"
        style="max-width: 250px"
      >
        <span class="ellipsis">
          {{ scope.opt.name }}
        </span>
      </q-chip>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No result for "{{ filterStr }}".
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:label>
      {{ $attrs.label }}
      <span v-if="required" class="text-weight-bold text-red"> *</span>
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label caption style="font-size: 0.7rem">
            {{
              scope.opt[optionCaptionProp] &&
              typeof scope.opt[optionCaptionProp] === "string"
                ? scope.opt[optionCaptionProp].toUpperCase()
                : scope.opt[optionCaptionProp]
            }}
          </q-item-label>
          <q-item-label style="font-size: 13px">
            {{ (scope.opt.name || "").toUpperCase() }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { delay } from "src/helpers/util.js";

export default defineComponent({
  name: "FormFieldUserSelectV2",
  props: {
    roleCode: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Object,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    requiredMessage: {
      type: String,
      default: "This field is required.",
    },
    chipRemovable: {
      type: Boolean,
      default: true,
    },
    initialOptions: {
      type: Array,
      default: () => [],
    },
    minSearchStrLength: {
      type: Number,
      default: 3,
    },
    formatOption: {
      type: Function,
      default: null,
    },
    optionsSortFn: {
      type: Function,
      default: null,
    },
    optionCaptionProp: {
      type: String,
      default: "code",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      filtering: false,
      filterStr: "",
      options: [],
    };
  },
  computed: {
    ...mapGetters({
      apiHost: "app/apiHost",
    }),
  },
  methods: {
    async filter(val, update, abort) {
      this.options = [];

      if (!val || val.length < this.minSearchStrLength) {
        abort();
        return;
      }

      this.filtering = true;

      const response = await this.$store.dispatch("app/getUsers", {
        searchStr: val,
        roleCode: this.roleCode,
      });

      await delay(1000);

      update(
        () => {
          const newOptions = !response || response.error ? [] : response.body;

          const formattedOptions = this.formatOption
            ? newOptions.map((o) => this.formatOption(o))
            : newOptions;

          this.options = this.optionsSortFn
            ? [...formattedOptions].sort(this.optionsSortFn)
            : formattedOptions;

          this.filtering = false;
        },
        (ref) => {
          // "ref" is the Vue reference to the QSelect
          if (val && ref.options.length > 0 && ref.getOptionIndex() === -1) {
            // focus the first selectable option and do not update the input-value
            ref.moveOptionSelection(1, true);

            // toggle the focused option
            ref.toggleOption(ref.options[ref.optionIndex], true);
          }
        },
      );
    },
    abortFilterFn() {
      this.filtering = false;
    },
  },
  created() {
    this.options = this.initialOptions;
  },
});
</script>
