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

export const visitPhasesMap = {
  REG: { code: "REG", name: "Registered" },
  ...examsMap,
  FIN: { code: "FIN", name: "Completed" },
};

export const campusesMap = {
  MNL: { code: "MNL", name: "Manila" },
  CAL: { code: "CAL", name: "Caloocan" },
  UERM: { code: "UERM", name: "UERM" },
};

export const userRolesMap = {
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
export const affiliations = Object.values(affiliationsMap);
export const userRoles = Object.values(userRolesMap);
export const visitPhases = Object.values(visitPhasesMap);

export const app = {
  name: "UERM Infirmary",
  version: "1.0.0",
  url: "https://uermhospital.com.ph/apps/infirmary",
};

export const navMenus = [
  {
    code: "USER_REGISTRATION",
    name: "Add/Update User",
    url: "/user-registration",
    icon: "fa-solid fa-user-plus",
  },
  // {
  //   code: "VISIT_APPOINTMENT_LINK",
  //   name: "Visit Appointment",
  //   url: "/visit-appointment-link",
  //   icon: "fa-regular fa-id-card",
  // },
  {
    code: "VISIT_APPOINTMENT_BULK",
    name: "Visit Appointment",
    url: "/visit-appointment-bulk",
    icon: "fa-solid fa-calendar-days",
  },
  {
    code: "VISITS",
    name: "Visits",
    url: "/visits",
    icon: "fa-solid fa-stethoscope",
  },
  {
    code: "COMPLETE_EXAM",
    name: "Complete Exam",
    url: "/complete-exam",
    icon: "fa-solid fa-user-tag",
  },
  {
    code: "VISIT_TRACKER",
    name: "Visit Tracker",
    url: "/track-visit",
    icon: "fa-solid fa-magnifying-glass",
  },
];
