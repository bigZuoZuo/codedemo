import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View, Text, Image, Button, ScrollView} from '@tarojs/components'

import blindBoxDetailBg from '@/assets/v2/blind-box-bg.png'
import blindBoxBorderBg from '@/assets/v2/blind-box-border-bg.png'
// import blindBoxLineBg from '@/assets/v2/blind-box-line-bg.png'
import blindBoxLogoBg from '@/assets/v2/blind-box-logo-bg.png'
import blindBoxI from '@/assets/v2/blind-box-i.png'
import blindBoxHand from '@/assets/v2/blind-box-hand.png'
import blindBoxShowCollect from '@/assets/v2/blind-box-show-collect.png'
import blindBoxHud from '@/assets/v2/blind-box-hud.png'
import blindHudBg from '@/assets/v2/blind-hud-bg.png'
import blindHudCube from '@/assets/v2/blind-hud-cube.png'
import hudLogo from '@/assets/v2/hud-logo.png'
import hudClose from '@/assets/v2/hud-close.png'

import styles from './blind-box-detail.module.css'
import {useStore} from '@/store'
import {useObserver} from 'mobx-react'
import Taro, {useRouter} from '@tarojs/taro'
import {IBlindBox, IBlindBoxState} from '@/typings'
import {AtFloatLayout, AtTabs, AtTabsPane} from 'taro-ui'
import {api} from '@/api'
import {useEffect, useState} from 'react'

import RenderHtml from '@/components/render-html/render-html'
import {showImageOrVideo} from '../home/home'
// import {onPlaceOrderPayment} from '@/pages/place-order/utils/place-order'
import {os} from '@/utils/util'

// const levelsIconMap = {
//   A: collectionLevelA,
//   B: collectionLevelB,
//   S: collectionLevelS,
//   SS: collectionLevelSS,
//   SSS: collectionLevelSSS,
// }

function BlindBoxDetail() {
  const store = useStore()
  const router = useRouter()

  useEffect(() => {
    // 详情 一定去重新 掉接口。不取列表页缓存的数据（字段 不太一样）
    router.params.id && store.loadByApi({api: api.blindbox.blindboxDetail(router.params.id)})
  }, [router.params.id])

  store.observableDetailIfNull({id: router.params.id!})

  return useObserver(() => {
    const detail = store.detailSet[router.params.id!] as IBlindBox
    /**
     * -1: 关闭弹窗
     * 0: 显示玩法
     * 1: 显示藏品
     */
    const [playAndCollectionList, setPlayAndCollectionList] = useState(-1)

    const isDisableBuyCurrentBlindBox = detail.sale_amount >= detail.amount || detail.state !== IBlindBoxState.onsale

    function onBuyBlindBox() {
      if (isDisableBuyCurrentBlindBox) {
        return
      }
      const navigateUrl = `/pages/place-order/place-order?id=${detail.id}&transactionType=blind_box&amount=1`
      if (!store.state.logined) {
        Taro.navigateTo({url: '/pages/login/login?to=' + encodeURIComponent(navigateUrl)})
        return
      }

      Taro.navigateTo({
        url: navigateUrl,
      })
    }

    return (
      <View className={styles.container} style={{paddingTop: os.isPlainWeb ? '10vh' : '5vh'}}>
        <View className={styles['navigation-bar']}>
          <NavigationBar back />
        </View>
        <Image src={blindBoxDetailBg} mode="aspectFill" className={styles['box-bg']} />
        <View className={styles['content-container']}>
          <Image src={blindBoxBorderBg} mode="aspectFill" className={styles['box-bg-border']} />
          <View className={styles['blind-box-content-container']}>
            <View className={styles['how-play']}>
              <Button className={styles['blind-box-detail-header-play']} onClick={() => setPlayAndCollectionList(0)}>
                玩法
              </Button>
            </View>
            <View className={styles['blind-box-detail-header-title-wrap']}>
              <Text className={styles['blind-box-detail-header-title']}>{detail.blind_name}</Text>
              {/* <Text className={styles['blind-box-detail-header-tips']}>不支持退货</Text> */}
            </View>

            <Image src={blindBoxLogoBg} className={styles['blind-box-detail-logo-bg']} />
            <Image src={blindBoxI} className={styles['blind-box-detail-box']} />
            <Image src={blindBoxHand} className={styles['blind-box-detail-hand']} />
            {/*@ts-ignore */}
            {!detail.is_can_sale ? (
              <Button className={styles['blind-box-detail-footer-bottom']}>盲盒藏品</Button>
            ) : (
              <Button
                className={styles['blind-box-detail-footer-bottom']}
                disabled={isDisableBuyCurrentBlindBox}
                onClick={onBuyBlindBox}
              >
                {isDisableBuyCurrentBlindBox ? '售罄' : `￥${detail.price} 立即购买`}
              </Button>
            )}

            <View className={styles['show-blind-box-collection']}>
              <Image
                src={blindBoxShowCollect}
                className={styles['show-blind-box-collection-icon']}
                onClick={() => setPlayAndCollectionList(1)}
              />
            </View>
          </View>
        </View>

        <AtFloatLayout
          isOpened={playAndCollectionList >= 0}
          className={styles['show-blind-box-how-to-play-dialog']}
          onClose={() => setPlayAndCollectionList(-1)}
        >
          <Image src={blindHudBg} className={styles['blind-box-hud-bg']} />
          <Image src={blindBoxHud} className={styles['blind-box-hud']} />
          <View className={styles['show-blind-box-how-to-play-container']}>
            <View className={styles['show-blind-box-how-to-play-header']}>
              <Image src={hudLogo} className={styles['show-blind-box-how-to-play-logo']} />
              <Image
                src={hudClose}
                className={styles['show-blind-box-how-to-play-close-icon']}
                onClick={() => setPlayAndCollectionList(-1)}
              />
            </View>

            <View className={styles['show-blind-box-how-to-play-tabbar']}>
              <AtTabs
                current={playAndCollectionList}
                tabList={[{title: '玩法介绍'}, {title: '藏品详情'}]}
                onClick={(index) => setPlayAndCollectionList(index)}
              >
                <AtTabsPane index={0} current={playAndCollectionList}>
                  <View className={styles['blind-box-how-to-play-panel']}>
                    <ScrollView scrollY={true} className={styles['blind-box-how-to-play-panel-content-container']}>
                      <View className={styles['blind-box-how-to-play-panel-content']}>
                        <RenderHtml>{detail.play_instruction}</RenderHtml>
                      </View>
                    </ScrollView>
                  </View>
                </AtTabsPane>
                <AtTabsPane index={1} current={playAndCollectionList}>
                  <ScrollView scrollY className={styles['blind-box-how-to-play-panel-content-container']}>
                    <Text className={styles['blind-box-collection-panel-title']}>{detail.title}</Text>
                    <Text className={styles['blind-box-collection-panel-slogan']}>全款图鉴</Text>

                    <View className={styles['blind-box-collection-list']}>
                      {detail.collections?.map((item) => (
                        <View
                          className={styles['blind-box-collection-item']}
                          key={item.id}
                          onClick={() => {
                            Taro.navigateTo({
                              url: `/pages/nft-detail/index?id=${item.nft_id}&from=blind_box`,
                            })
                          }}
                        >
                          <View className={styles['blind-box-collection-item-image-wrap']}>
                            <Image
                              src={blindHudCube}
                              className={styles['blind-box-collection-item-image-bg']}
                              mode="aspectFit"
                            />
                            {
                              showImageOrVideo({
                                type: item?.material_type,
                                url: /3D|music|video/.test(item?.material_type) ? item?.cover_url : item?.images[0],
                                className: styles['blind-box-collection-item-image']
                              })
                            }
                            <View className={styles['blind-box-collection-image-mask']}></View>
                          </View>
                          <Text className={styles['blind-box-collection-item-title']}>{item.name}</Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </AtTabsPane>
              </AtTabs>
            </View>
          </View>
        </AtFloatLayout>
      </View>
    )
  })
}

export default BlindBoxDetail
