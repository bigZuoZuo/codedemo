import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {Image, View} from '@tarojs/components'

import {debounceFirst} from '@/utils/util'
import Taro, {useRouter} from '@tarojs/taro'
import {AtForm, AtInput, AtTextarea} from 'taro-ui'
import {useEffect, useState} from 'react'
import {useObserver} from 'mobx-react'

import TaroRegionPicker from '@/components/taro-region-picker/taro-region-picker'
import {api} from '@/api'
import {useStore} from '@/store'
import {IAddress} from '@/typings'
import addressSelectedIcon from '@/assets/v2/address-selected.png'
import addressUnselectIcon from '@/assets/v2/address-un-select.png'

import './delivery-address.scss'
import Input from '@/components/Input'

function DeliveryAddressList() {
  const store = useStore()
  const [addressInfo, setAddressInfo] = useState<Record<string, string>>({})
  const [areaInfo, setAreaInfo] = useState<[string, string, string]>()
  const [defaultAddress, setDefaultAddress] = useState<boolean>(false)
  const addressId = useRouter().params.id

  if (addressId) {
    store.observableDetailIfNull({id: addressId})
  }

  useEffect(() => {
    if (!addressId) {
      return
    }
    store.loadByApi({api: api.user.miniprogramAddressDetail(addressId)})
  }, [addressId])

  function addressItemProps(
    name: string,
    type = 'text' as 'text' | 'number' | 'password' | 'phone' | 'idcard' | 'digit'
  ) {
    if (!(name in addressInfo)) {
      setAddressInfo({...addressInfo, [name]: ''})
    }
    return {
      type,
      value: addressInfo[name],
      onChange(event: string) {
        setAddressInfo({...addressInfo, [name]: event})
      },
    }
  }

  async function onSubmit() {
    if (!Object.values(addressInfo).every(Boolean) || !areaInfo) {
      Taro.showToast({title: '请填写所有项目', icon: 'none'})
      return
    }

    if (!/1\d{10}$/.test(addressInfo.mobile)) {
      Taro.showToast({title: '请输入真实的手机号', icon: 'none'})
      return
    }

    if (addressInfo.contactName.length >= 64) {
      Taro.showToast({title: '联系人不能大于 64 个字符', icon: 'none'})
      return
    }

    if (addressInfo.address.length >= 128) {
      Taro.showToast({title: '详细地址不能大于 128 个字符', icon: 'none'})
      return
    }

    Taro.showLoading({title: '加载中...'})

    const saveBody = {
      ...addressInfo,
      province: areaInfo[0],
      city: areaInfo[1],
      area: areaInfo[2],
      street: '',
      isDefault: defaultAddress,
    }

    if (addressId) {
      await api.user.miniprogramAddressUpdate(addressId, saveBody)
    } else {
      await api.user.miniprogramAddressCreate(saveBody as any)
    }

    Taro.hideLoading()

    Taro.navigateBack()
  }

  return useObserver(() => {
    let detail: IAddress | undefined = undefined
    if (addressId) {
      detail = store.detailSet[addressId] as IAddress
    }

    useEffect(() => {
      if (
        !detail?.mobile &&
        !detail?.contact_name &&
        !detail?.address &&
        !detail?.province &&
        !detail?.city &&
        !detail?.area
      ) {
        return
      }

      setAddressInfo({
        contactName: detail.contact_name,
        mobile: detail.mobile,
        address: detail.address,
      })

      setDefaultAddress(detail.is_default)

      setAreaInfo([detail.province, detail.city, detail.area])
    }, [detail?.mobile, detail?.contact_name, detail?.address, detail?.province, detail?.city, detail?.area])

    return (
      <View className="container delivery-address-container">
        <NavigationBar title="收货地址" back color="#fff" />
        <View className="delivery-address-content-container">
          <AtForm>
            {/* <AtInput
              name="contactName"
              title="联系人"
              maxlength={64}
              placeholder="请输入联系人"
              {...addressItemProps('contactName')}
            />
            <AtInput
              name="mobile"
              title="联系号码"
              placeholder="请输入联系号码"
              {...addressItemProps('mobile', 'phone')}
            /> */}
            <Input label='联系人' classname='address_input'  maxlength={64} placeholder="请输入联系人" textAlign='right' {...addressItemProps('contactName')}/>
            <Input label='联系号码' classname='address_input' maxlength={11} placeholder="请输入联系号码" textAlign='right' {...addressItemProps('mobile', 'phone')}/>
            <TaroRegionPicker
              onChange={(value) => {
                setAreaInfo(value)
              }}
              value={areaInfo}
            />
            {/* <AtInput
              name="address"
              title="详细地址"
              placeholder="请输入详细地址"
              maxlength={128}
              {...addressItemProps('address')}
            /> */}
            <View className="area-box">
              <View className="area-label">详细地址</View>
              <AtTextarea
                count={false}
                className="area-address"
                placeholder="请输入详细地址"
                {...addressItemProps('address')}
              />
            </View>
          </AtForm>
        </View>
        <View
          className="delivery-address-list-item-footer"
          onClick={() => {
            setDefaultAddress(!defaultAddress)
          }}
        >
          <Image
            src={defaultAddress ? addressSelectedIcon : addressUnselectIcon}
            className="delivery-address-list-icon"
          />
          <View className="delivery-address-list-item-info">
            <View className="delivery-address-list-item-header">
              <View className="delivery-address-list-item-name">设为默认地址</View>
            </View>
          </View>
        </View>

        <View className="delivery-address-footer">
          <View className="btn delivery-address-btn" onClick={debounceFirst(onSubmit)}>
            完成
          </View>
          <View className="safe-bottom" />
        </View>
      </View>
    )
  })
}

export default DeliveryAddressList
