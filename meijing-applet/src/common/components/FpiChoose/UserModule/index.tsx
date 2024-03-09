import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'
import { rootSourceBaseUrl, getUserAvatarUrl } from '../../../utils/requests'

import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import './index.scss'

//图标引用
const checkedImage = `${rootSourceBaseUrl}/assets/common/radio/checked.png`;
const uncheckedImage = `${rootSourceBaseUrl}/assets/common/radio/unchecked.png`;
const flagLeader = `${rootSourceBaseUrl}/assets/common/icon_start.png`;
const flagLink = `${rootSourceBaseUrl}/assets/common/icon_link.png`;
const personLink = require('../../../assets/person.png');

interface UserModuleProps {
    data: any,
    onCheck: (item: any) => void,
    isSpace: boolean,
    isChoose: boolean,
    onDetail?: (item: any) => void,
}

interface UserModuleState {
    data: any,
}

export default class UserModule extends Component<UserModuleProps, UserModuleState> {
    constructor(props) {
        super(props)
        this.state = {
            data: props.data
        }
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

    imgOnerror = (id) => {
        const { data } = this.state
        data.users.filter(child => child.type == 4).map(item => {
            if (item.id === id) {
                item.personLink = personLink
            }
        });
        this.setState({
            data
        })
    }
    
    render() {
        const { isSpace, isChoose } = this.props;
        const { data } = this.state;
        if (isEmpty(data)) {
            return;
        }
        return (
            <View className={cn('module__person', { 'module__person--hide': data.users.filter(child => child.type == 4).length == 0 })}>
                <View className={cn('space', { 'space--hide': isSpace })}></View>
                <View className='module__body'>
                    {
                        data.users.filter(child => child.type == 4).map(item => (
                            <View key={item.id} className={cn('module__item', { 'module__item--disabled': data.checked })} onClick={this.onUser.bind(this, item)}>
                                {isChoose && <Image className='img' onClick={this.onCheckHandle.bind(this, item)} src={item.checked ? checkedImage : uncheckedImage} />}
                                <Image className='user_img' src={item.personLink || `${getUserAvatarUrl(item.id)}`} onError={this.imgOnerror.bind(this, item.id)}/>
                                <Text className='user_txt'>{item.name}</Text>
                                <View className='flag'>
                                    {item.managerFlag &&
                                        <View className='leader'>
                                        <Image className='flag_img' src={flagLeader}/>
                                        <Text>领导</Text>
                                        </View>
                                    }
                                    {item.linkmanFlag &&
                                        <View className='link'>
                                          <Image className='flag_img' src={flagLink} />
                                          <Text>联系人</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }
}
