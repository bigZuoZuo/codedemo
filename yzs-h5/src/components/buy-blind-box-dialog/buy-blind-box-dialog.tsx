import {AtCurtain} from 'taro-ui'
import {View, Image, Button, Text, Block} from '@tarojs/components'
// import {useStore} from '@/store'
import {useObserver} from 'mobx-react'
// import {IBlindBoxAsset, IOrder} from '@/typings'
import {useEffect, useState} from 'react'

import blindBoxV from '@/assets/v2/blind-box-v.png'
import blindBoxHand from '@/assets/v2/blind-box-hand2.png'
import blindBoxBg from '@/assets/v2/blind-box-bg.png'
import blindBoxBorderBg from '@/assets/v2/blind-box-border-bg2.png'
import blindBoxOpenBox from '@/assets/v2/open-box.png'
// import Taro from '@tarojs/taro'

import './buy-blind-box-dialog.scss'
// import {api} from '@/api'
// import qs from 'qs'

interface Props {
  isShow?: boolean
  blindBoxAni?: boolean
  onClose?: () => void
  blindAni?: () => void
  orderId?: string
  onOpen: Function
}

function BuyBlindBoxDialog(props: Props) {
  const [zoomIn, setZoomIn] = useState(false)
  // const store = useStore()
  // if (!props.orderId) {
  //   return null
  // }

  useEffect(() => {
    if (zoomIn) {
      setTimeout(() => {
        setTimeout(() => {
          setZoomIn(false)
        }, 10)
        props?.onOpen?.()
      }, 2300)
    }
  }, [zoomIn])

  useEffect(() => {
    if (props.blindBoxAni) {
      setTimeout(() => {
        props?.blindAni?.()
      }, 2300)
    }
  }, [props.blindBoxAni])

  // store.observableDetailIfNull({id: props.orderId})
  return useObserver(() => {
    // const detail = store.detailSet[props.orderId] as IOrder

    return (
      <AtCurtain
        isOpened={props.isShow}
        onClose={() => props.onClose?.()}
        className={`buy-blind-box-dialog-container ${(zoomIn || props.blindBoxAni) && 'open-box'}`}
      >
        <Block wx-if={!zoomIn && !props.blindBoxAni}>
          <Image src={blindBoxBg} className="blind-box-bg" />
          <Image src={blindBoxBorderBg} className="blind-box-order-bg" />
          <View className="blind-box-order-dialog">
            <Text className="blind-box-order-success-label">恭喜您，购买成功！</Text>
            <Image src={blindBoxV} className="blind-box-detail-box" mode="aspectFill" />
            <Image src={blindBoxHand} className="blind-box-detail-hand" mode="aspectFill" />
            <Button
              className="blind-box-order-btn"
              onClick={() => setZoomIn(true)}
              // 通过订单 ID 获取盲盒数据
              //   Taro.showLoading({title: '请等待'})
              //   try {
              //     const response = await Promise.all(
              //       detail.items?.[0].sn_list.map((blindboxNumber) => {
              //         return api.user.miniprogramMeBlindboxGetCreate({
              //           blindboxId: detail.items?.[0]?.item_id ?? '',
              //           blindboxNumber: blindboxNumber,
              //         })
              //       }) ?? []
              //     )

              //     const assets = response.map((item) => item.data.data) as IBlindBoxAsset[]
              //     const query = qs.stringify(
              //       {
              //         ids: assets.map((v) => v.id).join(),
              //         blindBoxIds: assets.map((v) => v.blind_box_id).join(),
              //         autoOpen: true,
              //       },
              //       {encode: false}
              //     )
              //     console.log('🚀 ~ file: buy-blind-box-dialog.tsx ~ line 57 ~ onClick={ ~ query', query)
              //     Taro.navigateTo({
              //       url: `/pages/blind-box-launch/blind-box-launch?${query}`,
              //     })
              //   } catch (error) {
              //     Taro.showToast({title: '打开异常', icon: 'none'})
              //   }
              //   props.onClose?.()
              //   Taro.hideLoading()
              // }}
            >
              立即开盒
            </Button>
            <Text
              className="blind-box-order-wait-label"
              onClick={() => {
                props.onClose?.()
                // Taro.navigateBack()
              }}
            >
              先等等，稍后开盒
            </Text>
          </View>
        </Block>
        <Block wx-if={zoomIn || props.blindBoxAni}>
          <View className="blind-box-open">
            <Image src={blindBoxOpenBox} className="blind-box-image" />
          </View>
        </Block>
      </AtCurtain>
    )
  })
}

export default BuyBlindBoxDialog
