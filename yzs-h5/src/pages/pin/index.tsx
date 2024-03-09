import {useState} from 'react'
// import cx from 'classnames';
import {View, Text} from '@tarojs/components'
import Taro, {useRouter} from '@tarojs/taro'
import {NumberKeyboard, PasswordInput} from 'react-vant'

import NavigationBar from '@/components/navigation-bar/navigation-bar'
// @ts-ignore
// import { baseURL } from '@services/request';
import './pin.scss'

const Pin = () => {
  const params = useRouter().params
  const [pin, setPin] = useState('')
  const [visible, toggleVisible] = useState(true)

  const onSubmit = (val) => {
    if (/([0-9])\1{5,}/.test(val) || '01234567890123456789_9876543210987654321'.indexOf(val) > -1) {
      setPin('')
      Taro.showToast({
        title: '操作密码不能是重复、连续的数字',
        icon: 'none',
      })
      return
    }
    Taro.navigateTo({url: '/pages/pin-confirm/index?pin=' + val + '&reset=' + params.reset})
  }

  return (
    <>
      <NavigationBar
        back
        color="#fff"
        // onBack={()=> params.to ? Taro.navigateTo({url: '/pages/account/account'}) : Taro.navigateBack()}
        background="transparent"
      />
      <View className="pin-container">
        <View className="pin-header">
          <Text className="title">Step1 {params.reset === 'false' ? '重置' : '设置'}操作密码</Text>
          <Text className="subtitle">为了您的交易与资金安全，请务必妥善备份操作密码{'\n'}以防遗失</Text>
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
            onSubmit={onSubmit}
          />
        </View>
        <View className="tips">操作密码不能是重复、连续的数字</View>
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
      </View>
    </>
  )
}

export default Pin
