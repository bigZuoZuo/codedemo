import React from "react";
import clsx from "clsx";

import "./index.scoped.css";

const ModalAwardList = (props) => {
  return (
    <div className="award-list">
      {props.list.map((item, index) => (
        <div
          key={item.key}
          className={clsx("list-item-layer", index === props.list.length - 1 && "last")}
        >
          <div className="list-item-key">{item.key}</div>
          <div className="list-item-dot" />
          <div className="list-item-award">
            <img src={item.img} alt="" />
          </div>
          <div className="list-item-name">
            {item.name}
            {props.showPeriod && <span>{item.period}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModalAwardList;
