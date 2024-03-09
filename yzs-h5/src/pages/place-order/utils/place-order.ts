import {api} from '@/api'
import {OrderCreateBodyPM} from '@/api/api'
import {store, useStore} from '@/store'
import {IAddress, IAudit, IBlindBox, INFC, INFCType, ISku} from '@/typings'
// import {paymentOrder} from '@/utils/payment-order'
import {mergeAddress} from '@/utils/util'
import Taro, {useDidShow} from '@tarojs/taro'
import {useEffect, useState} from 'react'

export interface Option {
  skuId?: string
  amount?: string
  id?: string
  /**
   * @deprecated 统一使用 id
   */
  auditId?: string
  transactionType?: OrderCreateBodyPM['type']
}

type Detail = INFC | IAudit | IBlindBox

export function useLoadDetailEffect(options: Option) {
  const store = useStore()

  if (options.id) {
    store.observableDetailIfNull({id: options.id})
  }

  if (options.auditId) {
    store.observableDetailIfNull({id: options.auditId})
  }

  if (options.skuId) {
    store.observableDetailIfNull({id: options.skuId})
  }

  useEffect(() => {
    /**
     * 获取用户发布的 NFT
     */
    if (options.transactionType === 'user' && options.auditId) {
      store.loadApiOrSelectDetail(api.user.miniprogramMeNftPublishDetail, options.auditId)
    }
    if (options.transactionType === 'user' && options.id) {
      store.loadApiOrSelectDetail(api.user.miniprogramMeNftPublishDetail, options.id)
    }

    /**
     * 获取NFT
     */
    if (options.transactionType === 'platform' && options.id) {
      store.loadApiOrSelectDetail(api.user.miniprogramNfcDetail, {id:options.id})
    }

    /**
     * 获取盲盒
     */
    if (options.transactionType === 'blind_box' && options.id) {
      store.loadApiOrSelectDetail(api.blindbox.blindboxDetail, options.id)
    }

    /**
     * 获取SKU
     */
    if (options.skuId && options.id) {
      store.loadApiOrSelectDetail(api.nfc.getNfc, options.id)
    }
  }, [])
}

export function useDetail(options: Option): {detail?: Detail; skuDetail?: ISku} {
  const store = useStore()

  if (options.transactionType === 'blind_box') {
    return {
      detail: store.detailSet[options.id!] as Detail,
    }
  }
  if (options.transactionType === 'user') {
    return {
      detail: (store.detailSet[options.id!] || store.detailSet[options.auditId!]) as Detail,
    }
  }

  if (options.transactionType === 'platform') {
    return {
      detail: store.detailSet[options.id!] as Detail,
      skuDetail: store.detailSet[options.skuId!] as ISku,
    }
  }

  throw new Error('no support type:' + options.transactionType)
}

export function useReceiveAddress() {
  const [addressInfo, setAddressInfo] = useState<IAddress>()

  async function loadAddressByCached() {
    try {
      const addressInfoCached = await Taro.getStorage({key: 'addressInfo'})
      setAddressInfo(addressInfoCached.data)
    } catch (err) {
      const result = await api.user.miniprogramAddressList()
      let beau = {is_default: false}
      result?.data?.list?.map((it) => {
        if (it.is_default) {
          beau = it
        }
      })
      if (beau?.is_default) {
        await Taro.setStorage({
          key: 'addressInfo',
          data: beau,
        })
        setAddressInfo(beau as IAddress)
      }
    }
  }

  useDidShow(() => {
    loadAddressByCached()
  })

  return {
    addressInfo,
    async chooseAddress() {
      Taro.navigateTo({url: '/pages/delivery-address-list/index?choose=1'})
    },
  }
}

export function getMaxAmount(options: {
  transactionType?: OrderCreateBodyPM['type']
  detail?: Detail
  skuDetail?: ISku
}) {
  // @ts-ignore
  let limitNumber = options.detail?.limit_number
  let returnNumber = 0
  if (options.transactionType === 'platform') {
    // @ts-ignore
    returnNumber = options.detail?.available_number - options.detail?.sale
    // returnNumber = options.skuDetail
    //   ? options.skuDetail.amount - options.skuDetail.sale_total
    //   : ((options.detail as INFC)?.total ?? 0) - ((options.detail as INFC)?.sale ?? 0)
  }

  if (options.transactionType === 'blind_box') {
    returnNumber = (options.detail as IBlindBox).amount - (options.detail as IBlindBox).sale_amount
  }
  // @ts-ignore
  if (options.detail?.is_purchase) {
    if (returnNumber < limitNumber) {
      limitNumber = returnNumber
    }
  } else {
    limitNumber = returnNumber
  }
  return limitNumber
}

/**
 * 下单逻辑相对比较复杂，阅读这块代码需要有一定的心理准备
 */
export async function onPlaceOrderPayment(options: {
  detail: Detail
  transactionType: OrderCreateBodyPM['type']
  skuDetail?: ISku
  amount?: number
  address?: IAddress
  chooseAddress?: () => Promise<void>
}) {
  Taro.showLoading({title: '下单中，请等待'})

  /**
   * 中断当前下单流程
   */
  function abort(abortHandler: () => void) {
    Taro.hideLoading()
    abortHandler()
    throw new Error('place order fail by')
  }

  /**
   * 中断当前下单流程并且给出提示
   */
  function abortAndShowToast(message: string) {
    console.log('🚀 ~ file: place-order.ts ~ line 159 ~ abortAndShowToast ~ message', message)
    abort(() => Taro.showToast({icon: 'none', title: message}))
  }

  /**
   * 如果没有生成钱包，需要去生成一下
   */
  try {
    await store.retryLoginToGenerateWallet()
  } catch {
    abortAndShowToast('系统繁忙，请稍后重试')
  }

  /**
   * 限购, 有些没有限购功能, 类型设为 any
   */
  const purchaseDetail: any = options.skuDetail || options.detail

  if (purchaseDetail.is_can_sale === false) {
    abortAndShowToast(`该商品不可售卖`)
  }

  if (purchaseDetail.is_can_sale) {
    if (options.transactionType === 'platform') {
      const response = (await store.loadByApi({api: api.user.miniprogramNfcDetail({id:options.detail.id})})) as INFC
      if (!response.is_can_sale) {
        abortAndShowToast(`该商品不可售卖`)
      }
    }
  }

  if (purchaseDetail.is_purchase && purchaseDetail.limit_number < (options.amount ?? 1)) {
    abortAndShowToast(`最多只能购买 ${purchaseDetail.limit_number} 件哦`)
  }

  /**
   * 实体 nft，需要选择收货地址
   */
  if ((options.detail as INFC).type === INFCType.collectionEntity && !options.address) {
    abort(() => {
      Taro.showModal({
        title: '提示',
        content: '请选择收货地址',
        success: (res) => {
          if (res.confirm) {
            options.chooseAddress?.()
          }
        },
      })
    })
  }

  /**
   * 有可能下单成功了，支付取消了，这时候订单已经创建了，就需要跳到订单详情中变成待支付状态
   */
  const response = await store
    .loadByApi({
      api: api.user.miniprogramOrderCreateCreate({
        type: options.transactionType,
        address: mergeAddress(options.address),
        contactMobile: options.address?.mobile ?? '',
        contactName: options.address?.contact_name ?? '',
        items: [
          {
            item_id: options.detail.id,
            sku_id: options.skuDetail?.id,
            amount: options.amount ?? 1,
          },
        ],
      }),
    })
    .catch((error) => {
      let message = error?.response?.data?.error
      if (/restrictions/.test(message)) {
        message = '你已经在规定时间超过购买数量！'
      } else if (/stock/.test(message)) {
        message = '藏品卖完了'
      } else if (/服务器拥挤请重试/.test(message)) {
        message = '购买人数太多了，请稍后重试！'
      } else if (/下单太频繁/.test(message)) {
        message = '您的操作过于频繁，请稍后操作！'
      } else if (/结束/.test(message)) {
        message = '该售卖已结束！'
      } else if (/开始/.test(message)) {
        message = '活动还未开始！'
      } else if (/下架/.test(message)) {
        message = '该藏品已下架！'
      } else if (/Error/.test(message)) {
        message = message.replace("Error create order!", "") || '你当前无法创建订单'
      }
      return abortAndShowToast(message)
    })

  /**
   * 支付订单
   * 支付取消或者失败，直接进入待支付页面
   */
  // await paymentOrder(response.id)
  //   .catch(() => abortAndShowToast('取消支付'))
  //   .catch(() => {})

  return response
}
