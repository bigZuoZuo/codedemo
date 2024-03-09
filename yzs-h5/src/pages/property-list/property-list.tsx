import {useEffect} from 'react'
import {IAsset} from '../../typings'
import {useAutoFetchList} from '../../utils/auto-fetch-list'
import {View, Text, ScrollView} from '@tarojs/components'
import {useStore} from '../../store'
import dayjs from 'dayjs'
import {useObserver} from 'mobx-react'
import Taro, {useDidShow, useReachBottom} from '@tarojs/taro'

// import RefreshScrollView from '@/components/scroll-view/scroll-view'
// import Waterfall from '@/components/waterfall/waterfall'
import ListState from '@/components/list-state/list-state'
import {showImageOrVideo} from '../home/home'

import styles from './property.module.css'

interface Props {
  sortBy: 'created_at' | 'name' | 'price'
  sort: 1 | -1
  refresh?: boolean
  onRefresh?: Function
  type?: 'blind_box'
  id?: string
}

function AssetListComponent(props: Props) {
  const store = useStore()

  store.observableListIfNull('miniprogramMeAssetListCreate')

  //@ts-ignore
  const {isInfiniteLoading, paginationInfo, isRefreshLoading, refresh, loadMore, getObservableList} = useAutoFetchList({
    fetchApi: 'miniprogramMeAssetListCreate',
    observable: true,
    extendsBody: () => {
      let params = {
        sourceType: props.type,
        type: props.type ?? ('nft' as const),
        nft_id: props.id,
      }
      if (props.sortBy && props.sort) {
        params = {
          ...params,
          //@ts-ignore
          sortBy: props.sortBy,
          sort: props.sort,
        }
      }
      return params
    },
    specifyStoreKey: props.type,
  })

  useEffect(() => {
    if (props.refresh) {
      props?.onRefresh?.()
      refresh()
    }
  }, [props.refresh])

  useDidShow(() => {
    refresh()
  })

  // useDidHide(() => {
  //   refresh()
  // })

  useReachBottom(() => {
    loadMore()
  })

  function onPressItem(_: IAsset) {
    // store.listSet['miniprogramMeAssetListCreate'].list = []
    Taro.navigateTo({url: `/pages/nft-detail/index?id=${_.nft_id}&assetsId=${_.id}&from=assets&chain_type=${_.chain_type||""}`})
  }

  return useObserver(() => {
    const list = getObservableList()

    return (
      <ScrollView
        scrollY
        scrollAnchoring={true}
        refresherEnabled={true}
        enhanced={true}
        // refresherEnabled
        // refresherThreshold={100}
        // refresherDefaultStyle="black"
        // refreshing={isRefreshLoading}
        // onRefresherRefresh={refresh}
        onScrollToLower={loadMore}
        lowerThreshold={200}
        className={styles['collection-wrap-detail']}
      >
        <View className={styles['collection-body']}>
          {list.map((item: IAsset) => (
            <View onClick={() => onPressItem(item)} className={styles['collection-recommend-box']}>
              {
                showImageOrVideo({
                  type: item?.material_type ?? '',
                  url: /3D|music|video/.test(item?.material_type) ? item?.cover_url : item?.images[0],
                  className: styles['recommend-image']
                })
              }
              <View className={styles['recommend-image-mask']}>
                <view
                  className={
                    /3D/.test(item?.material_type)
                      ? styles['d3']
                      : /video/.test(item?.material_type)
                      ? `${styles['d3']} ${styles['video-icon']}`
                      : ''
                  }
                ></view>
                <view className={dayjs(item?.unlock_time).isAfter(dayjs()) ? styles['locking'] : ''}></view>
              </View>
              <View className={styles['recommend-info']}>
                <Text className={styles['recommend-title']}>{item?.name ?? item?.title ?? ''}</Text>
                <View className={styles['recommend-tab']}>
                  {/* <Text className={styles['tab-one']}>限量</Text> */}
                  {/* <Text className={styles['tab-two']}>{item?.total ?? '-'}份</Text> */}
                  <Text wx-if={item?.category_name} className={styles['tab-three']}>
                    {item?.category_name}
                  </Text>
                </View>
                <View className={styles['recommend-footer']}>
                  <Text className={styles['recommend-price']}>￥ {item.price ?? '-'}</Text>
                  <Text className={styles['recommend-number']}>{item.nfc_number}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <ListState
          isEmpty={!list.length}
          hasNextPage={paginationInfo.hasNextPage}
          infiniteLoading={isInfiniteLoading}
          emptyLabel="还没有此类藏品"
        />
      </ScrollView>
    )
  })
}

export default AssetListComponent
