import {useEffect, useState} from 'react'
import Taro, {FC, useRouter} from '@tarojs/taro'
import {sm2} from 'sm-crypto'
import {View, Text, Button} from '@tarojs/components'
import {AtTextarea} from 'taro-ui'

import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {api} from '@/api'
import {useStore} from '@/store'
import {maskAddress} from '@/utils/util'
import {usePin} from '@/components/pin/pin'

import {showImageOrVideo} from '../home/home'
import './index.scss'

const NftGift: FC = () => {
  const store = useStore()
  const router = useRouter()
  const {show: showPinPop} = usePin()
  const id: string = router.params.id || ''
  const assetsId: string = router.params.assetsId || ''
  const status: string = router.params.status || ''

  const [beau, setBeau] = useState<any>([])
  const [value, setValue] = useState<any>('')

  useEffect(() => {
    if (!id) return
    async function fetchData() {
      const {data: result} = await api.user.miniprogramNfcDetail({id})
      setBeau(result)
    }
    fetchData()
  }, [id])

  const onGift = async () => {
    if (!store.state.haveTradePassword) {
      Taro.showModal({
        title: '',
        content: '转赠藏品，需先完成操作密码设置',
        confirmText: '去设置',
        success: function (res) {
          if (res.confirm) {
            Taro.navigateTo({url: '/pages/pin/index'})
          } else if (res.cancel) {
          }
        },
      })
    } else {
      if (!value.length) {
        Taro.showToast({title: '请输入好友的区块链地址', icon: 'none'})
        return
      }
      const pin: any = await showPinPop()
      if (!pin) {
        return
      }
      const {data: publicKey} = await api.pin.getUserKeyApi()
      const tradePassword = sm2.doEncrypt(pin, publicKey.data) // 加密结果
      api.give
        .giveApi({
          toUserAccount: value,
          userNftId: assetsId,
          tradePassword,
        })
        .then(() => {
          Taro.navigateTo({url: '/pages/pin-success/index?type=give'})
        })
        .catch((error) => {
          Taro.showToast({title: error?.response?.data?.message, icon: 'none'})
        })
    }
  }

  return (
    <View className="gift-page">
      <NavigationBar color="#fff" title={'藏品转赠'} back background="transparent" />
      <View className="gift-container">
        <View className="goods-detail-body">
           {
                showImageOrVideo({
                  type: beau?.material_type,
                  url: /3D|music|video/.test(beau?.material_type) ? beau?.cover_url : beau?.images?.[0],
                  className: 'goods-image'
                })
              }
          <View className="goods-info">
            <View className="goods-info-header">
              <Text className="goods-title">{beau?.name}</Text>
            </View>
            <View className="goods-info-tips">哈希值 {maskAddress(beau.transaction_hash)}</View>
            <View className="goods-footer">
              发行方：
              <br /> {beau?.issuer_name || '--'}
            </View>
          </View>
        </View>
        <View className="title-address">请输入好友的区块链地址</View>
        <AtTextarea
          className="area-address"
          count={false}
          value={value}
          onChange={setValue}
          maxLength={200}
          placeholder="请输入"
        />
        {status === 'locking' ? (
          <View className="bottom-operation">
            <Button className="operation-button disabled">锁定期</Button>
          </View>
        ) : (
          <View className="bottom-operation" onClick={onGift}>
            <Button className="operation-button">转赠</Button>
          </View>
        )}
      </View>
      <View className="safe-bottom" />
    </View>
  )
}

export default NftGift
