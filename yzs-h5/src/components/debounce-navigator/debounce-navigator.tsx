import {debounceFirst} from '@/utils/util'
import {View, NavigatorProps} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {PropsWithChildren} from 'react'

function DebounceNavigator(props: PropsWithChildren<NavigatorProps>) {
  return (
    <View
      {...props}
      onClick={debounceFirst((event) => {
        props.onClick?.(event as any)
        switch (props.openType) {
          case 'exit':
            Taro.exitMiniProgram()
            break
          case 'navigate':
            Taro.navigateTo({url: props.url!})
            break
          case 'navigateBack':
            Taro.navigateBack({delta: props.delta})
            break
          case 'reLaunch':
            Taro.reLaunch({url: props.url ?? '/pages/home/home'})
            break
          case 'redirect':
            Taro.redirectTo({url: props.url!})
            break
          case 'switchTab':
            Taro.switchTab({url: props.url!})
            break
          default:
            Taro.navigateTo({url: props.url!})
            break
        }
      }, 350)}
    >
      {props.children}
    </View>
  )
}

export default DebounceNavigator
