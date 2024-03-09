import DebounceNavigator from '@/components/debounce-navigator/debounce-navigator'
import {View, Image} from '@tarojs/components'
import {useObserver} from 'mobx-react'

import styles from './personal-profile.module.scss'

// @ts-ignore
const PersonalProfile = ({beau}) => {
  const phoneNumber = beau.phoneNumber
  const maskPhoneNumber = phoneNumber ? phoneNumber.slice(0, 3) + '****' + phoneNumber.slice(-4) : ''

  const logined = beau.logined

  const profileSetting = '/pages/account/account'

  // const url = logined ? profileSetting : '/pages/login/login?to=' + encodeURIComponent(profileSetting)
  const url = logined ? profileSetting : '/pages/login/login'

  return useObserver(() => {
    return (
      <DebounceNavigator url={url}>
        <View className={styles.profile}>
          <Image mode="aspectFill" src={beau.avatar} className={styles.avatar} />
          <View className={styles.info}>
            <View className={styles.nickname}>{logined ? beau.nickName : '未登录'}</View>
            <View className={styles.phone}>{logined ? maskPhoneNumber : '点击登录账号'}</View>
          </View>
        </View>
      </DebounceNavigator>
    )
  })
}

export default PersonalProfile
