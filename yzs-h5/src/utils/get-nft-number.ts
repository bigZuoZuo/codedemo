import {IAsset, IAudit, IOrder} from '@/typings'

/**
 * @deprecated 获取 nfc number 已经不需要解包 skuInfo， 可以直接 xxx.nft_number 这样获取
 */
export const getNfcNumber = function(detail: IOrder | IAudit | IAsset) {
  if (!detail) {
    return ''
  }

  if ((detail as IAudit).nft_number) {
    return (detail as IAudit).nft_number
  }

  if ((detail as IAsset).nfc_number) {
    return (detail as IAsset).nfc_number
  }

  return (detail as IOrder).items?.[0].sn_list.join('、')
}
