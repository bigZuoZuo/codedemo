import NavigationBar from '@/components/navigation-bar/navigation-bar'
import OrderDetailGoodsCard from './components/order-detail-goods-card'
import OrderInfoCard from './components/order-info-card'
// import {useStore} from '@/store'
import {OrderDeliveryType, OrderState} from '@/typings'
import {View, Text, Image} from '@tarojs/components'
import dayjs from 'dayjs'
import Taro, {getCurrentInstance, usePageScroll, useDidShow, useRouter} from '@tarojs/taro'
import {useEffect, useState} from 'react'
import {
  CancelButton,
  ConfirmReceivedButton,
  // DeleteOrderButton,
  ModifyAddressButton,
  // ModifyAddressWhenPendingShippedButton,
  PaymentButton,
  RepurchaseButton,
} from './order-operation-button'
import {statusToLabel} from '../order-list/components/status-to-label'
import {formatSecond2} from '../../utils/util'
import rightArrowIcon from '@/assets/right-arrow.png'
import addressIcon from '@/assets/icons/address.png'
import logisticsIcon from '@/assets/icons/logistics.png'

import './index.scss'
import {api} from '@/api'

function OrderDetail() {
  // const store = useStore()
  const router = useRouter()
  const [orderId, setOrderId] = useState(router?.params?.id ?? '')
  const [showNavigationBarBackground, setShowNavigationBarBackground] = useState(false)
  const [detail, setDetail] = useState<any>({})

  // 应该是 taro 的 bug
  // 真机支付 会触发 onHide 👇 导致拿到 上一个页面的 params
  useDidShow(() => {
    setOrderId(getCurrentInstance().router?.params.id || '')
  })

  useEffect(() => {
    if (!orderId) {
      return
    }
    async function fetchData() {
      const result: any = await api.order.orderDetail(orderId)
      setDetail(result.data)
    }
    fetchData()
    // store.loadApiOrSelectDetail(api.order.orderDetail, orderId!)
  }, [orderId])

  const [logisticsBeau, setLogisticsBeau] = useState<any>({})
  useEffect(() => {
    async function fetchData() {
      const result: any = await api.order.orderTrackApi(detail?.track_company, detail?.track_number)
      setLogisticsBeau(result.data.data)
    }
    if (detail?.track_company && detail?.track_number) {
      fetchData()
    }
  }, [detail])

  // store.observableDetailIfNull({id: orderId})

  usePageScroll((data) => {
    const scrollTop = data.scrollTop
    if (scrollTop < 80) {
      if (showNavigationBarBackground) {
        setShowNavigationBarBackground(false)
      }
    } else {
      if (!this.data.showNavigationBarBackground) {
        setShowNavigationBarBackground(true)
      }
    }
  })

  if (!orderId) {
    return <></>
  }
  if (!detail.id) {
    return <></>
  }

  const [timing, setTiming] = useState(0)
  const [rerender, setRerender] = useState(false)

  useEffect(() => {
    if (detail.state !== OrderState.pendingPayment) {
      return
    }

    const now = dayjs(Date.now())
    const expiredAt = dayjs(detail.time_expire)
    const remainTime = expiredAt.diff(now, 'second')

    const timeout = setTimeout(() => {
      setRerender(!rerender)
    }, 1000)

    if (remainTime <= 0) {
      clearTimeout(timeout)
      setTiming(0)
      setDetail({
        ...detail,
        state: OrderState.canceled,
        canceled_at: dayjs().format(),
      })
      return
    }

    setTiming(remainTime)
    return () => {
      clearTimeout(timeout)
    }
  }, [detail, rerender])

  const {statusString} = statusToLabel(detail.state)

  const remainTime = detail.state !== OrderState.pendingPayment ? '' : formatSecond2(timing, true)

  return (
    <View className="container order-detail-page-container">
      <NavigationBar
        back
        color="#fff"
        background="transparent"
        onBack={() => Taro.redirectTo({url: '/pages/order-list/order-list'})}
        title={statusString}
      />
      <View className="order-tips" wx-if={remainTime}>
        即将在{remainTime.replace(/分|时/g, ':').replace(/秒/g, '')}后自动取消订单
      </View>
      {/* <View className="order-status" style={{display: 'none'}}>
          <Block wx-if={orderId}>
            <OrderDetailStatus orderId={orderId!} />
          </Block>
        </View> */}

      {/* 实体 NFT 地址物流  */}
      <View className="address-box" wx-if={detail.delivery_type === OrderDeliveryType.inKine}>
        <View className="logistics-info" wx-if={OrderState.orderPaid === detail.state}>
          <Image src={logisticsIcon} mode="aspectFit" className="icon2" />
          <View className="logistics-news-info">
            <View className="logistics-news">待发货</View>
          </View>
        </View>
        <View
          className="logistics-info"
          wx-if={(!detail?.track_company || !detail.track_number) && OrderState.pendingShipped === detail.state}
        >
          <Image src={logisticsIcon} mode="aspectFit" className="icon2" />
          <View className="logistics-news-info">
            <View className="logistics-news">待揽收</View>
          </View>
        </View>
        <View
          className="logistics-info"
          wx-if={
            detail?.track_company &&
            detail.track_number &&
            [OrderState.pendingShipped, OrderState.complete].indexOf(detail.state) > -1 &&
            logisticsBeau?.items?.length
          }
          onClick={() => {
            Taro.navigateTo({
              url: `/pages/logistics/index?company=${detail?.track_company}&number=${detail?.track_number}`,
            })
          }}
        >
          <Image src={logisticsIcon} mode="aspectFit" className="icon2" />
          <View className="logistics-news-info">
            <View className="logistics-news">{logisticsBeau?.items?.[0].context}</View>
            <View className="logistics-date">{logisticsBeau?.items?.[0].ftime}</View>
          </View>
          <Image src={rightArrowIcon} mode="aspectFit" className="arrow" />
        </View>
        <View className="address-info">
          <Image src={addressIcon} mode="aspectFit" className="icon" />
          <View className="receive-address-info">
            <View className="receive-address-info-wang">
              <View className="receive-address-info-name">{detail?.contact_name}</View>&emsp;
              <View className="receive-address-info-phone-number">{detail?.contact_mobile}</View>
            </View>
            <View className="receive-address-info-detail">{detail.address}</View>
          </View>
        </View>
      </View>

      <View
        className="order-container"
        style={
          detail.state === OrderState.pendingPayment && detail.delivery_type === OrderDeliveryType.onLine
            ? 'margin-top: 0; padding-top: 18rpx'
            : ''
        }
      >
        <View className="order-detail-goods-card" wx-if={detail}>
          <OrderDetailGoodsCard detail={detail} orderId={detail.id} />
        </View>
        <OrderInfoCard orderId={detail.id} detail={detail} />
      </View>

      <View
        className="order-operation"
        wx-if={
          (detail.id && detail.state !== OrderState.orderPaid && detail.state !== OrderState.pendingShipped) ||
          detail.state === OrderState.pendingShipped
        }
      >
        <Text className="order-total" wx-if={remainTime}>
          合计：
          <Text className="order-price">{detail.price}</Text>
        </Text>
        <CancelButton id={detail.id} detail={detail} />
        <ModifyAddressButton id={detail.id} detail={detail} />
        <PaymentButton id={detail.id} detail={detail} />
        {/* <ModifyAddressWhenPendingShippedButton id={detail.id} detail={detail} /> */}
        <ConfirmReceivedButton
          id={detail.id}
          detail={detail}
          handleBack={() => {
            setDetail({
              ...detail,
              state: OrderState.complete,
              received_at: dayjs().format(),
            })
          }}
        />
        {/* <DeleteOrderButton id={detail.id} detail={detail} /> */}
        <RepurchaseButton id={detail.id} detail={detail} />
      </View>
      <View className="safe-bottom"></View>
    </View>
  )
  // })
}

export default OrderDetail
