import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View, Text, Input} from '@tarojs/components'

import styles from './login-captcha.module.css'
// import registerBg from '@/assets/v2/bg.png'
import {useRouter} from '@tarojs/taro'
import classNames from 'classnames'
import {useState} from 'react'
import Taro from '@tarojs/taro'
import {useStore} from '@/store'
import {debounceFirst} from '@/utils/util'

let logining = false
function LoginCaptcha() {
  const store = useStore()
  const router = useRouter()
  const phone = router.params.phone ?? ''

  const [captcha, setCaptcha] = useState('')

  async function onLogin() {
    if (logining) {
      return
    }
    if (!/1\d{10}/.test(phone)) {
      Taro.showToast({title: '请输入真实的手机号', icon: 'none'})
      return
    }
    if (!captcha || captcha.length != 6) {
      Taro.showToast({title: '请输入验证码', icon: 'none'})
      return
    }
    logining = true

    try {
      await Taro.removeStorage({key: 'logout'}).catch(() => {})
      await Taro.removeStorage({key: 'YZS_USER_INFO'}).catch(() => {})
      Taro.showLoading({title: '加载中'})
      await store.loginByMobile(phone, captcha)
      Taro.hideLoading()

      Taro.redirectTo({
        url: '/pages/home/home',
      })
    } catch (error) {
      Taro.showToast({title: '登录失败, 请确认手机号和验证码是否正确', icon: 'none', duration: 3000})
    }
    logining = false
  }

  return (
    <View className={styles.container}>
      <NavigationBar back />
      {/* <Image src={registerBg} className={styles.bg} /> */}

      <View className={styles['content-container']}>
        <View className={styles['title-wrap']}>
          <Text className={styles.title}>验证码已发送至</Text>
          <Text className={styles.title}>{phone}</Text>
        </View>
        <View className={styles['captcha-input-container']}>
          <Input
            className={styles['input-control']}
            value={captcha}
            maxlength={6}
            onInput={(event) => {
              setCaptcha(event.detail.value)
            }}
          />
          {Array.from({length: 6}).map((_, index) => {
            return (
              <Text
                className={classNames({
                  [styles['captcha-input-item']]: true,
                  [styles['captcha-input-item-small']]: !Boolean(captcha[index]),
                })}
              >
                {captcha[index] || '-'}
              </Text>
            )
          })}
        </View>

        <View className={styles['button']} onClick={debounceFirst(onLogin)}>
          登录
        </View>
        <View className={styles['shadow']}></View>
      </View>
    </View>
  )
}

export default LoginCaptcha
