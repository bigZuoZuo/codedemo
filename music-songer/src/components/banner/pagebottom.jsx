import React from "react";
// import PageBottom2 from "@src/assets/page-bottom2.png";
import PageBottom3 from "@src/assets/page-bottom3.png";


import "./index.scoped.css";

const PageBottom = (props) => {
  return (
    <div className="page-bottom">
      <img src={PageBottom3} alt="" />
      {/* <img src={PageBottom2} alt="" /> */}
    </div>
  );
};

export default PageBottom;
