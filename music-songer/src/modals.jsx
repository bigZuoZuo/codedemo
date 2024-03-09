import React from "react";
import { createPortal } from "react-dom";

export default function Modals() {
  const requireAllModals = (context) => context.keys();
  const pageComponent = require.context(`./components/modal`, true, /\.(ts|js)x$/);

  const modals = requireAllModals(pageComponent)
    .map((_path) => _path.replace(/^\.\//, "").replace(/\.(ts|js)x/, ""))
    .map((filename) => [require(`./components/modal/${filename}`).default, filename])
    .map(([ModalItem, filename]) => <ModalItem key={filename} />);

  return <>{createPortal(<>{modals}</>, document.querySelector("#modal"))}</>;
}
