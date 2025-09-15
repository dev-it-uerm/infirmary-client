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

// export const examsMap = {
//   MED_HIST: {
//     name: "Medical History",
//     icon: "fa-solid fa-notes-medical",
//   },
//   PE: {
//     name: "Physical Exam",
//     icon: "fa-solid fa-weight-scale",
//   },
//   LAB_CBC: {
//     name: "Lab - CBC",
//     icon: "fa-solid fa-droplet",
//   },
//   LAB_URI: {
//     name: "Lab - Urinalysis",
//     icon: "fa-solid fa-flask-vial",
//   },
//   LAB_FCL: {
//     name: "Lab - Fecalysis",
//     icon: "fa-solid fa-poop",
//   },
//   RAD_XR_CHST: {
//     name: "Rad - X-Ray (Chest)",
//     icon: "fa-solid fa-x-ray",
//   },
// };

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

// _formatMap(examsMap);
_formatMap(yearLevelsMap);
_formatMap(affiliationsMap);
_formatMap(userRolesMap);

// export const exams = Object.values(examsMap);
export const yearLevels = Object.values(yearLevelsMap);
export const affiliations = Object.values(affiliationsMap);
export const userRoles = Object.values(userRolesMap);

// export const examFieldsMap = {
//   [examsMap.MED_HIST.code]: [
//     {
//       code: "PRESENTSYMPTOMS",
//       name: "Present Symptoms",
//       type: "EXAMTEXTAREA",
//     },
//     {
//       code: "PASTILLNESSES",
//       name: "Past Illnesses",
//       type: "EXAMTEXTAREA",
//       required: true,
//     },
//     {
//       code: "OPERATIONS",
//       name: "Surgeries/Operations",
//       type: "EXAMTEXTAREA",
//     },
//     {
//       code: "ALLERGIES",
//       name: "Allergies",
//       type: "EXAMTEXTAREA",
//     },
//     {
//       code: "MEDICATIONS",
//       name: "Medications",
//       type: "EXAMTEXTAREA",
//     },
//     {
//       code: "MENSHISTLMP",
//       name: "Menstrual History (LMP)",
//       type: "EXAMTEXTAREA",
//     },
//     {
//       code: "FAMHIST",
//       name: "Family History",
//       type: "EXAMTEXTAREA",
//     },
//     {
//       code: "REMARKS",
//       name: "Remarks",
//       type: "EXAMTEXTAREA",
//     },
//   ],
//   [examsMap.PE.code]: [
//     {
//       code: "VSIGNBP",
//       name: "Blood Pressure",
//       type: "EXAMTEXT",
//       required: true,
//     },
//     {
//       code: "VSIGNRR",
//       name: "Respiratory Rate",
//       type: "EXAMTEXT",
//       required: true,
//     },
//     {
//       code: "VSIGNHR",
//       name: "Heart Rate",
//       type: "EXAMTEXT",
//       required: true,
//     },
//     {
//       code: "HEIGHT",
//       name: "Height",
//       type: "EXAMTEXT",
//       required: true,
//     },
//     {
//       code: "WEIGHT",
//       name: "Weight",
//       type: "EXAMTEXT",
//       required: true,
//     },
//     {
//       code: "SKIN",
//       name: "Skin",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "HEENT",
//       name: "HEENT",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "NECK",
//       name: "Neck",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "CHEST",
//       name: "Chest",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "BREAST",
//       name: "Breast",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "HEART",
//       name: "Heart",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "ABDOMEN",
//       name: "Abdomen",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "GENITOURINARY",
//       name: "Genitourinary",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "ANUS",
//       name: "Anus",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "REFLEXES",
//       name: "Reflexes",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "EXTREMITIES",
//       name: "Extremities",
//       type: "EXAMTEXT",
//       default: { value: "NORMAL" },
//       required: true,
//     },
//     {
//       code: "REMARKS",
//       name: "Remarks",
//       type: "EXAMTEXTAREA",
//     },
//   ],
//   [examsMap.LAB_CBC.code]: [
//     {
//       code: `HGB`,
//       name: "Hemoglobin",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "g/L",
//         normalRange: "140-160m / 120-140f",
//       },
//     },
//     {
//       code: `HCT`,
//       name: "Hematocrit",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "%",
//         normalRange: "0.40-0.54m / 0.37-0.47f",
//       },
//     },
//     {
//       code: `RBC`,
//       name: "RBC",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "x10^12/L",
//         normalRange: "4.5-5.0",
//       },
//     },
//     {
//       code: `MCHC`,
//       name: "MCHC",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "pg",
//         normalRange: "32-37",
//       },
//     },
//     {
//       code: `MCH`,
//       name: "MCH",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "",
//         normalRange: "",
//       },
//     },
//     {
//       code: `MCV`,
//       name: "MCV",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "fL",
//         normalRange: "80-94",
//       },
//     },
//     {
//       code: `RDWCV`,
//       name: "RDW-CV",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "",
//         normalRange: "",
//       },
//     },
//     {
//       code: `RDWSD`,
//       name: "RDW-SD",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "",
//         normalRange: "",
//       },
//     },
//     {
//       code: `WBC`,
//       name: "WBC",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "x10^9/L",
//         normalRange: "5-10",
//       },
//     },
//     {
//       code: `NEUT`,
//       name: "Neutrophils",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "%",
//         normalRange: "0.40-0.75",
//       },
//     },
//     {
//       code: `LYMPH`,
//       name: "Lymphocytes",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "%",
//         normalRange: "0.20-0.45",
//       },
//     },
//     {
//       code: `EOSINO`,
//       name: "Eosinophils",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "",
//         normalRange: "",
//       },
//     },
//     {
//       code: `MONO`,
//       name: "Monocytes",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "%",
//         normalRange: "0.02-0.06",
//       },
//     },
//     {
//       code: `BASO`,
//       name: "Basophils",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "%",
//         normalRange: "0.01-0.04",
//       },
//     },
//     {
//       code: `PLT`,
//       name: "Platelet",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "",
//         normalRange: "",
//       },
//     },
//     {
//       code: `MPV`,
//       name: "MPV",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "",
//         normalRange: "",
//       },
//     },
//     {
//       code: `MORPH`,
//       name: "Morphology",
//       type: "EXAM",
//       default: {
//         value: null,
//         unit: "",
//         normalRange: "",
//       },
//     },
//     {
//       code: "REMARKS",
//       name: "Remarks",
//       type: "EXAMTEXTAREA",
//     },
//   ],
//   [examsMap.LAB_URI.code]: [
//     {
//       code: `COLOR`,
//       name: "Color",
//       type: "EXAMSELECT",
//       options: ["Straw", "Light Yellow", "Yellow", "Dark Yellow", "Amber"],
//       default: { value: null },
//     },
//     {
//       code: `TURB`,
//       name: "Turbidity",
//       type: "EXAMSELECT",
//       options: ["Clear", "Slightly Cloudy", "Cloudy", "Turbid"],
//       default: { value: null },
//     },
//     {
//       code: `PH`,
//       name: "PH",
//       type: "EXAMSELECT",
//       default: { value: null },
//     },
//     {
//       code: `LEU`,
//       name: "Leukocytes",
//       type: "EXAM",
//       default: { value: null, unit: "", normalRange: "" },
//     },
//     {
//       code: `NIT`,
//       name: "Nitrite",
//       type: "EXAMSELECT",
//       options: [],
//       default: { value: null },
//     },
//     {
//       code: `URO`,
//       name: "Urobilinogen",
//       type: "EXAMSELECT",
//       options: [],
//       default: { value: null },
//     },
//     {
//       code: `PRTN`,
//       name: "Protein",
//       type: "EXAMSELECT",
//       options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
//       default: { value: null },
//     },
//     {
//       code: `REA`,
//       name: "Reaction",
//       type: "EXAMSELECT",
//       options: [],
//       default: { value: null },
//     },
//     {
//       code: `BLOOD`,
//       name: "Blood",
//       type: "EXAMSELECT",
//       options: [],
//       default: { value: null },
//     },
//     {
//       code: `SPGR`,
//       name: "SP GR",
//       type: "EXAM",
//       default: { value: null, unit: "", normalRange: "" },
//     },
//     {
//       code: `KET`,
//       name: "Ketones",
//       type: "EXAMSELECT",
//       options: [],
//       default: { value: null },
//     },
//     {
//       code: `BILI`,
//       name: "Bilirubin",
//       type: "EXAMSELECT",
//       options: [],
//       default: { value: null },
//     },
//     {
//       code: `SGR`,
//       name: "Sugar",
//       type: "EXAMSELECT",
//       options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
//       default: { value: null },
//     },
//     {
//       code: `RBC`,
//       name: "RBC",
//       type: "EXAM",
//       default: { value: null, unit: "", normalRange: "" },
//     },
//     {
//       code: `WBC`,
//       name: "WBC",
//       type: "EXAM",
//       default: { value: null, unit: "", normalRange: "" },
//     },
//     {
//       code: `BACT`,
//       name: "Bacteria",
//       type: "EXAMSELECT",
//       options: [],
//       default: { value: null },
//     },
//     {
//       code: `EPI`,
//       name: "Epithelial",
//       type: "EXAMSELECT",
//       options: ["None", "Few", "Many", "Moderate", "Abundant"],
//       default: { value: null },
//     },
//     {
//       code: `MCS`,
//       name: "Mucus",
//       type: "EXAMSELECT",
//       options: ["None", "Few", "Many", "Moderate", "Abundant"],
//       default: { value: null },
//     },
//     {
//       code: "REMARKS",
//       name: "Remarks",
//       type: "EXAMTEXTAREA",
//     },
//   ],
//   [examsMap.LAB_FCL.code]: [
//     {
//       code: "CHAR",
//       name: "Character",
//       type: "EXAMTEXT",
//       required: false,
//     },
//     {
//       code: "COLOR",
//       name: "Color",
//       type: "EXAMTEXT",
//       required: false,
//     },
//     {
//       code: "RBC",
//       name: "RBC",
//       type: "EXAMTEXT",
//       required: false,
//     },
//     {
//       code: "WBC",
//       name: "WBC",
//       type: "EXAMTEXT",
//       required: false,
//     },
//     {
//       code: "PRSTE",
//       name: "Parasite or Ova",
//       type: "EXAMTEXT",
//       required: false,
//     },
//     {
//       code: "REMARKS",
//       name: "Remarks",
//       type: "EXAMTEXTAREA",
//     },
//   ],
//   [examsMap.RAD_XR_CHST.code]: [
//     {
//       code: `IMPRN`,
//       name: "Impression",
//       type: "XRAYIMPRESSION",
//       default: { value: null },
//     },
//     {
//       code: "REMARKS",
//       name: "Remarks",
//       type: "EXAMTEXTAREA",
//     },
//   ],
// };

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

const navMenuAPEEmployeeAttendance = {
  code: "APE_EMPLOYEE_ATTENDANCE",
  name: "Employee Attendance",
  url: "/ape/employee-attendance",
  icon: "fa-solid fa-calendar-days",
};

const navMenuRegistration = {
  code: "APE_PATIENT_ATTENDANCE",
  name: "Triage",
  url: "/ape/patient-attendance",
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
  navMenuAPEEmployeeAttendance,
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
