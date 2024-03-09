import {useState} from 'react'
import {View, Image} from '@tarojs/components'
import {AtModal} from 'taro-ui'
import {FC} from '@tarojs/taro'
import Taro from '@tarojs/taro'
import {useObserver} from 'mobx-react'

import styles from './index.module.scss'
// import {maskAddress} from '@/utils/util'
import orderIcon from './static/order.png'
import walletIcon from './static/wallet.png'
import assetIcon from './static/asset.png'
import combindIcon from './static/combind.png'
import collectIcon from './static/collect-icon.png'
import shareIcon from './static/share-icon.png'
import flowSaleIcon from './static/flow-sale.png'
import DebounceNavigator from '@/components/debounce-navigator/debounce-navigator'

// @ts-ignore
const PersonalPanel: FC<{beau: any; setBeau: any}> = (_props) => {
  const [isOpened, setIsOpened] = useState(false)
  const list = [
    {icon: orderIcon, text: '我的订单', url: '/pages/order-list/order-list'},
    {icon: walletIcon, text: '钱包地址', url: 'click'},
    {icon: assetIcon, text: '我的资产', url: '/pages/property/property'},
    {icon: combindIcon, text: '合成中心', url: '/pages/combind-center/index'},
    {icon: shareIcon, text: '我的分享', url: '/pages/my-share/index'},
    {icon: collectIcon, text: '我的收藏', url: '/pages/my-collect/index'},
    {icon: flowSaleIcon, text: '售卖管理', url: '/pages/my-flow-sale/index'},
  ]
  const logined = _props.beau.logined
  let account = _props.beau.account
  const isKycAuth = _props.beau.isKycAuth

  const mapList = list.map((i) => ({
    ...i,
    url: logined ? i.url : '/pages/login/login?to=' + encodeURIComponent(i.url),
  }))

  const onWallet = () => {
    if (!logined) {
      Taro.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    if (!isKycAuth) {
      Taro.showModal({
        title: '',
        content: '请先完成实名认证',
        cancelText: '取消',
        confirmText: '去认证',
        success: ({confirm}) => {
          if (confirm) {
            Taro.redirectTo({
              url: '/pages/account/account?kyc=no',
            })
          }
        },
      })
    } else {
      Taro.navigateTo({url:"/pages/wallet-page/index"})
      // if (account) {
      //   setIsOpened(true)
      // } else {
      //   Taro.showLoading({title: '生成中...'})
      //   api.user.blockchainApi().then(({data}) => {
      //     account = data.account
      //     _props.setBeau({..._props.beau, account: data.account})
      //     Taro.hideLoading()
      //     setIsOpened(true)
      //   })
      // }
    }
  }

  return useObserver(() => {
    return (
      <View className={styles.panel}>
        {mapList.map((i, index) =>
          i.url !== 'click' ? (
            <DebounceNavigator url={i.url}>
              <View className={styles.item}>
                <Image className={`${styles.icon} index-${index}`} src={i.icon} mode="aspectFit" />
                <View className={styles.text}>{i.text}</View>
              </View>
            </DebounceNavigator>
          ) : (
            <View className={styles.item} onClick={onWallet}>
              <Image className={styles.icon} src={i.icon} mode="aspectFit" />
              <View className={styles.text}>{i.text}</View>
            </View>
          )
        )}
        <AtModal
          isOpened={isOpened}
          title="钱包地址"
          cancelText="关闭"
          confirmText="复制"
          onClose={() => setIsOpened(false)}
          onCancel={() => setIsOpened(false)}
          onConfirm={() => {
            Taro.showToast({title: '复制成功', icon: 'none'})
            Taro.setClipboardData({
              data: account,
            })
            setIsOpened(false)
          }}
          content={account}
        />
      </View>
    )
  })
}

export default PersonalPanel
