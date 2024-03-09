import {View} from '@tarojs/components'
import {PropsWithChildren} from 'react'

import '@tarojs/taro/html.css'
import Taro from '@tarojs/taro'

import './render-html.scss'

// @ts-ignore
Taro.options.html.transformElement = (el) => {
  if (el.nodeName === 'image') {
    el.setAttribute('mode', 'widthFix')
  }
  return el
}

function RenderHtml(props: PropsWithChildren<{}>) {
  return <View className="rich-text-container" dangerouslySetInnerHTML={{__html: `<div>${props.children}</div>`}} />
}

export default RenderHtml
