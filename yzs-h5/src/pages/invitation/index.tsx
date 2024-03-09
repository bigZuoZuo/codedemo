import {View, Image as TImage, Text, ScrollView} from '@tarojs/components'
import Taro, {FC} from '@tarojs/taro'
import dayjs from 'dayjs'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {useEffect, useState, useCallback, useRef} from 'react'
import QRCode from 'qrcode.react'
import {saveAs} from 'file-saver'
import html2canvas from 'html2canvas'
import copy from 'copy-to-clipboard'

import {os} from '@/utils/util'
import {api} from '@/api'

import './index.scss'
import TextBg from './image/in-text.png'
import shareBgSrc from './image/share-bg.png'
import InShare from './image/in-share.png'
import InRegister from './image/in-register.png'
import InKyc from './image/in-kyc.png'
import InLine from './image/in-line.png'
import FrameLeft from '@/assets/icons/frame-left.png'
import FrameRight from '@/assets/icons/frame-right.png'
import LinkIcon from './image/in-link.png'
import PicIcon from './image/in-pic.png'
// import WeChatIcon from './image/in-wechat.png'
// import PiaoIcon from './image/in-piao.png'

const options = [
  // {name: '微信', icon: WeChatIcon, value: 'weChatShare'},
  // {name: '朋友圈', icon: PiaoIcon, value: 'piao'},
  {name: '复制链接', icon: LinkIcon, value: 'linkIcon'},
  {name: '分享海报', icon: PicIcon, value: 'shareIcon'},
]

const imgUrl =
  'https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng8bbc987332b908fbbd253c9712276be4acf26ce809bda740d952170e3fe20276'

const Invitation: FC = () => {
  // const params = useRouter().params
  // const clientHeight = document.documentElement.clientHeight
  // const invitationHeight = document.getElementById('invitation')?.clientHeight || 0

  const [showShare, setShowShare] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>('')
  const [logs, setLogs] = useState<any>({
    list: [],
    total: 0,
  })
  const shareQRNodeRef = useRef<any>(null)
  const loadRef = useRef(false)
  const pageRef = useRef(1)

  const getUserInviteLog = () => {
    api.invite
      .getInviteListApi({
        pageSize: 10,
        current: pageRef.current++,
      })
      .then((res: any) => {
        setLogs((state) => ({
          list: [...state.list, ...res.data.data.list],
          total: res.data.data.total,
        }))
      })
      .finally(() => {
        loadRef.current = false
      })
  }

  useEffect(() => {
    Promise.all([
      api.invite.getInviteCodeApi(),
      api.invite.getInviteListApi({
        pageSize: 10,
        current: pageRef.current++,
      }),
    ]).then((res: any) => {
      if (res[0].data.code === 'ok') setShareUrl(res[0].data.data.replace('invite_code', 'invitation'))
      if (res[1].data.code === 'ok') {
        setLogs(res[1].data.data)
      } else {
        Taro.showToast({title: res[1].data.msg})
      }
    })
  }, [])

  useEffect(() => {
    if (!shareUrl) return
    createShare()
  }, [shareUrl])

  const createShare = useCallback(() => {
    const shareQRNode = shareQRNodeRef.current
    shareQRNode &&
      html2canvas(shareQRNode).then((res) => {
        // @ts-ignore
        const image = new Image()
        image.src = res.toDataURL('image/png')
        document.getElementById('shareContentShow')?.appendChild(image)
      })
  }, [])

  const copyUrl = useCallback(() => {
    if (copy(shareUrl)) {
      Taro.showToast({title: '复制成功，去分享吧～'})
    }
  }, [shareUrl])

  /**分享到微信朋友*/
  const handleWeChatShare = useCallback((url: string) => {
    //@ts-ignore
    if (window.wx.updateAppMessageShareData) {
      //@ts-ignore
      window.wx.ready(function () {
        //@ts-ignore
        window.wx.updateAppMessageShareData({
          title: '中传新文创', // 分享标题
          desc: '来【中传新文创藏品平台】成为文创数字收藏家', // 分享描述
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
          imgUrl, // 分享图标
          success: function () {
            // 设置成功
            console.log('url', url)
            Taro.showToast({title: '设置分享内容成功，快去分享吧～'})
          },
        })
      })
    } else {
      //@ts-ignore
      window.wx.onMenuShareAppMessage({
        title: '中传新文创', // 分享标题
        desc: '来【中传新文创藏品平台】成为文创数字收藏家', // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果 type 是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户点击了分享后执行的回调函数
          Taro.showToast({title: '设置分享内容成功，快去分享吧～'})
        },
      })
    }
  }, [])
  /**分享到朋友圈*/
  const handlePiao = useCallback((url: string) => {
    //@ts-ignore
    if (window.wx.updateTimelineShareData) {
      //@ts-ignore
      window.wx.ready(function () {
        //@ts-ignore
        window.wx.updateTimelineShareData({
          title: '中传新文创', // 分享标题
          desc: '来【中传新文创藏品平台】成为文创数字收藏家', // 分享描述
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
          imgUrl, // 分享图标
          success: function () {
            // 设置成功
            Taro.showToast({title: '设置分享内容成功，快去分享吧～'})
          },
        })
      })
    } else {
      //@ts-ignore
      window.wx.onMenuShareTimeline({
        title: '中传新文创', // 分享标题
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
        imgUrl, // 分享图标
        success: function () {
          // 设置成功
          Taro.showToast({title: '设置分享内容成功，快去分享吧～'})
        },
      })
    }
  }, [])

  const handleShare = useCallback(() => {
    const shareQRNode = shareQRNodeRef.current
    shareQRNode &&
      html2canvas(shareQRNode).then((res) => {
        saveAs(res.toDataURL(), '鸭藏邀请海报')
      })
  }, [])

  const handleSharePosters = useCallback(
    (type: string) => {
      type === 'linkIcon' && copyUrl()
      type === 'weChatShare' && handleWeChatShare(shareUrl)
      type === 'piao' && handlePiao(shareUrl)
      type === 'shareIcon' && handleShare()
    },
    [shareUrl]
  )

  const onScrollToLower = useCallback(() => {
    if (logs.list.length < logs.total) {
      // let contentH = e.target.clientHeight; //获取可见区域高度
      // var scrollHight = e.target.scrollHeight; //获取全文高度
      // let scrollTop = e.target.scrollTop; //获取被卷去的高度
      // const height = scrollHight - contentH - scrollTop;

      // if (height <= 50) {
      if (loadRef.current) return
      loadRef.current = true
      getUserInviteLog()
    }
    // }
  }, [logs])

  return (
    <View className="invitation-wrapper">
      <NavigationBar back color="#fff" background="transparent" />
      <View className="invitation-wrap" id="invitation">
        <TImage src={TextBg} className="text" />
        <View className="invitation-text-wrap">
          <TImage src={FrameLeft} className="frame" />
          <View>
            <View className="invitation-text">&nbsp;简单三步 注册成功&nbsp;</View>
          </View>
          <TImage src={FrameRight} className="frame" />
        </View>
        <View className="invitation-step-wrap step-image">
          <TImage src={InShare} className="step-item" />
          <TImage src={InLine} className="step-line" />
          <TImage src={InRegister} className="step-item" />
          <TImage src={InLine} className="step-line" />
          <TImage src={InKyc} className="step-item" />
        </View>
        <View className="invitation-step-wrap step-tips">
          <View className="step-item">邀请好友</View>
          <View className="step-line">&nbsp;</View>
          <View className="step-item">注册账号</View>
          <View className="step-line">&nbsp;</View>
          <View className="step-item">实名认证</View>
        </View>
        {/* <View className="invitation-step-wrap step-desc">
          <View className="step-item">邀请好友</View>
          <View className="step-line">&nbsp;</View>
          <View className="step-item">注册账号</View>
          <View className="step-line">&nbsp;</View>
          <View className="step-item">实名认证</View>
        </View> */}
        <View
          className="record-box"
          style={{
            visibility: showShare ? 'hidden' : 'inherit',
          }}
        >
          <View className="record">
            {logs.total ? (
              <View className="header">
                <Text className="number">{logs.total}</Text>人
              </View>
            ) : null}
            <ScrollView
              scrollY={true}
              scrollAnchoring={true}
              refresherEnabled={true}
              enhanced={true}
              onScrollToLower={onScrollToLower}
              lowerThreshold={100}
              className="record-list"
              // onScroll={onScrollToLower}
            >
              {logs.list.map((item: any) => (
                <View className="record-item" key={item.id}>
                  <Text>{item.invite_user_mobile.replace(/(\d{3})\d{6}(\d{2})/, '$1****$2')}</Text>
                  <Text>{dayjs(item.created_at).format('YYYY-MM-DD')}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View className="btn" onClick={() => setShowShare(true)}>
          立即分享
        </View>
      </View>

      <div id="shareQR" ref={shareQRNodeRef} className="share-content-hidden">
        <img src={shareBgSrc} alt="" />
        <QRCode className="qr-code" value={shareUrl} />
      </div>

      <section
        className="share-posters"
        style={{
          zIndex: showShare ? 1 : -2,
          visibility: showShare ? 'visible' : 'hidden',
          // height: clientHeight > invitationHeight ? clientHeight : invitationHeight,
        }}
        id="share_posters"
      >
        <div id="shareContentShow" className="share-content-show"></div>

        <div className="share-footer">
          <div className="share-footer-share">
            <p>立即分享</p>
            <ul className={!os.isWechatWeb ? 'not-wechat-web' : ''}>
              {options.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: os.isWechatWeb && item.value === 'shareIcon' ? 'none' : '',
                  }}
                  onClick={() => handleSharePosters(item.value)}
                >
                  <img src={item.icon} alt={item.name} />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="share-footer-close" onClick={() => setShowShare(false)}>
            取消
          </div>
        </div>
      </section>
    </View>
  )
}

export default Invitation
