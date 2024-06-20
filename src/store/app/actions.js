import { request } from "src/helpers/util";
import { Cookies } from "quasar";

export const addUser = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/user`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export function setUser(context, payload) {
  context.commit("setUser", payload);
  Cookies.set("uerm_infirmary__user", payload);
}

export function clearUser(context) {
  context.commit("setUser", null);
  Cookies.remove("uerm_infirmary__user");
}

export const login = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/user/login`,
    null,
    null,
    payload,
    context
  );
};

export const logout = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/user/logout`,
    null,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const changeUserInfo = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/user/change-info`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const changePassword = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/user/change-pw`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const resetPassword = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/user/reset-pw`,
    null,
    null,
    payload,
    context
  );
};

export const sendPasswordResetLink = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/user/send-pw-reset-link`,
    null,
    null,
    payload,
    context
  );
};

export const registerPatient = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/register-and-schedule`,
    null,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};
