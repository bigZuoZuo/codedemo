import {Block, View, Text} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {useEffect, useState} from 'react'
import classnames from 'classnames'

import './navigation-bar.scss'
// import {os} from '@/utils/util'

interface NavigationBarProps {
  back?: boolean
  title?: string
  loading?: boolean
  isNoHome?: boolean
  color?: string
  background?: string
  displayStyle?: string
  extClass?: string
  slotLeft?: React.ReactNode
  slotCenter?: React.ReactNode
  slotRight?: React.ReactNode

  onBack?: () => void
}

function NavigationBar(props: NavigationBarProps) {
  const [data, setData] = useState({
    ios: true,
    statusBarHeight: 0,
    innerWidth: '',
    innerPaddingRight: '',
    leftWidth: '',
  })

  useEffect(() => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      const isSupport = !!Taro.getMenuButtonBoundingClientRect
      const rect = Taro.getMenuButtonBoundingClientRect ? Taro.getMenuButtonBoundingClientRect() : null
      Taro.getSystemInfo({
        success: (res) => {
          const ios = !!(res.system.toLowerCase().search('ios') + 1)
          setData({
            ios,
            statusBarHeight: res.statusBarHeight ?? 0,
            innerWidth: isSupport ? `width:${rect!.left}px` : '',
            innerPaddingRight: isSupport ? `padding-right:${res.windowWidth - rect!.left}px` : '',
            leftWidth: isSupport ? `width:${res.windowWidth - rect!.left}px` : '',
          })
        },
      }).catch(() => {})
    }
  }, [])

  useEffect(() => {
    // if (os.isWechatWeb) {
    document.title = props.title ?? ''
    // }
  }, [props.title])

  const nextPage = Taro.getCurrentPages()
  const handleBack = () => {
    try {
      if (props.onBack) {
        props.onBack?.()
      } else if (nextPage.length > 1) {
        Taro.navigateBack()
      } else {
        Taro.reLaunch({url: '/pages/home/home'})
      }
    } catch (err) {
      Taro.reLaunch({url: '/pages/home/home'})
    }
  }

  return (
    // <View className="navigation-bar-container" wx-if={!os.isWechatWeb}>
    <View className="navigation-bar-container">
      <View className={classnames('weui-navigation-bar', props.extClass)}>
        <View
          className={`weui-navigation-bar__placeholder ${data.ios ? 'ios' : 'android'}`}
          style={`padding-top: ${data.statusBarHeight}px;visibility: hidden;`}
        />
        <View
          className={`weui-navigation-bar__inner ${data.ios ? 'ios' : 'android'}`}
          style={`padding-top: ${data.statusBarHeight}px; color: ${props.color};background: ${props.background};${props.displayStyle};${data.innerPaddingRight};${data.innerWidth};`}
        >
          <View className="weui-navigation-bar__left" style={data.leftWidth}>
            <Block wx-if={props.back && !props.slotLeft}>
              <View className="weui-navigation-bar__buttons">
                <View
                  onClick={() => handleBack()}
                  className="weui-navigation-bar__btn_goback_wrapper"
                  hover-className="weui-active"
                  aria-role="button"
                  aria-label="返回"
                >
                  <View className="weui-navigation-bar__button weui-navigation-bar__btn_goback go-back-arrow" />
                </View>
              </View>
            </Block>
            <Block wx-if={props.back && !props.slotLeft && !props.isNoHome}>
              <View className="weui-navigation-bar__buttons">
                <View className="left-line"></View>
              </View>
            </Block>
            <Block wx-if={props.back && !props.slotLeft && !props.isNoHome}>
              <View className="weui-navigation-bar__buttons">
                <View
                  onClick={() => Taro.reLaunch({url: '/pages/home/home'})}
                  className="weui-navigation-bar__btn_goback_wrapper"
                  hover-className="weui-active"
                  aria-role="button"
                  aria-label="主页"
                >
                  <View className="at-icon at-icon-home"></View>
                </View>
              </View>
            </Block>
            <Block wx-if={props.slotLeft}>{props.slotLeft}</Block>
          </View>
          <View className="weui-navigation-bar__center">
            <View wx-if={props.loading} className="weui-navigation-bar__loading" aria-role="alert">
              <View className="weui-loading" aria-role="img" aria-label="加载中" />
            </View>
            <Block wx-if={props.title}>
              <Text className="weui-navigation-bar__title">{props.title}</Text>
            </Block>
            <Block wx-if={!props.title && props.slotCenter}>{props.slotCenter}</Block>
          </View>
          <View className="weui-navigation-bar__right">{props.slotRight}</View>
        </View>
      </View>
    </View>
  )
}

export default NavigationBar
