<template>
  <q-input
    debounce="500"
    clearable
    maxlength="255"
    :type="isPwdMasked ? 'password' : 'text'"
    :rules="[
      (val) =>
        val == null || val === '' ? 'This field is required.' : undefined,
    ]"
  >
    <template v-if="showIcon" v-slot:prepend>
      <q-icon name="key" />
    </template>
    <template v-slot:append>
      <q-icon
        :name="isPwdMasked ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="(evt) => (isPwdMasked = !isPwdMasked)"
      />
    </template>
  </q-input>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldPassword",
  props: {
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
