import Taro, {Component, Config} from '@tarojs/taro';
import {View, Text, Input, Button} from '@tarojs/components'
import './otherPeople.scss'
import {navBackWithData} from "@common/utils/common";

interface AddState {
  data: any,
}
interface AddProps {
}

class OtherPeople extends Component<AddProps, AddState> {
  config: Config = {
    navigationBarTitleText: '添加其他负责人'
  }

  constructor(props) {
    super(props);
    console.log('props=>',props)
    this.state = {
      data: {
        name: '',
        duty: '',
        phoneNumber: '',
      }
    }
  }

  componentWillMount () {
    const { data } = this.$router.params
    if(data){
      this.setState({
        data:JSON.parse(data)
      })
    }
  }
  /**
   * 污染源上报
   */
  onSubmit = () => {
    if (!this.checkInput()) { return }
    const {data} = this.state;
    navBackWithData({
       otherPeople:data
    });
  }

  // 验证输入信息
  checkInput = () => {
    const { data } = this.state
    let result = true
    let message = ''
    if (!data.name) {
      message = '请填写姓名'
      result = false
    }
    else if (!data.duty) {
      message = '请填写岗位职责'
      result = false
    }
    else if (!data.phoneNumber) {
      message = '请填写手机号'
      result = false
    }
    else if( !( /^1[3456789]\d{9}$/.test(data.phoneNumber) ) ){
      message = '手机号码有误，请重填'
      result = false
    }
    if (!result) {
      Taro.showToast({
        title: message,
        icon: 'none'
      })
    }
    return result
  }

  onInputChange = (value, type) => {
    const {data} = this.state;
    this.setState({
      data: {
        ...data,
        [type]: value
      }
    })
  }

  render() {
    const {data} = this.state;
    return (
      <View className='addPage'>
        <View className='space'></View>
        <View className='content'>

          <View className='list'>
            <View className='left'>
              <Text className='title'>姓名</Text>
            </View>
            <View className='right'>
              <View className='container'>
                <Input
                  className='input'
                  placeholderClass='input__placeholder'
                  placeholder='请输入姓名'
                  value={data.name}
                  onInput={(e) => {
                    this.onInputChange(e.detail.value, 'name')
                  }}
                  maxLength={11}
                />
              </View>
            </View>
          </View>

          <View className='list'>
            <View className='left'>
              <Text className='title'>角色类型</Text>
            </View>
            <View className='right'>
              <View className='container'>
                <Input
                  value={data.duty}
                  className='input'
                  placeholderClass='input__placeholder'
                  placeholder='请输入角色类型'
                  onInput={(e) => {
                    this.onInputChange(e.detail.value, 'duty')
                  }}
                  maxLength={11}
                />
              </View>
            </View>
          </View>

          <View className='list'>
            <View className='left'>
              <Text className='title'>电话</Text>
            </View>
            <View className='right'>
              <View className='container'>
                <Input
                  value={data.phoneNumber}
                  className='input'
                  placeholderClass='input__placeholder'
                  placeholder='请输入电话'
                  maxLength={11}
                  onInput={(e) => {
                    this.onInputChange(e.detail.value, 'phoneNumber')
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        <View className='footer'>
          <Button className='btn save'  onClick={this.onSubmit}>保存</Button>
        </View>
      </View>
    );
  }
}

export default OtherPeople;
