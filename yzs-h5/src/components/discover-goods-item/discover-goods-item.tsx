import {View, Image, Text} from '@tarojs/components'

import moreIcon from '../../assets/more.png'
import datetimeIcon from '../../assets/datetime.png'

import './discover-goods-item.scss'
import React from 'react'
import dayjs from 'dayjs'

interface Props {
  avatar?: string
  nickName?: string
  goodsPoster?: string
  goodsTitle?: string
  goodsAmount?: string
  showSelledIcon?: boolean
  userId?: string
  dateTime?: string
}

function DiscoverGoodsItem(props: React.PropsWithChildren<Props>) {
  function onPressAvatar() {
    // Taro.navigateTo({
    //   url: `/pages/user-space/user-space?id=${props.userId}`,
    // })
  }

  return (
    <View className="goods-item discover-goods-item-container">
      <View className="goods-poster-wrap">
        <Image className="goods-poster" mode="aspectFill" src={props.goodsPoster ?? ''} />
      </View>
      <View className="goods-meta">
        <View className="goods-title-wrap">
          <Text className="goods-title">{props.goodsTitle}</Text>
        </View>
        <View className="goods-datetime" wx-if={props.dateTime}>
          <Image className="icon" src={datetimeIcon} mode="aspectFit" />
          {dayjs(props.dateTime).format('YYYY/MM/DD HH:mm')}
        </View>
        <Text className="goods-amount" wx-if={props.goodsAmount}>
          <Text className="goods-amount-symbol">￥</Text>
          {props.goodsAmount}
        </Text>

        <View className="goods-footer" wx-if={props.nickName}>
          <View onClick={onPressAvatar} className="goods-user">
            <Image className="goods-user-avatar" src={props.avatar ?? ''} mode="aspectFill"></Image>
            <Text className="goods-user-name">{props.nickName}</Text>
          </View>
        </View>
        {props.children}
        <View className="goods-more">
          <Image src={moreIcon} mode="aspectFit" className="goods-more-icon" />
        </View>
      </View>
    </View>
  )
}

export default DiscoverGoodsItem
