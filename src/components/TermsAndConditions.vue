<template>
  <div class="text-primary column items-center text-center">
    <span>
      By Accessing or using this website, you acknowledge that you have read,
      understand and agree to be bound by the
      <a href="/apps/patient-portal/#/privacy-policy">Terms and Conditions.</a>
    </span>
    <q-separator class="q-my-md full-width" />
    <q-icon name="map" size="sm" />
    <span class="text-weight-bold">
      Aurora Boulevard, Quezon City, Philippines, 1113
    </span>
    <q-separator class="q-my-md" style="width: 100px" />
    <q-icon name="fa-solid fa-square-phone" size="sm" />
    <span class="text-weight-bold">(+632) 8715-0861</span>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TermsAndConditions",
});
</script>
