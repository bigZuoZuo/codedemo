import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components'
import './index.scss'

interface GuideProps {
    
}

interface GuideState {
    
}


class Guide extends Component<GuideProps, GuideState> {

    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    render() {
        return (
            <View className='guide'>
            </View>
        );
    }
}
export default Guide