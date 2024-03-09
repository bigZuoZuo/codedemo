import {View} from '@tarojs/components'
import {PropsWithChildren} from 'react'

import './render-html.scss'

function RenderHtml(props: PropsWithChildren<{}>) {
  return <View className="rich-text-container" dangerouslySetInnerHTML={{__html: `<div>${props.children}</div>`}} />
}

export default RenderHtml
