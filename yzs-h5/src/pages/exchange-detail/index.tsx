import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View, Text, Image} from '@tarojs/components'
import Taro, {useRouter} from '@tarojs/taro'
import {useObserver} from 'mobx-react'
import {useCallback, useEffect, useState} from 'react'
import {AtForm, AtInput} from 'taro-ui'
import {api} from '@/api'
import {useStore} from '@/store'

import cylinderImage from '@/assets/v2/cylinder.png'
import styles from './exchange-detail.module.css'
import {showImageOrVideo} from '../home/home'
import classNames from 'classnames'
// import {maskAddress, copy} from '@/utils/util'
// import copyIcon from '@/assets/icons/copy.png'
import EmptyFigure from '../../components/empty-figure/empty-figure'
import './exchange.scss'

function ExchangeDetail() {
  const params = useRouter().params
  const store = useStore()

  const [detail, setDetail] = useState<any>({})
  const [isCanBinding, setIsCanBinding] = useState<any>('loading')
  // const [beau, setBeau] = useState(store.state || {})

  function trim(str) {
    if (str) {
      str = decodeURIComponent(str)
      return str.replace(/^\s+|\s+$/g, '')
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (params?.serialnumber) {
      api.entity
        .entityVerifyApi({serialnumber: params.serialnumber, chk: trim(params?.chk)})
        .then(({data}) => {
          if (data.code == 'ok') {
            setIsCanBinding(true)
            setDetail(data.data)
            // if (!store.state.logined) {
            //   const currentPage = '/pages/exchange-detail/index' + location.search
            //   Taro.navigateTo({url: '/pages/login/login?to=' + encodeURIComponent(currentPage)})
            //   return
            // }
          } else {
            setIsCanBinding(false)
          }
        })
        .catch(() => {
          setIsCanBinding(false)
        })
    }
  }, [params])

  // useEffect(() => {
  //   const loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
  //   if (loginResponse.userId && !store.state.userId) {
  //     setBeau({...loginResponse, logined: true})
  //   }
  // }, [store.state.userId])

  const [inputInfo, setInputInfo] = useState<any>('')

  const handleBind = useCallback(() => {
    if (isCanBinding == true) {
      if (!inputInfo.length) {
        Taro.showToast({title: '产品编号不能为空', icon: 'none'})
        return
      }
      // if (!beau.isKycAuth) {
      //   Taro.showModal({
      //     title: '',
      //     content: '请先完成实名认证',
      //     cancelText: '取消',
      //     confirmText: '去认证',
      //     success: ({confirm}) => {
      //       if (confirm) {
      //         Taro.redirectTo({
      //           url: '/pages/account/account?kyc=no',
      //         })
      //       }
      //     },
      //   })
      //   return
      // }
      Taro.showLoading({title: '绑定中'})
      api.entity
        .entityBindApi({
          serialnumber: params.serialnumber,
          chk: trim(params?.chk),
          productCode: inputInfo,
        })
        .then((result) => {
          Taro.hideLoading()
          if (result.data.code == 'ok') {
            Taro.showToast({title: '绑定成功', icon: 'success'})
            api.entity
              .entityVerifyApi({serialnumber: params.serialnumber, chk: trim(params?.chk)})
              .then(({data}) => {
                if (data.code == 'ok') {
                  setIsCanBinding(true)
                  setDetail(data.data)
                } else {
                  setIsCanBinding(false)
                }
              })
              .catch(() => {
                setIsCanBinding(false)
              })
          } else {
            if (result.data.code == 'need_kyc') {
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
              Taro.showToast({title: result.data.msg || '绑定失败', icon: 'none'})
            }
          }
        })
        .catch(() => {
          Taro.showToast({title: '绑定失败', icon: 'none'})
        })
    }
  }, [isCanBinding, inputInfo])

  return useObserver(() => {
    if (isCanBinding === 'loading') {
      return <></>
    }

    return (
      <View className={styles.container}>
        <NavigationBar back />
        {isCanBinding ? (
          <View className={classNames('pr z2', styles['scroll-view'])}>
            <View className="exchange-container-detail" wx-if={isCanBinding && !detail?.is_bind}>
              <View className="exchange-name">产品编号</View>
              <View className="exchange-content-container">
                <AtForm>
                  <AtInput
                    name="serialNumber"
                    maxlength={64}
                    placeholder="请输入产品编号"
                    onChange={(event: string) => setInputInfo(event)}
                  />
                </AtForm>
              </View>
              <View className="exchange-tips">请输入实物或说明书上的产品编号</View>
              {/* <View className="exchange-tips">1.产品编号</View> */}
              {/* <View className="exchange-tips">2.产品编号2</View> */}
            </View>

            <View className={styles.poster}>
              {
                showImageOrVideo({
                  type: detail?.material_type,
                  url: /3D|music|video/.test(detail?.material_type) ? detail?.cover_url : detail?.image,
                  className: styles['poster-image'],
                  canClick: true,
                  oUrl: detail?.image,
                  extra: /video/.test(detail?.material_type) ? 'official-goods-detail video-icon' : 'official-goods-detail'
                  })
              }
            </View>

            <Image src={cylinderImage} className={styles.cylinder} />
            <View className={styles.title}>
              <Text>{detail?.nft_name}</Text>
            </View>
            <View className={styles['goods-mate-info']}>
              <View>
                <Text className={styles['limited-quantity']}>限量</Text>
                <Text className={styles['limited-quantity-number']}>{detail?.total}份</Text>
              </View>
              <View wx-if={detail.category_name}>
                <Text className={styles['series-name']}>{detail.category_name}</Text>
              </View>
            </View>

            {detail?.is_bind && detail?.nick_name && detail?.account ? (
              <View className={styles.box}>
                <View className={styles['box-title-wrap']}>
                  <View className={styles['box-title-icon']}></View>
                  <Text className={styles['box-title']}>当前拥有者</Text>
                </View>

                <View className={styles['bod-body']}>
                  <View className={styles['list-item']}>
                    <Text className={styles.label}>昵称</Text>
                    <Text className={styles.value}>{detail?.nick_name}</Text>
                  </View>
                  <View className={styles['list-item']}>
                    <Text className={styles.label}>钱包地址</Text>
                    <Text className={styles.value}>{detail?.account}</Text>
                  </View>
                </View>
              </View>
            ) : null}
            <View wx-if={isCanBinding && !detail?.is_bind} className="fixed-footer flex-between-center">
              <View className="fixed-footer-btn" onClick={handleBind}>
                确认绑定
              </View>
            </View>
          </View>
        ) : (
          <View>
            <EmptyFigure label={'链接已失效'} />
            <View
              className={styles.backHomeBtn}
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/home/home',
                })
              }}
            >
              返回到主页
            </View>
          </View>
        )}
      </View>
    )
  })
}

export default ExchangeDetail
