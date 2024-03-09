import {View, Image} from '@tarojs/components'
import Taro, {FC, useRouter} from '@tarojs/taro'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
// import {useEffect, useState} from 'react'

import './index.scss'
import EmptyFigure from '@/components/empty-figure/empty-figure'
import FrameLeft from '@/assets/icons/frame-left.png'
import FrameRight from '@/assets/icons/frame-right.png'

const tips = {
  transfer: '转移成功',
  setting: '设置成功',
  give: '转赠成功',
}
const PaySuccess: FC = () => {
  const params = useRouter().params

  return (
    <View className="pin-success-wrapper">
      <NavigationBar back color="#fff" background="transparent" />
      <View className="success-wrap">
        <View className="success-text-wrap">
          <Image src={FrameLeft} className="frame" />
          <View>
            <View className="success-text">{tips[params.type || 'setting']}</View>
          </View>
          <Image src={FrameRight} className="frame" />
        </View>
        <View className="empty">
          <EmptyFigure success label="" />
        </View>
      </View>
      <View
        className="btn"
        onClick={() => {
          if (params.type === 'transfer' || params.type === 'give') {
            Taro.navigateTo({
              url: '/pages/property/property',
            })
          } else {
            Taro.navigateTo({
              url: '/pages/account/account',
            })
          }
        }}
      >
        完成
      </View>
    </View>
  )
}

export default PaySuccess
