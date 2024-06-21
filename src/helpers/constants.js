export const examsMap = {
  PE: {
    code: "PE",
    name: "Physical Exam",
    icon: "fa-solid fa-weight-scale",
  },
  LABCBC: {
    code: "LABCBC",
    name: "Lab - CBC",
    icon: "fa-solid fa-droplet",
  },
  LABURI: {
    code: "LABURI",
    name: "Lab - Urinalysis",
    icon: "fa-solid fa-flask-vial",
  },
  LABFCL: {
    code: "LABFCL",
    name: "Lab - Fecalysis",
    icon: "fa-solid fa-poop",
  },
  RADXRCHST: {
    code: "RADXRCHST",
    name: "Rad - X-Ray (Chest)",
    icon: "fa-solid fa-x-ray",
  },
};

export const campusesMap = {
  MNL: { code: "MNL", name: "Manila" },
  CAL: { code: "CAL", name: "Caloocan" },
  UERM: { code: "UERM", name: "UERM" },
};

export const collegesMap = {
  MED: { code: "MED", name: "Medicine" },
  NST: { code: "NST", name: "Nursing" },
  MEDTECH: { code: "MEDTECH", name: "Medical Technology" },
};

export const yearLevelsMap = {
  FIRST: { code: 1, name: "First Year" },
  SECOND: { code: 2, name: "Second Year" },
  THIRD: { code: 3, name: "Third Year" },
  FOURTH: { code: 4, name: "Fourth Year" },
};

export const userRolesMap = {
  ADM: { code: "CON", name: "Physician" },
  ADM: { code: "ADM", name: "Administrator" },
  MED: { code: "MED", name: "Medical Staff" },
  RAD: { code: "RAD", name: "Radiology Staff" },
  LAB: { code: "LAB", name: "Laboratory Staff" },
};

export const affiliationsMap = {
  EMP: { code: "EMP", name: "Employee/Faculty" },
  STU: { code: "STU", name: "Student" },
};

export const exams = Object.values(examsMap);
export const campuses = Object.values(campusesMap);
export const colleges = Object.values(collegesMap);
export const yearLevels = Object.values(yearLevelsMap);
export const affiliations = Object.values(affiliationsMap);
export const userRoles = Object.values(userRolesMap);

export const app = {
  name: "UERM Infirmary",
  version: "1.0.0",
  url: "https://uermhospital.com.ph/apps/infirmary",
};

// const navMenuAPEPxRegistration = {
//   code: "APE_PATIENT_REGISTRATION",
//   name: "Register Patient",
//   url: "/ape/patient-registration",
//   icon: "fa-solid fa-person-circle-plus",
// };

const navMenuRegistration = {
  code: "APE_REGISTRATION",
  name: "Registration",
  url: "/ape/registration",
  icon: "fa-solid fa-list-check",
};

// const navMenuAPEVisitAppointmentBulk = {
//   code: "APE_VISIT_APPOINTMENT_BULK",
//   name: "Visit Appointment",
//   url: "/ape/visit-appointment-bulk",
//   icon: "fa-solid fa-calendar-days",
// };

const navMenuAPEVisits = {
  code: "APE_VISITS",
  name: "Visits",
  url: "/ape/visits",
  icon: "fa-solid fa-stethoscope",
};

const navMenuAPEVisitTracker = {
  code: "APE_VISIT_TRACKER",
  name: "Visit Tracker",
  url: "/ape/track-visit",
  icon: "fa-solid fa-magnifying-glass",
};

const navMenuAPEXrayEncodeBulk = {
  code: "APE_XRAY_ENCODE_BULK",
  name: "X-Ray Batch Encode",
  url: "/ape/xray-encode-bulk",
  icon: "fa-solid fa-list-ul",
};

// const navMenuAPECompleteExam = {
//   code: "APE_COMPLETE_EXAM",
//   name: "Complete Exam",
//   url: "/ape/complete-exam",
//   icon: "fa-solid fa-user-tag",
// };

const navMenuAPEAnalytics = {
  code: "APE_ANALYTICS",
  name: "Analytics",
  url: "/ape/analytics",
  icon: "fa-solid fa-chart-pie",
};

// FOR INFIRMARY DIAGNOSTIC PROCEDURE
const navMenuPxRegistration = {
  code: "DIAG_EXAM_PATIENT_REGISTRATION",
  name: "Add Patient",
  url: "/diag-exam/patient-registration",
  icon: "fa-solid fa-person-circle-plus",
};

export const apeNavMenus = [
  navMenuRegistration,
  // navMenuAPEPxRegistration,
  // {
  //   code: "VISIT_APPOINTMENT_LINK",
  //   name: "Visit Appointment",
  //   url: "/visit-appointment-link",
  //   icon: "fa-regular fa-id-card",
  // },
  // navMenuAPEVisitAppointmentBulk,
  navMenuAPEVisits,
  navMenuAPEVisitTracker,
  // navMenuAPECompleteExam,
  navMenuAPEXrayEncodeBulk,
  navMenuAPEAnalytics,
];

export const diagNavMenus = [navMenuPxRegistration];
