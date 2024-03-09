import { isLocal, isProduction } from "@src/system";

export default async function setConsole() {
  // 在本地开发环境时不需要vconsole
  if (isLocal) return;
  // 在生产环境且无需vconsole时,覆盖console.log方法
  if (!window.location.search.includes("console") && isProduction) window.console.log = function() {};
  // 非生产环境,或需要console时,加载vconsole
  else {
    let VConsole = await import("vconsole");
    new VConsole.default();
  }
}
