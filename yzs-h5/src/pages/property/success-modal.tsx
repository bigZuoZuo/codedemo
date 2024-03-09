// import {useState} from 'react'
import {Button, View, Text} from '@tarojs/components'
// import {useStore} from '../../store'
import {useObserver} from 'mobx-react'
import {AtCurtain} from 'taro-ui'
// import Taro from '@tarojs/taro'

// import blindBoxV from '@/assets/v2/blind-box-v.png'
import './modal.scss'
import {showImageOrVideo} from '../home/home'

interface Props {
  isShow?: boolean
  amount: Number
  beau?: any
  onClose?: () => void
  onNext?: () => void
}

function SuccessModalComponent(props: Props) {
  return useObserver(() => {
    return (
      <View className="bind-box-success-box-container">
        <AtCurtain isOpened={props.isShow} onClose={() => props.onClose?.()} className="success-box-dialog-container">
          <View className="success-box-dialog-header">恭喜您获得</View>
          <View className="success-box-dialog-flag">
            <View className="success-box-dialog-flag-container">
              {
                showImageOrVideo({
                  type: props.beau?.material_type,
                  url: /3D|music|video/.test(props.beau?.material_type) ? props.beau?.cover_url : props.beau?.images?.[0],
                  className: 'success-box-dialog-flag-image'
                })
              }
              <Text className="success-box-dialog-flag-title">{props.beau?.name}</Text>
              <View className="success-box-dialog-flag-number-wrap">
                <Text className="success-box-dialog-flag-number-label">编号：</Text>
                <Text className="success-box-dialog-flag-number">{props.beau?.nft_number}</Text>
              </View>
            </View>
          </View>
          <View className="success-box-dialog-header success-box-dialog-footer">
            {props?.amount >= 2 ? (
              <Button className="success-box-dialog-next" onClick={() => props.onNext?.()}>
                下一个
              </Button>
            ) : (
              <Button className="success-box-dialog-next" onClick={() => props.onClose?.()}>
                完成
              </Button>
            )}
          </View>
        </AtCurtain>
      </View>
    )
  })
}

export default SuccessModalComponent
