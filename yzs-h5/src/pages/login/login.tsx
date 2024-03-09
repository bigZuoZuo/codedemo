import {View} from '@tarojs/components'
import NavigationBar from '@/components/navigation-bar/navigation-bar'

import styles from './login.module.css'
// import registerBg from '@/assets/v2/bg.png'
import {os} from '@/utils/util'
import {useStore} from '@/store'
import {useObserver} from 'mobx-react'
import {useEffect, useState} from 'react'
import Taro, {useRouter} from '@tarojs/taro'
import LoginEntry from './login-entry'
import LoginPhone from './login-phone'
import LoginCaptcha from './login-captcha'

function Login() {
  const store = useStore()
  const router = useRouter()

  useEffect(() => {
    Taro.removeStorage({
      key: 'addressInfo',
    })
  }, [])

  return useObserver(() => {
    useEffect(() => {
      if (store.state.logined) {
        const toPage = router.params.to
        if (os.isWeb) {
          Taro.redirectTo({url: '/pages/home/home'})
        } else {
          Taro.redirectTo({
            url: toPage?.startsWith('/page') ? toPage : '/pages/home/home',
          })
        }
      }
    }, [store.state.logined])

    // 0: 登录， 1： 输入手机号， 2： 输入验证码
    const [loginStep, setLoginStep] = useState(0)
    const [phone, setPhone] = useState('')

    return (
      <View className={styles.container}>
        <NavigationBar
          wx-if={loginStep !== 0}
          back
          onBack={() => {
            setLoginStep(loginStep - 1)
            return true
          }}
        />
        {/* <Image src={registerBg} className={styles.bg} /> */}
        <View className="z2" style={{display: loginStep === 0 ? 'block' : 'none'}}>
          <LoginEntry onNext={() => setLoginStep(1)} />
        </View>
        <View className="z2" style={{display: loginStep === 1 ? 'block' : 'none'}}>
          <LoginPhone
            onNext={(phone) => {
              setPhone(phone)
              setLoginStep(2)
            }}
          />
        </View>
        <View className="z2" style={{display: loginStep === 2 ? 'block' : 'none'}}>
          {loginStep === 2 ? <LoginCaptcha phone={phone} loginStep={loginStep} /> : null}
        </View>
      </View>
    )
  })
}

export default Login
