import Taro, {Component, Config} from '@tarojs/taro';
import {View, Text, Button, Image} from '@tarojs/components'
import {rootConstructionSourceBaseUrl} from '@common/utils/requests'
import EmptyHolder from '@common/components/EmptyHolder/index'
import TopBar from '@common/components/TopBar'
import isEmpty from 'lodash/isEmpty';
import './greenConstruction.scss'

const arrow = `${rootConstructionSourceBaseUrl}/assets/pages/work/arrow_right.png`
const arrow_y = `${rootConstructionSourceBaseUrl}/assets/pages/work/arrow_y.png`
const arrow_n = `${rootConstructionSourceBaseUrl}/assets/pages/work/arrow_n.png`
const updated = `${rootConstructionSourceBaseUrl}/assets/pages/work/updated.png`
const no_update = `${rootConstructionSourceBaseUrl}/assets/pages/work/no_update.png`

interface MyProps {
}

interface MyState {
  checked: any,
  unChecked: any,
  siteName: string,
  progressStatus: string,
  currentWorkStatus: string,
  submitButtonLoading: boolean,
}

class GreenConstruction extends Component<MyProps, MyState> {
  config: Config = {
    navigationBarTitleText: '绿色工地审核',
    navigationBarBackgroundColor: '#25AC4F',
    navigationBarTextStyle: 'white',
    backgroundColor: '#25AC4F',
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
  }

  constructor(props) {
    super(props)
    this.state = {
      // 已检查的数据
      checked: [
        {labelName: '工现场、堆场全部封闭围挡'},
        {labelName: '工现场、堆场全部封闭围挡'},
        {labelName: '工现场、堆场全部封闭围挡'},
      ],
      // 未检查的数据
      unChecked: [
        {labelName: '工现场、堆场全部封闭围挡'},
        {labelName: '工现场、堆场全部封闭围挡'},
        {labelName: '工现场、堆场全部封闭围挡'},
      ],
      siteName: '联发合纵二期工地', // 工地名称
      progressStatus: '在产',    // 工地进度状态
      currentWorkStatus: '施工', // 当前工作状态
      submitButtonLoading: false
    }
  }

  componentDidMount() {

  }


  // 详细
  onNaviToDetails() {

  }

  // 返回上一级的页面，自定义
  onBackHandle = () => {
    Taro.navigateBack()
  }

  // 跳转到已上传的详细页面
  onNaviToUpdatedDetails() {

  }

  onSubmit = () => {

  }

  render() {

    const {
      checked,
      unChecked,
      siteName,
      progressStatus,
      currentWorkStatus,
      submitButtonLoading,
    } = this.state

    return (
      <View className='report'>

        <TopBar fixed={false} title='绿色工地审核' onBack={this.onBackHandle} background='#25ac4f' color='#fff' />

        <View className='input_header'>
          <View className='input_box'>
            <View className='flex_row select'>
              <Text className='txt2'>工地名称</Text>
              <View className='flex_row'>
                <Text className='txt3'>{siteName ? siteName : ''}</Text>
              </View>
            </View>

            <View className='flex_row select'>
              <Text className='txt2'> 工地进度状态</Text>
              <View className='flex_row'>
                <Text className='txt3'>{progressStatus ? progressStatus : ''}</Text>
              </View>
            </View>

            <View className='flex_row select'>
              <Text className='txt2'> 当前工作状态</Text>
              <View className='flex_row'>
                <Text className='txt3'>{currentWorkStatus ? currentWorkStatus : ''}</Text>
              </View>
            </View>

          </View>
        </View>
        <View className='content'>
          <View className='flex_row update_title'>
            <Image className='img3' src={no_update} />
            <Text className='txt4'>未检查</Text>
          </View>
          {!isEmpty(unChecked) &&
          <View>
            {
              unChecked.map((item, index) => {
                return (
                  <View
                    className='flex_row update_info'
                    key={index}
                    onClick={this.onNaviToDetails.bind(this, item)}
                  >
                    <Image className='img4' src={arrow_n}></Image>
                    <View className='update_content'>
                      <Text className='txt6'>{item.labelName}</Text>
                    </View>
                    <Image src={arrow} className='img2'></Image>
                  </View>
                )
              })
            }
          </View>
          }
          <View className='flex_row update_title'>
            <Image className='img3' src={updated} />
            <Text className='txt5'>已检查</Text>
          </View>

          <View>
            {
              checked.map((item, index) => {
                return (
                  <View
                    className='flex_row update_info' key={index}
                    onClick={() => {
                      this.onNaviToUpdatedDetails.bind(item)
                    }}
                  >
                    <Image className='img4' src={arrow_y} />
                    <View className='update_content'>
                      <Text className='txt6'>{item.labelName}</Text>
                    </View>
                    <Image src={arrow} className='img2' />
                  </View>)
              })
            }
          </View>
        </View>

        <View className='commit_bottom'>
          <Button
            className='submit_button'
            onClick={this.onSubmit}
            disabled={submitButtonLoading}
            loading={submitButtonLoading}
          >
            确认提交
          </Button>
        </View>
      </View>
    );
  }
}

export default GreenConstruction
