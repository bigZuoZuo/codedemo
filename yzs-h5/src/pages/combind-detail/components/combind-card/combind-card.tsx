import {View, Image} from '@tarojs/components'
import {FC} from '@tarojs/taro'
import styles from './combind-card.module.scss'
import {showImageOrVideo} from '../../../home/home'

export type CombindCardProps = {
  image: string
  name: string
  material_type: string
  cover_url: string
  level: string
}

const CombindCard: FC<CombindCardProps> = (props) => {
  return (
    <View className={styles.cardBox}>
      <View className={styles.card}>
        {props.level ? <Image mode="aspectFill" src={props.level} className={styles.level} /> : null}
        {
          showImageOrVideo({
            type: props.material_type,
            url: /3D|music|video/.test(props?.material_type) ? props?.cover_url : props?.image,
            className: styles.image
          })
        }
        <View className={styles.mask}></View>
      </View>
      <View className={styles.name}>{props.name}</View>
    </View>
  )
}

export default CombindCard
