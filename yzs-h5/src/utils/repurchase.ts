import {store} from '../store'
import {IAsset, IBlindBox, IBlindBoxState, INFC, IOrder, NFCState, OrderType} from '../typings'
import Taro from '@tarojs/taro'
import {hideLoading, showLoading} from './show-loading'
import {api} from '@/api'

/**
 * TODO: 三种情况：盲盒、用户、官方
 */
export const repurchase = async (order: IOrder) => {
  showLoading()
  const itemId = order.items?.[0].item_id
  if (!itemId) {
    return
  }
  if (order.type === OrderType.platform) {
    const nfcDetail = (await store.loadApiOrSelectDetail(api.user.miniprogramNfcDetail, {id:itemId})) as INFC

    if (nfcDetail.state !== NFCState.onsale) {
      hideLoading()
      Taro.showModal({title: '提示', content: '该系列已不再销售'})
      return
    }

    const remainNfc = nfcDetail.total - nfcDetail.sale
    if (remainNfc <= 0) {
      hideLoading()
      Taro.showModal({title: '提示', content: '该系列已销售完毕'})
      return
    }
    Taro.navigateTo({url: `/pages/official-goods-detail/official-goods-detail?id=${nfcDetail.id}`})
  }

  if (order.type === OrderType.user) {
    const auditDetail = (await store.loadApiOrSelectDetail(api.user.miniprogramMeNftPublishDetail, itemId)) as IAsset

    if (!auditDetail.is_can_sale) {
      hideLoading()
      Taro.showModal({title: '提示', content: '该藏品已不再销售'})
      return
    }
    Taro.navigateTo({url: `/pages/user-goods-detail/user-goods-detail?id=${auditDetail.id}`})
  }

  if (order.type === OrderType.blind_box) {
    const blindBoxDetail = (await store.loadApiOrSelectDetail(api.blindbox.blindboxDetail, itemId)) as IBlindBox

    const remainNfc = blindBoxDetail.amount - blindBoxDetail.sale_amount
    if (remainNfc <= 0) {
      hideLoading()
      Taro.showModal({title: '提示', content: '该盲盒已销售完毕'})
      return
    }

    if (blindBoxDetail.state !== IBlindBoxState.onsale) {
      hideLoading()
      Taro.showModal({title: '提示', content: '该盲盒已不再销售'})
      return
    }
    Taro.navigateTo({url: `/pages/blind-box-detail/blind-box-detail?id=${blindBoxDetail.id}`})
  }

  hideLoading()
}
