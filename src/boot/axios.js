import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.DEV ? process.env.apiHost__DEV : process.env.apiHost,
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return {
      error: true,
      status: error.response?.status ?? 0,
      body:
        error.response?.data ??
        error.response?.statusText ??
        "REST API Unreachable",
    };
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api };
