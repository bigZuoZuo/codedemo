//@ts-nocheck
import {Text, Button, View, Image, Block} from '@tarojs/components'
import {useRouter} from '@tarojs/taro'
import {useObserver} from 'mobx-react'
import {useState} from 'react'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {os} from '@/utils/util'
import {INFC, INFCType} from '@/typings'
import {mergeAddress} from '@/utils/util'

import './place-order.scss'

import {showImageOrVideo} from '../home/home'
import Stepper from '@/components/stepper/stepper'
import rightArrowIcon from '@/assets/right-arrow.png'
import addressIcon from '@/assets/icons/address.png'
// import Pay from './components/pay'
import {priceRemoveFloat} from '@/utils/parse-price'
import {useLoadDetailEffect, onPlaceOrderPayment, useReceiveAddress, useDetail, getMaxAmount} from './utils/place-order'
import {OrderCreateBodyPM} from '@/api/api'
import {api} from '@/api'
import {useStore} from '@/store'

let payment = false

/**
 * 下单会存在多种类型，每种类型都不一样，
 * 包含：Sku 下单、NFT 下单、用户发布的 NFT 下单、盲盒下单
 */
function PlaceOrder() {
  const options = useRouter().params
  const store = useStore()

  /**
   * 处理一些副作用
   */
  useLoadDetailEffect(options)
  const transactionType = options.transactionType as OrderCreateBodyPM['type']
  const isPlatform = transactionType === 'platform'

  return useObserver(() => {
    const detailInfo = useDetail(options)
    const [payModal, setPayModal] = useState(false)
    const {addressInfo, chooseAddress} = useReceiveAddress()

    // 优先取当前 SKU 的价格
    const basePrice = detailInfo.skuDetail?.price ?? detailInfo.detail?.price
    const [amount, setAmount] = useState(options.amount)

    const transactionType = options.transactionType as OrderCreateBodyPM['type']

    const isUser = transactionType === 'user'
    const isBlindBox = transactionType === 'blind_box'

    async function onPay() {
      // setPayModal(true)
      if (payment) return
      payment = true
      // 是否实名认证
      if (!store.state.isKycAuth) {
        payment = false
        Taro.navigateTo({
          url: '/pages/account/account?kyc=no',
        })
        return
      }
      const {id: orderId} = await onPlaceOrderPayment({
        detail: detailInfo.detail!,
        skuDetail: detailInfo.skuDetail,
        transactionType,
        amount: Number(amount),
        address: addressInfo,
        chooseAddress,
      }).finally(() => {
        payment = false
      })

      let channelCode
      if (os.isWechatWeb) {
        channelCode = sessionStorage.getItem('channelCode')
      } else {
        channelCode = Taro.getStorageSync('channelCode')
      }
      if (channelCode) {
        await api.order.userChannelRecord({
          code: channelCode,
          operation_type: 'buy',
          nft_id: options.id,
        })
      }

      if (!orderId) return
      Taro.navigateTo({url: `/pages/pay/pay?id=${orderId}`})
    }

    return (
      <>
        {/* <Pay payModal={payModal} amount={amount} detailInfo={detailInfo}></Pay> */}
        <View className="container place-order-container">
          <NavigationBar back color="#fff" background="transparent" extClass="place-order-nav" />
          {/* 目前只有下单平台的 NFT 才有实体 NFT 选择 */}
          <Block wx-if={isPlatform && INFCType.collectionEntity === (detailInfo.detail as INFC)?.type}>
            <View className="unselected-address-container" wx-if={!addressInfo} onClick={chooseAddress}>
              <View className="unselected-address-label"> 新增收货地址 </View>
              <View>
                <Image src={rightArrowIcon} mode="aspectFit" className="arrow" />
              </View>
            </View>

            <View className="address-info" wx-if={addressInfo} onClick={chooseAddress}>
              <Image src={addressIcon} mode="aspectFit" className="icon" />
              <View className="receive-address-info">
                <View className="receive-address-info-wang">
                  <View className="receive-address-info-name">{addressInfo?.contact_name}</View>&emsp;
                  <View className="receive-address-info-phone-number">{addressInfo?.mobile}</View>
                </View>
                <View className="receive-address-info-detail">{mergeAddress(addressInfo)}</View>
              </View>
              <Image src={rightArrowIcon} mode="aspectFit" className="arrow" />
            </View>
          </Block>
          <View className="goods-detail-container">
            <View className="goods-detail-body">
              {
                showImageOrVideo({
                  type: detailInfo.skuDetail?.material_type ?? detailInfo.detail?.material_type,
                  url: /3D|music|video/.test(detailInfo.skuDetail?.material_type ?? detailInfo.detail?.material_type)
                  ? detailInfo.skuDetail?.cover_url ?? detailInfo.detail?.cover_url
                  : detailInfo.skuDetail?.images?.[0] ?? detailInfo.detail?.images?.[0],
                  className: 'goods-image'
                })
              }
              <view
                className={
                  /3D/.test(detailInfo.skuDetail?.material_type ?? detailInfo.detail?.material_type)
                    ? 'd3'
                    : /video/.test(detailInfo.skuDetail?.material_type ?? detailInfo.detail?.material_type)
                    ? 'd3 video-icon'
                    : ''
                }
              ></view>
              <View className="goods-info" wx-if={!isUser}>
                <View className="goods-info-header">
                  <Text className="goods-title">
                    {detailInfo.skuDetail
                      ? '【' + detailInfo.detail?.title + '】' + detailInfo.skuDetail?.attribute
                      : detailInfo.detail?.name ?? detailInfo.detail?.blind_name}
                  </Text>
                </View>
                {/* {isBlindBox ? <View className="goods-info-tips">不支持退货</View> : null} */}
                {detailInfo.detail?.is_purchase ? (
                  <View className="goods-info-tips">限购{detailInfo.detail?.limit_number}个</View>
                ) : null}
                <View className="goods-footer">
                  {/* {!isBlindBox ? ( */}
                  <Stepper
                    min={1}
                    max={getMaxAmount({
                      transactionType,
                      detail: detailInfo.detail,
                      skuDetail: detailInfo.skuDetail,
                    })}
                    onChange={(value) => setAmount(String(value))}
                    value={Number(amount)}
                  />
                  {/* ) : (
                    <Stepper
                      min={1}
                      max={detailInfo.detail?.amount - detailInfo.detail?.sale_amount}
                      onChange={(value) => setAmount(String(value))}
                      value={Number(amount)}
                    />
                  )}*/}
                </View>
              </View>
            </View>
          </View>

          <View className="goods-info-card">
            {!isBlindBox ? (
              <View className="goods-info-body">
                <View className="goods-info-item">
                  <Text className="goods-info-label">库存数量</Text>
                  <Text className="goods-info-value">
                    {detailInfo.detail?.available_number - detailInfo.detail?.sale}
                  </Text>
                </View>
                <View className="goods-info-item">
                  <Text className="goods-info-label">藏品系列</Text>
                  <Text className="goods-info-value">{detailInfo.detail?.category_name}</Text>
                </View>
              </View>
            ) : (
              <View className="goods-info-body">
                <View className="goods-info-item">
                  <Text className="goods-info-label">库存数量</Text>
                  <Text className="goods-info-value">
                    {detailInfo.detail?.available_amount - detailInfo.detail?.sale_amount}
                  </Text>
                </View>
                <View className="goods-info-item">
                  <Text className="goods-info-label">发行商</Text>
                  <Text className="goods-info-value">{detailInfo.detail?.issuer_name}</Text>
                </View>
              </View>
            )}
            <View className="goods-info-body pay">
              <View className="goods-info-item">
                <Text className="goods-info-label">商品总额</Text>
                <Text className="goods-info-value"> ¥{priceRemoveFloat(basePrice || '', Number(amount) || 1)} </Text>
              </View>
              <View className="goods-info-item">
                <Text className="goods-info-label">优惠</Text>
                <Text className="goods-info-value">免运费</Text>
              </View>
              <View className="goods-info-item">
                <Text className="goods-info-label">实付款</Text>
                <Text className="goods-info-value pay">¥{priceRemoveFloat(basePrice || '', Number(amount) || 1)} </Text>
              </View>
            </View>
          </View>

          <View className="footer">
            <View className="footer-wrap">
              <View className="footer-price-label">合计&emsp;</View>
              <View className="footer-price-label mob">¥&nbsp;</View>
              <View>
                <Text className="footer-price">{priceRemoveFloat(basePrice || '', Number(amount) || 1)} </Text>
              </View>
              <Button className="footer-btn" onClick={onPay}>
                立即付款
              </Button>
            </View>
            <View className="safe-bottom" />
          </View>
        </View>
      </>
    )
  })
}

export default PlaceOrder
