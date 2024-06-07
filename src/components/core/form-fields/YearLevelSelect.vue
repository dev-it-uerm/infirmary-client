<template>
  <q-select
    stack-label
    outlined
    :options="[
      { value: 1, label: '1st Year' },
      { value: 2, label: '2nd Year' },
      { value: 3, label: '3rd Year' },
      { value: 4, label: '4th Year' },
    ]"
    label="Year Level"
    emit-value
    map-options
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormFieldYearLevelSelect",
});
</script>
