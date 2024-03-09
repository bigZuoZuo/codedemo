import {useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {CoverView, View, Image} from '@tarojs/components'
import './tabbar.scss'

const TabBar = ({index}) => {
  const [state, setState] = useState({
    color: '#999999',
    selectedColor: '#777eff',
    borderStyle: 'white',
    custom: true,
    selected: 0,
    list: [
      {
        iconPath: require('../../assets/icons/home.png'),
        selectedIconPath: require('../../assets/icons/home-select.png'),
        pagePath: '../../pages/home/home',
        text: '首页',
      },
      {
        iconPath: require('../../assets/icons/find.png'),
        selectedIconPath: require('../../assets/icons/find-select.png'),
        pagePath: '../../pages/discover/discover',
        text: '发现',
      },
      {
        iconPath: require('../../assets/icons/mine.png'),
        selectedIconPath: require('../../assets/icons/mine-select.png'),
        pagePath: '../../pages/personal/personal',
        text: '我的',
      },
    ],
  })

  useEffect(() => {
    setState({
      ...state,
      selected: index,
    })
  })

  const switchTab = (item) => {
    const url = item.pagePath
    Taro.switchTab({
      url,
    })
  }

  return (
    <CoverView className="tab-bar">
      <CoverView className="tab-bar-wrap">
        {state.list.map((item, index) => {
          return (
            <CoverView
              className="tab-bar-wrap-item"
              onClick={() => switchTab(item)}
              data-path={item.pagePath}
              key={index}
            >
              <Image
                className="tab-bar-wrap-item-icon"
                mode="aspectFill"
                src={state.selected === index ? item.selectedIconPath : item.iconPath}
              />
              {state.selected === index ? <View className="tab-bar-select"></View> : null}
            </CoverView>
          )
        })}
      </CoverView>
    </CoverView>
  )
}
export default TabBar
