import { homepage as basename } from "../package.json";
import { createBrowserHistory } from "history";
if (basename === "/ee-h5seed") {
  console.error("请修改package.json中的homepage字段为你的项目名称");
}
export default createBrowserHistory({ basename });
