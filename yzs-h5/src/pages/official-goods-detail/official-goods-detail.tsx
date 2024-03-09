import NavigationBar from '@/components/navigation-bar/navigation-bar'
import { useStore } from '@/store'
import { INFC, ISku } from '@/typings'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro'
import { useObserver } from 'mobx-react'
import { useEffect, useState } from 'react'

import { isDisableBuy, isPresale } from '@/utils/is-disable-buy'
import qs from 'qs'
import { api } from '@/api'

import cylinderImage from '@/assets/v2/cylinder.png'
import styles from './official-goods-detail.module.css'
import { showImageOrVideo } from '../home/home'
import RenderHtml from '@/components/render-html/render-html'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { maskAddress, copy } from '@/utils/util'
import copyIcon from '@/assets/icons/copy.png'
import ProductTab from '@/components/productTab'

function OfficialGoodsDetail() {
  const store = useStore()
  const goodsId = useRouter().params?.id

  const [pre, setPre] = useState<any>({})
  const [skuInfo, setSkuInfo] = useState({
    skuList: [] as ISku[],
    skuImages: [] as string[],
  })

  const [currentTime, setCurrentTime] = useState<any>(Date.now())

  useEffect(() => {
    async function fetchData() {
      const result: any = await api.synthesis.syncTime()
      setCurrentTime(dayjs(result?.data?.data))
    }
    fetchData()
  }, [])

  if (!store.detailSet[goodsId!]) {
    store.observableDetail({ id: goodsId! })
  }

  useEffect(() => {
    store.load('miniprogramNfcDetail', { id: goodsId! })
    store.load('getNfc', goodsId!).then((skuResponse) => {
      if (skuResponse && skuResponse.list) {
        const skuList = skuResponse.list as ISku[]

        setSkuInfo({
          skuList,
          //@ts-ignore
          skuImages: skuList.flatMap((item: ISku) => item.images),
        })
      }
    })
  }, [])

  useShareAppMessage(() => {
    return {
      title: '',
      imageUrl: '',
      path: '',
    }
  })

  useEffect(() => {
    if (!goodsId || !store.state.logined) {
      return
    }
    async function fetchData() {
      const result: any = await api.order.prePurchase(goodsId)
      setPre(result.data)
    }
    fetchData()
  }, [goodsId, store.state.logined])

  return useObserver(() => {
    const detail = store.detailSet[goodsId!] as INFC
    const isDisableBuyCurrentGoods = isDisableBuy(detail, skuInfo.skuList) || isPresale(detail.start_time, currentTime)

    function onConfirmSpecBuy() {
      if (isPresale(detail.start_time, currentTime) && !(!pre?.openSale && pre?.pre)) {
        Taro.showToast({ title: '暂未开售', icon: 'none' })
        return
      }
      const options = qs.stringify({
        amount: 1,
        id: goodsId,
        transactionType: 'platform',
        preSale: !pre?.openSale && pre?.pre ? 'preSale' : 'normal', // 优先购
      })

      const navigateUrl = `/pages/place-order/place-order?${options}`
      // if (!store.state.logined) {
      //   Taro.navigateTo({ url: '/pages/login/login?to=' + encodeURIComponent(navigateUrl) })
      //   return
      // }

      Taro.navigateTo({
        url: navigateUrl,
      })
    }

    function onShowSkuSelector() {
      Taro.showToast({ title: '目前不支持该商品购买', icon: 'none' })
      return
    }

    // function isWeixinBrowser() {
    //   var ua = navigator.userAgent.toLowerCase()
    //   return /micromessenger/.test(ua) ? true : false
    // }

    const login = () => {
      const options = qs.stringify({
        amount: 1,
        id: goodsId,
        transactionType: 'platform',
        preSale: !pre?.openSale && pre?.pre ? 'preSale' : 'normal', // 优先购
      })
      const navigateUrl = `/pages/place-order/place-order?${options}`
      Taro.navigateTo({ url: '/pages/login/login?to=' + encodeURIComponent(navigateUrl) })
    }
    const handleBtn = () => {
      if (!store.state.logined) {
        login()
        return
      }
      if (detail?.chain_type === "国版链" && !store.state.zswAccount) {
        Taro.navigateTo({ url: "pages/third-auth/index" })
      } else {
        skuInfo.skuList.length ? onShowSkuSelector() : onConfirmSpecBuy()
      }
    }

    return (
      <View className={styles.container}>
        <NavigationBar back />
        {/* <Image src={bgImage} className="bg" /> */}

        <ScrollView scrollY className={classNames('pr z2', styles['scroll-view'])}>
          <View className={`${styles.poster}`}>
            {
              showImageOrVideo({
                type: detail?.material_type,
                url: /3D|music|video/.test(detail?.material_type) ? detail?.cover_url : detail?.images?.[0],
                className: styles['poster-image'],
                canClick: true,
                oUrl: detail?.images?.[0],
                extra: /video/.test(detail?.material_type) ? 'official-goods-detail video-icon' : 'official-goods-detail',
                dataTab: detail?.chain_type,
                dataTabStyle: styles['cover-img-box'],

              })
            }
            {!pre?.openSale && pre?.pre ? (
              <Image
                className={styles['pre-sale']}
                mode="aspectFill"
                src={require('../../assets/icons/pre-sale.png')}
              />
            ) : null}
            {!pre?.openSale && pre?.pre ? <Text className={styles['pre-sale-text']}>预售</Text> : null}
          </View>

          <Image src={cylinderImage} className={styles.cylinder} />
          <View className={styles.title}>
            <Text>{detail?.name}</Text>
          </View>
          <ProductTab detail={detail} />
          {/*  */}
          <View className={styles.box}>
            <View className={styles['box-title-wrap']}>
              <View className={styles['box-title-icon']}></View>
              <Text className={styles['box-title']}>藏品信息</Text>
            </View>

            <View className={styles['bod-body']}>
              <View className={styles['list-item']}>
                <Text className={styles.label}>发行方</Text>
                <Text className={styles.value}>{detail?.issuer_name}</Text>
              </View>
              <View className={styles['list-item']} wx-if={detail.chain_type !== "国版链"} >
                <Text className={styles.label}>哈希</Text>
                <Text className={styles.value}>
                  {maskAddress(detail?.transaction_hash)}
                  <Image
                    src={copyIcon}
                    className={styles.icon}
                    mode="aspectFit"
                    onClick={() => {
                      copy(detail?.transaction_hash)
                    }}
                  />
                </Text>
              </View>
              {/* <View className={styles['list-item']}>
                <Text className={styles.label}>Token ID</Text>
                <Text className={styles.value}>{detail?.token_id}</Text>
              </View> */}
            </View>
          </View>

          <View className={styles.box}>
            <View className={styles['box-title-wrap']}>
              <View className={styles['box-title-icon']}></View>
              <Text className={styles['box-title']}>作品简介</Text>
            </View>

            <View className={styles['bod-body']}>
              <RenderHtml>{detail?.desc}</RenderHtml>
            </View>
          </View>

          <View className={styles['footer-place']} />
        </ScrollView>

        {/* <View className={`${styles.footer} ${!pre?.openSale && pre?.pre && styles.footer2}`}> */}
        {/* 可售不可售（活动藏品） */}
        {!detail.is_can_sale ? (
          <View className="fixed-footer flex-between-center">
            <View className="fixed-footer-btn disabled">
              {detail?.nft_type === 'blindbox' ? '盲盒藏品' : '活动藏品'}
            </View>
          </View>
        ) : (
          <View className={`${styles.footer}`}>
            <View className={styles['footer-wrap']}>
              <View className={styles['footer-price-label']}>
                {Number(detail.price_attribute) === 10 ? '公益价' : ''}&emsp;
              </View>
              <View>
                <Text className={styles['footer-price']}>￥{detail.price}</Text>
              </View>
              {detail.state === 'soldout' ? (
                <Button className={styles['footer-btn']} disabled>
                  售罄
                </Button>
              ) : (
                <Button
                  className={styles['footer-btn']}
                  disabled={isDisableBuyCurrentGoods}
                  onClick={handleBtn}
                >
                  {/* ? `${dayjs(detail.start_time).format('MM.DD HH:mm')} 开售` */}
                  {
                    detail?.chain_type === "国版链" && !store.state.zswAccount ? "点击授权" :
                      !pre?.openSale && pre?.pre
                        ? '立即购买'
                        : isPresale(detail.start_time, currentTime)
                          ? `${dayjs(detail.start_time).format('MM月DD日 HH:mm')} 开售`
                          : '立即购买'
                  }
                </Button>
              )}
            </View>
            {/* {!pre?.openSale && pre?.pre ? (
            <View className={`${styles['footer-wrap']} ${styles['footer-wrap2']}`}>
              <View className={styles['footer-price-label']}>
                {Number(detail.price_attribute) === 10 ? '公益价' : ''}&emsp;
              </View>
              <View>
                <Text className={styles['footer-price']}>￥{detail.price}</Text>
              </View> */}
            {/* @ts-ignore  */}
            {/* {detail.state === 'soldout' ? (
                <Button className={styles['footer-btn']} disabled>
                  售罄
                </Button>
              ) : (
                <Button
                  className={styles['footer-btn']}
                  disabled={isDisableBuyCurrentGoods}
                  onClick={skuInfo.skuList.length ? onShowSkuSelector : onConfirmSpecBuy}
                >
                  抢先购买
                </Button>
              )}
            </View>
          ) : null} */}
            <View className="safe-bottom" />
          </View>
        )}
      </View>
    )
  })
}

export default OfficialGoodsDetail
