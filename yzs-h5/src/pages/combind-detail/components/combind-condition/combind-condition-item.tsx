import {View} from '@tarojs/components'
import Taro, {FC} from '@tarojs/taro'
import styles from './combind-condition-item.module.scss'
import {showImageOrVideo} from '../../../home/home'

type CombindConditionItemProps = {
  badge: number
  index: number
  name: string
  owned: number
  image: string
  material_type: string
  cover_url: string
  id: string
  fadeInUpBig: any
}

const CombindConditionItem: FC<CombindConditionItemProps> = (props) => {
  return (
    <View
      className={styles.item}
      onClick={() => {
        Taro.navigateTo({url: '/pages/official-goods-detail/official-goods-detail?id=' + props.id})
      }}
    >
      {
        showImageOrVideo({
          type: props.material_type,
          url: /3D|music|video/.test(props?.material_type) ? props?.cover_url : props?.image,
          className: `${styles.image} ${styles['fade_' + (props.index % 3)]} ${props.fadeInUpBig && styles.fade}`
        })
      }
      <View className={styles.mask1}></View>
      {props.owned < props.badge ? <View className={styles.mask}></View> : null}
      <View className={`${styles.name} ${props.owned >= props.badge ? styles.all : ''}`}>{props.name}</View>
      <View className={`${styles.status} ${props.owned >= props.badge ? styles.all : ''}`}>
        {props.owned}&nbsp;/ {props.badge}
      </View>
    </View>
  )
}

export default CombindConditionItem
