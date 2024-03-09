import {View, Image, Text} from '@tarojs/components'

import './empty-figure.scss'

import emptyFigure from '../../assets/icons/emptyY.png'
import successFigure from '../../assets/icons/successY.png'
// import orderFigure from '../../assets/order-figure.png'
// import v2EmptyFigure from '../../assets/v2/empty.png'
import ufoEmptyFigure from '../../assets/icons/ufo.png'
import classNames from 'classnames'

interface Props {
  label?: string
  type?: string
  v2?: boolean
  down?: boolean
  success?: boolean
  isOrder?: boolean
}

function EmptyFigure(props: Props) {
  return (
    <View className="empty-figure">
      <Image src={emptyFigure} wx-if={!props.down && !props.success} className="v2-figure" mode="aspectFit" />
      <Image src={ufoEmptyFigure} wx-if={props.down} className="down" mode="aspectFit" />
      {/* <Image src={successFigure} wx-if={props.success} className="v2-figure" mode="aspectFit" /> */}
      <View
        className="v2-figure"
        wx-if={props.success}
        style={{background: `url(${successFigure}) no-repeat center center`, backgroundSize: 'cover'}}
      ></View>
      {/* <Image src={v2EmptyFigure} wx-if={props.v2} className="v2-figure" mode="aspectFit" /> */}
      {/* <Image
        src={releaseListEmptyFigure}
        wx-if={!props.v2 && props.type === 'release-list'}
        className="figure"
        mode="aspectFit"
      /> */}
      {/* <Image src={orderFigure} wx-if={!props.v2 && props.type !== 'release-list'} className="figure" mode="aspectFit" /> */}
      <Text
        className={classNames('empty-tips', {
          'v2-empty-tips': props.v2,
          down: props.down,
        })}
      >
        {props.label}
      </Text>
    </View>
  )
}

export default EmptyFigure
