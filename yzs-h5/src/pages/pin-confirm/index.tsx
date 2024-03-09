import {useState, useEffect, useRef} from 'react'
import {sm2} from 'sm-crypto'
import {runInAction} from 'mobx'
// import cx from 'classnames';
import {View, Text, Button} from '@tarojs/components'
import Taro, {useRouter} from '@tarojs/taro'
import {NumberKeyboard, PasswordInput} from 'react-vant'
import {AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui'
import NavigationBar from '@/components/navigation-bar/navigation-bar'

import {delay, runInPlatform} from '@/utils/util'
import {useStore} from '@/store'
import {api} from '@/api'
import '../pin/pin.scss'

interface AWSCCallbackData {
  sessionId: string
  sig: string
  token: string
}

const PinConfirm = () => {
  const store = useStore()
  const params = useRouter().params
  const [pin, setPin] = useState('')
  const [visible, toggleVisible] = useState(true)
  const [posting, setPosting] = useState(false)
  const [modal, setModal] = useState(false)
  const [captcha, setCaptcha] = useState('')
  const [awscCallbackData, setAwscCallbackData] = useState<AWSCCallbackData>()
  const [showAWSC, setShowAWSC] = useState(false)
  const [loading, setLoading] = useState(true)

  const userIsPressBtn = useRef(false)

  useEffect(() => {
    if (!awscCallbackData) return
    onSubmit()
  }, [awscCallbackData])

  useEffect(() => {
    if (loading === false) {
      Taro.hideLoading()
    }
    if (loading === false && userIsPressBtn.current) {
      onSubmit()
    }
  }, [loading])

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
  }, [params])

  const onSubmit = async () => {
    if (pin !== params?.pin) {
      setPin('')
      Taro.showToast({title: '二次输入的密码不一致', icon: 'none'})
      return
    }
    if (/([0-9])\1{5,}/.test(pin) || '01234567890123456789_9876543210987654321'.indexOf(pin) > -1) {
      setPin('')
      Taro.showToast({
        title: '操作密码不能是重复、连续的数字',
        icon: 'none',
      })
      return
    }
    // if (params?.reset === 'true') {
    if (loading) {
      Taro.showLoading({title: '加载中'})
      return
    }
    userIsPressBtn.current = true
    if (!awscCallbackData) {
      setShowAWSC(true)
      return
    }
    if (posting) {
      return
    }
    setPosting(true)
    Taro.showLoading({title: '发送中'})
    api.sms
      .sendVerificationCodeCreate({
        mobile: store.state.phoneNumber,
        type: 'login',
        ...awscCallbackData,
      })
      .then(() => setModal(true))
      .catch((error) => {
        const message = /frequently/.test(error?.response?.data?.message)
          ? '发送验证码太频繁了，请稍后后重试'
          : '发送验证码失败, 请重试'

        Taro.showToast({title: message, icon: 'none'})
      })
      .finally(() => {
        setPosting(false)
        Taro.hideLoading()
      })
    // } else {
    //   settingPassword()
    // }
  }

  const settingPassword = async () => {
    if (posting) {
      return
    }
    setPosting(true)
    try {
      const {data: publicKey} = await api.pin.getUserKeyApi()
      const tradePassword = sm2.doEncrypt(pin, publicKey.data) // 加密结果
      // if (params?.reset === 'true') {
      await api.pin.resetUserTradePasswordApi({tradePassword, verificationCode: captcha})
      // } else {
      //   await api.pin.getUserTradePasswordApi({tradePassword})
      // }
      setPosting(false)
      runInAction(() => {
        store.state.haveTradePassword = true
        let loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
        loginResponse.haveTradePassword = true
        Taro.setStorageSync('YZS_USER_INFO', JSON.stringify(loginResponse))
        Taro.reLaunch({url: '/pages/pin-success/index'})
      })
    } catch (err) {
      Taro.showToast({title: err.response.data.error || '设置失败', icon: 'none'})
      setPosting(false)
    }
  }

  return (
    <>
      <NavigationBar back color="#fff" background="transparent" />
      <View className="pin-container">
        <View className="pin-header">
          <Text className="title">Step2 再次输入操作密码</Text>
          <Text className="subtitle">&emsp;</Text>
        </View>
        <View className="pin-input">
          <PasswordInput
            value={pin}
            length={6}
            autoFocus
            onFocus={() => {
              // @ts-ignore
              document.activeElement.blur()
              toggleVisible(true)
            }}
            className="pin"
          />
        </View>
        <View className="tips">操作密码不能是重复、连续的数字</View>
        <View className="pin-button" onClick={onSubmit}>
          确定
        </View>
        <View className="pin-keyboard">
          <NumberKeyboard
            value={pin}
            extraKeyRender={() => null}
            visible={visible}
            maxlength={6}
            onChange={(v) => {
              setPin(v)
            }}
            onBlur={() => {
              toggleVisible(false)
            }}
          />
        </View>
        <AtModal isOpened={showAWSC} onClose={() => setShowAWSC(false)} className="at-modal-container">
          <AtModalContent>
            <View id="ic" />
          </AtModalContent>
        </AtModal>
        <AtModal
          isOpened={modal}
          onClose={() => {
            setModal(false)
          }}
        >
          <AtModalHeader>短信验证码验证</AtModalHeader>
          <AtModalContent>
            <View>验证码已发送至你账户手机号</View>
            <AtInput
              border={false}
              clear
              type="number"
              placeholder="验证码"
              name="captcha"
              value={captcha}
              className="taro-code-input"
              onChange={(event) => setCaptcha(event.toString())}
            />
          </AtModalContent>
          <AtModalAction>
            <Button
              onClick={() => {
                setModal(false)
              }}
              className="taro-cancel-button"
            >
              取消
            </Button>
            <Button
              className="taro-confirm-button"
              onClick={() => {
                if (!captcha) {
                  Taro.showToast({title: '请输入正确的验证码', icon: 'none'})
                  return
                }
                setModal(false)
                settingPassword()
              }}
            >
              确定
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    </>
  )
}

export default PinConfirm
