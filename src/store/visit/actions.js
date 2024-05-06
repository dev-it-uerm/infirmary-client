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

export const sendRegistrationLink = async (context, patientCode) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/send-visit-registration-link`,
    null,
    null,
    { code: patientCode }
  );
};

export const register = async (context, accessToken) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/register?accessToken=${accessToken}`
  );
};

export const changeStatus = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/visit-status`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};
