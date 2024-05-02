import { request } from "src/helpers/util";
import qs from "qs";

export const getOnlinePayments = async (context) => {
  return await request(
    "get",
    `${context.rootState.app.apiHost}/px-portal/online-payments`,
    context.rootState.app?.user?.accessToken,
    null,
    context
  );
};

export const uploadOnlinePayments = async (context, payload) => {
  return await request(
    "post",
    `${context.rootState.app.apiHost}/px-portal/online-payments?${qs.stringify(
      payload
    )}`,
    context.rootState.app?.user?.accessToken,
    payload.formData,
    context,
    false
  );
};
