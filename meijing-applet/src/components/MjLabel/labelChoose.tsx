import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import cn from 'classnames'
import './index.scss'
import _ from 'lodash'

interface MjLabelProps {
    data: any;
    onChoose?: () => void;
}

interface MjLabelState {
    isActive: boolean;
}

export default class MjLabel extends Component<MjLabelProps, MjLabelState> {
    constructor(props) {
        super(props)
        this.state = {
            isActive: false
        }
    }

    onCheck = () => {
        this.setState({
            isActive: true
        }, () => {
            Taro.setStorageSync('pollutionType', this.props.data)
            Taro.navigateBack()
        })
    }

    render() {
        const { data } = this.props
        const { isActive } = this.state
        return (
            <View className={cn('mj-label-choose', { 'mj-label-choose__active': isActive })} onClick={this.onCheck}>
                {data.name}
            </View>
        )
    }
}