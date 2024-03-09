import NavigationBar from '@/components/navigation-bar/navigation-bar'
import { View } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { AtTabs, AtTabsPane } from 'taro-ui'
import Taro, { useRouter } from '@tarojs/taro'
import { useObserver } from 'mobx-react'

import { OrderType } from '@/typings'
// import {useStore} from '@/store'
import { api } from '@/api'
import AssetListComponent from './property-list'
import SuccessModalComponent from './success-modal'
import BuyBlindBoxDialog from '@/components/buy-blind-box-dialog/buy-blind-box-dialog'
import styles from './property.module.css'
import './filter.scss'

enum AssetType {
  collection = 'collection',
  blindBox = 'blind-box',
  chainItem = 'chain-item'
}

const tabbar = [
  { title: '藏品', value: AssetType.collection },
  { title: '国版链', value: AssetType.chainItem },
  { title: '盲盒', value: AssetType.blindBox },
]

const sortByBeau = {
  created_at: '时间',
  name: '名称',
  price: '价格',
}

function AssetsList() {
  const router = useRouter()
  const [currentStateInfo, setCurrentStateInfo] = useState({
    current: router.params?.chain_type==='国版链'?1:0,
    currentState: router.params?.chain_type==='国版链'?AssetType.chainItem:AssetType.collection,
  })
  const [blindBoxId, setBlindBoxId] = useState('')
  const [yzsList] = useState(JSON.parse(Taro.getStorageSync('__YZS_TEMP_LIST__') || '[]'))
  const [amount, setAmount] = useState(0)
  const [openBox, setOpenBox] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [filter, setFilter] = useState<any>(false)
  const [sortBy, setSortBy] = useState<any>('')
  const [sort, setSort] = useState<any>('')
  const [detailBeau, setDetailBeau] = useState({})
  const [orderBlindList, setOrderBlindList] = useState<any>([])

  
  // const store = useStore()

  useEffect(() => {
    if (router.params.type === OrderType.blind_box) {
      if (router.params.id) {
        getOrderBlind()
      }
    }
  }, [router.params.id])

  useEffect(() => {
    if (yzsList.length) {
      setOrderBlindList(yzsList)
      setBlindBoxId(yzsList[0]?.id)
      setAmount(Number(yzsList.length))
      setCurrentStateInfo({
        current: 2,
        currentState: tabbar[2].value,
      })
      Taro.removeStorageSync('__YZS_TEMP_LIST__')
    }
  }, [yzsList])

  // 通过订单 ID 获取盲盒数据
  async function getOrderBlind() {
    Taro.showLoading({ title: '请等待' })
    try {
      const { data: detail } = await api.order.orderDetail(router.params.id ?? '')
      const response = await Promise.all(
        detail.items?.[0].sn_list.map((blindboxNumber) => {
          return api.user.miniprogramMeBlindboxGetCreate({
            blindboxId: detail.items?.[0]?.item_id ?? '',
            blindboxNumber: blindboxNumber,
          })
        }) ?? []
      )
      const assets: any = response.map((item) => item.data.data) as []
      Taro.setStorageSync('__YZS_TEMP_LIST__', JSON.stringify(assets))
      window.location.replace('/property')
      // Taro.redirectTo({
      //   url: '/pages/property/property',
      // })
    } catch (error) {
      Taro.showToast({ title: '打开异常', icon: 'none' })
    }
    Taro.hideLoading()
  }

  async function getDetail(id) {
    Taro.showLoading({ title: '开盒中' })
    try {
      const result = await api.user.miniprogramMeBlindboxOpenUpdate(id || blindBoxId)
      setBlindBoxId('')
      setDetailBeau(result?.data.data)
      setOpenBox(true)
    } catch (error) {
      let msg = error.response.data.message
      if (/enough/.test(msg)) {
        msg = '藏品库存不足，打开失败'
      } else {
        msg = '打开失败'
      }
      Taro.showToast({ title: msg, icon: 'none' })
    } finally {
      Taro.hideLoading()
    }
  }

  const [blindBoxAni, setBlindBoxAni] = useState(false)
  function blindAni() {
    setBlindBoxAni(false)
    getDetail(orderBlindList[amount - 1].id)
    setAmount(amount - 1)
  }
  async function onSuccessClose() {
    if (amount >= 2) {
      setOpenBox(false)
      setDetailBeau({})
      // 处理盲盒动画
      setBlindBoxAni(true)
    } else {
      setOpenBox(false)
      setDetailBeau({})
      setRefresh(true)
    }
  }

  function onChangeItem(index: number) {
    setCurrentStateInfo({
      current: index,
      currentState: tabbar[index].value,
    })
  }

  return useObserver(() => {
    const isOrderOpen = router.params.type === OrderType.blind_box && router.params.id
    // const isOrderOpenRed = yzsList.length && !orderBlindList.length
    if (router.params.type === OrderType.blind_box && router.params.id && router.params.amount) {
      return null
    }
    return (
      <View className={styles.container}>
        <NavigationBar back color="#fff" background="transparent" />
        {isOrderOpen ? null : (
          <AtTabs className={styles.tabbar} current={currentStateInfo.current} tabList={tabbar} onClick={onChangeItem}>
            {
              currentStateInfo.currentState === AssetType.chainItem ? null : 
              tabbar.map((_item, index) => (
                <AtTabsPane  key={index} current={currentStateInfo.current} index={index}>
                  <View className="list-filter-container">
                    <View
                      onClick={() => {
                        if (sortBy === 'created_at') {
                          setSortBy('created_at')
                          setFilter(true)
                        } else {
                          setSortBy('created_at')
                          setSort('')
                          setFilter(true)
                        }
                      }}
                      className={`list-filter-item ${filter && sortBy === 'created_at' ? 'active' : ''}`}
                    >
                      时间排序
                    </View>
                    <View
                      onClick={() => {
                        if (sortBy === 'price') {
                          setSortBy('price')
                          setFilter(true)
                        } else {
                          setSortBy('price')
                          setSort('')
                          setFilter(true)
                        }
                      }}
                      className={`list-filter-item ${filter && sortBy === 'price' ? 'active' : ''}`}
                    >
                      价格排序
                    </View>
                    <View
                      onClick={() => {
                        if (sortBy === 'name') {
                          setSortBy('name')
                          setFilter(true)
                        } else {
                          setSortBy('name')
                          setSort('')
                          setFilter(true)
                        }
                      }}
                      className={`list-filter-item ${filter && sortBy === 'name' ? 'active' : ''}`}
                    >
                      名称排序
                    </View>
                    {filter ? (
                      <View className={`list-filter-option ${sortBy}`}>
                        <View
                          className={`${sort === 1 ? 'active' : ''}`}
                          onClick={() => {
                            setSort(1)
                            setFilter(false)
                            setRefresh(true)
                          }}
                        >
                          {sortBy && sortByBeau[sortBy]}正序
                        </View>
                        <View
                          className={`${sort === -1 ? 'active' : ''}`}
                          onClick={() => {
                            setSort(-1)
                            setFilter(false)
                            setRefresh(true)
                          }}
                        >
                          {sortBy && sortByBeau[sortBy]}倒序
                        </View>
                      </View>
                    ) : null}
                  </View>
                  <View className="list-tips">新获得的藏品需等待3天后，才可进行转赠</View>
                 
                </AtTabsPane>
              ))
            }
          </AtTabs>
        )}
        {
          currentStateInfo.currentState === AssetType.blindBox && <AssetListComponent
          key="blind_box"
          type={'blind_box'}
          onBlindBoxId={(id) => {
            setBlindBoxId(id)
            setAmount(1)
          }}
          refresh={refresh}
          sort={sort}
          sortBy={sortBy}
          onRefresh={() => setRefresh(false)}
        />
        }
        {
          currentStateInfo.currentState === AssetType.collection && 
          <AssetListComponent
            key="nft"
            type='nft'
            onBlindBoxId={(id) => {
              setBlindBoxId(id)
              setAmount(1)
            }}
            refresh={refresh}
            sort={sort}
            sortBy={sortBy}
            onRefresh={() => setRefresh(false)}
          />
        }
          {
          currentStateInfo.currentState === AssetType.chainItem && 
          <AssetListComponent
            key="chain"
            type='chain'
            onBlindBoxId={(id) => {
              setBlindBoxId(id)
              setAmount(1)
            }}
            refresh={refresh}
            sort={sort}
            sortBy={sortBy}
            onRefresh={() => setRefresh(false)}
          />
        }
        <SuccessModalComponent
          isShow={Boolean(openBox)}
          amount={amount}
          beau={detailBeau}
          onClose={() => {
            setOpenBox(false)
            setDetailBeau({})
            setRefresh(true)
          }}
          onNext={onSuccessClose}
        />
        <BuyBlindBoxDialog
          isShow={Boolean(isOrderOpen) || Boolean(blindBoxId) || blindBoxAni}
          onClose={() => {
            setBlindBoxId('')
            setRefresh(true)
            setBlindBoxAni(false)
          }}
          blindBoxAni={blindBoxAni}
          blindAni={blindAni}
          onOpen={getDetail}
        />
      </View>
    )
  })
}

export default AssetsList
