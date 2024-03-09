import {useCallback} from 'react'
import {View, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'
import cx from 'classnames'
import dayjs from 'dayjs'

import {Swiper, SwiperSlide} from 'swiper/react/swiper-react.js'
import {Autoplay} from 'swiper'

import 'swiper/swiper.scss' // core Swiper

import {BannerType, IBanner} from '@/typings'
import {api} from '@/api'

export const BannerSwiperBox = ({banner}) => {
  let len = banner.length
  if (len === 0) {
    return <View className={cx('swiper-box', 'empty')}></View>
  }
  return (
    <View className={cx('swiper-box', 'no-shadow')}>
      <View className="project-swiper-box">
        <Swiper
          slidesPerView={'auto'}
          spaceBetween={20}
          centeredSlides={true}
          loop={len >= 2}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={false}
          className="swiper"
          modules={[Autoplay]}
        >
          {banner.map((child, idx) => (
            <SwiperSlide className="project-swiper-item" key={idx}>
              {BannerBoxItem(child, len)}
            </SwiperSlide>
          ))}
        </Swiper>
      </View>
    </View>
  )
}

const BannerBoxItem = (banner: IBanner, len) => {
  const handleClick = useCallback(async () => {
    let urlPrefix = ''
    switch (banner.link_type) {
      case BannerType.blindboxlink:
        urlPrefix = '/pages/blind-box-detail/blind-box-detail?id='
        break
      case BannerType.innerlink:
        urlPrefix = '/pages/activity/activity?id='
        break
      case BannerType.outlink:
        urlPrefix = '/pages/web-viewer/web-viewer?link=' + (/http/.test(banner.link) ? '' : 'https://')
        break
      case BannerType.nftlink:
        urlPrefix = '/pages/official-goods-detail/official-goods-detail?id='
        break
      case BannerType.news:
        urlPrefix = '/pages/article/article?news='
        break
    }
    if (banner.link_type === BannerType.syntheticlink) {
      const result: any = await api.synthesis.synthesisDetail(banner.link)
      if (result?.data?.data.state == 'onsale') {
        const time: any = await api.synthesis.syncTime()
        const currentTime = +dayjs(time?.data?.data)
        if (+dayjs(result?.data?.data.start_time) > currentTime) {
          Taro.showToast({icon: 'none', title: '活动未开始'})
          return
        }
        if (+dayjs(result?.data?.data.end_time) < currentTime) {
          Taro.showToast({icon: 'none', title: '活动已结束'})
          return
        }
      } else {
        Taro.showToast({icon: 'none', title: '活动已结束'})
        return
      }
    }

    if (banner.link_type === 'outlink') {
      window.location.href = (/http/.test(banner.link) ? '' : 'https://') + banner.link
      return
    }
    Taro.navigateTo({
      url: urlPrefix + banner.link,
    })
  }, [banner])

  return (
    <View onClick={handleClick} className={`project-box-item width-${len}`}>
      <Image className="pic" mode="aspectFill" src={banner.image} />
    </View>
  )
}
