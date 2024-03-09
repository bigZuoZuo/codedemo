import CreateProtal from "@src/lib/createProtal";
import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "./mask.scoped.css";

export default function Mask({ visible, onClick, children, onEnter, onExited }) {
  // // 去除弹框滚动穿透
  useEffect(() => {
    window.document.body.style.overflow = visible ? "hidden" : "auto";
    window.document.body.style.height = window.document.documentElement.style.height = visible ? "100%" : "auto";
  }, [visible]);

  useEffect(() => {
    return () => {
      window.document.body.style.overflow = "auto";
      window.document.body.style.height = window.document.documentElement.style.height = "auto";
    };
  }, []);

  return (
    <CSSTransition in={visible} timeout={300} unmountOnExit classNames="fade" onEnter={onEnter} onExited={onExited}>
      <CreateProtal>
        <div className={`mask `} onClick={onClick}>
          <div className="content" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </CreateProtal>
    </CSSTransition>
  );
}
