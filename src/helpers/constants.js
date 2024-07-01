// const _getMapArrayThenFormat = (map) => {
//   for (const key in map) {
//     map[key] = {
//       ...(typeof map[key] === "object" ? map[key] : { name: map[key] }),
//       code: key,
//     };
//   }
// };

// THIS IS TO LET THE LINTER HELP SUGGEST `map` PROPS WHILE BEING "DRY" AT THE SAME TIME
// `code` WILL BE USED AS ENUM VALUE IF IT EXISTS
const _getMapArrayThenFormat = (obj) => {
  const map = {};
  const arr = [];

  for (const key in obj) {
    if (!obj[key]) {
      arr.push({ name: key, code: key });
      map[key] = { name: key, code: key };
      obj[key] = key;
      continue;
    }

    if (obj[key].constructor.name === "Object") {
      arr.push({ ...obj[key], code: obj[key].code || key });
      map[key] = { ...obj[key], code: obj[key].code || key };
      obj[key] = obj[key].code || key;
      continue;
    }

    arr.push({ name: obj[key], code: key });
    map[key] = { name: obj[key], code: key };
    obj[key] = key;
    continue;
  }

  return [map, arr];
};

export const EXAMS = {
  PE: {
    name: "Physical Exam",
    icon: "fa-solid fa-weight-scale",
  },
  LABCBC: {
    name: "Lab - CBC",
    icon: "fa-solid fa-droplet",
  },
  LABURI: {
    name: "Lab - Urinalysis",
    icon: "fa-solid fa-flask-vial",
  },
  LABFCL: {
    name: "Lab - Fecalysis",
    icon: "fa-solid fa-poop",
  },
  RADXRCHST: {
    name: "Rad - X-Ray (Chest)",
    icon: "fa-solid fa-x-ray",
  },
};

export const CAMPUSES = {
  MNL: "Manila",
  CAL: "Caloocan",
  UERM: "UERM",
};

export const COLLEGES = {
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
};

export const YEAR_LEVELS = {
  FIRST: { code: 1, name: "First Year" },
  SECOND: { code: 2, name: "Second Year" },
  THIRD: { code: 3, name: "Third Year" },
  FOURTH: { code: 4, name: "Fourth Year" },
};

export const AFFILIATIONS = {
  EMP: "Employee/Faculty",
  STU: "Student",
};

export const USER_ROLES = {
  ADMIN: "Administrator",
  DR: "Physician",
  NURSE: "Nurse",
  STAFF: "Staff",
  RAD: "Radiologist",
  LAB: "Pathologist",
  RADTECH: "Radiology Technician",
  LABTECH: "Laboratory Technician",
};

export const DEPARTMENTS = {
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
  ELEM: "ELEMENTARY",
  ELEMLAB: "ELEMENTARY LABORATORY SCHOOL",
  ENVSRV: "ENVIRONMENTAL SERVICES OFFICE",
  FNCE: "FINANCE OFFICE",
  GENSRVPRNT: "GENERAL SERVICES - PRINTING",
  GUID: "GUIDANCE, COUNSELLING AND CAREER SERVICES OFFICE",
  HS: "HIGH SCHOOL",
  IT: "INFORMATION TECHNOLOGY DEPARTMENT",
  INTAUD: "INTERNAL AUDIT DEPARTMENT",
  KNDR: "KINDERGARTEN",
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
  SHS: "SENIOR HIGH SCHOOL",
  STCK: "STOCK & RECEIVING OFFICE",
  STUAFF: "STUDENT AFFAIRS OFFICE",
  PUBLSH: "TEXTBOOK EVALUATION & PUBLISHING OFFICE",
  UNIVREL: "UNIVERSITY RELATIONS OFFICE",
  UNIVTHEA: "UNIVERSITY THEATER",
};

export const [examsMap, exams] = _getMapArrayThenFormat(EXAMS);
export const [campusesMap, campuses] = _getMapArrayThenFormat(CAMPUSES);
export const [collegesMap, colleges] = _getMapArrayThenFormat(COLLEGES);
export const [yearLevelsMap, yearLevels] = _getMapArrayThenFormat(YEAR_LEVELS);

export const [affiliationsMap, affiliations] =
  _getMapArrayThenFormat(AFFILIATIONS);

export const [userRolesMap, userRoles] = _getMapArrayThenFormat(USER_ROLES);

export const [departmentsMap, departments] =
  _getMapArrayThenFormat(DEPARTMENTS);

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
  [EXAMS.PE]: [
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
  [EXAMS.LABCBC]: [
    {
      code: `${EXAMS.LABCBC}HGB`,
      name: "HGB",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "g/L",
        normalRange: "140-160m / 120-140f",
      },
    },
    {
      code: `${EXAMS.LABCBC}HCT`,
      name: "HCT",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.40-0.54m / 0.37-0.47f",
      },
    },
    {
      code: `${EXAMS.LABCBC}RBC`,
      name: "RBC",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "x10^12/L",
        normalRange: "4.5-5.0",
      },
    },
    {
      code: `${EXAMS.LABCBC}MCHC`,
      name: "MCHC",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "pg",
        normalRange: "32-37",
      },
    },
    {
      code: `${EXAMS.LABCBC}MCV`,
      name: "MCV",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "fL",
        normalRange: "80-94",
      },
    },
    {
      code: `${EXAMS.LABCBC}RDWCV`,
      name: "RDW-CV",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `${EXAMS.LABCBC}RDWSD`,
      name: "RDW-SD",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `${EXAMS.LABCBC}WBC`,
      name: "WBC",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "x10^9/L",
        normalRange: "5-10",
      },
    },
    {
      code: `${EXAMS.LABCBC}NEUT`,
      name: "NEUT",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.40-0.75",
      },
    },
    {
      code: `${EXAMS.LABCBC}LYMPH`,
      name: "LYMPH",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.20-0.45",
      },
    },
    {
      code: `${EXAMS.LABCBC}MONO`,
      name: "MONO",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.02-0.06",
      },
    },
    {
      code: `${EXAMS.LABCBC}BASO`,
      name: "BASO",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "%",
        normalRange: "0.01-0.04",
      },
    },
    {
      code: `${EXAMS.LABCBC}PLT`,
      name: "PLT",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `${EXAMS.LABCBC}MPV`,
      name: "MPV",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
    {
      code: `${EXAMS.LABCBC}MORPH`,
      name: "MORPH",
      type: "DIAGTEST",
      default: {
        value: null,
        unit: "",
        normalRange: "",
      },
    },
  ],
  [EXAMS.LABURI]: [
    {
      code: `${EXAMS.LABURI}COLOR`,
      name: "Color",
      type: "DIAGTESTSELECT",
      options: ["Straw", "Light Yellow", "Yellow", "Dark Yellow", "Amber"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}TURB`,
      name: "Turbidity",
      type: "DIAGTESTSELECT",
      options: ["Clear", "Slightly Cloudy", "Cloudy", "Turbid"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}SPGR`,
      name: "SP GR",
      type: "DIAGTESTSELECT",
      options: ["1.000", "1.005", "1.010", "1.015", "1.020", "1.025", "1.030"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}PH`,
      name: "PH",
      type: "DIAGTESTSELECT",
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}PRTN`,
      name: "Protein",
      type: "DIAGTESTSELECT",
      options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}SGR`,
      name: "Sugar",
      type: "DIAGTESTSELECT",
      options: ["None", "Negative", "Trace", "1+", "2+", "3+", "4+"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}RBC`,
      name: "RBC",
      type: "DIAGTESTSELECT",
      options: ["None"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}EPI`,
      name: "Epithelial",
      type: "DIAGTESTSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}MCS`,
      name: "Mucus",
      type: "DIAGTESTSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
    {
      code: `${EXAMS.LABURI}CRSTL`,
      name: "Crystal",
      type: "DIAGTESTSELECT",
      options: ["None", "Few", "Many", "Moderate", "Abundant"],
      default: { value: null },
    },
  ],
  [EXAMS.LABFCL]: [
    {
      code: `${EXAMS.LABFCL}IMPRN`,
      name: "Impression",
      type: "DIAGTESTTEXTAREA",
      default: { value: null },
    },
  ],
  [EXAMS.RADXRCHST]: [
    {
      code: `${EXAMS.RADXRCHST}IMPRN`,
      name: "Impression",
      type: "DIAGTESTTEXTAREA",
      default: { value: null },
    },
  ],
};

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
