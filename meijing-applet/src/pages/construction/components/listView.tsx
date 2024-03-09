import Taro, {Component} from '@tarojs/taro';
import {Label, Text, View,} from '@tarojs/components';
import isArray from 'lodash/isArray'
import './listView.scss';

interface ListViewProps {
  data:any;
}

interface ListViewState {
}

class ListView extends Component<ListViewProps, ListViewState> {
  constructor() {
    super(...arguments);
  }

  toDetail = (item:any)=>{
    Taro.redirectTo({
      url: `/pages/construction/detail?id=${item.id}`
    })
  }

  render() {
    const {data} = this.props;
    return (
      <View className='listView' >
        {isArray(data) &&
          data.map((item,index)=>{
            let flag = 'flag';
            if(item.status === '通过'){
              flag = 'success'
            }
            else if(item.status === '不通过'){
              flag = 'failure'
            }
            return (
              <View className='listWarp' key={index} onClick={()=>{this.toDetail(item)}}>
                <View className='title'>
                  <Label className='label'>{item.name}</Label>
                  <Label className={flag}>{item.status}</Label>
                </View>
                <View className='list'>
                  <Label className='label'>申请类型：</Label>
                  <Text className='text'>{item.type}</Text>
                </View>
                <View className='list'>
                  <Label className='label'>工地类型：</Label>
                  <Text className='text'>{item.construction}</Text>
                </View>
                <View className='list'>
                  <Label className='label'>申报单位：</Label>
                  <Text className='text'>{item.unit}</Text>
                </View>
                <View className='list'>
                  <Label className='label'>联系人：</Label>
                  <Text className='text'>{item.link}</Text>
                </View>
                <View className='list'>
                  <Label className='label'>申请时间：</Label>
                  <Text className='text'>{item.time}</Text>
                </View>
              </View>
            )
          })
        }
      </View>
    );
  }
}

export default ListView;
