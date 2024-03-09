import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View, Image, Text} from '@tarojs/components'

import styles from './login-phone.module.css'

// import registerBg from '@/assets/v2/bg.png'
import {AtInput} from 'taro-ui'
import {useState} from 'react'
import Captcha from '@/components/captcha/captcha'
import Taro from '@tarojs/taro'

import logoImage from '@/assets/icons/logo.png'

function LoginPhone() {
  const [phone, setPhone] = useState('')

  return (
    <View className={styles.container}>
      <NavigationBar back />

      {/* <Image src={registerBg} className={styles.bg} /> */}
      <View className={styles['slogan']}>
        <Image src={logoImage} className={styles['logo-image']} />
      </View>

      <View className={styles['content-container']}>
        <Text className={styles.label}>手机号</Text>
        <View className={styles['input-wrap']}>
          <Text className={styles['area-code']}>+86</Text>
          <AtInput
            className={styles['input-control']}
            type="phone"
            name="phone"
            onChange={(event) => {
              setPhone(event.toString())
            }}
          />
        </View>

        <View className={styles['button']}>
          <Captcha
            phone={phone}
            className={styles['captcha-label']}
            success={() => {
              Taro.navigateTo({
                url: `/pages/login-captcha/login-captcha?phone=${phone}`,
              })
            }}
          />
        </View>
        <View className={styles['shadow']}></View>
      </View>
    </View>
  )
}

export default LoginPhone
