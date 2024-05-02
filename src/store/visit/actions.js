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
