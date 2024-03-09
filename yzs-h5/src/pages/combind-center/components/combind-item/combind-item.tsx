import {useEffect, useState} from 'react'
import {View, Image, Text} from '@tarojs/components'
import Taro, {FC} from '@tarojs/taro'
import classNames from 'classnames'
import dayjs from 'dayjs'

import iconGray from '@/assets/marketing/time.png'

import styles from './combind-item.module.scss'

export type Combind = {
  images: string[]
  introduction: string
  name: string
  state: 'onsale' | 'offsale'
  title: string
  id: string
  issuer_name: string
  start_time: string
  end_time: string
}

export type CombindItemProps = {
  item: Combind
  currentTime: number
}

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const CombindItem: FC<CombindItemProps> = ({currentTime, item}) => {
  const handleDetail = () => {
    if (+dayjs(item.end_time) < currentTime) {
      Taro.showToast({icon: 'none', title: '活动已结束'})
      return
    }
    if (+dayjs(item.start_time) > currentTime) {
      Taro.showToast({icon: 'none', title: '活动未开始'})
      return
    }
    Taro.navigateTo({url: '/pages/combind-detail/index?id=' + item.id})
  }
  const [start, setStart] = useState(+dayjs(item.start_time) - currentTime)
  const [end, setEnd] = useState(+dayjs(item.end_time) - currentTime)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const countdown = () => {
      setStart((v) => v - 1000)
      setEnd((v) => v - 1000)
      setTimeout(countdown, 1000)
    }
    countdown()
    return () => clearTimeout(timeout)
  }, [])
  const isStart = dayjs(item.start_time).isBefore(dayjs())
  const remain = isStart ? end : start

  const dd = Math.floor(remain / DAY)
  const hh = Math.floor((remain - DAY * dd) / HOUR)
  const mm = Math.floor((remain - DAY * dd - hh * HOUR) / MINUTE)
  const ss = Math.floor((remain - DAY * dd - hh * HOUR - mm * MINUTE) / SECOND)

  const pad = (v: number) => {
    return v.toString().padStart(2, '0')
  }

  return (
    <View className={styles.item} onClick={handleDetail}>
      <View className={classNames([styles.header, {[styles.gray]: end < 0}])}>
        <Image mode="aspectFit" src={end > 0 ? iconGray : iconGray} className={styles.icon} />
        {end > 0 ? (
          <View className={styles.time}>
            <Text>
              {isStart ? '距结束' : '距开始'}&emsp;
              <Text className={styles.textSmall}>
                {pad(dd)}&nbsp;天&nbsp;&nbsp;{pad(hh)}&nbsp;:&nbsp;{pad(mm)}&nbsp;:&nbsp;{pad(ss)}
              </Text>
            </Text>
            {/* <Text className={styles.span}>

              <Text className={styles.textSmall}>天</Text>
            </Text>
            <Text className={styles.span}>{pad(hh)}</Text>:<Text className={styles.span}>{pad(mm)}</Text>:
            <Text className={styles.span}>{pad(ss)}</Text> */}
          </View>
        ) : (
          '已结束'
        )}
      </View>
      <View className={styles.imageWrapper}>
        <Image mode="aspectFill" src={item?.images?.[0] || ''} className={styles.image} />
      </View>
      <View className={styles.name}>{item?.name}</View>
      <View className={styles.nameSmall}>{item?.issuer_name}</View>
    </View>
  )
}

export default CombindItem
