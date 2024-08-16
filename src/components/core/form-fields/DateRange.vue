<template>
  <q-input :model-value="dateRangeStr">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover :breakpoint="600" ref="qPopUpProxy">
          <q-date
            style="border-color: rgba(0, 0, 0, 0.25)"
            v-model="dateRange"
            range
            minimal
            mask="YYYY/MM/DD"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { defineComponent } from "vue";
import {
  empty,
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
      if (this.value === null) return "";
      return `${this.value.from} - ${this.value.to}`;
    },
    value() {
      if (empty(this.dateRange)) return null;
      if (isObj(this.dateRange)) return this.dateRange;

      // this.dateRange is probably a string
      return { from: this.dateRange, to: this.dateRange };
    },
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("valueChanged", val);
      },
      immediate: false,
    },
    dateRange: {
      handler(val) {
        this.$refs.qPopUpProxy.hide();
      },
    },
  },
  created() {
    if (this.initialValue) this.dateRange = this.initialValue;
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
