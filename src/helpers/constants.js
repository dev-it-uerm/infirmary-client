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

export const examFieldsMap = {
  MEDHIST: [
    {
      code: "PRESENTSYMPTOMS",
      name: "Present Symptoms",
      type: "TEXTAREA",
    },
    {
      code: "PASTILLNESSES",
      name: "Past Illnesses",
      type: "TEXTAREA",
    },
    {
      code: "ALLERGIES",
      name: "Allergies",
      type: "TEXTAREA",
    },
    {
      code: "MEDICATIONS",
      name: "Medications",
      type: "TEXTAREA",
    },
    {
      code: "MENSHISTLMP",
      name: "Menstrual History (LMP)",
      type: "TEXTAREA",
    },
    {
      code: "OPERATIONS",
      name: "Surgeries/Operations",
      type: "TEXTAREA",
    },
  ],
  PE: [
    {
      code: "VSIGNBP",
      name: "Blood Pressure",
      type: "TEXT",
      required: true,
    },
    {
      code: "VSIGNRR",
      name: "Respiratory Rate",
      type: "TEXT",
      required: true,
    },
    {
      code: "VSIGNHR",
      name: "Heart Rate",
      type: "TEXT",
      required: true,
    },
    {
      code: "HEIGHT",
      name: "height",
      type: "TEXT",
      required: true,
    },
    {
      code: "WEIGHT",
      name: "weight",
      type: "TEXT",
      required: true,
    },
    {
      code: "SKIN",
      name: "Skin",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "HEENT",
      name: "HEENT",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "NECK",
      name: "Neck",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "CHEST",
      name: "Chest",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "BREAST",
      name: "Breast",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "HEART",
      name: "Heart",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "ABDOMEN",
      name: "Abdomen",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "GENITOURINARY",
      name: "Genitourinary",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "ANUS",
      name: "Anus",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "REFLEXES",
      name: "Reflexes",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
    {
      code: "EXTREMITIES",
      name: "Extremities",
      type: "TEXT",
      default: "NORMAL",
      required: true,
    },
  ],
  LABCBC: [
    {
      code: "LABCBCHGB",
      name: "HGB",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "g/L",
        normalRange: "140-160m / 120-140f",
      },
    },
    {
      code: "LABCBCHCT",
      name: "HCT",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.40-0.54m / 0.37-0.47f",
      },
    },
    {
      code: "LABCBCRBC",
      name: "RBC",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "x10^12/L",
        normalRange: "4.5-5.0",
      },
    },
    {
      code: "LABCBCMCHC",
      name: "MCHC",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "pg",
        normalRange: "32-37",
      },
    },
    {
      code: "LABCBCMCV",
      name: "MCV",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "fL",
        normalRange: "80-94",
      },
    },
    {
      code: "LABCBCRDWCV",
      name: "RDW-CV",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: "LABCBCRDWSD",
      name: "RDW-SD",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: "LABCBCWBC",
      name: "WBC",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "x10^9/L",
        normalRange: "5-10",
      },
    },
    {
      code: "LABCBCNEUT",
      name: "NEUT",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.40-0.75",
      },
    },
    {
      code: "LABCBCLYMPH",
      name: "LYMPH",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.20-0.45",
      },
    },
    {
      code: "LABCBCMONO",
      name: "MONO",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.02-0.06",
      },
    },
    {
      code: "LABCBCBASO",
      name: "BASO",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.01-0.04",
      },
    },
    {
      code: "LABCBCPLT",
      name: "PLT",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: "LABCBCMPV",
      name: "MPV",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: "LABCBCMORPH",
      name: "MORPH",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
  ],
  LABURI: [
    {
      code: "LABURICOLOR",
      name: "Color",
      type: "DIAGTESTSELECT",
      options: ["Straw", "Light Yellow", "Yellow", "Dark Yellow", "Amber"],
      default: { value: null },
    },
    {
      code: "LABURITURB",
      name: "Turbidity",
      type: "DIAGTESTSELECT",
      options: ["Clear", "Slightly Cloudy", "Cloudy", "Turbid"],
      default: { value: null },
    },
    {
      code: "LABURISPGR",
      name: "SP GR",
      type: "DIAGTESTSELECT",
      options: ["1.000", "1.005", "1.010", "1.015", "1.020", "1.025", "1.030"],
      default: { value: null },
    },
    {
      code: "LABURIPH",
      name: "PH",
      type: "DIAGTESTSELECT",
      default: { value: null },
    },
    {
      code: "LABURIPRTN",
      name: "Protein",
      type: "DIAGTESTSELECT",
      options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
      default: { value: null },
    },
    {
      code: "LABURISGR",
      name: "Sugar",
      type: "DIAGTESTSELECT",
      options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
      default: { value: null },
    },
    {
      code: "LABURIRBC",
      name: "RBC",
      type: "DIAGTESTSELECT",
      options: ["None"],
      default: { value: null },
    },
    {
      code: "LABURIEPI",
      name: "Epithelial",
      type: "DIAGTESTSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
    {
      code: "LABURIMCS",
      name: "Mucus",
      type: "DIAGTESTSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
    {
      code: "LABURICRSTL",
      name: "Crystal",
      type: "DIAGTESTSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
  ],
  LABFCL: [
    {
      code: "LABFCLIMPRN",
      name: "Impression",
      type: "DIAGTESTTEXTAREA",
      default: { value: null },
    },
  ],
  RADXRCHST: [
    {
      code: "RADXRCHSTIMPRN",
      name: "Impression",
      type: "DIAGTESTTEXTAREA",
      default: { value: null },
    },
  ],
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
  ADMIN: { code: "ADMIN", name: "Administrator" },
  DR: { code: "DR", name: "Physician" },
  NURSE: { code: "NURSE", name: "Nurse" },
  STAFF: { code: "STAFF", name: "Staff" },
  RADTECH: { code: "RADTECH", name: "Radiology Technician" },
  LABTECH: { code: "LABTECH", name: "Laboratory Technician" },
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
  navMenuAPEVisitTracker,
  // navMenuAPECompleteExam,
  navMenuAPEXrayEncodeBulk,
  navMenuAPEAnalytics,
];

export const diagNavMenus = [navMenuPxRegistration];
