import React, { memo } from "react";
import clsx from "clsx";

import "./index.scoped.css";

import imgStar from "./images/img-star.png";
import imgStar1 from "./images/img-star1.png";

const Star = memo(({ list, right }) => {
  const _list = [false, false, false, false].map((_, index) => !!(list || [])[index]);

  return (
    <div className={clsx("star", right && "right")}>
      {_list.map((item, index) => (
        <img key={`star-${index}`} src={item ? imgStar1 : imgStar} alt="" />
      ))}
    </div>
  );
});

export default Star;
