// import NavigationBar from '@/components/navigation-bar/navigation-bar'
// import {IOrder, OrderType, PaymentStatus} from '@/typings'
import {OrderType, OrderState} from '@/typings'
import {View} from '@tarojs/components'
import Taro, {useRouter} from '@tarojs/taro'
import {useState, useEffect} from 'react'

import {os} from '@/utils/util'
import {api, baseUrl} from '@/api'
// import {useStore} from '@/store'
// @ts-ignore
import './index.scss'

function PaidMiddle() {
  // const store = useStore()
  const params: any = useRouter().params
  // console.log(params, 'params')
  const [orderId] = useState(params?.id ?? '')
  const [free] = useState(params?.free ?? false)
  const [type] = useState(params?.order_type ?? '')
  const [amount] = useState(params?.amount ?? '')
  const [status] = useState(params?.status ?? '')
  const [delivery_type] = useState(params?.delivery_type ?? '')

  useEffect(() => {
    if (!orderId) {
      return
    }
    if (os.isWechatWeb && !free) {
      return
    }
    async function fetchData() {
      try {
        const result: any = await api.order.orderDetail(orderId)
        Taro.redirectTo({
          url: getReturnUrl(result.data),
        })
      } catch (e) {
        Taro.redirectTo({
          url: getReturnUrl({}),
        })
      }
    }
    fetchData()
  }, [orderId])

  function getReturnUrl(detail) {
    const chain_type = JSON.parse(detail?.items?.[0]?.extra)?.chain_type
    const up = chain_type==="国版链" ? chain_type : ''
    let returnUrl = `/pages/pay-success/pay-success?id=${orderId}&delivery_type=${delivery_type}&chain_type=${up}`
    if (os.isWechatWeb && !free) {
      returnUrl = `/pay-success?id=${orderId}&delivery_type=${delivery_type}&chain_type=${up}`
      if (/TRADE_SUCCESS/.test(status)) {
        if (type === OrderType.blind_box) {
          returnUrl = `/property?id=${orderId}&type=${type}&amount=${Number(amount)}`
        }
      } else {
        returnUrl = `/order-detail?id=${orderId}`
      }
    } else {
      if (OrderState.orderPaid === detail.state || OrderState.complete === detail.state) {
        if (type === OrderType.blind_box) {
          returnUrl = `/pages/property/property?id=${orderId}&type=${type}&amount=${Number(amount)}`
        }
      } else {
        returnUrl = `/pages/order-detail/order-detail?id=${orderId}`
      }
    }
    return returnUrl
  }

  useEffect(() => {
    if (os.isWechatWeb && !free) {
      var mchData = {action: 'onIframeReady', displayStyle: 'SHOW_CUSTOM_PAGE'}
      var postData = JSON.stringify(mchData)
      parent.postMessage(postData, 'https://payapp.weixin.qq.com')
    }
  }, [os.isWechatWeb])

  function jumpOut() {
    if (/TRADE_SUCCESS/.test(status)) {
      var mchData = {action: 'jumpOut', jumpOutUrl: baseUrl + getReturnUrl({})}
      var postData = JSON.stringify(mchData)
      parent.postMessage(postData, 'https://payapp.weixin.qq.com')
    } else {
      Taro.redirectTo({
        url: getReturnUrl({}),
      })
    }
  }
  if (os.isWechatWeb && !free) {
    if (/TRADE_SUCCESS/.test(status)) {
      return (
        <View className="pay-middle">
          <View className="success-text">订单已支付完成</View>
          <View className="btn" onClick={jumpOut}>
            前去查看
          </View>
        </View>
      )
    } else {
      Taro.redirectTo({
        url: getReturnUrl({}),
      })
    }
  }

  return null
}

export default PaidMiddle
