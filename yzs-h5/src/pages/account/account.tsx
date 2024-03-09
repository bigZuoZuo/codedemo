import {View, Image} from '@tarojs/components'
import {FC} from '@tarojs/taro'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {useState, useEffect} from 'react'
import Taro, {useRouter} from '@tarojs/taro'
import {runInAction} from 'mobx'
import {useObserver} from 'mobx-react'

import {api} from '@/api'
import {uploadFile} from '@/utils/aliyun-oss'
import styles from './account.module.scss'
import CardContent from '@/components/card-content'
import {useStore} from '@/store'
// import DebounceNavigator from '@/components/debounce-navigator/debounce-navigator'
import UserNameForm from './components/userNameForm'
import MobileForm from './components/mobileForm'
import KYCForm from './components/kycForm'
import defaultAvatar from '@/assets/default-avatar.png'

const Account: FC = () => {
  const params = useRouter().params
  const store = useStore()
  const [openNickNameDialog, setOpenNickNameDialog] = useState(false)
  const [openMobileDialog, setOpenMobileDialog] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [avatar, setAvatar] = useState(defaultAvatar)

  async function chooseAvatar() {
    const response = await Taro.chooseImage({
      count: 1,
    })

    Taro.showLoading({title: '上传中...'})
    try {
      const result = await uploadFile(response.tempFilePaths[0])
      const profile: any = await api.user.miniprogramMeProfileUpdate({
        avatar: result + '?x-oss-process=image/format,webp/quality,Q_60',
      })
      Taro.setStorageSync('access_token', profile.data.token)
      setAvatar(result)
      runInAction(() => {
        store.state.avatar = result + '?x-oss-process=image/format,webp/quality,Q_60'
      })
    } catch (error) {
      //
    }
    Taro.hideLoading()
  }
  return useObserver(() => {
    useEffect(() => {
      setAvatar(store.state.avatar || defaultAvatar)
    }, [store.state.avatar])

    useEffect(() => {
      if (params?.mobile === 'no' && !store.state.phoneNumber) {
        console.log(store.state.phoneNumber, '111')
        setOpenMobileDialog(true)
      } else if (store.state.phoneNumber) {
        setOpenMobileDialog(false)
      }
    }, [params, store.state.phoneNumber])

    useEffect(() => {
      if (params?.kyc === 'no' && !store.state.isKycAuth) {
        setOpenDialog(true)
      } else if (store.state.isKycAuth) {
        setOpenDialog(false)
      }
    }, [params, store.state.isKycAuth])

    return (
      <View className={styles.page}>
        <NavigationBar back color="#fff" />
        <CardContent>
          <View className={styles.content}>
            <View className={styles.item} onClick={chooseAvatar}>
              头像
              <Image className={styles.avatarImage} src={avatar} mode="aspectFill" />
            </View>

            <View className={styles.item} onClick={() => setOpenNickNameDialog(true)}>
              用户名
              <View className={styles.text}>{store.state.nickName}</View>
            </View>

            <View className={styles.item} onClick={() => setOpenMobileDialog(true)}>
              绑定手机
              <View className={styles.text}>{store.state.phoneNumber}</View>
            </View>

            <View
              className={styles.item}
              onClick={() => {
                if (!store.state.isKycAuth) {
                  setOpenDialog(true)
                }
              }}
            >
              实名认证
              <View className={styles.text}>{store.state.isKycAuth ? '已认证' : '未认证'}</View>
            </View>

            <View
              className={styles.item}
              onClick={() => {
                // if (store.state.phoneNumber) {
                //   Taro.showToast({
                //     title: '请先绑定手机号',
                //     icon: 'none'
                //   });
                // }
                Taro.navigateTo({
                  url: '/pages/pin/index?reset=' + store.state.haveTradePassword,
                })
              }}
            >
              操作密码
              <View className={styles.text}>{store.state.haveTradePassword ? '已设置' : '未设置'}</View>
            </View>
          </View>
        </CardContent>
        <UserNameForm openNickNameDialog={openNickNameDialog} setOpenNickNameDialog={setOpenNickNameDialog} />
        {openMobileDialog ? (
          <MobileForm
            mobile={params?.mobile === 'no' && !store.state.phoneNumber}
            openMobileDialog={openMobileDialog}
            setOpenMobileDialog={setOpenMobileDialog}
          />
        ) : null}
        <KYCForm kyc={params?.kyc} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </View>
    )
  })
}

export default Account
