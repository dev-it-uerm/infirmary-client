import { request } from "src/helpers/util";

const _toMap = (arr) => {
  return arr.reduce((acc, e) => {
    acc[e.code] = e.name;
    return acc;
  }, {});
};

export const getDepartments = async (context) => {
  if (context.state.departments && context.state.departmentsMap) {
    return [context.state.departments, context.state.departmentsMap];
  }

  const response = await request(
    "get",
    `${context.rootState.app.apiHost}/ape/misc/departments`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );

  if (response.error) return [[], {}];

  const ret = [response.body, _toMap(response.body)];
  context.commit("setDepartments", ret);
  return ret;
};

export const getExams = async (context) => {
  if (context.state.exams && context.state.examsMap) {
    return [context.state.exams, context.state.examsMap];
  }

  const response = await request(
    "get",
    `${context.rootState.app.apiHost}/ape/misc/exams`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );

  if (response.error) return [[], {}];

  const exams = response.body[0];
  const examParams = response.body[1];

  const examsMap = exams.reduce((acc, e) => {
    acc[e.code] = {
      ...e,
      params: examParams
        .filter((p) => p.examId === e.id)
        .map((p) => ({
          ...p,
          ...(p.defaultValue == null || p.defaultValue === ""
            ? {}
            : { defaultValue: JSON.parse(p.defaultValue) }),
        }))
        .toSorted((a, b) => a.sequenceNumber - b.sequenceNumber),
    };

    return acc;
  }, {});

  const ret = [Object.values(examsMap), examsMap];
  context.commit("setExams", ret);
  return ret;
};

export const getVisits = async (context, urlQuery) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const sendVisitAppointmentLink = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/send-appointment-link`,
    null,
    null,
    payload
  );
};

export const scheduleSelf = async (context, accessToken) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/self-schedule`,
    { accessToken }
  );
};

export const schedule = async (context, patientCode) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/schedule/${patientCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const acceptExam = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/accept-exam`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const completeExam = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/complete-exam`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const track = async (context, patientCode) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/track/${patientCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getVisitExamDetails = async (context, urlQuery) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/exam-details`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getVisit = async (context, visitId) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/${visitId}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const updateVisit = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/ape/visit`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

// export const getVisitDetailsAll = async (context, visitId) => {
//   return await request(
//     "get",
//     `${context.rootState.app.apiHost}/ape/visit-details-all/${visitId}`,
//     null,
//     context.rootState.app?.user?.accessToken,
//     null,
//     context
//   );
// };

export const getVisitPdfJson = async (context, visitId) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/printout/visit-pdf-json/${visitId}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const saveExamDetails = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/ape/visit/exam-details`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const getPatients = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/patient`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const addPatient = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/patient`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const getVisitExams = async (context, visitId) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/exams/${visitId}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getVisitsWithXray = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/w-xray`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsCompletedVisitsPerDay = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/completed-visits-per-day`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const timeInOut = async (context, employeeCode) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/misc/time-in-out/${employeeCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getXrayChestResultTemplates = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/misc/xray-chest-result-templates`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsPatientsSeenByDr = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/patients-seen-by-dr`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsXraysReadByDr = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/xrays-read-by-dr`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsPatientsVisited = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/patients-registered`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsDoctorPatients = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/doctor-patients`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsPatientVisitProgress = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/patient-visit-progress`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getConfig = async (context, payload) => {
  if (context.state.config) {
    return context.state.config;
  }

  const response = await request(
    "get",
    `${context.rootState.app.apiHost}/ape/misc/app-config`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );

  if (response.error) {
    return null;
  }

  context.commit("setConfig", response.body);
  return response.body;
};
