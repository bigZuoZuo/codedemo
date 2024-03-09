import {api} from '@/api'
import {delay, runInPlatform} from '@/utils/util'
import {View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import {useEffect, useRef, useState} from 'react'
import {AtModal, AtModalContent} from 'taro-ui'

import './captcha.scss'

interface AWSCCallbackData {
  sessionId: string
  sig: string
  token: string
}

let timePoint
let sended = false
function Captcha(props: {phone: string; className?: string; success?: () => void}) {
  const [timing, setTiming] = useState(-1)
  const [showAWSC, setShowAWSC] = useState(false)
  const [awscCallbackData, setAwscCallbackData] = useState<AWSCCallbackData>()

  const [loading, setLoading] = useState(true)
  const userIsPressBtn = useRef(false)

  async function onSendCaptcha() {
    if (timing >= 0) {
      return
    }

    if (!/1\d{10}/.test(props.phone)) {
      Taro.showToast({title: '请输入真实的手机号', icon: 'none'})
      return
    }

    userIsPressBtn.current = true
    if (loading) {
      Taro.showLoading({title: '加载中'})
      return
    }

    if (!awscCallbackData) {
      setShowAWSC(true)
      return
    }

    if (sended) {
      return
    }

    sended = true
    Taro.showLoading({title: '发送中'})

    api.sms
      .sendVerificationCodeCreate({mobile: props.phone, type: 'login', ...awscCallbackData})
      .then(props.success)
      .catch((error) => {
        setTiming(-1)
        clearTimeout(timePoint)
        const message = /frequently/.test(error?.response?.data?.message)
          ? '发送验证码太频繁了，请稍后后重试'
          : '发送验证码失败, 请重试'

        Taro.showToast({title: message, icon: 'none'})
      })
      .finally(() => {
        sended = false
        Taro.hideLoading()
      })
    setAwscCallbackData(undefined)
    setTiming(60)
  }

  /**
   * 1. 用户点击发送验证码，
   * 2. 点击人机验证成功后 awscCallbackData 改变
   * 3. 真实发送验证码
   */
  useEffect(() => {
    if (!awscCallbackData) return
    onSendCaptcha()
  }, [awscCallbackData])

  useEffect(() => {
    if (loading === false) {
      Taro.hideLoading()
    }
    if (loading === false && userIsPressBtn.current) {
      onSendCaptcha()
    }
  }, [loading])

  /**
   * 计时中
   */
  useEffect(() => {
    if (timing < 0) return
    timePoint = setTimeout(() => setTiming(timing - 1), 1000)
    return () => clearTimeout(timePoint)
  }, [timing])

  // Code from alibaba doc
  useEffect(() => {
    runInPlatform({
      async web() {
        while (true) {
          if (document.getElementById('ic')) {
            break
          }
          await delay(100)
        }

        function ready() {
          return new Promise((resolve) => {
            window.AWSC.use('ic', function (_, module) {
              resolve(module)
            })
          })
        }

        while (true) {
          if (await ready()) {
            break
          }
          await delay(350)
        }

        setLoading(false)
        window.AWSC.use('ic', function (_, module) {
          // 初始化
          window.ic = module.init({
            width: 259,
            // 应用类型标识。它和使用场景标识（scene字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
            appkey: 'FFFF0N0000000000A874',
            // 使用场景标识。它和应用类型标识（appkey字段）一起决定了智能验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的scene值，请务必正确填写。
            scene: 'ic_message_h5',
            // 声明智能验证需要渲染的目标元素ID。
            renderTo: 'ic',
            // 验证通过时会触发该回调参数。您可以在该回调参数中将会话ID（sessionId）、签名串（sig）、请求唯一标识（token）字段记录下来，随业务请求一同发送至您的服务端调用验签。
            success: function (data) {
              window.ic?.reset?.()
              setAwscCallbackData(data)
              setShowAWSC(false)
            },
          })
        })
      },
    })?.()
  }, [])

  return (
    <View className="captcha-container">
      <AtModal isOpened={showAWSC} onClose={() => setShowAWSC(false)} className="at-modal-container">
        <AtModalContent>
          <View id="ic" />
        </AtModalContent>
      </AtModal>
      <View
        onClick={onSendCaptcha}
        className={classNames('captcha-timing', props.className, {
          'captcha-timing-active': timing >= 0,
        })}
      >
        {timing < 0 ? '获取验证码' : `${timing}秒后重试`}
      </View>
    </View>
  )
}

export default Captcha
