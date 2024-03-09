import {useEffect, useState} from 'react'
import {View, Image, Text, ScrollView, ITouchEvent} from '@tarojs/components'
import Taro, {useDidShow, useRouter} from '@tarojs/taro'
import {useObserver} from 'mobx-react'

import {useAutoFetchList} from '@/utils/auto-fetch-list'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {api} from '@/api'
import {debounceFirst, mergeAddress} from '@/utils/util'
import ListState from '@/components/list-state/list-state'
import {IAddress} from '@/typings'
import addressSelectedIcon from '@/assets/v2/address-selected.png'
import addressIcon from '@/assets/icons/address.png'
import addressUnselectIcon from '@/assets/v2/address-un-select.png'

import './delivery-address-list.scss'

function DeliveryAddressList() {
  const {getObservableList, isInfiniteLoading, isRefreshLoading, paginationInfo, refresh} = useAutoFetchList({
    fetchApi: 'miniprogramAddressList',
    observable: true,
  })

  const routerParams = useRouter().params as {
    /**
     * 需要选择
     */
    choose?: string
  }
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState<IAddress>()

  useEffect(() => {
    if (!routerParams.choose) {
      return
    }

    Taro.getStorage({
      key: 'addressInfo',
    }).then((res) => {
      if (!res.data || !res.data.id) {
        return
      }

      setCurrentSelectedAddress(res.data)
    })
  }, [routerParams.choose])

  async function onDelete(addressId) {
    const addressInfoCached = await Taro.getStorage({key: 'addressInfo'})
    const rst = await Taro.showModal({title: '提示', content: '确认要删除这个收货地址吗？'})
    if (rst.confirm) {
      if(addressInfoCached?.data?.id == addressId){
        Taro.removeStorage({
          key: 'addressInfo',
        })
      }
      await api.user.miniprogramAddressDelete(addressId!)
      refresh()
    }
  }

  const [posting, setPosting] = useState(false)
  async function onDefault(addressId, isDefault) {
    if (posting) {
      return
    }
    setPosting(true)
    try {
      await api.user.miniprogramAddressUpdate(addressId!, {isDefault})
      setPosting(false)
      refresh()
    } catch (e) {
      setPosting(false)
    }
  }

  useDidShow(() => {
    refresh()
  })

  return useObserver(() => {
    const data = getObservableList()

    return (
      <View className="container delivery-address-list-container">
        <NavigationBar back loading={isRefreshLoading} title="我的地址" color="#fff" />
        <ScrollView scrollY className="delivery-address-list-content-container">
          <View>
            {data.map((item: IAddress) => (
              <View className="delivery-address-list-item">
                <View className="delivery-address-list-item-top">
                  <Image src={addressIcon} className="delivery-address-list-icon" />
                  <View className="delivery-address-list-item-info">
                    <View className="delivery-address-list-item-header">
                      <View className="delivery-address-list-item-name">{item.contact_name}</View>
                      <View className="delivery-address-list-phone">{item.mobile}</View>
                    </View>
                    <View className="delivery-address-list-item-address">
                      <Text className="delivery-address-list-item-address-content">{mergeAddress(item)}</Text>
                    </View>
                  </View>
                </View>
                <View className="delivery-address-list-item-footer">
                  {Boolean(routerParams.choose) ? (
                    <Image
                      onClick={() => {
                        setCurrentSelectedAddress(item)
                      }}
                      src={currentSelectedAddress?.id === item.id ? addressSelectedIcon : addressUnselectIcon}
                      className="delivery-address-list-icon"
                    />
                  ) : (
                    <Image
                      src={item.is_default ? addressSelectedIcon : addressUnselectIcon}
                      className="delivery-address-list-icon"
                      onClick={() => {
                        setCurrentSelectedAddress(item)
                      }}
                    />
                  )}
                  <View className="delivery-address-list-item-info">
                    <View
                      className="delivery-address-list-item-header"
                      onClick={() => {
                        if (Boolean(routerParams.choose)) {
                          setCurrentSelectedAddress(item)
                        } else {
                          onDefault(item.id, !item.is_default)
                        }
                      }}
                    >
                      <View className="delivery-address-list-item-name">
                        {Boolean(routerParams.choose) ? '选择此地址' : '设为默认地址'}
                      </View>
                      <View className="delivery-address-list-options">
                        <View
                          className="delivery-address-list-item-edit"
                          onClick={debounceFirst((e: ITouchEvent) => {
                            e.stopPropagation()
                            Taro.navigateTo({url: `/pages/delivery-address/index?id=${item.id}`})
                          })}
                        >
                          编辑
                        </View>
                        <View
                          className="delivery-address-list-item-remove"
                          onClick={debounceFirst(() => onDelete(item.id))}
                        >
                          删除
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          <ListState
            isEmpty={!data.length}
            infiniteLoading={isInfiniteLoading}
            hasNextPage={paginationInfo.hasNextPage}
          />
        </ScrollView>

        {routerParams.choose ? (
          <View className="fixed-footer">
            <View
              className="fixed-footer-btn fixed-footer-btn-confirm"
              onClick={debounceFirst(async () => {
                if (!currentSelectedAddress) {
                  Taro.showToast({title: '请选择收货地址', icon: 'none'})
                  return
                }
                let address = currentSelectedAddress
                data.map((item: IAddress) => {
                  if (currentSelectedAddress.id == item.id) {
                    address = item
                  }
                })

                await Taro.setStorage({
                  key: 'addressInfo',
                  data: address,
                })

                Taro.navigateBack()
              })}
            >
              确认
            </View>
            <View
              className="fixed-footer-btn fixed-footer-btn-back"
              onClick={debounceFirst(() => {
                Taro.navigateTo({url: '/pages/delivery-address/index'})
              })}
            >
              添加地址
            </View>
            <View className="safe-bottom" />
          </View>
        ) : (
          <View className="delivery-address-list-footer">
            <View
              className={`${routerParams.choose && 'delivery-transparent'} btn delivery-address-list-btn`}
              onClick={debounceFirst(() => {
                Taro.navigateTo({url: '/pages/delivery-address/index'})
              })}
            >
              添加地址
            </View>
            <View className="safe-bottom" />
          </View>
        )}
      </View>
    )
  })
}

export default DeliveryAddressList
