import React from "react";
import { Redirect, Router, Route, Switch } from "react-router-dom";
import history from "./history";
import lazyload from "./lib/lazyload";
import { shouldRedirectToEntry } from "./lib/utils";

const requireAllPages = (context) => context.keys();
const pageComponent = require.context(`./pages`, true, /index\.(ts|js)x/);

const parseRoutes = (_path) => {
  _path = _path.toLowerCase();
  if (_path === "ranks") {
    return [`/${_path}`, "/singers"];
  }

  return `/${_path}`;
};

const routes = requireAllPages(pageComponent)
  .map((_path) => _path.replace(/^\.\//, "").replace(/\/index\.(ts|js)x/, ""))
  .map((_path) => ({
    path: parseRoutes(_path),
    exact: ["rule"].includes(_path) ? false : true,
    component: lazyload(() => import(`./pages/${_path}`)),
  }));

export default () => (
  <Router history={history}>
    <Switch>
      <Redirect from="/" to={shouldRedirectToEntry() ? "/entry" : "/matches"} exact />
      {routes.map(({ path, exact, component }) => {
        if (!component) {
          return null;
        }

        return <Route key={String(path)} exact={exact} path={path} component={component} />;
      })}
      <Route path="/" component={lazyload(() => import("@src/pages/not-found/index"))} />
    </Switch>
  </Router>
);
