import Frisbee from "frisbee";
import { Platform } from "react-native";
import { BASE_URL } from "./config";
import storage from "./store/storage";

const Api = {
  api: () => {
    let api = new Frisbee({
      baseURI: BASE_URL,
      headers: {
        Accept: "application/text",
        "Content-Type": "application/text",
      },
    });

    api.interceptor.register({
      response: (response) => {
        let text = response.body;
        if (Platform.OS === "android") {
          text = text.replace(/\r?\n/g, "").replace(/[\u0080-\uFFFF]/g, "");
        }
        return JSON.parse(text);
      },
      request: function (path, options) {
        return [path, options];
      },
    });

    return api;
  },

  noBaseApi: function () {
    let api = new Frisbee({
      headers: {
        Accept: "application/text",
        "Content-Type": "application/text",
      },
    });

    api.interceptor.register({
      response: (response) => {
        let text = response.body;
        if (Platform.OS === "android") {
          text = text.replace(/\r?\n/g, "").replace(/[\u0080-\uFFFF]/g, ""); // If android , I've removed unwanted chars.
        }
        return JSON.parse(text);
      },
      request: function (path, options) {
        // Read/Modify the path or options
        return [path, options];
      },
    });

    return api;
  },

  get: async function (url, param, withBase) {
    if (withBase === undefined || withBase) {
      return this.api().get(url, {
        body: param,
      });
    } else {
      return this.noBaseApi().get(url, {
        body: param,
      });
    }
  },

  getWithCache: async function (url, param, callback) {
    storage.get(url).then((result) => {
      let data = JSON.parse(result);
      if (result !== null && result !== undefined) {
        let bound = callback.bind();
        bound(data);
      }
    });

    this.get(url, param).then((result) => {
      storage.set(url, JSON.stringify(result));
      let bound = callback.bind();
      bound(result);
    });
  },

  post: async function (url, param) {
    return this.api().post(url, {
      body: param,
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8;",
      },
    });
  },
};

export default Api;
