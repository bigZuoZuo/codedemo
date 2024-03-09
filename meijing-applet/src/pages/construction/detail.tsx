import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image,  Label} from '@tarojs/components'
import {rootConstructionSourceBaseUrl} from '@common/utils/requests'
import './detail.scss'

const topBgUrl = `${rootConstructionSourceBaseUrl}/assets/pages/work/top-bg.png`
const successIcon = `${rootConstructionSourceBaseUrl}/assets/pages/work/success.png`
const warningIcon = `${rootConstructionSourceBaseUrl}/assets/pages/work/warning.png`
const orangeIcon = `${rootConstructionSourceBaseUrl}/assets/pages/work/icon-orange.png`


interface DetailProps {

}

interface DetailState {
  awaitingModeration: any // 待审核
  success: any            // 审核通过
  refuse: any             // 审核不通过
  current: number         // 当前选中标签
}

class Detail extends Component<DetailProps, DetailState> {

  constructor(props) {
    super(props)
    this.state = {
      awaitingModeration: [],
      success: [],
      refuse: [],
      current: 0,
    }
  }

  config = {
    navigationBarTitleText: '巡查记录'
  };

  componentDidMount() {
    // this.getInitData()
  }

  getInitData = async () => {

  }


  showBigImage(urls: string[]) {
    Taro.previewImage({
      urls: urls
    })
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

  render() {
    const {current} = this.state;
    return (
      <View className='page'>
        <View className='title'>
          <View>
            <Image src={topBgUrl} className='topImg' />
          </View>
          <View className='txt'>
            <View className='headerWarp'>
              <Text className='header'>联发合纵二期工地</Text>
              {/*<Text className='flag'>待审核</Text>*/}
              {/*<Text className='failure'>待审核</Text>*/}
              {/*<Text className='success'>通过</Text>*/}
            </View>
            <View className='titleList'>
              {/*<Label>工地类型：</Label>*/}
              <Text>建筑工地1</Text>
            </View>
            <View className='titleList'>
              <View className='flex1'>
                <Label>巡查人：</Label>
                <Text>赵泉泉</Text>
              </View>
              <View>
                <Label>巡查时间：</Label>
                <Text>2021-02-12 11:34</Text>
              </View>
            </View>
          </View>
        </View>
        <View className='tabs'>
          <View className='item' onClick={()=>{this.handleClick(0)}}>
            <Text className={current===0 ? 'itemName choose' :'itemName'}>巡查检查项</Text>
          </View>
          <View className='item' onClick={()=>{this.handleClick(1)}}>
            <Text className={current===1 ? 'itemName choose' :'itemName'}>发现的问题(2)</Text>
          </View>
        </View>
        <View   className={current===0 ? 'content show' :'content'}>
          <View className='listWarp'>
            <View className='header'>
              <Image src={successIcon}  className='iconSuccess' />
              <Text>
                工地、堆场、矿山出
              </Text>
            </View>
            <View className='imgList'>
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
            </View>
            <View className='description'>
              描述：请相关部门进行监督整改的进度
            </View>
          </View>
          <View className='listWarp'>
            <View className='header'>
              <Image src={successIcon}  className='iconSuccess' />
              <Text>
                工地、堆场、矿山出入口及场内主要道路全部硬化。
              </Text>
            </View>
            <View className='imgList'>
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
            </View>
            <View className='description'>
              描述：请相关部门进行监督整改的进度
            </View>
          </View>
          <View className='listWarp'>
            <View className='header'>
              <Image src={successIcon}  className='iconSuccess' />
              <Text>
                工地、堆场、W
              </Text>
            </View>
            <View className='imgList'>
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
            </View>
            <View className='description'>
              描述：请相关部门进行监督整改的进度
            </View>
          </View>
        </View>
        <View className={current===1 ? 'content show' :'content'}>
          <View className='listWarp'>
            <View className='header'>
              <Image src={successIcon}  className='iconSuccess' />
              <Text>
                工地、堆场、矿山出
              </Text>
            </View>
            <View className='imgList'>
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
            </View>
            <View className='description'>
              描述：请相关部门进行监督整改的进度
            </View>
          </View>
          <View className='listWarp'>
            <View className='header'>
              <Image src={successIcon}  className='iconSuccess' />
              <Text>
                工地、堆场、矿山出
              </Text>
            </View>
            <View className='imgList'>
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
              <Image
                src={topBgUrl}
                className='img'
                onClick={()=>{this.showBigImage([topBgUrl])}}
              />
            </View>
            <View className='description'>
              描述：请相关部门进行监督整改的进度
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Detail
