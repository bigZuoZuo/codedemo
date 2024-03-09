// @ts-nocheck
import {View, Text, Block} from '@tarojs/components'
import Taro from '@tarojs/taro'

import {showImageOrVideo} from '../../home/home'
import {getNfcNumber} from '@/utils/get-nft-number'
import {statusToLabel} from '../../order-list/components/status-to-label'
// import {useStore} from '../../../store'
import {OrderType} from '../../../typings'
import './order-detail-goods-card.scss'

interface Props {
  orderId: string
  detail: object
}

function OrderDetailGoodsCard(props: Props) {
  // const store = useStore()

  const detail = props.detail
  const {statusString} = statusToLabel(detail.state)

  function onClickCard() {
    let url = ''
    switch (detail.type) {
      case OrderType.platform:
        console.log("detail",detail)
        url = '/pages/official-goods-detail/official-goods-detail?id=' + detail.items?.[0].item_id
        break
      case OrderType.user:
        url = '/pages/user-goods-detail/user-goods-detail?id=' + detail.items?.[0].item_id
        break
      case OrderType.blind_box:
        url = '/pages/blind-box-detail/blind-box-detail?id=' + detail.items?.[0].item_id
        break

      default:
        break
    }

    Taro.navigateTo({url})
  }

  return (
    <View className="order-detail-goods-page-container">
      <View className="order-detail-header" onClick={onClickCard}>
        <Block>
          <Text className="order-detail-no">编号:{getNfcNumber(detail)}</Text>
          <Text className="order-detail-status">{statusString}</Text>
        </Block>
      </View>
      <View className="order-detail-body" onClick={onClickCard}>
        {
          showImageOrVideo({
            type:  detail.items?.[0].material_type,
            url: /3D|music|video/.test(detail.items?.[0].material_type)
            ? detail.items?.[0].cover_url
            : detail.items?.[0].images?.[0],
            className: 'goods-poster'
          })
        }
        <View className="goods-info">
          <View className="goods-info-header">
            <Text className="goods-title">{detail.items?.[0]?.title}</Text>
            <Text className="goods-number">商品数量 x{detail.amount}</Text>
          </View>
          <View className="goods-footer">
            <Text className="goods-amount">¥ {detail.price}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default OrderDetailGoodsCard
