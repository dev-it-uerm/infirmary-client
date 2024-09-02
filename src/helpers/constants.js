// THIS IS TO LET THE LINTER HELP SUGGEST `map` PROPS WHILE BEING "DRY" AT THE SAME TIME
const _formatMap = (map) => {
  for (const key in map) {
    if (!map[key]) {
      map[key] = { name: key, code: key };
      continue;
    }

    if (map[key].constructor.name === "Object") {
      // 0 AND null ARE VALID CODES
      map[key] = {
        ...map[key],
        code:
          map[key].code === undefined || map[key].code === ""
            ? key
            : map[key].code,
      };

      continue;
    }

    map[key] = { name: map[key], code: key };
  }
};

export const campusesMap = {
  MNL: "Manila",
  CAL: "Caloocan",
  UERM: null, // `name` is the same as the `code`
};

export const yearLevelsMap = {
  NA: { code: null, name: "N/A" },
  FIRST: { code: 1, name: "First Year" },
  SECOND: { code: 2, name: "Second Year" },
  THIRD: { code: 3, name: "Third Year" },
  FOURTH: { code: 4, name: "Fourth Year" },
  FIFTH: { code: 5, name: "Fifth Year" },
  SIXTH: { code: 6, name: "Sixth Year" },
};

export const affiliationsMap = {
  EMP: "Employee/Faculty",
  STU: "Student",
};

export const userRolesMap = {
  ADMIN: "Administrator",
  DR: "Physician",
  NURSE: "Nurse",
  RAD: "Radiologist",
  LAB: "Pathologist",
  RADTECH: "Radiologic Technologist",
  LABTECH: "Laboratory Technologist",
  STAFF: "Staff",
  FAC: "Faculty",
};

_formatMap(campusesMap);
_formatMap(yearLevelsMap);
_formatMap(affiliationsMap);
_formatMap(userRolesMap);

export const campuses = Object.values(campusesMap);
export const yearLevels = Object.values(yearLevelsMap);
export const affiliations = Object.values(affiliationsMap);
export const userRoles = Object.values(userRolesMap);

export const app = {
  name: "UE Infirmary",
  version: "1.0.0",
  url: "https://uermhospital.com.ph/apps/infirmary",
};

const navMenuAPEPxRegistration = {
  code: "APE_PATIENT_REGISTRATION",
  name: "Add Patient",
  url: "/ape/patient-registration",
  icon: "fa-solid fa-person-circle-plus",
};

const navMenuRegistration = {
  code: "APE_REGISTRATION",
  name: "Triage",
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

// const navMenuAPEExamAccept = {
//   code: "APE_EXAM_ACCEPT",
//   name: "Receive Patient",
//   url: "/ape/exam-accept",
//   icon: "fa-solid fa-door-open",
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
  navMenuAPEPxRegistration,
  // {
  //   code: "VISIT_APPOINTMENT_LINK",
  //   name: "Visit Appointment",
  //   url: "/visit-appointment-link",
  //   icon: "fa-regular fa-id-card",
  // },
  // navMenuAPEVisitAppointmentBulk,
  navMenuAPEVisits,
  // navMenuAPEExamAccept,
  navMenuAPEVisitTracker,
  // navMenuAPECompleteExam,
  navMenuAPEXrayEncodeBulk,
  navMenuAPEAnalytics,
];

export const diagNavMenus = [navMenuPxRegistration];
