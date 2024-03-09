import "@src/lib/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import App from "./App";
import setConsole from "./lib/console";
import System from "./system";
import stores from "./store";

// 监听未被捕获的promise异常
window.addEventListener("unhandledrejection", (event) => {
  console.log(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});

(async () => {
  await setConsole();
  await System.init();

  const root = document.getElementById("root");

  ReactDOM.render(
    <Provider {...stores}>
      <App />
    </Provider>,
    root
  );
})();
