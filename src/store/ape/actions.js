import { request, camelToKebab, createMap } from "src/helpers/util";

export const getExams = async (context) => {
  if (context.rootState.ape.exams?.length > 0) {
    return [
      context.rootState.ape.exams,
      context.rootState.ape.examsMap,
      context.rootState.ape.EXAMS,
    ];
  }

  const response = await request(
    "get",
    `${context.rootState.app.apiHost}/ape/misc/exams`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );

  if (response.error) {
    return [null, null];
  }

  const exams = response.body[0].map((e) => {
    const params = response.body[1]
      .filter((f) => f.examId === e.id)
      .map((f) => {
        return {
          ...f,
          default: f.defaultValue === "" ? "" : JSON.parse(f.defaultValue),
          options: f.options ? JSON.parse(f.options) : null,
        };
      })
      .sort((a, b) => {
        return a.sequenceNumber - b.sequenceNumber;
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

  const examsMapAndEnum = exams.reduce(
    (a, e) => {
      a[0][e.code] = e;
      a[1][e.code] = e.code;
      return a;
    },
    [{}, {}],
  );

  context.commit("setExams", [exams, examsMapAndEnum[0], examsMapAndEnum[1]]);

  return [
    context.rootState.ape.exams,
    context.rootState.ape.examsMap,
    context.rootState.ape.EXAMS,
  ];
};

export const getVisits = async (context, urlQuery) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const sendVisitAppointmentLink = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/send-appointment-link`,
    null,
    null,
    payload,
  );
};

export const registerVisit__OLD = async (context, urlQuery) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const registerVisit = async (context, urlQuery) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/from-ue-db`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const registerVisitManually = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/from-user`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context,
  );
};

export const acceptExam = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/accept-exam`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context,
  );
};

export const completeExam = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/visit/complete-exam`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context,
  );
};

export const track = async (context, patientCode) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/track/${patientCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getVisitExamDetails = async (context, urlQuery) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/exam-details`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getVisit = async (context, visitId) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/${visitId}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const updateVisit = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/ape/visit`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context,
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
    context,
  );
};

export const saveExamDetails = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/ape/visit/exam-details`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context,
  );
};

export const getPatients = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/patient`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getVisitsWithXray = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/w-xray`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const timeInOut = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/misc/time-in-out`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context,
  );
};

export const getXrayChestResultTemplates = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/misc/xray-chest-result-templates`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getAnalyticsSeenPatientCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/seen-patient-count`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getAnalyticsDrXraysReadCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/doctor-xrays-read-count`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getAnalyticsRegisteredPatientCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/registered-patient-count`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getAnalyticsDoctorPatientCount = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/doctor-patient-count`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getAnalyticsPatientVisitProgress = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/patient-visit-progress`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getNotSeenPatients = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/analytics/not-seen-patients`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
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
      context,
    );

    if (response.error) {
      console.log("Error fetching one of the app data.");
      continue;
    }

    context.commit("setAppData", {
      [dataName]: response.body,
      // ADD MAP AND ENUM VERSIONS OF AN APP DATA IF IT IS AN ARRAY
      ...(Array.isArray(response.body)
        ? {
            [`${dataName}Map`]: response.body.reduce((a, e) => {
              a[e.code] = e;
              return a;
            }, {}),
            [dataName.toUpperCase()]: response.body.reduce((a, e) => {
              a[e.code] = e.code;
              return a;
            }, {}),
          }
        : {}),
    });
  }
};

export const getHeadDoctor = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/user/head-doctor`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};

export const getAllowedExams = async (context, patientId) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit/allowed-exams/${patientId}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context,
  );
};
