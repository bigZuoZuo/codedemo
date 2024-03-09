import {useState, useEffect} from 'react'
import {View} from '@tarojs/components'
import {useStore} from '@/store'
import {useObserver} from 'mobx-react'
import Taro, {useDidShow, usePageScroll} from '@tarojs/taro'

import NavigationBar from '@/components/navigation-bar/navigation-bar'
import TabBar from '@/components/tab-bar/tabbar'
import {api} from '@/api'

import PersonalMenu from './components/personal-menu'
import PersonalProfile from './components/personal-profile/personal-profile'
import PersonalPanel from './components/personal-panel'
import styles from './personal.module.scss'

function Personal() {
  const store = useStore()
  const [showNavigationBarBackground, setShowNavigationBarBackground] = useState(false)
  const [beau, setBeau] = useState(store.state || {})
  // const [fullscreen, setFullScreen] = useState<any>(false)

  usePageScroll((data) => {
    const scrollTop = data.scrollTop
    if (scrollTop < 100) {
      if (showNavigationBarBackground) {
        setShowNavigationBarBackground(false)
      }
    } else {
      if (!showNavigationBarBackground) {
        setShowNavigationBarBackground(true)
      }
    }
  })

  const [stat, setStat] = useState({
    commentUnreadCount: 0,
    orderCanceledCount: 0,
    orderCompletedCount: 0,
    orderPendingCount: 0,
    orderReceivedCount: 0,
    orderShippedCount: 0,
  })

  useDidShow(() => {
    if (!beau.logined) return
    api.user.miniprogramMeStatList().then(({data}) => {
      setStat(data as typeof stat)
    })
  })
  // const [ios, setIOS] = useState(true)
  // useEffect(() => {
  //   Taro.getSystemInfo({
  //     success: (res) => {
  //       const ios = !!(res.system.toLowerCase().search('ios') + 1)
  //       setIOS(ios)
  //     },
  //   }).catch(() => {})
  // }, [])

  // const handleQRCode = () =>{
  //  Taro.navigateTo({url: '/pages/scan/index'})
  // }
  // const handleQRCode = () => {
  //   if (!beau.logined) {
  //     Taro.navigateTo({url: '/pages/login/login'})
  //     return
  //   }
  //   setFullScreen(true)
  //   // @ts-ignore
  //   Html5Qrcode.getCameras()
  //     .then((devices) => {
  //       if (devices && devices.length) {
  //         const cameraId = devices.length >= 2 ? devices[1].id : devices[0].id
  //         // @ts-ignore
  //         const _html5QrCode = new Html5Qrcode('reader')
  //         setTimeout(() => {
  //           setFullScreen('QRCode')
  //           _html5QrCode
  //             .start(
  //               ios ? cameraId : {facingMode: 'environment'},
  //               {
  //                 fps: 3, // Optional, frame per seconds for qr code scanning
  //                 qrbox: {width: 200, height: 200}, // Optional, if you want bounded box UI
  //               },
  //               // @ts-ignore
  //               (decodedText, decodedResult) => {
  //                 // do something when code is read
  //                 setFullScreen(false)
  //                 // alert(decodedText)
  //                 setTimeout(() => {
  //                   const url = new URL(decodedText)
  //                   window.location.replace(url)
  //                 }, 0)
  //               },
  //               // @ts-ignore
  //               (errorMessage) => {
  //                 // parse error, ignore it.
  //                 // Taro.showToast({title: '扫码错误，请重试' || errorMessage, icon: 'none'})
  //               }
  //             )
  //             .catch((err) => {
  //               setFullScreen(false)
  //               Taro.showToast({title: '启动相机失败' || err, icon: 'none'})
  //             })
  //         }, 500)
  //       }
  //     })
  //     .catch((err) => {
  //       setFullScreen(false)
  //       Taro.showToast({title: '授权使用相机失败' || err, icon: 'none'})
  //     })
  // }

  return useObserver(() => {
    useEffect(() => {
      const loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
      if (loginResponse.userId && !store.state.userId) {
        setBeau({...loginResponse, logined: true})
      }
    }, [store.state.userId])
    return (
      <View className={styles.container}>
        <NavigationBar
        // slotRight={
        //   <View onClick={handleQRCode} className={`${styles.scan} ${fullscreen && styles.fullscreen}`}>
        //     <Block wx-if={fullscreen === true}>
        //       <View className={styles.buttonLoad}></View>
        //       <View className={styles.rightCircle}></View>
        //       <View className={styles.buttonText}>相机启动中</View>
        //     </Block>
        //     <View
        //       className={`${styles.close} ${fullscreen && styles.fullscreen}`}
        //       onClick={(e) => {
        //         e.stopPropagation()
        //         //@ts-ignore
        //         setFullScreen(false)
        //         window.location.reload()
        //       }}
        //     >
        //       ＋
        //     </View>
        //     <Block wx-if={fullscreen}>
        //       <View id="reader" className={`${styles.reader} ${fullscreen && styles.fullscreen}`}></View>
        //     </Block>
        //   </View>
        // }
        />

        <PersonalProfile beau={beau} />
        <View className={styles.wrap}>
          <PersonalPanel beau={beau} setBeau={setBeau} />

          <PersonalMenu beau={beau} unread={stat.commentUnreadCount} />
        </View>

        <TabBar index={2} />
      </View>
    )
  })
}

export default Personal
