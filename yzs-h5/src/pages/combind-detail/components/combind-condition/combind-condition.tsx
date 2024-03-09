// @ts-nocheck
import Taro, {FC} from '@tarojs/taro'
import {View} from '@tarojs/components'
import styles from './combind-condition.module.scss'
import style from './combind-condition-item.module.scss'
import CombindConditionItem from './combind-condition-item'
import {showImageOrVideo} from '../../../home/home'

export type CombindCondition = {
  baseNft: any
  fadeInUpBig: any
  rules: Array<{
    images: string[]
    name: string
    owned: number
    amount: number
    nft_id: string
  }>
}

const CombindCondition: FC<CombindCondition> = ({rules, baseNft, fadeInUpBig}) => {
  console.log(/3D|music|video/.test(baseNft?.material_type), 'baseNft')
  const baseNumber = 1
  return (
    <View className={styles.condition}>
      {baseNft.id ? (
        <View
          className={`${style.item} ${style.item2}`}
          onClick={() => {
            Taro.navigateTo({url: '/pages/official-goods-detail/official-goods-detail?id=' + baseNft.id})
          }}
        >
          {showImageOrVideo({
             type: baseNft?.material_type,
            url: /3D|music|video/.test(baseNft?.material_type) ? baseNft?.cover_url : baseNft.images[0],
            className: `${style.image}`}
          )}
          {baseNft.owned < baseNumber ? <View className={style.mask}></View> : null}
          <View className={`${style.name} ${baseNft.owned >= baseNumber ? style.all : ''}`}>{baseNft.name}</View>
          <View className={`${style.status} ${baseNft.owned >= baseNumber ? style.all : ''}`}>
            {baseNft.owned}&nbsp;/ {baseNumber}
          </View>
        </View>
      ) : null}
      {rules?.map((i, index) => (
        <CombindConditionItem
          name={i.name}
          index={baseNft.id ? index + 1 : index}
          owned={i.owned}
          badge={i.amount}
          id={i.nft_id}
          image={i?.images?.[0]}
          fadeInUpBig={fadeInUpBig}
          material_type={i?.material_type}
          cover_url={i?.cover_url}
        />
      ))}
    </View>
  )
}

export default CombindCondition
