import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

interface MyProps {
    num:number,
    numTotal:number,
    title:string,
    bgColor:string
}

interface MyState {
    myStyle:number,
}

export default class Onebox extends Component<MyProps, MyState> {

    static defaultProps = {
        num:1,
        numTotal:10,
        title:'已签收',
        bgColor:'#1091FF'
    }

    state = {
        myStyle: Math.round(this.props.num / this.props.numTotal * 100)
    }

    render() {
        const {num , numTotal , title, bgColor} = this.props

        const aStyles = {
            width: this.state.myStyle + '%',
            backgroundColor:bgColor
        }

        return (
            <View className='onebox' >
                <View className='topShow'>
                    <Text>{title}</Text>
                    <Text>{num}/{numTotal}</Text>
                </View>
                <View className='components-page'>
                    <View className='a'></View>
                    <View className='b' style={ aStyles }></View>
                </View>
            </View>
        )
    }
}