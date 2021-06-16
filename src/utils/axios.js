import axios from "axios";
import { message } from "antd";
import API from "./api";
window.API = API;

axios.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      _t: new Date().getTime(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (res) => {
    const code = res.data.errCode;
    if (+code === 200) {
      return res.data.data;
    } else {
      message.error(code);
      return null;
    }
  },
  (error) => {
    console.log("error", error);
    const status = error.response.status;
    switch (status) {
      case 400:
        break;
      case 401:
        window.location.href =
          "/tenant/#/login?return_insite=" +
          encodeURIComponent(window.location.href);
        break;
      case 403:
        window.location.href = "/tenant/";
        break;
      default:
        message.error(`w${status}`);
        break;
    }
  }
);

window.axios = axios;
