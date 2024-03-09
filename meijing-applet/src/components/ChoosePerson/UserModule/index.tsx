import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { rootSourceBaseUrl, getUserAvatarUrl } from '@common/utils/requests'

import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import './index.scss'

//图标引用
const checkedImage = `${rootSourceBaseUrl}/assets/common/radio/checked.png`;
const uncheckedImage = `${rootSourceBaseUrl}/assets/common/radio/unchecked.png`;

interface UserModuleProps {
    data: any,
    onCheck: (item: any) => void,
    isChoose: boolean,
    onDetail?: (item: any) => void,
    nowCheckId?: any,
}

interface UserModuleState {

}

export default class UserModule extends Component<UserModuleProps, UserModuleState> {
    constructor(props) {
        super(props)
    }

    onCheckHandle = (item) => {
        const { data } = this.props;
        !data.checked && this.props.onCheck(item);
    }

    static defaultProps = {
        isChoose: true
    }

    onUser = (user) => {
        const { onDetail } = this.props
        onDetail && onDetail(user)
    }

    render() {
        const { data, isChoose } = this.props;
        if (isEmpty(data)) {
            return;
        }
        return (
            <View className={cn('module__person', { 'module__person--hide': data.users.filter(child => child.type == 4).length == 0 })}>
                <View className='module__body'>
                    {
                        data.users.filter(child => child.type == 4).map(item => (
                            <View key={item.id} className={cn('module__item', { 'module__item--disabled': data.checked })} >
                                {isChoose && <Image className='img' onClick={this.onCheckHandle.bind(this, item)} src={item.checked ? checkedImage : uncheckedImage} />}
                                <View  onClick={this.onUser.bind(this, item)}>
                                  <Image className='user_img' src={`${getUserAvatarUrl(item.id)}`} />
                                  <Text className='user_txt'>{item.name}</Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }
}
