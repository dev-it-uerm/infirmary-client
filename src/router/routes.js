const routes = [
  {
    path: "/login",
    component: () => import("layouts/Login.vue"),
    children: [
      {
        name: "LOGIN",
        path: "/login",
        component: () => import("pages/Login.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/Main.vue"),
    children: [
      {
        name: "MAIN",
        path: "/",
        component: () => import("pages/Main.vue"),
      },
      {
        name: "VISITS",
        path: "/visits",
        component: () => import("pages/VisitsPage.vue"),
      },
      {
        name: "REGISTRATION_LINK",
        path: "/registration-link",
        component: () => import("pages/RegistrationLinkPage.vue"),
      },
      {
        name: "REGISTRATION",
        path: "/registration",
        component: () => import("pages/RegistrationPage.vue"),
      },
      {
        name: "LAB_SECTION",
        path: "/section-entrance/:sectionCode",
        component: () => import("pages/SectionEntrancePage.vue"),
      },
      // {
      //   path: "/test-page",
      //   name: "TEST_PAGE",
      //   component: () => import("pages/TestPage.vue"),
      // },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
