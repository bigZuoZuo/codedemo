import {api} from '@/api'

export async function wechatConfig() {
  const jssdkBackupdata = await api.user.offiaccountJssdkList()
  const wechatConfigOption = jssdkBackupdata.data.data

  ;(wx as any).config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: wechatConfigOption.appId, // 必填，公众号的唯一标识
    timestamp: wechatConfigOption.timestamp + '', // 必填，生成签名的时间戳
    nonceStr: wechatConfigOption.noncestr, // 必填，生成签名的随机串
    signature: wechatConfigOption.signature, // 必填，签名
    jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'chooseWXPay'], // 必填，需要使用的JS接口列表
  })

  return new Promise((resolve, reject) => {
    ;(wx as any).ready(resolve)
    ;(wx as any).error(reject)
  })
}
