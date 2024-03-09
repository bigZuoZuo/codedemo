import {View} from '@tarojs/components'
import {FC} from '@tarojs/taro'
import NavigationBar from '@/components/navigation-bar/navigation-bar'

import styles from './setup.module.scss'
import CardContent from '@/components/card-content'
import {useStore} from '@/store'
import Taro from '@tarojs/taro'
import DebounceNavigator from '@/components/debounce-navigator/debounce-navigator'

const Setting: FC = () => {
  const store = useStore()

  async function logout() {
    await store.logout()
    Taro.reLaunch({
      url: '/pages/personal/personal',
    })
  }

  return (
    <View className={styles.page}>
      <NavigationBar back color="#fff" />
      <CardContent>
        <View className={styles.content}>
          {/* <View className={styles.item}>设置操作密码</View> */}
          <DebounceNavigator url="/pages/delivery-address-list/index">
            <View className={styles.item}>地址管理</View>
          </DebounceNavigator>
          <DebounceNavigator url="/pages/article/article?channel=privacy-agreement">
            <View className={styles.item}>隐私政策</View>
          </DebounceNavigator>
          <DebounceNavigator url="/pages/article/article?channel=owner">
            <View className={styles.item}>关于我们</View>
          </DebounceNavigator>
        </View>
      </CardContent>
      <View className={styles.btn} onClick={logout}>
        退出账号
      </View>
    </View>
  )
}

export default Setting
