import System from "@src/system";
// app日志上报
import qs from "qs";
export function report(params) {
  let report_url = "https://log.iambanban.com/xs?";
  let reportInfo = JSON.parse(localStorage.getItem("reportInfo"));
  let mac = reportInfo && reportInfo.mac;
  let report_map = {
    ct: new Date().getTime(),
    mac,
    ch: "web_h5",
    tp: "web",
    vref: encodeURIComponent(window.location.href),
    ...reportInfo,
    ...params,
  };

  let url = report_url + qs.stringify(report_map);
  let img = new Image();
  img.onload = img.onerror = () => (img = null);
  img.src = url;
}

// thinkingdata日志上报
export function initThinkingData() {
  window.ta = {
    track() {
      throw new Error("请检查thinkingdata是否已正确引入");
    },
  };

  if (!System.thinkingdata || !window.thinkingdata) {
    console.log("当前app未配置thinkingdata");
    return;
  }

  // 初始化数数
  window.ta = window.thinkingdata;

  let { server_env, thinkingdata, pkg, mac, uid } = System;
  window.ta.init({
    appId: thinkingdata[server_env].appid,
    serverUrl: thinkingdata[server_env].domain,
  });

  window.ta.setSuperProperties({
    package_name: pkg,
    mac: mac,
  });

  window.ta.login(uid);
}
