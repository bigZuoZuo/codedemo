import React from "react";
import clsx from "clsx";

import "./index.scoped.css";

const CommonPannel = (props) => {
  return (
    <div
      className={clsx(
        "common-pannel",
        props.row && "row",
        props.column && "column"
      )}
    >
      {props.title && <div className="pannel-title">{props.title}</div>}
      <div className="children">
        {props.grade && <span data-grade />}
        {props.children}
      </div>
      {props.shadow && (
        <>
          <span data-shadow1 />
          <span data-shadow2 />
        </>
      )}
      {props.fixedbottom && <div className="fixed-bottom" />}
    </div>
  );
};

export default CommonPannel;
