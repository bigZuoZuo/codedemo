import { useState, useLayoutEffect } from "react";

export function useModal(comp) {
  const [visible, setVisible] = useState(false);
  const [args, setArgs] = useState(undefined);

  useLayoutEffect(() => {
    comp.show = (...args) => {
      setVisible(true);
      setArgs(args);
    };
    comp.hide = () => {
      setVisible(false);
      setArgs(undefined);
    };
  }, [comp.hide, comp.show]);

  return [visible, setVisible, args];
}
