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
    path: "/password-reset",
    component: () => import("layouts/Blank.vue"),
    children: [
      {
        name: "PASSWORD_RESET",
        path: "/password-reset",
        component: () => import("pages/PasswordReset.vue"),
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
        name: "USER_REGISTRATION",
        path: "/user-registration",
        component: () => import("pages/UserRegistration.vue"),
      },
      {
        name: "PATIENT_REGISTRATION",
        path: "/patient-registration",
        component: () => import("pages/PatientRegistration.vue"),
      },
      {
        name: "VISITS",
        path: "/visits",
        component: () => import("pages/Visits.vue"),
      },
      {
        name: "VISIT_APPOINTMENT_LINK",
        path: "/visit-appointment-link",
        component: () => import("pages/VisitAppointmentLink.vue"),
      },
      {
        name: "VISIT_APPOINTMENT",
        path: "/visit-appointment",
        component: () => import("pages/VisitAppointment.vue"),
      },
      {
        name: "VISIT_APPOINTMENT_BULK",
        path: "/visit-appointment-bulk",
        component: () => import("pages/VisitAppointmentBulk.vue"),
      },
      {
        name: "COMPLETE_EXAM",
        path: "/complete-exam",
        component: () => import("pages/CompleteExam.vue"),
      },
      {
        name: "VISIT_TRACKER",
        path: "/track-visit",
        component: () => import("pages/VisitTracker.vue"),
      },
      {
        name: "PASSWORD_CHANGE",
        path: "/password-change",
        component: () => import("pages/PasswordChange.vue"),
      },
      {
        name: "USER_INFO",
        path: "/user-info",
        component: () => import("pages/UserInfo.vue"),
      },
      {
        name: "ANALYTICS",
        path: "/analytics",
        component: () => import("pages/Analytics.vue"),
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
