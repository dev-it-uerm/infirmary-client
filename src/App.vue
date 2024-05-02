<template>
  <!-- <router-view :key="$route.fullPath" /> -->
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { Cookies } from "quasar";

export default defineComponent({
  name: "App",
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
    ready() {
      return this.$route.name && this.initialized;
    },
  },
  setup() {
    return {
      publicRouteNames: ["COOKIE_POLICY", "PRIVACY_POLICY", "LOGIN"],
    };
  },
  data() {
    return {
      initialized: false,
    };
  },
  watch: {
    user: {
      handler(val) {
        if (this.ready && val == null && !this.currentRouteIsPublic())
          this.$router.push("/login");

        if (this.ready && val && this.$route.name === "LOGIN")
          this.$router.push("/");
      },
      immediate: true,
    },
    "$route.name": {
      handler(val) {
        // if (this.ready && this.user == null && !this.currentRouteIsPublic())
        //   this.$router.push("/login");
        // if (this.ready && this.user != null) {
        //   if (this.user.requirePasswordChange) {
        //     this.$router.push("/change-password");
        //     return;
        //   }
        //   if (val === "LOGIN") this.$router.push("/");
        // }
      },
      immediate: true,
    },
  },
  async created() {
    const userCookie = Cookies.get("px_portal__user");
    if (userCookie) this.$store.dispatch("app/setUser", userCookie);
    this.initialized = true;
  },
  methods: {
    currentRouteIsPublic() {
      if (this.publicRouteNames.includes(this.$route.name)) return true;

      if (
        this.$route.name === "CHANGE_PASSWORD" &&
        this.$route.query.accessToken
      )
        return true;

      return false;
    },
  },
});
</script>
