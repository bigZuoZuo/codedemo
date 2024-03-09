import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View} from '@tarojs/components'
import {useState} from 'react'
import {useRouter} from '@tarojs/taro'
import {useObserver} from 'mobx-react'

import AssetListComponent from './property-list'
import styles from './property.module.css'

function AssetsList() {
  const [refresh, setRefresh] = useState(false)
  const router = useRouter()
  // const store = useStore()

  return useObserver(() => {
    return (
      <View className={styles.container}>
        <NavigationBar back color="#fff" title="藏品" background="#1C1134" />
        <AssetListComponent
          key="nft"
          id={router.params.id}
          refresh={refresh}
          sort={-1}
          sortBy={'created_at'}
          onRefresh={() => setRefresh(false)}
        />
      </View>
    )
  })
}

export default AssetsList
