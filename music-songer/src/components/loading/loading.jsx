import System from "@src/system";
import React from "react";
import "./loading.scoped.css";

export default function Loading({ style, children, width, height }) {
  const theme = {
    banban: {
      color: "#47CDFE",
    },
    partying: {
      color: "#FFF64E",
    },
    teammate: {
      color: "#242424",
    },
  }[System.appName];

  return (
    <div className="container" style={style}>
      <div className="loading" style={{ width, height }}>
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M512 981.312a469.312 469.312 0 1 0-445.824-322.24A42.688 42.688 0 1 0 147.2 632.32 384 384 0 1 1 512 896a42.688 42.688 0 1 0 0 85.312z"
            fill={style?.color || theme.color || "#aaaaaa"}
          />
        </svg>
      </div>
      {children}
    </div>
  );
}
