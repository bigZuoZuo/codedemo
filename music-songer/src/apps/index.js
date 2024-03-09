import banban from "./banban";
import teammate from "./teammate";
import partying from "./partying";
import who from "./who";
import wolf from "./wolf";

// 未知环境(从域名或者包名都无法判断的app环境,比如localhost)下的默认app
const defaultApp = banban;

// 根据网页地址域名获取app
export function getAppByHostname() {
  let app = [banban, teammate, partying, who, wolf].find((appItem) =>
    window.location.hostname.includes(appItem.domain)
  );
  return app || defaultApp;
}

// 根据包名获取app
export function getAppByPackage(pkg) {
  let app = [banban, teammate, partying, who, wolf].find((appItem) =>
    Object.values(appItem.pkg)
      .flat()
      .includes(pkg)
  );
  if (!app) console.log(`此app包名未配置: ${pkg},请联系邓勇添加配置`);
  return app || getAppByHostname() || defaultApp;
}
