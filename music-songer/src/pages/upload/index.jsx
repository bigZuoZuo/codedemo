import { signup, uploadFile } from "@src/services/index";
import { toast } from "@src/system";
import Loading from "@src/components/loading/loading";
import React, { useState } from "react";
import DeviceInfo from "@src/lib/deviceinfo";
import System from "@src/system";
import "./upload2.scoped.css";
import { observer } from "mobx-react";
import { useUserinfoState, useSignupStatusService } from "@src/hooks";
import UploadImg from "./uploadImg";
import RightIcon from "./images/right.png";

export default observer(function Upload() {
  let [nameRefer, setNameRefer] = useState();
  let [styleRefer, setStyleRefer] = useState(1);
  let [introRefer, setIntroRefer] = useState();
  let [urlRefer, setUrlRefer] = useState();
  let [imageRefer, setImageRefer] = useState();

  let [name, setName] = useState();
  let [intro, setIntro] = useState();
  let [style, setStyle] = useState(1);
  let [music, setMusic] = useState();
  let [coverImg1, setCoverImg1] = useState();
  let [loading, setLoading] = useState(false);
  const userInfoState = useUserinfoState();

  async function upload() {
    let formData1 = new FormData();
    let formData2 = new FormData();

    formData1.append("files", urlRefer);
    formData1.append("uid", System.uid);
    formData2.append("files", imageRefer);
    formData2.append("uid", System.uid);

    let [{ url: url_refer }, { url: image_refer }] = await Promise.all([
      uploadFile(formData1),
      uploadFile(formData2),
    ]);
    return { url_refer, image_refer };
  }

  async function upload2() {
    let formData3 = new FormData();
    let formData4 = new FormData();
    formData3.append("files", music);
    formData3.append("uid", System.uid);
    formData4.append("files", coverImg1);
    formData4.append("uid", System.uid);

    let [{ url }, { url: image }] = await Promise.all([
      uploadFile(formData3),
      uploadFile(formData4),
    ]);
    return { url, image };
  }

  async function submit() {
    console.log(userInfoState);
    if (!userInfoState.canSignup) return;
    if (!nameRefer) return toast("请填写作品1歌曲名称");
    if (!introRefer) return toast("请填写作品1歌曲简介");
    if (!styleRefer) return toast("请填写作品1歌曲风格");
    if (!urlRefer) return toast("请选择作品1要上传的歌曲");
    if (!imageRefer) return toast("请选择作品1要上传的歌曲封面");
    if (!name) return toast("请填写作品2歌曲名称");
    if (!intro) return toast("请填写作品2歌曲简介");
    if (!style) return toast("请填写作品2歌曲风格");
    if (!music) return toast("请选择作品2要上传的歌曲");
    if (!coverImg1) return toast("请选择要作品2上传的歌曲封面");
    if (urlRefer.size > 20 * 1024 * 1024)
      return toast("作品1音频文件不能大于20M");
    if (music.size > 20 * 1024 * 1024)
      return toast("作品2音频文件文件不能大于20M");

    try {
      setLoading(true);
      let { url_refer, image_refer } = await upload();
      let { url, image } = await upload2();
      await signup(
        nameRefer,
        introRefer,
        styleRefer,
        url_refer,
        image_refer,
        name,
        intro,
        style,
        url,
        image
      );
      // console.log(result)
      // if (result.success) {
      toast(userInfoState.signupStatus === 2 ? "更新成功" : "报名成功");
      // }
      userInfoState.fetchSignupStatus();
    } finally {
      setLoading(false);
    }
  }

  useSignupStatusService();

  return (
    <div className="container">
      <div className={`page ${DeviceInfo.platform}`}>
        <div className="card">
          {loading && (
            <Loading
              width="50px"
              height="50px"
              style={{
                position: "absolute",
                minHeight: "auto",
                zIndex: 10,
                backgroundColor: "rgba(0,0,0, 0.5)",
                fontSize: "16px",
                top: 0,
                left: 0,
                color: "#fff",
              }}
            >
              上传中...
            </Loading>
          )}
          <div className="card-title">报名参赛</div>
          <div className="children">
            <div className="chapter">作品1</div>
            <div className="title">歌曲名称</div>
            <input
              type="text"
              placeholder="歌曲名称"
              onChange={(e) => setNameRefer(e.target.value)}
            />
            <div className="title">歌曲简介</div>
            <textarea
              placeholder="歌曲简介"
              onChange={(e) => setIntroRefer(e.target.value)}
            />
            <label className="label-selet" htmlFor="select1">
              <div className="label-title">曲风</div>
              <select
                id="select1"
                placeholder="曲风"
                value={styleRefer}
                onChange={(e) => setStyleRefer(e.target.value)}
              >
                <option value="1">流行</option>
                <option value="2">古风</option>
                <option value="3">民谣</option>
                <option value="4">rap</option>
                <option value="5">其它</option>
              </select>
            </label>
            <label className="label-selet" htmlFor="select2">
              <div
                className="label-title"
                style={{ justifyContent: "flex-start" }}
              >
                作品
                <span
                  style={{
                    color: "orange",
                    fontSize: "12px",
                    marginLeft: "4px",
                  }}
                >
                  (mp3格式, 20M以内, 2-5分钟)
                </span>
              </div>
              <div className="file">
                <input
                  id="select2"
                  type="file"
                  placeholder="作品上传"
                  accept="audio/mpeg,audio/ogg,application/ogg"
                  onChange={(e) => setUrlRefer(e.target.files[0])}
                />
                <div className="show-music">
                  {urlRefer && <p className="music-name">{urlRefer.name}</p>}
                  <img className="right-icon" src={RightIcon} alt="" />
                </div>
              </div>
            </label>
            <div className="title">作品配图</div>
            <UploadImg coverImg={imageRefer} setCoverImg={setImageRefer} />
            {/* <div className="file">
              <input
                type="file"
                placeholder="作品配图"
                accept="image/*"
                onChange={(e) => setCover(e.target.files[0])}
              />
            </div> */}
            {/* 作品二开始 */}
            <div className="chapter">作品2</div>
            <div className="title">歌曲名称</div>
            <input
              type="text"
              placeholder="歌曲名称"
              onChange={(e) => setName(e.target.value)}
            />
            <div className="title">歌曲简介</div>
            <textarea
              placeholder="歌曲简介"
              onChange={(e) => setIntro(e.target.value)}
            />
            <label className="label-selet" htmlFor="select3">
              <div className="label-title">曲风</div>
              <select
                id="select3"
                placeholder="曲风"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="1">流行</option>
                <option value="2">古风</option>
                <option value="3">民谣</option>
                <option value="4">rap</option>
                <option value="5">其它</option>
              </select>
            </label>
            <label htmlFor="selet4" className="label-selet">
              <div
                className="label-title"
                style={{ justifyContent: "flex-start" }}
              >
                作品
                <span
                  style={{
                    color: "orange",
                    fontSize: "12px",
                    marginLeft: "4px",
                  }}
                >
                  (mp3格式, 20M以内, 2-5分钟)
                </span>
              </div>
              <div className="file">
                <input
                  id="selet4"
                  type="file"
                  placeholder="作品上传"
                  accept="audio/mpeg,audio/ogg,application/ogg"
                  onChange={(e) => setMusic(e.target.files[0])}
                  // onClick={(e) => {
                  //   setMusic(e.target.files[0]);
                  // }}
                />
                <div className="show-music">
                  {music && <p className="music-name">{music.name}</p>}
                  <img className="right-icon" src={RightIcon} alt="" />
                </div>
              </div>
            </label>
            <div className="title">作品配图</div>
            <UploadImg coverImg={coverImg1} setCoverImg={setCoverImg1} />
            {/* 作品二结束 */}
            <div className="form-tips">
              <p>报名者必须提交2首有效音乐作品，作品格式为mp3</p>
              <p>作品一：不带伴奏的本人清唱歌曲</p>
              <p>作品二：带伴奏带本人演唱歌曲</p>
            </div>
            {/* 报名状态 0 立即报名（包括被拒绝） 1 审核中 2 报名成功 */}
            <button
              className="sure-sign"
              onClick={submit}
              data-status={userInfoState.signupStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
