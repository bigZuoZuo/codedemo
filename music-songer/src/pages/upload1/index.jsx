import { signup, uploadFile } from "@src/services/index";
import { toast } from "@src/system";
import Loading from "@src/components/loading/loading";
import React, { useState } from "react";
import DeviceInfo from "@src/lib/deviceinfo";
import System from "@src/system";
import "./upload.scoped.css";
import { observer } from "mobx-react";
import { useUserinfoState, useSignupStatusService } from "@src/hooks";

export default observer(function Upload() {
  let [name, setName] = useState();
  let [intro, setIntro] = useState();
  let [style, setStyle] = useState(1);
  let [music, setMusic] = useState();
  let [cover, setCover] = useState();
  let [loading, setLoading] = useState(false);
  const userInfoState = useUserinfoState();

  async function upload() {
    let formData1 = new FormData();
    let formData2 = new FormData();

    formData1.append("files", music);
    formData1.append("uid", System.uid);
    formData2.append("files", cover);
    formData2.append("uid", System.uid);

    let [{ url }, { url: image }] = await Promise.all([
      uploadFile(formData1),
      uploadFile(formData2),
    ]);
    return { url, image };
  }

  async function submit() {
    if (!userInfoState.canSignup) return;

    if (!name) return toast("请填写歌曲名称");
    if (!intro) return toast("请填写歌曲简介");
    if (!style) return toast("请填写歌曲风格");
    if (!music) return toast("请选择要上传的歌曲");
    if (!cover) return toast("请选择要上传的歌曲封面");
    if (music.size > 20 * 1024 * 1024) return toast("文件不能大于20M");

    try {
      setLoading(true);
      let { url, image } = await upload();
      await signup(name, intro, style, url, image);
      toast(userInfoState.signupStatus === 2 ? "更新成功" : "报名成功");
      userInfoState.fetchSignupStatus();
    } finally {
      setLoading(false);
    }
  }

  useSignupStatusService();

  return (
    <div className={`page ${DeviceInfo.platform}`}>
      {loading && (
        <Loading
          width="50px"
          height="50px"
          style={{
            position: "fixed",
            minHeight: "auto",
            zIndex: 10,
            backgroundColor: "rgba(255,255,255, 0.6)",
            fontSize: "16px",
          }}
        >
          上传中...
        </Loading>
      )}
      <div className="card">
        <div className="title">歌曲名称</div>
        <input type="text" placeholder="歌曲名称" onChange={(e) => setName(e.target.value)} />
        <div className="title">歌曲简介</div>
        <textarea placeholder="歌曲简介" onChange={(e) => setIntro(e.target.value)} />
        <div className="title">曲风</div>
        <select placeholder="曲风" value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="1">流行</option>
          <option value="2">古风</option>
          <option value="3">民谣</option>
          <option value="4">rap</option>
          <option value="5">其它</option>
        </select>
        <div className="title">作品</div>
        <div className="file">
          <input
            type="file"
            placeholder="作品上传"
            accept="audio/mpeg"
            onChange={(e) => setMusic(e.target.files[0])}
          />
        </div>
        <div className="title">作品配图</div>
        <div className="file">
          <input
            type="file"
            placeholder="作品配图"
            accept="image/png"
            onChange={(e) => setCover(e.target.files[0])}
          />
        </div>
        <button onClick={submit}>{userInfoState.signUpTxt}</button>
      </div>
    </div>
  );
});
