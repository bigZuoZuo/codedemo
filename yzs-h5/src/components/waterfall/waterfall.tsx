import {IBase} from '@/typings'
import {debounceFirst} from '@/utils/util'
import {View} from '@tarojs/components'
import React from 'react'
import DiscoverGoodsItem from '../discover-goods-item/discover-goods-item'

import './waterfall.scss'

interface Props {
  views: IBase[]
  showSelledIcon?: boolean
  showDateTime?: boolean
  /**
   * @deprecated 小程序端只能通过 slot 插入，迁移过来后已经不是必须的了, 建议使用 renderItem 代替
   */
  eachSlot?: React.ReactNode
  onClickItem?: (view: IBase) => void
  /**
   * @deprecated 早期后端接口字段不确定，前端先行的产物, 建议使用 renderItem 代替
   */
  keys?: {
    avatar?: string
    nickName?: string
    goodsPoster?: string
    goodsTitle?: string
    goodsAmount?: string
    selled?: string
    userId?: string
    dateTime?: string
  }

  renderItem?(item: IBase): React.ReactNode
}

function Waterfall(props: React.PropsWithChildren<Props>) {
  const keys = props.keys ?? {
    avatar: 'avatar',
    nickName: 'nick_name',
    goodsPoster: 'images',
    goodsTitle: 'title',
    goodsAmount: 'price',
    selled: 'selled',
    userId: 'user_id',
    dateTime: 'created_at',
    ...(props.keys ?? {}),
  }

  return (
    <View className="waterfall-container" wx-if={props.views.length} data-reload={true}>
      {props.views.map((item) => {
        return (
          <View className="item waterfall-item" onClick={debounceFirst(() => props.onClickItem?.(item))} key={item.id}>
            <View className="waterfall-item-gap">
              {props.renderItem?.(item) ?? (
                <DiscoverGoodsItem
                  goodsPoster={item[keys.goodsPoster!][0]}
                  goodsAmount={item[keys.goodsAmount!]}
                  goodsTitle={item[keys.goodsTitle!]}
                  avatar={item[keys.avatar!]}
                  nickName={item[keys.nickName!]}
                  showSelledIcon={props.showSelledIcon && item[keys.selled!]}
                  userId={item[keys.userId!]}
                  dateTime={props.showDateTime && item[keys.dateTime!]}
                >
                  {props.eachSlot}
                </DiscoverGoodsItem>
              )}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default Waterfall
