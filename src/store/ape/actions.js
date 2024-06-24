import { request } from "src/helpers/util";

export const get = async (context, urlQuery) => {
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
    `${context.rootState.app.apiHost}/ape/send-visit-appointment-link`,
    null,
    null,
    payload
  );
};

export const scheduleSelf = async (context, accessToken) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/schedule-visit-self`,
    { accessToken }
  );
};

export const schedule = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/schedule-visit`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const completeExam = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/complete-exam`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const track = async (context, visitCode) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/track-visit/${visitCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getDetails = async (context, urlQuery) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit-details`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const saveDetails = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/ape/visit-details`,
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

export const registerPatient = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/register-and-schedule`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const register = async (context, patientCode) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/register/${patientCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const timeInOut = async (context, employeeCode) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/ape/time-in-out/${employeeCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getVisitExams = async (context, visitId) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit-exams/${visitId}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getVisitsWithXray = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/ape/visit-w-xray`,
    payload,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};
