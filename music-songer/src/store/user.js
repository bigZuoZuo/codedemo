import { makeAutoObservable } from "mobx";
import System from "@src/system";
import { getSingerInfo } from "@src/services";

export default class UserInfoState {
  username = System.name;
  uid = System.uid;
  // 报名状态 0 立即报名（包括被拒绝） 1 审核中 2 报名成功
  signupStatus = 0;
  // 用于获取报名是否被拒绝
  signupReject = false;
  // 是否限时限时礼包
  showGiftPack = false;

  // 报名的文案
  get signUpTxt() {
    if (this.signupStatus === 2) {
      return "提交";
    }

    if (this.signupStatus === 1) {
      return "审核中";
    }

    if (this.signupReject) {
      return "审核已拒绝";
    }

    return "立即报名";
  }
  // 是否可以跳转
  get canSignup() {
    // 未报名/报名被拒绝/报名成功去修改
    if (this.signupStatus === 0 || this.signupStatus === 2) {
      return true;
    }

    return false;
  } 

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  refreshUserInfo() {
    this.username = System.name;
    this.uid = System.uid;
  }

  async fetchSignupStatus() {
    // allow_to_update: false 允许更新: true 允许 false 不允许
    // audit_state 审核状态 状态 1:审核中 0:无效 2:审核通过 3:审核失败
    // is_sign_up : true 已报名 false 未报名

    try {
      const data = await getSingerInfo();
      const audit_state = +data.audit_state || 0;

      // 已报名
      if (data.is_sign_up) {
        this.signupStatus = 2;
        this.signupReject = false;
        return;
      }

      if (audit_state === 1) {
        this.signupStatus = 1;
        this.signupReject = false;
        return;
      }

      if (audit_state === 3) {
        this.signupStatus = 0;
        this.signupReject = true;
        return;
      }
    } catch (err) {}
  }

  updateGiftPack(is_show) {
    this.showGiftPack = is_show;
  }
}
