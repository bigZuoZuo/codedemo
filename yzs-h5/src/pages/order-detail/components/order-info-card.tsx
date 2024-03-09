// import {useStore} from '../../../store'
import {View, Text} from '@tarojs/components'
import dayjs from 'dayjs'
import {OrderState} from '../../../typings'

import './order-info-card.scss'
import Taro from '@tarojs/taro'

const PAY_TYPE = {
  wxpay: '微信',
  unionpay_h5tomini: '微信',
  'unionpay-h5tomini': '微信',
  'unionpay-wx': '微信',
  unionpay_wx: '微信',
  alipay: '支付宝',
  unionpay_ali: '支付宝',
  unionpay: '银联',
  'unionpay-offiaccount': '公众号',
  unionpay_offiaccount: '公众号',
  'unionpay-uac': '云闪付',
  unionpay_uac: '云闪付',
  none: '无',
}

interface Props {
  orderId: string
  detail: object
  seller?: string
}

function OrderInfoCard(props: Props) {
  // const store = useStore()

  const orderDetail: any = props.detail

  // const orderDetail = store.detailSet[props.orderId] as IOrder
  const orderTime = dayjs(orderDetail.paid_at).format('YYYY/MM/DD HH:mm')

  function onCopyOrderId() {
    Taro.setClipboardData({
      data: orderDetail.order_code,
    })
    Taro.showToast({title: '复制成功'})
  }

  let amountLabel = ''
  switch (orderDetail.state) {
    case OrderState.pendingPayment:
      amountLabel = '应付款'
      break
    case OrderState.pendingShipped:
      amountLabel = props.seller ? '应收金额' : '实付款'
      break
    case OrderState.merchantShipped:
      amountLabel = props.seller ? '应收金额' : '实付款'
      break
    case OrderState.complete:
      amountLabel = props.seller ? '应收金额' : '实付款'
      break
    case OrderState.canceled:
      amountLabel = '应付款'
      break
    default:
      break
  }

  return (
    <View className="order-info-page-card">
      <View className="order-info-body">
        <View className="order-info-item">
          <Text className="order-info-label">订单编号</Text>
          <Text className="order-info-value no">{orderDetail.order_code} </Text>
          <View className="order-info-extra" onClick={onCopyOrderId}></View>
        </View>
        <View className="order-info-item">
          <Text className="order-info-label">商品总额</Text>
          <Text className="order-info-value">¥ {orderDetail.price}</Text>
        </View>
        <View className="order-info-item">
          <Text className="order-info-label">运费</Text>
          <Text className="order-info-value">¥ 0.00</Text>
        </View>
        <View className="order-info-item">
          <Text className="order-info-label">优惠</Text>
          <Text className="order-info-value">¥ 0.00</Text>
        </View>
        <View className="order-info-item final">
          <Text className="order-info-label">{amountLabel}</Text>
          <Text className="order-info-value">¥ {orderDetail.price}</Text>
        </View>
      </View>
      {orderDetail.price != 0 ? (
        <View className="order-info-body pay">
          <View className="order-info-item">
            <Text className="order-info-label">支付时间</Text>
            <Text className="order-info-value time">{orderTime}</Text>
          </View>
          <View className="order-info-item">
            <Text className="order-info-label">支付方式</Text>
            <Text className="order-info-value pay">{PAY_TYPE[orderDetail.pay_type || 'none']}</Text>
          </View>
        </View>
      ) : null}
    </View>
  )
}

export default OrderInfoCard
