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

export const examsMap = {
  MED_HIST: {
    name: "Medical History",
    icon: "fa-solid fa-notes-medical",
  },
  PE: {
    name: "Physical Exam",
    icon: "fa-solid fa-weight-scale",
  },
  LAB_CBC: {
    name: "Lab - CBC",
    icon: "fa-solid fa-droplet",
  },
  LAB_URI: {
    name: "Lab - Urinalysis",
    icon: "fa-solid fa-flask-vial",
  },
  LAB_FCL: {
    name: "Lab - Fecalysis",
    icon: "fa-solid fa-poop",
  },
  RAD_XR_CHST: {
    name: "Rad - X-Ray (Chest)",
    icon: "fa-solid fa-x-ray",
  },
};

export const campusesMap = {
  MNL: "Manila",
  CAL: "Caloocan",
  UERM: null, // `name` is the same as the `code`
};

export const departmentsMap = {
  ADMSSN: "ADMISSIONS OFFICE",
  BBM: "BACHELOR OF BUSINESS MANAGEMENT",
  BED: "BASIC EDUCATION DEPARTMENT",
  BUDG: "BUDGET OFFICE",
  BENT: "BUSINESS ENTERPRISES",
  CASLAB: "CAS-LABORATORIES",
  COMPT: "COMPTROLLERS DEPARTMENT",
  ENGR: "DEPARTMENT OF ENGINEERING",
  GENSRV: "DEPARTMENT OF GENERAL SERVICES",
  HRD: "DEPARTMENT OF HUMAN RESOURCES & DEVELOPMENT",
  LIB: "DEPARTMENT OF LIBRARIES",
  REG: "DEPARTMENT OF REGISTRATION AND RECORDS MANAGEMENT",
  ELEMLAB: "ELEMENTARY LABORATORY SCHOOL",
  ENVSRV: "ENVIRONMENTAL SERVICES OFFICE",
  FNCE: "FINANCE OFFICE",
  GENSRVPRNT: "GENERAL SERVICES - PRINTING",
  GUID: "GUIDANCE, COUNSELLING AND CAREER SERVICES OFFICE",
  IT: "INFORMATION TECHNOLOGY DEPARTMENT",
  INTAUD: "INTERNAL AUDIT DEPARTMENT",
  MRKTG: "MARKETING AND UNIVERSITY RELATIONS DEPARTMENT",
  NATSRVTR: "NATIONAL SERVICE TRAINING PROGRAM",
  QA: "OFFICE FOR QUALITY ASSURANCE",
  CULTAFF: "OFFICE OF CULTURAL AFFAIRS",
  CURRDEV: "OFFICE OF CURRICULUM DEVELOPMENT AND INSTRUCTION",
  OUTRCH: "OFFICE OF EXTENSION AND COMMUNITY OUTREACH",
  RSRCHCOORD: "OFFICE OF RESEARCH COORDINATION",
  CHAIR: "OFFICE OF THE CHAIRMAN OF THE BOARD AND CEO",
  CHANC: "OFFICE OF THE CHANCELLOR",
  CORPSEC: "OFFICE OF THE CORPORATE SECRETARY",
  DIRADSRV: "OFFICE OF THE DIRECTOR FOR ADMINISTRATIVE SERVICES",
  EXECVP: "OFFICE OF THE EXECUTIVE VICE PRESIDENT AND CADO",
  PCAO: "OFFICE OF THE PRESIDENT AND CAO",
  SVPFAD: "OFFICE OF THE SVP FOR FINANCE AND ADMINISTRATION",
  LEGALCOUNSEL: "OFFICE OF THE UNIVERSITY LEGAL COUNSEL",
  VPFN: "OFFICE OF THE VICE PRESIDENT FOR FINANCE",
  PE: "PHYSICAL EDUCATION",
  PROP: "PROPERTY CUSTODIAN",
  PURCH: "PURCHASING OFFICE",
  SCNDLAB: "SECONDARY LABORATORY SCHOOL",
  SCRTY: "SECURITY OFFICE",
  STCK: "STOCK & RECEIVING OFFICE",
  STUAFF: "STUDENT AFFAIRS OFFICE",
  PUBLSH: "TEXTBOOK EVALUATION & PUBLISHING OFFICE",
  UNIVREL: "UNIVERSITY RELATIONS OFFICE",
  UNIVTHEA: "UNIVERSITY THEATER",
};

export const collegesMap = {
  GRAD: "Graduate School",
  MED: "Medicine",
  NURS: "Nursing",
  MEDTECH: "Medical Technology",
  ARTS: "Arts and Sciences",
  BA: "Business Administration",
  ENGR: "Engineering",
  CSS: "Computer Studies and Systems",
  DEN: "Dentistry",
  EDUC: "Education",
  FAAD: "Fine Arts, Architecture and Design",
  LAW: "Law",
  SHS: "Senior High School",
  HS: "High School",
  ELEM: "Elementary",
  KNDR: "Kindergarten",
};

export const yearLevelsMap = {
  NA: { code: null, name: "N/A" },
  FIRST: { code: 1, name: "First Year" },
  SECOND: { code: 2, name: "Second Year" },
  THIRD: { code: 3, name: "Third Year" },
  FOURTH: { code: 4, name: "Fourth Year" },
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
  RADTECH: "Radiology Technician",
  LABTECH: "Laboratory Technician",
  STAFF: "Staff",
  FAC: "Faculty",
};

_formatMap(examsMap);
_formatMap(campusesMap);
_formatMap(departmentsMap);
_formatMap(collegesMap);
_formatMap(yearLevelsMap);
_formatMap(affiliationsMap);
_formatMap(userRolesMap);

export const exams = Object.values(examsMap);
export const campuses = Object.values(campusesMap);
export const departments = Object.values(departmentsMap);
export const colleges = Object.values(collegesMap);
export const yearLevels = Object.values(yearLevelsMap);
export const affiliations = Object.values(affiliationsMap);
export const userRoles = Object.values(userRolesMap);

export const examFieldsMap = {
  [examsMap.MED_HIST.code]: [
    {
      code: "PRESENTSYMPTOMS",
      name: "Present Symptoms",
      type: "EXAMTEXTAREA",
    },
    {
      code: "PASTILLNESSES",
      name: "Past Illnesses",
      type: "EXAMTEXTAREA",
    },
    {
      code: "ALLERGIES",
      name: "Allergies",
      type: "EXAMTEXTAREA",
    },
    {
      code: "MEDICATIONS",
      name: "Medications",
      type: "EXAMTEXTAREA",
    },
    {
      code: "MENSHISTLMP",
      name: "Menstrual History (LMP)",
      type: "EXAMTEXTAREA",
    },
    {
      code: "OPERATIONS",
      name: "Surgeries/Operations",
      type: "EXAMTEXTAREA",
    },
    {
      code: "REMARKS",
      name: "Remarks",
      type: "EXAMTEXTAREA",
    },
  ],
  [examsMap.PE.code]: [
    {
      code: "VSIGNBP",
      name: "Blood Pressure",
      type: "EXAMTEXT",
      required: true,
    },
    {
      code: "VSIGNRR",
      name: "Respiratory Rate",
      type: "EXAMTEXT",
      required: true,
    },
    {
      code: "VSIGNHR",
      name: "Heart Rate",
      type: "EXAMTEXT",
      required: true,
    },
    {
      code: "HEIGHT",
      name: "height",
      type: "EXAMTEXT",
      required: true,
    },
    {
      code: "WEIGHT",
      name: "weight",
      type: "EXAMTEXT",
      required: true,
    },
    {
      code: "SKIN",
      name: "Skin",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "HEENT",
      name: "HEENT",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "NECK",
      name: "Neck",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "CHEST",
      name: "Chest",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "BREAST",
      name: "Breast",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "HEART",
      name: "Heart",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "ABDOMEN",
      name: "Abdomen",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "GENITOURINARY",
      name: "Genitourinary",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "ANUS",
      name: "Anus",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "REFLEXES",
      name: "Reflexes",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "EXTREMITIES",
      name: "Extremities",
      type: "EXAMTEXT",
      default: { value: "NORMAL" },
      required: true,
    },
    {
      code: "REMARKS",
      name: "Remarks",
      type: "EXAMTEXTAREA",
    },
  ],
  [examsMap.LAB_CBC.code]: [
    {
      code: `HGB`,
      name: "Hemoglobin",
      type: "EXAM",
      default: {
        value: null,
        unit: "g/L",
        normalRange: "140-160m / 120-140f",
      },
    },
    {
      code: `HCT`,
      name: "Hematocrit",
      type: "EXAM",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.40-0.54m / 0.37-0.47f",
      },
    },
    {
      code: `RBC`,
      name: "RBC",
      type: "EXAM",
      default: {
        value: null,
        unit: "x10^12/L",
        normalRange: "4.5-5.0",
      },
    },
    {
      code: `MCHC`,
      name: "MCHC",
      type: "EXAM",
      default: {
        value: null,
        unit: "pg",
        normalRange: "32-37",
      },
    },
    {
      code: `MCV`,
      name: "MCV",
      type: "EXAM",
      default: {
        value: null,
        unit: "fL",
        normalRange: "80-94",
      },
    },
    {
      code: `RDWCV`,
      name: "RDW-CV",
      type: "EXAM",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `RDWSD`,
      name: "RDW-SD",
      type: "EXAM",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `WBC`,
      name: "WBC",
      type: "EXAM",
      default: {
        value: null,
        unit: "x10^9/L",
        normalRange: "5-10",
      },
    },
    {
      code: `NEUT`,
      name: "Neutrophils",
      type: "EXAM",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.40-0.75",
      },
    },
    {
      code: `LYMPH`,
      name: "Lymphocytes",
      type: "EXAM",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.20-0.45",
      },
    },
    {
      code: `EOSINO`,
      name: "Eosinophils",
      type: "EXAM",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `MONO`,
      name: "Monocytes",
      type: "EXAM",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.02-0.06",
      },
    },
    {
      code: `BASO`,
      name: "Basophils",
      type: "EXAM",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.01-0.04",
      },
    },
    {
      code: `PLT`,
      name: "Platelet",
      type: "EXAM",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `MPV`,
      name: "MPV",
      type: "EXAM",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `MORPH`,
      name: "Morphology",
      type: "EXAM",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: "REMARKS",
      name: "Remarks",
      type: "EXAMTEXTAREA",
    },
  ],
  [examsMap.LAB_URI.code]: [
    {
      code: `COLOR`,
      name: "Color",
      type: "EXAMSELECT",
      options: ["Straw", "Light Yellow", "Yellow", "Dark Yellow", "Amber"],
      default: { value: null },
    },
    {
      code: `TURB`,
      name: "Turbidity",
      type: "EXAMSELECT",
      options: ["Clear", "Slightly Cloudy", "Cloudy", "Turbid"],
      default: { value: null },
    },
    {
      code: `SPGR`,
      name: "SP GR",
      type: "EXAMSELECT",
      options: ["1.000", "1.005", "1.010", "1.015", "1.020", "1.025", "1.030"],
      default: { value: null },
    },
    {
      code: `PH`,
      name: "PH",
      type: "EXAMSELECT",
      default: { value: null },
    },
    {
      code: `PRTN`,
      name: "Protein",
      type: "EXAMSELECT",
      options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
      default: { value: null },
    },
    {
      code: `SGR`,
      name: "Sugar",
      type: "EXAMSELECT",
      options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
      default: { value: null },
    },
    {
      code: `RBC`,
      name: "RBC",
      type: "EXAMSELECT",
      options: ["None"],
      default: { value: null },
    },
    {
      code: `EPI`,
      name: "Epithelial",
      type: "EXAMSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
    {
      code: `MCS`,
      name: "Mucus",
      type: "EXAMSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
    {
      code: `CRSTL`,
      name: "Crystal",
      type: "EXAMSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
    {
      code: "REMARKS",
      name: "Remarks",
      type: "EXAMTEXTAREA",
    },
  ],
  [examsMap.LAB_FCL.code]: [
    {
      code: `IMPRN`,
      name: "Impression",
      type: "EXAMTEXTAREA",
      default: { value: null },
    },
    {
      code: "REMARKS",
      name: "Remarks",
      type: "EXAMTEXTAREA",
    },
  ],
  [examsMap.RAD_XR_CHST.code]: [
    {
      code: `IMPRN`,
      name: "Impression",
      type: "XRAYIMPRESSION",
      default: { value: null },
    },
    {
      code: "REMARKS",
      name: "Remarks",
      type: "EXAMTEXTAREA",
    },
  ],
};

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

const navMenuAPEExamAccept = {
  code: "APE_EXAM_ACCEPT",
  name: "Receive Patient",
  url: "/ape/exam-accept",
  icon: "fa-solid fa-door-open",
};

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
  navMenuAPEExamAccept,
  navMenuAPEVisitTracker,
  // navMenuAPECompleteExam,
  navMenuAPEXrayEncodeBulk,
  navMenuAPEAnalytics,
];

export const diagNavMenus = [navMenuPxRegistration];
