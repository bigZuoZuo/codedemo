import {api} from '../../../api'
import {useStore} from '../../../store'
import {IOrder, OrderState, OrderType} from '../../../typings'
// import {paymentOrder} from '../../../utils/payment-order'
import {repurchase} from '../../../utils/repurchase'
import {mergeAddress} from '../../../utils/util'
import {useOrderTiming} from '../../../utils/use-order-timing'
import {Button, Text, View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {runInAction} from 'mobx'
import {useObserver} from 'mobx-react'

// import clockIcon from '../../../assets/clock.png'

import './order-list-item.scss'
import dayjs from 'dayjs'
import useChooseAddress from '@/utils/use-choose-address'

interface Props {
  orderId: string
}

export function PendingPaymentButton(props: Props) {
  const store = useStore()
  return useObserver(() => {
    const orderDetail = store.detailSet[props.orderId] as IOrder
    if (orderDetail.state !== OrderState.pendingPayment) {
      return null
    }

    return (
      <Button
        className="order-footer-button purple"
        type="primary"
        plain
        size="mini"
        onClick={() => Taro.navigateTo({url: `/pages/pay/pay?id=${props.orderId}`})}
      >
        立即付款
      </Button>
    )
  })
}

export function ModifyAddressButton(props: Props) {
  const store = useStore()
  const chooseAddress = useChooseAddress()

  return useObserver(() => {
    const orderDetail = store.detailSet[props.orderId] as IOrder

    async function onModifyAddress() {
      const rst = await chooseAddress()
      await api.order.addressUpdate({
        orderId: props.orderId,
        address: mergeAddress(rst),
        contactName: rst.contact_name,
        contactMobile: rst.mobile,
      })

      Taro.showToast({title: '地址修改成功', icon: 'success'})
    }

    if (orderDetail.state !== OrderState.pendingShipped || orderDetail.type === OrderType.blind_box) {
      return null
    }

    return (
      <Button className="order-footer-button" plain type="primary" size="mini" onClick={onModifyAddress}>
        修改地址
      </Button>
    )
  })
}

export function ConfirmReceivedButton(props: Props) {
  const store = useStore()
  return useObserver(() => {
    const orderDetail = store.detailSet[props.orderId] as IOrder

    async function onConfirmReceived() {
      await api.order.completedCreate({orderId: props.orderId})

      runInAction(() => {
        orderDetail.state = OrderState.complete
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, props.orderId)
        store.addToListSet(`miniprogramMeOrderCreate_${OrderState.complete}` as any, props.orderId)
      })
    }

    if (orderDetail.state !== OrderState.merchantShipped || orderDetail.type === OrderType.blind_box) {
      return null
    }

    return (
      <Button className="order-footer-button" plain type="primary" size="mini" onClick={onConfirmReceived}>
        确认收货
      </Button>
    )
  })
}

export function DeleteOrderButton(props: Props) {
  const store = useStore()
  return useObserver(() => {
    const orderDetail = store.detailSet[props.orderId] as IOrder

    async function onDeleteOrder() {
      Taro.showModal({
        title: '提示',
        content: '您确认要删除该订单，删除后该订单将无法再恢复',
        success: async (res) => {
          if (res.confirm) {
            await api.order.deleteCreate({orderIds: [props.orderId]})
            store.removeByListSet('miniprogramMeOrderCreate_all' as any, props.orderId)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, props.orderId)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.complete}` as any, props.orderId)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.merchantShipped}` as any, props.orderId)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingPayment}` as any, props.orderId)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, props.orderId)
          }
        },
      })
    }

    const orderStateCompleteAndCanceled =
      orderDetail.state === OrderState.complete || orderDetail.state === OrderState.canceled // ||
    // orderDetail.state === OrderState.refunded
    if (!orderStateCompleteAndCanceled) {
      return null
    }

    return (
      <Button className="order-footer-button" plain type="primary" size="mini" onClick={onDeleteOrder}>
        删除订单
      </Button>
    )
  })
}

export function RepurchaseButton(props: Props) {
  const store = useStore()
  return useObserver(() => {
    const orderDetail = store.detailSet[props.orderId] as IOrder

    const orderStateCompleteAndCanceled =
      orderDetail.state === OrderState.complete || orderDetail.state === OrderState.canceled
    if (!orderStateCompleteAndCanceled) {
      return null
    }

    return (
      <Button
        className="order-footer-button purple"
        plain
        type="primary"
        size="mini"
        onClick={() => repurchase(orderDetail)}
      >
        再次购买
      </Button>
    )
  })
}

export function ShowDetailButton() {
  // const store = useStore()
  return useObserver(() => {
    // const orderDetail = store.detailSet[props.orderId] as IOrder
    // if (orderDetail.state !== OrderState.refunded) {
    //   return null
    // }

    return null
    // return (
    //   <Button className="order-footer-button" plain type="primary" size="mini">
    //     查看详情
    //   </Button>
    // )
  })
}

export function RemainTimeLabel(props: Props) {
  return useObserver(() => {
    const remainTime = useOrderTiming(props.orderId)
    if (!remainTime) {
      return null
    }
    return (
      <View className="order-clock-box">
        {/* <Image src={clockIcon} className="order-clock" /> */}
        <Text className="order-timing">支付剩余{remainTime}</Text>
      </View>
    )
  })
}

export const CancelButton = (props: Props) => {
  const store = useStore()
  store.observableDetailIfNull({id: props.orderId})

  // return null
  // 删除取消订单功能
  return useObserver(() => {
    const orderDetail = store.detailSet[props.orderId] as IOrder
    if (orderDetail.state !== OrderState.pendingPayment) {
      return null
    }

    async function onCancel() {
      await api.order.cancelCreate({orderId: props.orderId})

      runInAction(() => {
        orderDetail.state = OrderState.canceled
        orderDetail.canceled_at = dayjs().format()

        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, orderDetail.id)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.complete}` as any, orderDetail.id)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.merchantShipped}` as any, orderDetail.id)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingPayment}` as any, orderDetail.id)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, orderDetail.id)
        store.addToListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, orderDetail.id)
      })
    }

    return (
      <Button
        className="order-footer-button"
        plain
        type="primary"
        size="mini"
        wx-if={[OrderState.pendingPayment, OrderState.pendingShipped].includes(orderDetail.state)}
        onClick={onCancel}
      >
        取消订单
      </Button>
    )
  })
}
