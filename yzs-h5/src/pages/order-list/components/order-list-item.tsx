// @ts-nocheck

import {useStore} from '../../../store'
import {IOrder, OrderType} from '../../../typings'
import {useObserver} from 'mobx-react'

import Taro from '@tarojs/taro'
import {View, Text, Image, Block} from '@tarojs/components'

import {showImageOrVideo} from '../../home/home'
import {statusToLabel} from './status-to-label'

import './order-list-item.scss'

import rightArrowIcon from '../../../assets/right-arrow.png'
// import {getNfcNumber} from '../../../utils/get-nft-number'
import {
  CancelButton,
  ConfirmReceivedButton,
  // DeleteOrderButton,
  ModifyAddressButton,
  PendingPaymentButton,
  RemainTimeLabel,
  RepurchaseButton,
  // ShowDetailButton,
} from './order-btn-group'

interface Props {
  orderId: string
  seller?: boolean
  header?: React.ReactNode
  footer?: React.ReactNode
}

function OrderListItem(props: Props) {
  const store = useStore()
  store.observableDetailIfNull({id: props.orderId})

  return useObserver(() => {
    const orderDetail = store.detailSet[props.orderId] as IOrder
    const status = orderDetail.state
    const {statusString, amountLabel} = statusToLabel(status)

    function onPressHeader() {
      if (props.header) {
        return
      }
      Taro.navigateTo({
        url: '/pages/order-detail/order-detail?id=' + props.orderId,
      })
    }

    function onPressBody() {
      let url = ''
      switch (orderDetail.type) {
        case OrderType.platform:
          url = `/pages/official-goods-detail/official-goods-detail?id=${orderDetail.items?.[0].item_id}`
          break
        case OrderType.user:
          url = '/pages/user-goods-detail/user-goods-detail?id=' + orderDetail.items?.[0].item_id
          break
        case OrderType.blind_box:
          url = '/pages/blind-box-detail/blind-box-detail?id=' + orderDetail.items?.[0].item_id
          break

        default:
          break
      }

      Taro.navigateTo({url})
    }

    return (
      <View className={`order-list-page-item-container ${props.footer && 'no-footer'}`}>
        <View className="order-list-header" onClick={onPressHeader}>
          {!props.header ? (
            <Block>
              <Text className="order-list-no no">订单编号:{orderDetail.order_code}</Text>
              <Text className="order-list-status">{statusString}</Text>
            </Block>
          ) : (
            <Block>
              <Text className="order-list-status">{statusString}</Text>
              <Image src={rightArrowIcon} className="right-arrow" mode="aspectFit" />
            </Block>
          )}
        </View>
        <View className="order-list-body" onClick={onPressBody}>
          {
            showImageOrVideo({
              type: orderDetail.items?.[0].material_type,
              url: /3D|music|video/.test(orderDetail.items?.[0].material_type)
              ? orderDetail.items?.[0].cover_url
              : orderDetail.items?.[0].images?.[0],
              className: 'goods-poster'
            })
          }
          <View className="goods-poster-mask"></View>
          <View className="goods-info">
            <View className="goods-info-header">
              <Text className="goods-title">{orderDetail.items?.[0]?.title}</Text>
              <Text className="goods-number">商品数量 x{orderDetail.amount}</Text>
            </View>
            <View className="goods-footer">
              <Text className="goods-amount">¥ {orderDetail.price}</Text>
              <Text className="goods-amount-label">{amountLabel}</Text>
            </View>
          </View>
        </View>
        {props.footer ? null : (
          <View className="order-list-footer">
            <View className="order-list-footer-left">
              <RemainTimeLabel orderId={props.orderId} />
            </View>
            <View className="order-list-footer-right">
              <CancelButton orderId={props.orderId} />
              <PendingPaymentButton orderId={props.orderId} />
              {/* <ModifyAddressButton orderId={props.orderId} /> */}
              <ConfirmReceivedButton orderId={props.orderId} />
              {/* <DeleteOrderButton orderId={props.orderId} /> */}
              <RepurchaseButton orderId={props.orderId} />
              {/* <ShowDetailButton orderId={props.orderId} /> */}
            </View>
          </View>
        )}
      </View>
    )
  })
}

export default OrderListItem
