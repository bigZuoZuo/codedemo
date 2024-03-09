import React, { memo } from "react";

import imgNoData from "@src/assets/images/img-empty.png";
import "./index.scoped.css";

const NoData = memo((props) => {
  return (
    <div className="no-data">
      <img src={imgNoData} alt="" />
      {props.tips&&<p className="no-tips">{props.tips}</p>}
    </div>
  );
});

export default NoData;
