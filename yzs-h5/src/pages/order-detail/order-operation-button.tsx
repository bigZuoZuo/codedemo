import {api} from '@/api'
import {useStore} from '@/store'
import {IOrder, OrderDeliveryType, OrderState, OrderType} from '@/typings'
// import {paymentOrder} from '@/utils/payment-order'
import {repurchase} from '@/utils/repurchase'
import useChooseAddress from '@/utils/use-choose-address'
import {mergeAddress} from '@/utils/util'
import {Button} from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import {runInAction} from 'mobx'
import {useObserver} from 'mobx-react'
// import {useState} from 'react'

interface Props {
  id: string
  detail: object
  handleBack?: Function
}

//@ts-ignore
export const CancelButton = (props: Props) => {
  // const store = useStore()
  // store.observableDetailIfNull({id: props.id})
  return null
  // 删除取消订单功能
  // return useObserver(() => {
  //   const detail = store.detailSet[props.id] as IOrder

  //   async function onCancel() {
  //     await api.order.cancelCreate({orderId: props.id})

  //     runInAction(() => {
  //       detail.state = OrderState.canceled
  //       detail.canceled_at = dayjs().format()

  //       store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, detail.id)
  //       store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.complete}` as any, detail.id)
  //       store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.merchantShipped}` as any, detail.id)
  //       store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingPayment}` as any, detail.id)
  //       store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, detail.id)
  //       store.addToListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, detail.id)
  //     })
  //   }

  //   return (
  //     <Button
  //       className="order-operation-button"
  //       size="mini"
  //       plain={true}
  //       wx-if={[OrderState.pendingPayment, OrderState.pendingShipped].includes(detail.state)}
  //       onClick={onCancel}
  //     >
  //       取消订单
  //     </Button>
  //   )
  // })
}

/**
 * 待发货时修改地址
 */
export const ModifyAddressButton = (props: Props) => {
  // const store = useStore()
  const chooseAddress = useChooseAddress()
  // store.observableDetailIfNull({id: props.id})

  return useObserver(() => {
    // const detail = store.detailSet[props.id] as IOrder
    const detail = props.detail as IOrder

    async function onModifyAddress() {
      const rst = await chooseAddress()
      await api.order.addressUpdate({
        orderId: props.id,
        address: mergeAddress(rst),
        contactName: rst.contact_name,
        contactMobile: rst.mobile,
      })

      runInAction(() => {
        detail.address = mergeAddress(rst)
        detail.contact_name = rst.contact_name
        detail.contact_mobile = rst.mobile
      })
    }
    return (
      <Button
        className="order-operation-button"
        size="mini"
        plain={true}
        wx-if={
          [OrderState.pendingPayment].includes(detail.state) &&
          detail.delivery_type !== OrderDeliveryType.onLine &&
          detail.type !== OrderType.blind_box
        }
        onClick={onModifyAddress}
      >
        修改地址
      </Button>
    )
  })
}

export const PaymentButton = (props: Props) => {
  // const store = useStore()
  // store.observableDetailIfNull({id: props.id})

  const detail = props.detail as IOrder

  // const [showDialog, setShowDialog] = useState(false)
  function onPayment() {
    Taro.navigateTo({url: `/pages/pay/pay?id=${props.id}`})
    // await paymentOrder(props.id)
    // setShowDialog(true)
  }

  return (
    <>
      <Button
        className="order-operation-button"
        size="mini"
        plain
        type="primary"
        wx-if={[OrderState.pendingPayment].includes(detail.state)}
        onClick={onPayment}
      >
        去支付
      </Button>
    </>
  )
}

export const ModifyAddressWhenPendingShippedButton = (props: Props) => {
  // const store = useStore()
  const chooseAddress = useChooseAddress()
  // store.observableDetailIfNull({id: props.id})

  const detail = props.detail as IOrder

  async function onModifyAddress() {
    const rst = await chooseAddress()
    await api.order.addressUpdate({
      orderId: props.id,
      address: mergeAddress(rst),
      contactName: rst.contact_name,
      contactMobile: rst.mobile,
    })

    runInAction(() => {
      detail.address = mergeAddress(rst)
    })
  }

  return (
    <Button
      className="order-operation-button"
      size="mini"
      type="primary"
      plain={true}
      wx-if={
        [OrderState.pendingShipped].includes(detail.state) &&
        detail.delivery_type !== OrderDeliveryType.onLine &&
        detail.type !== OrderType.blind_box
      }
      onClick={onModifyAddress}
    >
      修改地址
    </Button>
  )
}

export const ConfirmReceivedButton = (props: Props) => {
  const store = useStore()
  // store.observableDetailIfNull({id: props.id})

  return useObserver(() => {
    // const detail = store.detailSet[props.id] as IOrder
    const detail = props.detail as IOrder

    async function onConfirmReceived() {
      await api.order.completedCreate({orderId: props.id})

      runInAction(() => {
        detail.state = OrderState.complete
        detail.received_at = dayjs().format()
        props.handleBack && props.handleBack()
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, props.id)
        store.addToListSet(`miniprogramMeOrderCreate_${OrderState.complete}` as any, props.id)
      })
    }

    return (
      <Button
        className="order-operation-button"
        size="mini"
        plain={true}
        type="primary"
        wx-if={[OrderState.pendingShipped].includes(detail.state) && detail.type !== OrderType.blind_box}
        onClick={onConfirmReceived}
      >
        确定收货
      </Button>
    )
  })
}

export const DeleteOrderButton = (props: Props) => {
  const store = useStore()
  // store.observableDetailIfNull({id: props.id})

  return useObserver(() => {
    const detail = props.detail as IOrder
    // const detail = store.detailSet[props.id] as IOrder
    function onDeleteOrder() {
      Taro.showModal({
        title: '提示',
        content: '您确认要删除该订单，删除后该订单将无法再恢复',
        success: async (res) => {
          if (res.confirm) {
            await api.order.deleteCreate({orderIds: [props.id]})
            store.removeByListSet('miniprogramMeOrderCreate_all' as any, props.id)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, props.id)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.complete}` as any, props.id)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.merchantShipped}` as any, props.id)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingPayment}` as any, props.id)
            store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, props.id)

            Taro.navigateBack()
          }
        },
      })
    }

    return (
      <Button
        className="order-operation-button"
        size="mini"
        plain={true}
        wx-if={[OrderState.complete, OrderState.canceled].includes(detail.state)}
        onClick={onDeleteOrder}
      >
        删除订单
      </Button>
    )
  })
}

export const RepurchaseButton = (props: Props) => {
  // const store = useStore()
  // store.observableDetailIfNull({id: props.id})

  const detail = props.detail as IOrder

  function onRepurchase() {
    repurchase(detail)
  }

  return (
    <Button
      className="order-operation-button"
      size="mini"
      plain={true}
      type="primary"
      wx-if={[OrderState.complete, OrderState.canceled].includes(detail.state)}
      onClick={onRepurchase}
    >
      再次购买
    </Button>
  )
}
