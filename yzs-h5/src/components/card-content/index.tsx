import {View} from '@tarojs/components'
import {FC} from '@tarojs/taro'
import styles from './index.module.scss'

const CardContent: FC = (props) => {
  return <View className={styles.card}>{props.children}</View>
}

export default CardContent
