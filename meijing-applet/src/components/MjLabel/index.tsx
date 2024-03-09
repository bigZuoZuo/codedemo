import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import cn from 'classnames'
import './index.scss'
import _ from 'lodash'

interface MjLabelProps {
    data: any;
    onChoose: () => void;
}

interface MjLabelState {

}

export default class MjLabel extends Component<MjLabelProps, MjLabelState> {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    onChooseHandle = () => {
        this.props.onChoose()
    }

    render() {
        const { data = '' } = this.props
        const hasData = !_.isEmpty(data)
        return (
            <View className='mj-label' onClick={this.onChooseHandle}>
                <View className={cn('container', { 'container__data': hasData })}>
                    <View className='pre-img'></View>
                    <View className='label-txt'>{hasData ? data : '添加标签'}</View>
                    <View className='end-img'></View>
                </View>
            </View>
        )
    }
}