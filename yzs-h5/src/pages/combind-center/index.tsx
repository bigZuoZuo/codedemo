import {View} from '@tarojs/components'
import {FC, useReachBottom} from '@tarojs/taro'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'

import {useAutoFetchList} from '@/utils/auto-fetch-list'
import EmptyFigure from '@/components/empty-figure/empty-figure'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {api} from '@/api'

import styles from './index.module.scss'
import CombindItem, {Combind} from './components/combind-item/combind-item'

const CombindCenter: FC = () => {
  const {data, loadMore, loading} = useAutoFetchList({
    fetch: api.synthesis.listCreate,
  })

  const [currentTime, setCurrentTime] = useState<any>(Date.now())

  useEffect(() => {
    async function fetchData() {
      const result: any = await api.synthesis.syncTime()
      setCurrentTime(dayjs(result?.data?.data))
    }
    fetchData()
  }, [])

  useReachBottom(() => {
    loadMore()
  })

  return (
    <View className={`${styles.page}`}>
      <NavigationBar color="#fff" back background="transparent" />

      <View className={styles.container}>
        {data.map((i) => (
          <CombindItem currentTime={currentTime - 0} item={i as unknown as Combind} key={i.id} />
        ))}
        {data.length === 0 && !loading && (
          <View className={styles.empty}>
            <EmptyFigure label="暂无可合成的藏品" />
          </View>
        )}
      </View>
    </View>
  )
}

export default CombindCenter
