import {View, Text} from '@tarojs/components'
import classNames from 'classnames'

import EmptyFigure from '../empty-figure/empty-figure'

import './list-state.scss'

interface Props {
  isEmpty?: boolean
  isOrder?: boolean
  hasNextPage?: boolean
  infiniteLoading?: boolean
  label?: string

  emptyLabel?: string
}

function ListState(props: Props) {
  return (
    <View className="list-stat-container">
      <View wx-if={!props.hasNextPage && !props.isEmpty} className="no-more-data">
        <Text className={classNames('no-more-data-tips', {'v2-no-more-data-tips': true})}>
          没有更多{props.label ?? '数据'}了~
        </Text>
        <View className="safe-bottom small"></View>
      </View>
      <View wx-if={props.isEmpty}>
        <EmptyFigure
          isOrder={props.isOrder}
          label={props.infiniteLoading ? '' : props.emptyLabel ? props.emptyLabel : `没有相关的${props.label ?? '数据'}`}
        />
      </View>
      <View className="weui-infinite-loading-wrap" aria-role="alert" wx-if={props.infiniteLoading}>
        <View className="weui-infinite-loading">
          <View className="weui-loading loading" aria-role="img" aria-label="加载中" />
          <Text className={classNames('loading-Text', {'v2-loading-Text': true})}>加载中</Text>
        </View>
        <View className="safe-bottom small"></View>
      </View>
    </View>
  )
}

export default ListState
