import { api } from '@/api'
import { useStore } from '@/store'
import { formatDate } from '@/utils/formatTime'
import { Image, Navigator, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRouter } from '@tarojs/taro'
import classNames from 'classnames'
import { useEffect, useMemo } from 'react'
import { ImagePreview, Swiper } from 'react-vant'
import { useShare } from '../../store'
// import { useEffect } from "react";
import styles from './index.module.scss'



function Detail() {


  const { id, discoverType } = useRouter().params

  const { state, dispatch } = useShare()

  const store = useStore()

  useEffect(() => {
    // querySale
    const queryAPi = discoverType === "sale" ?  api.flow.querySale : api.share.queryShareDetail
    queryAPi(id!).then((res: any) => {
      if (res?.data?.code === 200) {
        dispatch({ type: "discoverDetail", payload: res.data.data })
      }
    })
  }, [])


  const node = useMemo(() => {

    const infoNode = <>
      <Text className={styles.title}>{state?.detail?.title}</Text>
      <Text className={styles.content}>{state?.detail?.content}</Text>
    </>

    const linkNode = <Navigator
      className={styles.officialLink}
      url={`/pages/official-goods-detail/official-goods-detail?id=${state?.detail?.nft_id}`}
    >
      官方链接
    </Navigator>


    if (discoverType === "sale" && state?.detail?.images?.length) {

      return <>

        <Swiper
          className={styles.swiper_box}
          // loop
          indicator={(total, current) => (
            <div className={styles.swiper_indicator}>
              {current + 1}/{total}
            </div>
          )}
        >
          {
            state.detail.images.map((src, index) => (
              <Swiper.Item key={index} >
                <Image 
                  src={src} 
                  className={styles.swiper_item}
                  onClick={()=>ImagePreview.open({images:state.detail.images,startPosition:index})}
                  />
              </Swiper.Item>
            ))
          }
        </Swiper>
        {infoNode}
        <View className={styles.sale_price} >
          <Text>¥ {state.detail.price}</Text>
          {linkNode}
        </View>
      </>

    } else {

      return <>

        <View className={styles.imgs}>
          {state?.detail?.images?.map((src, index) => (
            <Image
              key={index}
              className={classNames(styles.postsImg, { [styles.postsImg4]: state?.detail?.images.length >= 4 })}
              src={src}
              onClick={()=>ImagePreview.open({images:state.detail.images,startPosition:index})}
            />
          ))}
          {state?.detail?.images?.length === 2 ? <View className={styles.postsImg} /> : null}
        </View>
        {linkNode}
        {infoNode}

      </>
    }

  }, [state])

  const login = () => {
    const currentPage = '/pages/discover-detail/index' + location.search
    Taro.navigateTo({ url: '/pages/login/login?to=' + encodeURIComponent(currentPage) })
  }

  const jumpUser = () => {
    if (!store.state.logined) {
      login()
      return
    }
    Taro.navigateTo({
      url: `/pages/user-page/index?userId=${state?.detail?.user_id}`
    })
  }


  return (
    <View className={classNames(styles.detail, { [styles.sale_detail]: discoverType === "sale" })}>
      <View className={styles.userInfo}>
        <Image className={styles.userAvatar} src={state?.detail?.avatar} onClick={jumpUser} />
        <View className={styles.userTip}>
          <Text>{state?.detail?.nick_name}</Text>
          <Text>{formatDate(state?.detail?.created_at)} </Text>
        </View>
      </View>
      {node}
    </View>
  )
}

export default Detail
