import {INFC, ISku} from '@/typings'
import dayjs from 'dayjs'

export const isAllSkuListSoldOut = function (skuList: ISku[]) {
  for (let index = 0; index < skuList.length; index++) {
    const skuInfo = skuList[index]
    if (skuInfo.amount - skuInfo.sale_total > 0) {
      return false
    }
  }
  return true
}

/**
 * 如果商品已经下架，或者 sku 已经卖完则不能购买了
 * @param goods
 * @param skuList
 * @returns
 */
export const isDisableBuy = function (goods?: INFC, skuList?: ISku[]) {
  if (!goods) {
    return true
  }
  if (goods.state !== 'onsale') {
    return true
  }
  if (goods.is_can_sale === false) {
    return true
  }
  if (skuList?.length) {
    return isAllSkuListSoldOut(skuList)
  }
  return goods.total - goods.sale <= 0
}

export const isDisableBuySku = function (skuInfo: ISku) {
  return skuInfo.amount - skuInfo.sale_total <= 0
}

export const isPresale = (datetime: string, currentTime: string) => dayjs(datetime).isAfter(dayjs(currentTime))
