import { useEffect } from "react";

export function useMask(visable) {
  useEffect(() => {
    const el = document.querySelector("#root");
    if (!el) {
      return;
    }

    el.style.overflow = visable ? "hidden" : "auto";
    el.style.maxHeight = visable ? "100vh" : "auto";
    el.style.position = visable ? "absolute" : "static";
    el.style.left = visable ? "0" : "auto";
    el.style.bottom = visable ? "0" : "auto";
    el.style.right = visable ? "0" : "auto";
    el.style.top = visable ? "0" : "auto";
  }, [visable]);

  useEffect(() => {
    const el = document.querySelector("#root");
    if (!el) {
      return;
    }

    return () => {
      el.style.overflow = "auto";
      el.style.maxHeight = "auto";
    };
  }, []);
}
