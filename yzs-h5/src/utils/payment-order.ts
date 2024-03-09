import {api} from '../api'
import {store} from '../store'
import {IOrder, OrderState} from '../typings'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import {runInAction} from 'mobx'
import {hideLoading, showLoading} from './show-loading'
import {os} from './util'

let payment = false
export const paymentOrder = async (orderId: string) => {
  if (payment) return
  payment = true
  const outTradeNo = Date.now().toString()
  hideLoading()
  showLoading()

  try {
    const response = await api.order.paymentCreate({
      orderId: orderId,
      outTradeNo,
      tradeType: os.isPlainWeb ? 'MWEB' : 'JSAPI',
    })

    if (os.isWechatWeb) {
      ;(wx as any).chooseWXPay({
        nonceStr: response.data.wechatRef.nonceStr,
        package: `prepay_id=${response.data.wechatRef.prepayId}`,
        paySign: response.data.wechatRef.paySign,
        timestamp: Number(response.data.wechatRef.timestamp),
        signType: 'MD5',
        success: function (res) {
          console.log('🚀 ~ file: payment-order.ts ~ line 33 ~ paymentOrder ~ res', res)
          // 支付成功后的回调函数
        },
        fail(res) {
          console.log('🚀 ~ file: payment-order.ts ~ line 37 ~ fail ~ res', res, response.data.wechatRef.timestamp)
        },
      })
      return
    }

    if (os.isPlainWeb) {
      // TODO: 小程序支付
      Taro.showToast({title: '当前不支持非小程序支付', icon: 'none'})
      return Promise.reject('no support')
    }

    await Taro.requestPayment({
      nonceStr: response.data.wechatRef.nonceStr,
      package: `prepay_id=${response.data.wechatRef.prepayId}`,
      paySign: response.data.wechatRef.paySign,
      timeStamp: response.data.wechatRef.timestamp,
      signType: 'MD5',
    })

    // 轮询 支付结果
    let order = (await store.loadByApi({api: api.order.orderDetail(orderId)})) as IOrder
    const start = Date.now()
    const timeout = 10e3
    while (order.state === OrderState.pendingPayment && Date.now() - start < timeout) {
      const next = new Promise<void>((resolve) => {
        setTimeout(async () => {
          order = await store.loadByApi({api: api.order.orderDetail(orderId)})
          resolve()
        }, 1e3)
      })
      await next
    }

    runInAction(() => {
      const orderDetail = store.detailSet[orderId] as IOrder
      orderDetail.state = OrderState.pendingShipped
      orderDetail.deal_at = dayjs().format()
      store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingPayment}` as any, orderId)
      store.addToListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, orderId)
      store.addToListSet(`miniprogramMeOrderCreate_all` as any, orderId)
    })
  } catch (error) {
    runInAction(() => {
      const orderDetail = store.detailSet[orderId] as IOrder
      orderDetail.state = OrderState.pendingPayment
      store.addToListSet(`miniprogramMeOrderCreate_${OrderState.pendingPayment}` as any, orderId)
      store.addToListSet(`miniprogramMeOrderCreate_all` as any, orderId)
    })

    return Promise.reject(error)
  } finally {
    payment = false
    hideLoading()
  }
}
