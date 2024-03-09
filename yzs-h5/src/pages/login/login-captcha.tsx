import {View, Text, Input} from '@tarojs/components'

import styles from './login-captcha.module.css'
import classNames from 'classnames'
import {useState, useEffect} from 'react'
import Taro, {useRouter} from '@tarojs/taro'
import {useStore} from '@/store'
import {debounceFirst} from '@/utils/util'

interface LoginCaptchaProps {
  phone: string
  loginStep: number
}

let logining = false
function LoginCaptcha(props: LoginCaptchaProps) {
  const store = useStore()
  const phone = props.phone
  const params = useRouter().params

  const [captcha, setCaptcha] = useState('')
  const [focus, setFocus] = useState(true)

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
      if (params?.to) {
        Taro.redirectTo({
          url: params?.to,
        })
      } else {
        Taro.redirectTo({
          url: '/pages/home/home',
        })
      }
    } catch (error) {
      Taro.showToast({title: '登录失败, 请确认手机号和验证码是否正确', icon: 'none', duration: 3000})
    }
    logining = false
  }

  useEffect(() => {
    if (props.loginStep === 2 && phone) {
      setFocus(true)
      document.getElementById('login-yzs')?.focus()
    }
  }, [props.loginStep, phone])

  return (
    <View className={styles['content-container']}>
      <View className={styles['title-wrap']}>
        <Text className={styles.title}>验证码已发送至</Text>
        <Text className={styles.title}>{phone}</Text>
      </View>
      <View className={styles['captcha-input-container']}>
        <Input
          id="login-yzs"
          className={styles['input-control']}
          value={captcha}
          autoFocus={focus}
          focus={focus}
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
  )
}

export default LoginCaptcha
