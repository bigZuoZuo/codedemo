import {useStore} from '../../../store'
import {useAutoFetchList} from '../../../utils/auto-fetch-list'
import {View, ScrollView} from '@tarojs/components'
import {useObserver} from 'mobx-react'
import ListState from '@/components/list-state/list-state'
// import ScrollView from '@/components/scroll-view/scroll-view'
import OrderListItem from './order-list-item'

import './order-list.scss'
import {OrderState} from '@/typings'

interface Props {
  state: string
}

function OrderListComponent(props: Props) {
  const store = useStore()
  //@ts-ignore
  const {paginationInfo, isInfiniteLoading, isRefreshLoading, loadMore, refresh} = useAutoFetchList({
    fetchApi: 'miniprogramMeOrderCreate',
    //@ts-ignore
    extendsBody: () => ({state: props.state !== 'all' ? (props.state as OrderState) : undefined}),
    observable: true,
    specifyStoreKey: props.state,
    disableAutoLoadMore: true,
    disableAutoRefresh: true,
  })

  const namespace = `miniprogramMeOrderCreate_${props.state}` as any
  store.observableListIfNull(namespace)

  return useObserver(() => {
    const list = store.listSet[namespace]?.list ?? []
    // 渲染比较卡，可能需要自己写一个虚拟滚动列表
    // https://www.infoq.cn/article/lbrhswgbb5jbccfd2zzw
    return (
      <ScrollView
        scrollY
        style={{width: '100%', height: '85vh', overflowAnchor: 'auto', paddingBottom: '1vh'}}
        scrollAnchoring={true}
        refresherEnabled={true}
        enhanced={true}
        // refresherEnabled
        // refresherThreshold={100}
        // refresherDefaultStyle="black"
        // refreshing={isRefreshLoading}
        // onRefresherRefresh={refresh}
        onScrollToLower={loadMore}
        lowerThreshold={100}
      >
        <View className="order-page-container">
          {list.map((item) => (
            <View className="order-item" key={item.id}>
              <OrderListItem
                orderId={item.id}
                footer={item?.state === OrderState.orderPaid || item?.state === OrderState.pendingShipped}
              />
            </View>
          ))}
          <ListState
            isOrder
            isEmpty={!list.length}
            hasNextPage={paginationInfo.hasNextPage}
            infiniteLoading={isInfiniteLoading}
            label="订单"
          />
        </View>
      </ScrollView>
    )
  })
}

export default OrderListComponent
