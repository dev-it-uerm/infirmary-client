import { request } from "src/helpers/util";
import { Cookies } from "quasar";
import qs from "qs";

export function setUser(context, payload) {
  context.commit("setUser", payload);
  Cookies.set("px_portal__user", payload);
}

export function clearUser(context) {
  context.commit("setUser", null);
  Cookies.remove("px_portal__user");
}

export const login = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/px-portal/user/login`,
    null,
    payload,
    context
  );
};

export const logout = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/px-portal/user/logout`,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const getDiagnostics = async (context) => {
  if (context.state.diagnostics && context.state.diagnostics.length > 0) return;

  const response = await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/app/diagnostics`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );

  if (!response.error) context.commit("setDiagnostics", response.body);
};

export const getDiagnosticCenters = async (context) => {
  if (context.state.diagCenters && context.state.diagCenters.length > 0) return;

  const response = await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/app/diagnostic-centers`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );

  if (!response.error) context.commit("setDiagnosticCenters", response.body);
};

export const getLabResults = async (context, filters) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/app/lab-results?${qs.stringify(
      filters
    )}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

// export const getRadResults = async (context, filters) => {
//   return await request(
//     "get",
//     `${context.rootState.app.apiHost}/px-portal/app/rad-results?${qs.stringify(
//       filters
//     )}`,
//     context.rootState.app?.user?.accessToken,
//     null,
//     context
//   );
// };

export const getOthers = async (context) => {
  return {
    error: false,
    body: [],
  };
};

export const getLabPdfList = async (context, filters) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/app/lab-pdf-list?${qs.stringify(
      filters
    )}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getRadPdfList = async (context, filters) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/app/rad-pdf-list?${qs.stringify(
      filters
    )}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getOthersList = async (context) => {
  return {
    error: false,
    body: [],
  };
};

export const changeUserInfo = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/px-portal/user/change-info`,
    context.rootState.app?.user?.accessToken,
    payload,
    context
  );
};

export const changePassword = async (context, payload) => {
  return await request(
    "put",
    `${context.rootState.app.apiHost}/px-portal/user/change-pw`,
    null,
    payload,
    context
  );
};

export const sendPasswordResetLink = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/px-portal/user/send-pw-reset-link`,
    null,
    payload,
    context
  );
};

export const getEncounters = async (context, payload) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/encounter?${qs.stringify(
      payload
    )}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getSoaHospCharges = async (context, caseNo) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/encounter/soa-hosp-charges/${caseNo}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getSoaOtherCharges = async (context, caseNo) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/encounter/soa-other-charges/${caseNo}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getProFees = async (context, caseNo) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/encounter/soa-pro-fees/${caseNo}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const getDoctors = async (context, searchStr) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/doctors?searchStr=${searchStr}`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};
