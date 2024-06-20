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
        name: "PASSWORD_CHANGE",
        path: "/password-change",
        component: () => import("pages/PasswordChange.vue"),
      },
      {
        name: "USER_INFO",
        path: "/user-info",
        component: () => import("pages/UserInfo.vue"),
      },
      // UE ANNUAL DIAGNOSTIC EXAM
      {
        name: "APE_REGISTRATION",
        path: "/annual-physical-exam/registration",
        component: () => import("pages/ape/Registration.vue"),
      },
      {
        name: "APE_PATIENT_REGISTRATION",
        path: "/annual-physical-exam/patient-registration",
        component: () => import("pages/ape/PatientRegistration.vue"),
      },
      {
        name: "APE_VISITS",
        path: "/annual-physical-exam/visits",
        component: () => import("pages/ape/Visits.vue"),
      },
      {
        name: "APE_VISIT_APPOINTMENT_LINK",
        path: "/annual-physical-exam/visit-appointment-link",
        component: () => import("pages/ape/VisitAppointmentLink.vue"),
      },
      {
        name: "APE_VISIT_APPOINTMENT",
        path: "/annual-physical-exam/visit-appointment",
        component: () => import("pages/ape/VisitAppointment.vue"),
      },
      // {
      //   name: "APE_VISIT_APPOINTMENT_BULK",
      //   path: "/annual-physical-exam/visit-appointment-bulk",
      //   component: () => import("pages/ape/VisitAppointmentBulk.vue"),
      // },
      {
        name: "APE_COMPLETE_EXAM",
        path: "/annual-physical-exam/complete-exam",
        component: () => import("pages/ape/CompleteExam.vue"),
      },
      {
        name: "APE_VISIT_TRACKER",
        path: "/annual-physical-exam/track-visit",
        component: () => import("pages/ape/VisitTracker.vue"),
      },
      {
        name: "APE_ANALYTICS",
        path: "/annual-physical-exam/analytics",
        component: () => import("pages/ComingSoon.vue"),
      },
      // UERM DIAGNOSTIC EXAM
      {
        name: "DIAG_EXAM_PATIENT_REGISTRATION",
        path: "/diag-exam/patient-registration",
        component: () => import("pages/ComingSoon.vue"),
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
