import NavigationBar from '@/components/navigation-bar/navigation-bar'
import OrderListComponent from './components/order-list'
import {OrderState} from '@/typings'
import {View} from '@tarojs/components'
import {useRouter} from '@tarojs/taro'
import {useEffect, useState} from 'react'
import {AtTabs, AtTabsPane} from 'taro-ui'

import './order-list.scss'

function OrderList() {
  const [currentStateInfo, setCurrentStateInfo] = useState({
    current: 0,
    currentState: 'all',
  })
  const tabbar = [
    {title: '全部', value: 'all'},
    {title: '待付款', value: OrderState.pendingPayment},
    // {title: '待发货', value: OrderState.pendingShipped},
    // {title: '待收货', value: OrderState.merchantShipped},
    {title: '已完成', value: OrderState.complete},
    {title: '已取消', value: OrderState.canceled},
  ]

  const params = useRouter().params

  function onChangeItem(index: number) {
    setCurrentStateInfo({
      current: index,
      currentState: tabbar[index].value,
    })
  }

  useEffect(() => {
    const current = Number(params?.type) || 0
    onChangeItem(current)
  }, [params?.type])

  return (
    <View className="container order-list-page-container">
      <NavigationBar back color="#fff" background="transparent" />
      <AtTabs current={currentStateInfo.current} tabList={tabbar} onClick={onChangeItem}>
        {tabbar.map((item, index) => (
          <AtTabsPane key={index} current={currentStateInfo.current} index={index}>
            <View
              className="list-container order-list-container"
              style={{display: currentStateInfo.current === index ? 'flex' : 'none'}}
            >
              <OrderListComponent state={item.value} />
            </View>
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  )
}

export default OrderList
