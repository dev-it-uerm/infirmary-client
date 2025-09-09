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
        name: "APE_PATIENT_ATTENDANCE",
        path: "/ape/patient-attendance",
        component: () => import("pages/ape/PatientAttendance.vue"),
      },
      {
        name: "APE_PATIENT_REGISTRATION",
        path: "/ape/patient-registration",
        component: () => import("pages/ape/PatientRegistration.vue"),
      },
      {
        name: "APE_EMPLOYEE_ATTENDANCE",
        path: "/ape/employee-attendance",
        component: () => import("pages/ape/EmployeeAttendance.vue"),
      },
      {
        name: "APE_VISITS",
        path: "/ape/visits",
        component: () => import("pages/ape/Visits.vue"),
      },
      // {
      //   name: "APE_COMPLETE_EXAM",
      //   path: "/ape/complete-exam",
      //   component: () => import("pages/ape/CompleteExam.vue"),
      // },
      // {
      //   name: "APE_EXAM_ACCEPT",
      //   path: "/ape/exam-accept",
      //   component: () => import("pages/ape/ExamAccept.vue"),
      // },
      {
        name: "APE_VISIT_TRACKER",
        path: "/ape/track-visit",
        component: () => import("pages/ape/VisitTracker.vue"),
      },
      {
        name: "APE_XRAY_ENCODE_BULK",
        path: "/ape/xray-encode-bulk",
        component: () => import("pages/ape/XrayEncodeBulk.vue"),
      },
      {
        name: "APE_ANALYTICS",
        path: "/ape/analytics",
        component: () => import("pages/ape/Analytics.vue"),
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
