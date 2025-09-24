<template>
  <q-input
    debounce="500"
    :disable="disable"
    clearable
    maxlength="255"
    :type="isPwdMasked ? 'password' : 'text'"
    :rules="[
      (v) => {
        return v == null || v === '' ? 'This field is required.' : true;
      },
    ]"
  >
    <template v-if="showIcon" v-slot:prepend>
      <q-icon name="key" />
    </template>
    <template v-slot:append>
      <q-icon
        :name="isPwdMasked ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="isPwdMasked = !isPwdMasked"
      />
    </template>
  </q-input>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldPassword",
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isPwdMasked: true,
    };
  },
});
</script>
