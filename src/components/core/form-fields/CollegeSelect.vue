<template>
  <q-select
    stack-label
    outlined
    map-options
    emit-value
    label="College"
    :options="[
      { value: 'MED', label: 'Medicine' },
      { value: 'NST', label: 'Nursing' },
      { value: 'MEDTECH', label: 'Medical Technology' },
    ]"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldCollegeSelect",
});
</script>
