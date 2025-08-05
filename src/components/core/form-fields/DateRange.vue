<template>
  <q-input
    :readonly="true"
    :rules="
      required
        ? [(v) => (v == null || v === '' ? 'This field is required' : true)]
        : []
    "
    :model-value="dateRangeStr"
  >
    <template v-slot:append>
      <q-icon
        v-if="Boolean(dateRange)"
        name="sym_o_close"
        class="cursor-pointer"
        @click="dateRange = null"
      />
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover :breakpoint="600" ref="qPopUpProxy">
          <q-date
            style="border-color: rgba(0, 0, 0, 0.25)"
            range
            minimal
            :options="options"
            mask="YYYY/MM/DD"
            v-model="dateRange"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { defineComponent } from "vue";

import {
  isObj,
  // jsDateToISOString,
  // subtractDay,
} from "src/helpers/util.js";

export default defineComponent({
  name: "DateRange",
  props: {
    // subtractDaysCount: {
    //   type: Number,
    //   default: 0,
    // },
    required: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [Array, Function],
      default: null,
    },
    initialValue: {
      type: Object,
      default: null,
    },
  },
  emits: ["valueChanged"],
  data() {
    return {
      dateRange: null,
    };
  },
  computed: {
    dateRangeStr() {
      if (this.value === null) {
        return "";
      }

      return `${this.value.from} - ${this.value.to}`;
    },
    value() {
      if (!this.dateRange) {
        return null;
      }

      if (isObj(this.dateRange)) {
        return this.dateRange;
      }

      // this.dateRange is probably a string
      return { from: this.dateRange, to: this.dateRange };
    },
  },
  watch: {
    initialValue: {
      handler(v) {
        this.dateRange = v;
      },
      immediate: true,
    },
    value: {
      handler(val) {
        this.$emit("valueChanged", val);
      },
      immediate: true,
    },
    dateRange: {
      handler(v) {
        this.$refs.qPopUpProxy.hide();
      },
    },
  },
  // created() {
  //   if (this.subtractDaysCount === 0) {
  //     this.dateRange = jsDateToISOString(new Date(), true).replace(/-/g, "/");
  //     return;
  //   }

  //   this.dateRange = {
  //     from: jsDateToISOString(
  //       subtractDay(new Date(), this.subtractDaysCount),
  //       true
  //     ).replace(/-/g, "/"),
  //     to: jsDateToISOString(new Date(), true).replace(/-/g, "/"),
  //   };
  // },
});
</script>
