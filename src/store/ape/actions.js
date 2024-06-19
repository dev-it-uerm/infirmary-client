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