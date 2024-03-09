import React from "react";
import { useModal, useMask } from "@src/hooks";

import "./award.scoped.css";

const AwardModal = () => {
  const [visible, setVisible, args = []] = useModal(AwardModal);

  const _onClose = () => {
    setVisible(false);
  };

  useMask(visible);

  const awards = args[0] || [];

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      <div className="content-wrapper">
        <div className="award-modal">
          <span data-title />
          <h6 className="new-title">恭喜获得</h6>
          <div className="content" data-start={awards.length > 1 ? 1 : 0}>
            {awards.length === 1 ? (
              <div className="award-wrapper">
                <img src={awards[0].img} alt="" />
              </div>
            ) : null}
            {awards.map((item, index) => (
              <span key={index}>{item.name}</span>
            ))}
          </div>
          <div className="award-action" onClick={_onClose} />
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};

export default AwardModal;
