<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card borderless class="shadow-0">
      <PageHeader text="REGISTRATION" icon="fa-regular fa-id-card" />
      <div
        class="q-pa-md"
        style="padding: 32px; width: 300px; max-width: 300px"
      >
        <div v-if="loading">Registering your visit... Please wait.</div>
        <div v-else :class="success ? 'text-positive' : 'text-negative'">
          {{ message }}
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { delay } from "src/helpers/util.js";

export default defineComponent({
  name: "RegistrationPage",
  components: {
    PageHeader: defineAsyncComponent(() =>
      import("src/components/core/PageHeader.vue")
    ),
    // FetchingData: defineAsyncComponent(() =>
    //   import("src/components/core/FetchingData.vue")
    // ),
  },
  data() {
    return {
      message: "",
      success: true,
      loading: false,
    };
  },
  async mounted() {
    this.loading = true;
    await delay(2000);

    if (!this.$route?.query?.accessToken) {
      this.message = "`accessToken` in URL is required.";
      return;
    }

    const response = await this.$store.dispatch(
      "visit/register",
      this.$route.query.accessToken
    );

    if (response.error) {
      this.message = response.body;
      this.success = false;
      this.loading = false;
      return;
    }

    this.message = "You have successfully registered a visit.";
    this.loading = false;
  },
});
</script>
