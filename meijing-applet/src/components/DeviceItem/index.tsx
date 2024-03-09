import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Block } from '@tarojs/components'
import { rootConstructionSourceBaseUrl } from '@common/utils/requests'
import './index.scss'
import get from 'lodash/get'

const shaobin1 = `${rootConstructionSourceBaseUrl}/assets/pages/sentry/shaobin1.png`
const shaobin2 = `${rootConstructionSourceBaseUrl}/assets/pages/sentry/shaobin2.png`
const shaobin3 = `${rootConstructionSourceBaseUrl}/assets/pages/sentry/shaobin3.png`
const shaobin4 = `${rootConstructionSourceBaseUrl}/assets/pages/sentry/shaobin4.png`

interface DeviceItemProps {
    data: any
}

interface DeviceItemState {

}

export default class DeviceItem extends Component<DeviceItemProps, DeviceItemState> {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    getImage = (sentry, online) => {
        if (sentry && online) return shaobin2
        else if (sentry && !online) { return shaobin4 }
        else if (!sentry && online) { return shaobin1 }
        else return shaobin3
    }

    onDeviceClick = () => {
        const { data = {} } = this.props
        Taro.navigateTo({
            url: `/pages/video/video?siteCode=${data.siteCode}&siteName=${data.siteName}`
        })
    }

    render() {
        const { data = {} } = this.props
        return (
            <View className='device-item' onClick={this.onDeviceClick}>
                <View className='left'>
                    <Text className='txt'>{get(data, 'siteName')}</Text>
                </View>
                <View className='right'>
                    {get(data, 'videos', []).map(item => (
                        <Image className='img' src={this.getImage(item.isSentry, item.online)} />
                    ))}
                </View>
            </View>
        )
    }    

}