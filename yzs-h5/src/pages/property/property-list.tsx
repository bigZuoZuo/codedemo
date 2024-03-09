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
  onBlindBoxId: Function
  type?: 'blind_box' | 'nft' | 'chain'
}

function AssetListComponent(props: Props) {
  const store = useStore()

  store.observableListIfNull('miniprogramMeAssetCreate')

  //@ts-ignore
  const {isInfiniteLoading, paginationInfo, isRefreshLoading, refresh, loadMore, getObservableList} = useAutoFetchList({
    fetchApi: 'miniprogramMeAssetCreate',
    observable: true,
    extendsBody: () => {
      let params = {
        sourceType: props.type,
        type: props.type ?? ('nft' as const),
      }
      // @ts-ignore
      if (props.sortBy && props.sort && props.type === 'nft') {
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
    // TODO: 调整指定页面
    // Taro.showToast({title: '暂未开发'})
    // nft-detail?id=0181b9cd-8d3b-4a41-84ad-c78dfc3a8199&assetsId=0181eb08-8f38-4eeb-acb9-ba4d715c199d&from=assets
    if (props.type === 'blind_box') {
      props.onBlindBoxId(_.id)
      return
    }

    if (props.type === 'chain') {
      Taro.navigateTo({url: `/pages/nft-detail/index?id=${_.id}&from=assets&chain_type=${_.chain_type}`})
      return
    }
    Taro.navigateTo({url: `/pages/property-list/property?id=${_.nft_id}`})
    return
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
        className={styles['collection-wrap']}
      >
        <View className={styles['collection-body']}>
          {list.map((item: IAsset) => (
            <View onClick={() => onPressItem(item)} className={styles['collection-recommend-box']}>
              {
                showImageOrVideo({
                  type: item?.material_type ?? '',
                  url:/3D|music|video/.test(item?.material_type)
                  ? item?.cover_url
                  : typeof item?.images !== 'string'
                  ? item?.images[0]
                  : item?.images,
                  className:styles['recommend-image']
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
                {props.type !== 'nft' ? null : <view className={styles['amount']}>X{item.amount}</view>}
              </View>
              <View className={styles['recommend-info']}>
                {/**@ts-ignore */}
                <Text className={styles['recommend-title']}>{item?.name ??  item?.blind_name ?? item?.title ?? item?.nft_name ?? ''}</Text>
                <View className={styles['recommend-tab']}>
                  {/* <Text className={styles['tab-one']}>限量</Text> */}
                  {/* <Text className={styles['tab-two']}>{item?.total ?? '-'}份</Text> */}
                  <Text wx-if={item?.category_name} className={styles['tab-three']}>
                    {item?.category_name}
                  </Text>
                </View>
                <View className={styles['recommend-footer']}>
                  <Text className={styles['recommend-price']}>￥ {item.price ?? '-'}</Text>
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
