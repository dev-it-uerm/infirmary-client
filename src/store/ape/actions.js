import { request, camelToKebab, createMap } from "src/helpers/util";

export const getExams = async (context) => {
  if (context.rootState.ape.exams?.length > 0) {
    return [context.rootState.ape.exams, context.rootState.ape.examsMap];
  }

  const response = await request(
    "get",
    `${context.rootState.app.apiHost}/ape/misc/exams`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );

  if (!response.error) {
    const exams = response.body[0].map((e) => {
      const params = response.body[1]
        .filter((f) => f.examId === e.id)
        .map((f) => {
          return {
            ...f,
            default: JSON.parse(f.defaultValue),
            options: JSON.parse(f.options),
          };
        });

      return {
        ...e,
        params,
        paramsMap: params.reduce((a, p) => {
          a[p.code] = p;
          return a;
        }, {}),
      };
    });

    const examsMap = exams.reduce((a, e) => {
      a[e.code] = e;
      return a;
    }, {});

    context.commit("setExams", [exams, examsMap]);
    return [context.rootState.ape.exams, context.rootState.ape.examsMap];
  }

  return response;
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

export const getAnalyticsSeenPatientCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/seen-patient-count`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsDrXraysReadCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/doctor-xrays-read-count`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsRegisteredPatientCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/registered-patient-count`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAnalyticsDoctorPatientCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/doctor-patient-count`,
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

export const getNotSeenPatients = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/not-seen-patients`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getAppData = async (context) => {
  for (const dataName of ["appConfig", "campuses", "departments"]) {
    if (context.state[dataName]) {
      continue;
    }

    const response = await request(
      "get",
      `${context.rootState.app.apiHost}/ape/misc/${camelToKebab(dataName)}`,
      null,
      context.rootState.app?.user?.accessToken,
      null,
      context
    );

    if (response.error) {
      console.log("Error fetching one of the app data.");
      continue;
    }

    context.commit("setAppData", {
      [dataName]: response.body,
      // ADD MAP VERSION OF AN APP DATA IF IT IS AN ARRAY
      ...(Array.isArray(response.body)
        ? { [`${dataName}Map`]: createMap(response.body, "code") }
        : {}),
    });
  }
};
