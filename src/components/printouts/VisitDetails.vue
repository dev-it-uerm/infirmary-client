<template>
  <div class="fit relative-position">
    <iframe
      v-if="dataUrl"
      id="docContainer"
      :src="'data:application/pdf;base64,' + dataUrl"
      style="
        background-color: white;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 1;
        position: absolute;
        border: 0;
      "
    />
    <div v-else class="fit bg-white flex flex-center" style="z-index: 999">
      <q-spinner size="md" color="primary" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { delay } from "src/helpers/util";

export default {
  name: "PrintoutVisitDetails",
  props: {
    visitId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      user: "app/user",
      // uermLogo: "app/uermLogo",
    }),
    ready() {
      return this.visitId && this.user;
    },
  },
  data() {
    return {
      loading: true,
      dataUrl: null,
    };
  },
  watch: {
    ready: {
      async handler(val) {
        if (val) {
          this.getDataUrl();
        }
      },
      immediate: true,
    },
  },
  methods: {
    async getDataUrl() {
      this.loading = true;

      const response = await this.$store.dispatch(
        "ape/getVisitPdfJson",
        this.visitId
      );

      await delay(2000);

      if (response.error) {
        console.log(response.error);
        this.loading = false;
        return;
      }

      this.dataUrl = response.body;
      this.loading = false;
    },
  },
};
</script>
