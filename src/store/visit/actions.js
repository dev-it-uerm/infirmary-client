import { request } from "src/helpers/util.js";

export const get = async (context, urlQuery) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/visit`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const sendVisitAppointmentLink = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/send-visit-appointment-link`,
    null,
    null,
    payload
  );
};

export const schedule = async (context, accessToken) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/schedule-visit?accessToken=${accessToken}`
  );
};

export const completeExam = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/complete-exam`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const track = async (context, visitCode) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/track-visit/${visitCode}`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getDetails = async (context, urlQuery) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/visit-details`,
    urlQuery,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const saveDetails = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/visit-details`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};
