import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View} from '@tarojs/components'

import {debounceFirst} from '@/utils/util'
import Taro, {useRouter} from '@tarojs/taro'
import {AtForm, AtInput} from 'taro-ui'
import {useEffect, useState} from 'react'

import {api} from '@/api'

import './exchange.scss'

function ExchangePage() {
  const [inputInfo, setInputInfo] = useState<any>({})
  const [isCanBinding, setIsCanBinding] = useState<any>('loading')
  const params = useRouter().params

  useEffect(() => {
    setInputInfo({serialNumber: params.serialnumber})
    if (params.serialnumber && params.chk) {
      api.entity
        .entityVerifyApi(params)
        .then(() => {
          setIsCanBinding(true)
        })
        .catch(() => {
          Taro.showToast({title: '链接已失效', icon: 'none'})
          setIsCanBinding(false)
        })
    }
  }, [params])

  function inputItemProps(name: string, type = 'text' as 'text' | 'number') {
    if (!(name in inputInfo)) {
      setInputInfo({...inputInfo, [name]: ''})
    }
    return {
      type,
      value: inputInfo[name],
      onChange(event: string) {
        setInputInfo({...inputInfo, [name]: event})
      },
    }
  }

  async function onSubmit() {
    if (!isCanBinding) {
      Taro.navigateTo({url: '/pages/home/home'})
      return
    }
    if (inputInfo.serialNumber.length >= 128) {
      Taro.showToast({title: '兑换码不能大于 128 个字符', icon: 'none'})
      return
    }

    Taro.showLoading({title: '加载中...'})

    // const saveBody = {
    //   ...inputInfo,
    // }

    Taro.navigateBack()
  }

  return (
    <View className="container exchange-container">
      <NavigationBar title="藏品兑换" back color="#fff" />

      <View className="exchange-name">兑换码</View>
      <View className="exchange-content-container">
        <AtForm>
          <AtInput name="serialNumber" maxlength={64} placeholder="请输入兑换码" {...inputItemProps('serialNumber')} />
        </AtForm>
      </View>
      <View className="exchange-tips">兑换码说明：</View>
      <View className="exchange-tips">1.都是假的伤口了打瞌睡了</View>
      <View className="exchange-tips">2.都是假的伤口了打瞌睡了</View>
      <View className="exchange-tips">3.都是假的伤口了打瞌睡了</View>

      <View className="exchange-footer">
        <View className="btn exchange-btn" onClick={debounceFirst(onSubmit)}>
          {isCanBinding ? '确认兑换' : '跳转到主页'}
        </View>
        <View className="safe-bottom" />
      </View>
    </View>
  )
}

export default ExchangePage
