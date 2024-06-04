<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          v-if="user"
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />
        <!-- <q-toolbar-title>
          <q-avatar>
            <q-img
              no-native-menu
              src="logo-white.png"
              alt="UERM Logo"
              class="img-fluid"
              style="height: 35px; width: 35px"
            />
          </q-avatar>
        </q-toolbar-title> -->
        <AppLogo size="xs" :showTitle="false" />
        <div><b>UERM</b> INFIRMARY</div>
      </q-toolbar>
    </q-header>
    <q-drawer v-if="user" v-model="leftDrawerOpen" side="left" bordered overlay>
      <q-scroll-area style="height: 100%">
        <div
          class="column q-pa-lg justify-between fit no-wrap"
          style="gap: 16px"
        >
          <div class="column" style="gap: 16px">
            <div class="row justify-start">
              <q-btn
                outline
                dense
                icon="arrow_back"
                color="primary"
                @click="(evt) => (leftDrawerOpen = false)"
              />
            </div>
            <div class="row justify-center">
              <div
                style="height: 120px; width: 120px; border-radius: 50%"
                class="flex flex-center bg-secondary"
              >
                <span class="text-h4">{{
                  user.firstName[0] + user.lastName[0]
                }}</span>
              </div>
            </div>
            <div class="text-center">
              <span class="text-h6 text-weight-bold">{{ userFullName }}</span>
              <div class="row justify-center text-grey-6">
                <span class="text-weight-bold"
                  >{{ user.code }} &#8226; {{ user.roleCode }}</span
                >
              </div>
            </div>
            <div class="row items-start" style="gap: 12px">
              <q-btn
                class="col-12"
                :disable="loading"
                outline
                label="Change Password"
                color="primary"
                @click="
                  (evt) => {
                    $router.push('/password-change');
                  }
                "
              />
              <q-btn
                class="col-12"
                :disable="loading"
                outline
                label="Update Account Info."
                color="primary"
                @click="
                  (evt) => {
                    $router.push('/user-info');
                  }
                "
              />
              <q-btn
                class="col-12"
                unelevated
                :loading="loading"
                label="Log Out"
                color="primary"
                @click="(evt) => (logoutDialogVisible = true)"
              >
                <template v-slot:loading>
                  <q-spinner-cube size="xs" />
                </template>
              </q-btn>
            </div>
            <div class="row justify-center">
              <q-separator class="q-my-md" style="width: 80px" />
            </div>
            <template v-for="navMenu in navMenus" :key="navMenu.code">
              <q-btn-dropdown
                v-if="navMenu.children"
                unelevated
                :class="
                  activeMenu === navMenu.code
                    ? 'bg-accent text-black'
                    : 'text-black text-weight-bold bordered-grey'
                "
                align="left"
              >
                <template v-slot:label>
                  <div class="q-pa-sm row no-wrap full-width">
                    <q-icon left :name="navMenu.icon" />
                    <div>{{ navMenu.name }}</div>
                  </div>
                </template>
                <q-list separator>
                  <q-item
                    v-for="menu in navMenu.children"
                    :key="menu.code"
                    :icon="menu.icon"
                    clickable
                    v-close-popup
                    class="text-black"
                    :class="activeMenu === menu.code ? 'bg-accent' : ''"
                    @click="
                      (evt) => {
                        $router.push(menu.url);
                      }
                    "
                  >
                    <q-item-section avatar>
                      <q-icon left :name="menu.icon" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{
                        menu.name
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn
                v-else
                :class="
                  activeMenu === navMenu.code
                    ? 'bg-accent text-black'
                    : 'text-black text-weight-bold bordered-grey'
                "
                :icon="navMenu.icon"
                :label="navMenu.name"
                :disable="loading"
                unelevated
                align="left"
                style="padding: 12px 24px"
                @click="
                  (evt) => {
                    $router.push(navMenu.url);
                  }
                "
              />
            </template>
          </div>
          <!-- <q-separator class="q-my-md" />
          <div class="bordered-grey q-pa-lg">
            <UermCopyright />
            <q-separator class="q-my-md full-width" />
            <TermsAndConditions />
          </div> -->
        </div>
      </q-scroll-area>
      <ConfirmationDialog
        v-if="logoutDialogVisible"
        question="Are you sure you want to logout?"
        @cancel="(evt) => (logoutDialogVisible = false)"
        @ok="
          (evt) => {
            logoutDialogVisible = false;
            logout();
          }
        "
      />
    </q-drawer>
    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { delay, showMessage } from "src/helpers/util.js";
import { navMenus } from "src/helpers/constants.js";

export default defineComponent({
  name: "MainLayout",
  components: {
    ConfirmationDialog: defineAsyncComponent(() =>
      import("src/components/core/ConfirmationDialog.vue")
    ),
    AppLogo: defineAsyncComponent(() =>
      import("src/components/core/AppLogo.vue")
    ),
    // UermCopyright: defineAsyncComponent(() =>
    //   import("src/components/UermCopyright.vue")
    // ),
    // TermsAndConditions: defineAsyncComponent(() =>
    //   import("src/components/TermsAndConditions.vue")
    // ),
  },
  setup() {
    return {
      navMenus,
    };
  },
  data() {
    return {
      loading: false,
      leftDrawerOpen: true,
      activeMenu: null,
      logoutDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "app/user",
    }),
    userFullName() {
      if (this.user) return `${this.user.firstName} ${this.user.lastName}`;
      return null;
    },
  },
  watch: {
    "$route.name": {
      handler(val) {
        this.activeMenu = val;
      },
      immediate: true,
    },
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async logout() {
      this.loading = true;
      await delay(1000);
      const response = await this.$store.dispatch("app/logout");

      if (response.error) {
        showMessage(this.$q, false, "Unable to log out. Please try again.");
        this.loading = false;
        return;
      }

      await this.$store.dispatch("app/clearUser");
      this.loading = false;
    },
  },
});
</script>
