import {View, Image, Text} from '@tarojs/components'

import styles from './login-phone.module.css'

import {AtInput} from 'taro-ui'
import {useState} from 'react'
import Captcha from '@/components/captcha/captcha'

import logoImage from '@/assets/icons/logo.png'

interface LoginPhoneProps {
  onNext(phone: string): void
}

function LoginPhone(props: LoginPhoneProps) {
  const [phone, setPhone] = useState('')

  return (
    <View>
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
              props.onNext(phone)
            }}
          />
        </View>
        <View className={styles['shadow']}></View>
      </View>
    </View>
  )
}

export default LoginPhone
