import {api} from '@/api'
import Captcha from '@/components/captcha/captcha'
import {useStore} from '@/store'
import {Button, View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {runInAction} from 'mobx'
import {useState} from 'react'
import {AtForm, AtInput, AtFloatLayout} from 'taro-ui'

import './form.scss'

function BlindMobile({mobile, openMobileDialog, setOpenMobileDialog}) {
  const store = useStore()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [captcha, setCaptcha] = useState('')

  async function onSubmit() {
    if (!/1\d{10}/.test(phoneNumber)) {
      Taro.showToast({title: '请输入真实的手机号', icon: 'none'})
      return
    }
    if (!captcha) {
      Taro.showToast({title: '请输入正确的验证码', icon: 'none'})
      return
    }

    api.user
      .miniprogramMeChangeMobileUpdate({newMobile: phoneNumber, verificationCode: captcha} as any)
      .then((profile) => {
        runInAction(() => {
          store.state.phoneNumber = phoneNumber
          Taro.setStorageSync('access_token', profile.data.token)
          let loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
          loginResponse.phoneNumber = phoneNumber
          Taro.setStorageSync('YZS_USER_INFO', JSON.stringify(loginResponse))
          Taro.reLaunch({url: '/pages/home/home'})
        })
      })
      .catch((error) => {
        let message = error?.response?.data?.message
        if (/incrrec/.test(message)) {
          message = '验证码不正确'
        } else if (/existed/.test(message)) {
          message = '该手机号已经绑定其它账号'
        }
        Taro.showModal({
          title: '绑定手机失败',
          content: message,
        })
      })
  }

  return (
    <View>
      <AtFloatLayout
        className={`account-dialog ${mobile && 'close-none'}`}
        title="绑定手机号"
        isOpened={mobile || openMobileDialog}
        onClose={() => setOpenMobileDialog(false)}
      >
        <AtForm className="account-dialog-body">
          <AtInput
            clear
            title="手机号"
            type="text"
            placeholder="手机号"
            name="mobile"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.toString())}
          >
            <Captcha phone={phoneNumber} />
          </AtInput>
          <AtInput
            border={false}
            clear
            title="验证码"
            type="text"
            placeholder="验证码"
            maxlength={6}
            name="captcha"
            value={captcha}
            onChange={(event) => setCaptcha(event.toString())}
          />
        </AtForm>

        <View className="account-dialog-footer">
          {mobile ? (
            <Button
              className="btn account-dialog-btn"
              plain
              size="mini"
              onClick={async () => {
                window?.ic?.reset()
                await store.logout()
                Taro.reLaunch({url: '/pages/login/login'})
              }}
            >
              切换登录方式
            </Button>
          ) : (
            <Button className="btn account-dialog-btn" plain size="mini" onClick={() => setOpenMobileDialog(false)}>
              取消
            </Button>
          )}
          <Button className="btn account-dialog-btn" type="primary" size="mini" onClick={onSubmit}>
            提交
          </Button>
        </View>
      </AtFloatLayout>
    </View>
  )
}

export default BlindMobile
