import { request } from "src/helpers/util";
import { Cookies } from "quasar";
import qs from "qs";

export const add = async (context, payload) => {
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
    payload,
    context
  );
};

export const logout = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/user/logout`,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const changeUserInfo = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/user/change-info`,
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
    payload,
    context
  );
};

export const sendPasswordResetLink = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/user/send-pw-reset-link`,
    null,
    payload,
    context
  );
};
