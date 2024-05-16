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
  data() {
    return {
      initialized: false,
    };
  },
  watch: {
    user: {
      handler(val) {
        if (this.ready) this.redirectPage(val, this.$route.name);
      },
      immediate: true,
    },
    "$route.name": {
      handler(val) {
        if (this.ready) this.redirectPage(this.user, val);
      },
      immediate: true,
    },
  },
  async created() {
    const userCookie = Cookies.get("uerm_infirmary__user");
    if (userCookie) this.$store.dispatch("app/setUser", userCookie);
    this.initialized = true;
  },
  methods: {
    routeIsPublic(routeName) {
      console.log("routeName:", routeName);
      if (
        [
          "COOKIE_POLICY",
          "PRIVACY_POLICY",
          "LOGIN",
          "PASSWORD_RESET",
          "VISIT_APPOINTMENT",
          "VISIT_APPOINTMENT_LINK",
        ].includes(routeName)
      )
        return true;

      return false;
    },
    redirectPage(user, routeName) {
      // console.log(this.ready);
      // console.log(user);
      // console.log(this.routeIsPublic(routeName));

      if (user == null && !this.routeIsPublic(routeName)) {
        console.log("Redirecting page...");
        this.$router.push("/login");
      }

      if (user && routeName === "LOGIN") {
        console.log("Redirecting page...");
        this.$router.push("/");
      }
    },
  },
});
</script>
