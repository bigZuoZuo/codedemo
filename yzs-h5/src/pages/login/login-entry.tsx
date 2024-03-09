import styles from './login-entry.module.css'
import {View, Text, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
// import {os} from '@/utils/util'

import phoneLogin from '@/assets/v2/icon/phone-login.svg'
// import wechatLogin from '@/assets/v2/icon/wechat-login.svg'
import classNames from 'classnames'
import {api} from '@/api'
import DebounceNavigator from '@/components/debounce-navigator/debounce-navigator'
import QueryString from 'qs'
import {useState} from 'react'

interface LoginEntryProps {
  onNext(): void
}

export default function LoginEntry(props: LoginEntryProps) {
  const [checked, setChecked] = useState(false)

  //@ts-ignore
  async function loginByWechat() {
    if (!checked) {
      Taro.showToast({title: '请勾选已阅读协议', icon: 'none'})
      return
    }

    Taro.showLoading({title: '请等待'})
    await Taro.removeStorage({key: 'logout'}).catch(() => {})
    await Taro.removeStorage({key: 'YZS_USER_INFO'}).catch(() => {})

    const url = new URL(window.location.href)
    const search = QueryString.parse(url.search.slice(1) ?? '')
    delete search.code
    delete search.state
    url.search = `?${QueryString.stringify(search)}`

    const response = await api.user.getAuthroizeUrlList({
      redirectUri: encodeURIComponent(url.href),
      // 后台已经有用户信息，静默登录, 否则像用户获取用户信息
      scope: 'snsapi_userinfo',
    })
    Taro.hideLoading()
    // console.log('snsapi_userinfo====', response.data)
    // window.location.href = response.data.url
    window.location.replace(response.data.url)
  }

  return (
    <View>
      <View className={styles['slogan']}>
        <Text className={styles['slogan-text']}>Welcome to</Text>
        <Text className={styles['slogan-text']}>PLATYPUS</Text>
      </View>

      <View className={styles['content-container']}>
        <Text className={styles.title}>登录注册</Text>

        {/* <View className={styles['login-btn']} wx-if={os.isWechatWeb} onClick={loginByWechat}>
          <Image src={wechatLogin} className={styles['login-icon']} />
          <Text className={styles['login-text']}>使用微信登录</Text>
        </View> */}
        <View
          // wx-if={!os.isWechatWeb}
          onClick={() => {
            if (!checked) {
              Taro.showToast({title: '请勾选已阅读协议', icon: 'none'})
              return
            }
            props.onNext()
          }}
          className={styles['login-btn']}
        >
          <Image src={phoneLogin} className={styles['login-icon']} />
          <Text className={styles['login-text']}>使用手机登录</Text>
        </View>

        <View className={styles['protocol']}>
          <View
            onClick={() => {
              setChecked(!checked)
            }}
            className={classNames(styles['checkbox'], {
              [styles['checked']]: checked,
            })}
          />
          <Text className={styles['protocol-text']}>我已阅读并同意</Text>
          <DebounceNavigator
            url="/pages/article/article?channel=user-agreement"
            className={classNames([styles['protocol-text'], styles['protocol-link']])}
          >
            《用户协议》
          </DebounceNavigator>
          <DebounceNavigator
            url="/pages/article/article?channel=privacy-agreement"
            className={classNames([styles['protocol-text'], styles['protocol-link']])}
          >
            《隐私政策》
          </DebounceNavigator>
        </View>
      </View>

      <View className={styles['footer']}>
        <Text className={styles['footer-text']}>好藏品 鸭不住</Text>
      </View>
    </View>
  )
}
