import {View, Text, Image} from '@tarojs/components'
import Taro, {FC, useRouter} from '@tarojs/taro'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {useEffect, useState} from 'react'

import {OrderDeliveryType} from '@/typings'
import './pay-success.scss'
import EmptyFigure from '@/components/empty-figure/empty-figure'
import FrameLeft from '@/assets/icons/frame-left.png'
import FrameRight from '@/assets/icons/frame-right.png'

let timePoint
const PaySuccess: FC = () => {
  const params = useRouter().params
  const [delivery_type] = useState(params?.delivery_type ?? '')
  const [orderId] = useState(params?.id ?? '')
  const chain_type = params.chain_type

  const [timing, setTiming] = useState(5)
  useEffect(() => {
    if (timing <= 0) {
      Taro.navigateTo({
        url: delivery_type === OrderDeliveryType.inKine ? `/order-detail?id=${orderId}` : `/pages/property/property?chain_type=${chain_type||""}`,
      })
      return
    }
    timePoint = setTimeout(() => setTiming(timing - 1), 1000)
    return () => clearTimeout(timePoint)
  }, [timing])

  return (
    <View className="success-wrapper">
      <NavigationBar back color="#fff" background="transparent" />
      <View className="success-wrap">
        <View className="success-text-wrap">
          <Image src={FrameLeft} className="frame" />
          <View>
            <View className="success-text">支付成功</View>
            {/* <View className="success-text-one">藏品已收入背包中</View> */}
          </View>
          <Image src={FrameRight} className="frame" />
        </View>
        <View className="empty">
          <EmptyFigure success label="" />
        </View>
      </View>
      <View className="count">
        {timing <= 0 ? (
          ''
        ) : (
          <Text>
            <Text className="sec">{timing}</Text> 秒后将自动跳转
          </Text>
        )}
      </View>
      <View
        className="btn"
        onClick={() => {
          clearTimeout(timePoint)
          Taro.navigateTo({
            url:
              delivery_type === OrderDeliveryType.inKine ? `/order-detail?id=${orderId}` : `/pages/property/property?chain_type=${chain_type||""}`,
          })
        }}
      >
        前去查看
      </View>
    </View>
  )
}

export default PaySuccess
