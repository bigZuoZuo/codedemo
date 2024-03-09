import React from "react";
import Loading from "@src/components/loading/loading";
import Loadable from "react-loadable";

export default (loader, style) =>
  Loadable({ loader, loading: () => <Loading style={{ position: "fixed", ...style }} /> });
