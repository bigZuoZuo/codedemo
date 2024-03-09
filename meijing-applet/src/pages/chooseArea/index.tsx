import Taro, {Component, Config} from '@tarojs/taro';
import {rootSourceBaseUrl} from '@common/utils/requests';
import {View, Image, Text, Picker, ScrollView} from '@tarojs/components';
import isEmpty from 'lodash/isEmpty'
import './index.scss';
import { getAreaTree } from '../../service/pollutionType'

interface ChooseAreaProps {
}

interface ChooseAreaState {
  root: any,
  area: any,
  first: any,
  second: any,
  // third: any,
  parentName: string,
  parentCode: string,
  firstNum: number,
}

//切换行政区划
const changeDivision = rootSourceBaseUrl + '/assets/user_join/change_division.png';


class ChooseArea extends Component<ChooseAreaProps, ChooseAreaState> {
  config: Config = {
    navigationBarTitleText: '选择区域'
  };

  constructor() {
    super(...arguments);
    this.state = {
      root:[],
      area: [],
      first:[],
      second:[],
      parentName: '',
      parentCode: '',
      firstNum: 0,
    };
  }

  componentWillMount() {
    getAreaTree().then((res:any)=>{
      if(res&&res.data){
        const root = res.data[0];
        console.log(root)
        this.setState({
          first:root,
          second:root.children[0],
          root,
          area:root.children,
          parentName: root.name,
          parentCode: root.code
        })
      }
    })
  }

  change = (item:any,type:string) => {
    const value = item.detail.value;
    const {root} = this.state;
    if(type==='first'){
      const children = root.children;
      if(children[value]){
        this.setState({
          second:children[value],
          parentName:children[value].name,
          parentCode: children[value].code,
          area:children[value].children,
          firstNum:value,
        })
      }
    }
    if(type==='second'){
      const {firstNum} = this.state;
      const children = root.children[firstNum].children;
      if(children[value]){
        this.setState({
          second:children[value],
          parentName:children[value].name,
          parentCode: children[value].code,
          area:children[value].children,
        })
      }
    }
  }


  goBack = (nowChoose: any) => {
    let pages = Taro.getCurrentPages();
    //上一页面
    let prevPage = pages[pages.length - 2];
    prevPage.setData({chooseArea:nowChoose});
    Taro.navigateBack();
  }
  goRoot = ()=>{
    const {root} = this.state;
    this.setState({
      area:root.children,
      parentName: root.name,
      parentCode: root.code,
    })
  }

  render() {
    const {area, parentName,first,second,parentCode} = this.state;
    console.log(parentCode,parentName)
    return (
      <View className='root_view'>
        <View className='selected_division'>
          <View className='city_select' onClick={()=>{this.goRoot()}}>
            <View className='picker'>
              <Text className='city'>{first.name}</Text>
            </View>
          </View>
          {!isEmpty(first) &&
          <View className='city_select'>
            <Picker
              range={first.children}
              onChange={(item)=>{this.change(item,'first')}}
              value={[0, 0]}
              rangeKey='name'
            >
              <View className='picker'>
                <Text className='city'>{first.name===parentName?'请选择':parentName}</Text>
                <Image src={changeDivision} className='icon'></Image>
              </View>
            </Picker>
          </View>
          }
        </View>
        <View className='tip'>
          <Text className='content'>下级区域</Text>
        </View>
        <View className='division_result'>
          <ScrollView className='scrollview' scrollY scrollWithAnimation>
            <View
              className='division_item'
              onClick={() => {
                this.goBack({name: parentName, code: parentCode})
              }}
            >
              <View className='division_name'>{parentName}</View>
            </View>
            {
              area.map((item: any) => {
                return (
                  <View
                    key={item.code}
                    className='division_item'
                    onClick={() => {
                      this.goBack({name: item.name, code: item.code})
                    }}
                  >
                    <View className='division_name'>{item.name}</View>
                    <View className='address_name'>{parentName}</View>
                  </View>
                )
              })
            }

          </ScrollView>
        </View>
      </View>
    );
  }
}

export default ChooseArea;
