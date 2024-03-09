import {useStore} from '../../../store'
import {View, Image, Text, Block} from '@tarojs/components'
import {useObserver} from 'mobx-react'
import {IOrder, OrderState} from '../../../typings'

import whitePendingPaymentIcon from '../../../assets/white-pending-payment-icon.png'
import whitePendingShippedIcon from '../../../assets/white-pending-shipped.png'
import whiteMerchantShippedIcon from '../../../assets/white-merchant-shipped.png'
import whiteCompletedIcon from '../../../assets/white-completed.png'
import whiteCanceledIcon from '../../../assets/white-canceled-icon.png'
import {useOrderTiming} from '../../../utils/use-order-timing'

import './order-detail-status.scss'

interface Props {
  orderId: string
  // 卖家查看订单详情
  seller?: boolean
}

function orderStatusLabel(status: OrderState, seller: boolean = false) {
  switch (status) {
    case OrderState.pendingPayment:
      return '待支付'
    case OrderState.pendingShipped:
      return '待发货'
    case OrderState.merchantShipped:
      return '待收货'
    case OrderState.complete:
      return seller ? '交易完成' : '已完成'
    case OrderState.canceled:
      return '已取消'
    // case OrderState.refunded:
    //   return '已退款'
    default:
      return '未知'
  }
}

function RemainTimeLabel(props: Props) {
  return useObserver(() => {
    const remainTime = useOrderTiming(props.orderId)
    return (
      <Text className="order-tips" wx-if={remainTime}>
        剩余支付 {remainTime}
      </Text>
    )
  })
}

function OrderDetailStatus(props: Props) {
  const store = useStore()
  store.observableDetailIfNull({id: props.orderId})

  return useObserver(() => {
    const detail = store.detailSet[props.orderId] as IOrder

    return (
      <View className="order-detail-status-page-container">
        <View className="order-label-wrap">
          <Image
            src={whitePendingPaymentIcon}
            className="order-status-icon"
            mode="aspectFit"
            wx-if={detail.state === OrderState.pendingPayment}
          />
          <Image
            src={whitePendingShippedIcon}
            className="order-status-icon"
            mode="aspectFit"
            wx-if={detail.state === OrderState.pendingShipped}
          />
          <Image
            src={whiteMerchantShippedIcon}
            className="order-status-icon"
            mode="aspectFit"
            wx-if={detail.state === OrderState.merchantShipped}
          />
          <Image
            src={whiteCompletedIcon}
            className="order-status-icon"
            mode="aspectFit"
            wx-if={detail.state === OrderState.complete}
          />
          <Image
            src={whiteCanceledIcon}
            className="order-status-icon"
            mode="aspectFit"
            // wx-if={detail.state === OrderState.canceled || detail.state === OrderState.refunded}
            wx-if={detail.state === OrderState.canceled}
          />
          <Text className="order-label">{orderStatusLabel(detail.state, props.seller)}</Text>
        </View>
        <View className="order-tips-wrap">
          <RemainTimeLabel orderId={props.orderId} />
          <Text className="order-tips" wx-if={detail.state === OrderState.pendingShipped}>
            买家已付款
          </Text>
          <Text className="order-tips" wx-if={detail.state === OrderState.merchantShipped}>
            请及时查看物流信息
          </Text>
          <Text className="order-tips" wx-if={detail.state === OrderState.complete}>
            <Block wx-if={props.seller}>恭喜您！成功完成第1笔订单</Block>
            <Block wx-if={!props.seller}>感谢您的信任，期待您再次选择</Block>
          </Text>
          <Text className="order-tips" wx-if={detail.state === OrderState.canceled}>
            感谢您的信任，期待您再次选择
          </Text>
          {/* <Text className="order-tips" wx-if={detail.state === OrderState.refunded}>
            感谢您的信任，期待您再次选择
          </Text> */}
        </View>
      </View>
    )
  })
}

export default OrderDetailStatus
