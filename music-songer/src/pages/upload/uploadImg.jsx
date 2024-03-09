import { observer } from "mobx-react";
import React, { useState } from "react";

import AddImg from "./images/add-img.png";
import "./uploadImg.scoped.css";

export default observer(function UploadImg(props) {
  console.log(props);
  const [showImg, setShowImg] = useState("");
  function uploadImg(cover) {
    const fileReader = new FileReader();
    if (cover) {
      fileReader.readAsDataURL(cover);
    }
    fileReader.onload = (e) => {
      props.setCoverImg(cover);
      setShowImg(e.target.result);
    };
  }
  return (
    <div className="upload-img">
      <div className="file">
        <input
          type="file"
          placeholder="作品配图"
          accept="image/*"
          onChange={(e) => uploadImg(e.target.files[0])}
        />
        {showImg === "" ? (
          <img src={AddImg} alt="" />
        ) : (
          <img className="have-img" src={showImg} alt="" />
        )}
      </div>
    </div>
  );
});
