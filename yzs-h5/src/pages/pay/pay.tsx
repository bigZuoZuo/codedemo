import NavigationBar from '@/components/navigation-bar/navigation-bar'
// import {IOrder, OrderType, PaymentStatus} from '@/typings'
// import {OrderType} from '@/typings'
import {View, Image, Text, Button} from '@tarojs/components'
import Taro, {useRouter} from '@tarojs/taro'
import {useState, useEffect} from 'react'
import {AtModal, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui'
import {useObserver} from 'mobx-react'

import {api, baseUrl} from '@/api'
import {useStore} from '@/store'
import {os} from '@/utils/util'

import wechatPayIcon from '@/assets/v2/icon/wechat-pay.png'
import aliPayIcon from '@/assets/v2/icon/ali-pay.png'
import otherPayIcon from '@/assets/v2/icon/other-pay.png'
import styles from './pay.module.css'
import {priceRemoveFloat} from '@/utils/parse-price'
import {debounceFirst} from '@/utils/util'
import classNames from 'classnames'
import {OrderState} from '@/typings'

/**
 * 下单会存在多种类型，每种类型都不一样，
 * 包含：Sku 下单、NFT 下单、用户发布的 NFT 下单、盲盒下单
 */
function PlaceOrder() {
  const store = useStore()
  const params = useRouter().params
  const [orderId] = useState(params?.id ?? '')
  const [payment, setPayment] = useState(false)
  const [payModal, setPayModal] = useState(false)
  const [detail, setDetail] = useState<any>({})
  const [returnUrl, setReturnUrl] = useState<any>('')

  useEffect(() => {
    if (!orderId) {
      return
    }
    async function fetchData() {
      const reuslt: any = await api.order.orderDetail(orderId)
      setDetail(reuslt.data)
    }
    fetchData()
  }, [orderId])
  // store.observableDetailIfNull({id: orderId})

  useEffect(() => {
    if (detail?.type) {
      let tempReturnUrl = `/pages/paid-middle/paid-middle?id=${orderId}&order_type=${detail?.type}&amount=${Number(
        detail.amount
      )}&delivery_type=${detail?.delivery_type}`
      if (os.isWechatWeb) {
        tempReturnUrl = `/paid-middle?id=${orderId}&order_type=${detail?.type}&amount=${Number(
          detail.amount
        )}&delivery_type=${detail?.delivery_type}`
      }
      setReturnUrl(tempReturnUrl)
    }
  }, [detail])

  //@ts-ignore
  const payQuery = () => {
    // 轮询 支付结果
    // let order = (await store.loadByApi({api: api.order.orderDetail(orderId)})) as IOrder
    // const start = Date.now()
    // const timeout = 10e3
    // while (order.state === OrderState.pendingPayment && Date.now() - start < timeout) {
    //   const next = new Promise<void>((resolve) => {
    //     setTimeout(async () => {
    //       order = await store.loadByApi({api: api.order.orderDetail(orderId)})
    //       resolve()
    //     }, 1e3)
    //   })
    //   await next
    //   if (PaymentStatus.success === order.payment_status) {
    //     Taro.redirectTo({
    //       url: returnUrl,
    //     })
    //     return
    //   }
    // }
  }

  const [payType, setPayType] = useState('h5tomini')

  async function onPay() {
    if (detail?.state === OrderState.orderPaid || detail?.state === OrderState.complete) {
      // 不要钱的订单
      Taro.redirectTo({
        url: `${returnUrl}&free=1`,
      })
      return
    }
    // 没有微信id 禁止发起微信支付
    // if (os.isWechatWeb && !store.state.openId) {
    //   Taro.showToast({title: '未授权微信，请联系客服！', icon: 'none'})
    //   return
    // }
    if (payment) return
    setPayment(true)
    let tradeType = payType
    if (os.isWechatWeb && tradeType === 'h5tomini') {
      tradeType = 'offiaccount'
    }
    /**
     * 支付订单
     */
    Taro.showLoading({title: '支付中...'})
    try {
      const pay = await store.loadByApi({
        api: api.order.orderPay({orderId: orderId, tradeType: tradeType, returnUrl: baseUrl + returnUrl}),
      })
      setPayment(false)
      if (os.isWechatWeb) {
        // window.location.href = pay.url
        window.location.replace(pay.url)
      } else {
        Taro.hideLoading()
        await Taro.showModal({
          title: '提示',
          content: '确定支付吗？',
          cancelText: '取消支付',
          confirmText: '去支付',
          success: ({confirm}) => {
            if (confirm) {
              window.open(pay.url, '_blank')
              self.focus()
            } else {
              Taro.redirectTo({
                url: `/pages/order-detail/order-detail?id=${orderId}`,
              })
            }
          },
          fail: () => {
            Taro.redirectTo({
              url: `/pages/order-detail/order-detail?id=${orderId}`,
            })
          },
        })
        setPayModal(true)
      }
    } catch (error) {
      Taro.hideLoading()
      setPayment(false)
      let msg = error.response.data.error
      Taro.showToast({title: msg, icon: 'none'})
    }
  }

  if (!detail.state) {
    return null
  }
  const [beau, setBeau] = useState(store.state || {})

  return useObserver(() => {
    useEffect(() => {
      const loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
      if (loginResponse.openId && !store.state.openId) {
        setBeau({...loginResponse, openId: loginResponse.openId})
      }
    }, [store.state.openId])
    return (
      <View className={classNames(styles.container, styles.show)}>
        {/* <Image src={bgImage} className="bg" /> title="数字文创销售"*/}
        <View className={classNames(styles.containerBox, 'pr z2')}>
          <NavigationBar back color="#fff" />
          <View className={styles.header}>
            <Text className={styles['price-label']}>需支付</Text>
            <Text className={styles.price}>¥{priceRemoveFloat(detail.price || '', 1)}</Text>
          </View>

          <View className={styles.body}>
            <View
              className={classNames(styles.item, payType === 'h5tomini' && styles['item-active'])}
              onClick={() => {
                setPayType('h5tomini')
                // Taro.showToast({title: '暂不支持其它支付方式', icon: 'none'})
              }}
            >
              <Image src={wechatPayIcon} className={styles.icon} />
              <Text className={styles['item-text']}>微信支付</Text>
            </View>
            {!os.isWechatWeb ? (
              <View
                className={classNames(styles.item, payType === 'ali' && styles['item-active'])}
                onClick={() => {
                  setPayType('ali')
                  // Taro.showToast({title: '暂不支持其它支付方式', icon: 'none'})
                }}
              >
                <Image src={aliPayIcon} className={styles.icon} />
                <Text className={styles['item-text']}>支付宝</Text>
              </View>
            ) : null}
            {!os.isWechatWeb ? (
              <View
                className={classNames(styles.item, payType === 'uac' && styles['item-active'])}
                onClick={() => {
                  setPayType('uac')
                  // Taro.showToast({title: '暂不支持其它支付方式', icon: 'none'})
                }}
              >
                <Image src={otherPayIcon} className={styles.icon} />
                <Text className={styles['item-text']}>其他支付</Text>
              </View>
            ) : null}
          </View>
          {os.isWechatWeb && beau.openId ? (
            <Button className={styles['pay-btn']} onClick={debounceFirst(onPay)}>
              确认付款
            </Button>
          ) : null}
          {!os.isWechatWeb && beau.logined ? (
            <Button className={styles['pay-btn']} onClick={debounceFirst(onPay)}>
              确认付款
            </Button>
          ) : null}
        </View>
        <AtModal
          isOpened={payModal}
          onClose={() => {
            setPayModal(false)
            Taro.redirectTo({
              url: returnUrl,
            })
          }}
        >
          <AtModalHeader>支付提示</AtModalHeader>
          <AtModalContent>
            支付完成前，请不要关闭此支付验证窗口。 支付完成后，请根据您支付的情况点击下面按钮。
          </AtModalContent>
          <AtModalAction>
            <Button
              onClick={() => {
                setPayModal(false)
                Taro.redirectTo({
                  url: `/pages/order-detail/order-detail?id=${orderId}`,
                })
              }}
              className={styles['pay-modal-btn2']}
            >
              支付遇到问题
            </Button>
            <Button
              onClick={() => {
                setPayModal(false)
                Taro.redirectTo({
                  url: returnUrl,
                })
              }}
              className={styles['pay-modal-btn']}
            >
              支付完成
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  })
}

export default PlaceOrder
