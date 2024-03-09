import Taro, {Component, Config} from '@tarojs/taro';
import {View, Image, Text, Picker, ScrollView} from '@tarojs/components';
import {rootSourceBaseUrl} from "@common/utils/requests";
import {AtIcon} from 'taro-ui'
import ListView from "./components/listView";
import './list.scss';


interface AuditListProps {
}

interface AuditListState {
  type: any;
  auditType: any;
  chooseType: any;
  chooseAuditType: any;
  data: any;
}

const searchImg = `${rootSourceBaseUrl}/assets/common/search.png`;


class AuditList extends Component<AuditListProps, AuditListState> {
  config: Config = {
    navigationBarTitleText: '绿色工地审核'
  };

  constructor() {
    super(...arguments);
    this.state = {
      type: [
        {name: '全部类型', id: '0'},
        {name: '选择项1', id: '1'},
        {name: '选择项2', id: '2'},
        {name: '选择项3', id: '3'},
      ],
      chooseType: {name: '查看全部', id: '0'},
      auditType: [
        {name: '查看全部', id: '0'},
        {name: '待审核', id: '1'},
        {name: '审核完成', id: '2'},
      ],
      chooseAuditType: {name: '全部类型', id: '0'},
      data:[
        {
          name:'联发合纵二期工地',
          type:'申请绿色工地',
          construction:'建筑工地',
          unit:'联发合纵投资有限公司',
          link:'赵泉泉（15698765467）',
          time:'2021-02-12 11:34',
          status:'待审核'
        },
        {
          name:'联发合纵二期工地',
          type:'申请绿色工地',
          construction:'建筑工地',
          unit:'联发合纵投资有限公司',
          link:'赵泉泉（15698765467）',
          time:'2021-02-12 11:34',
          status:'待审核'
        },
        {
          name:'联发合纵二期工地',
          type:'申请绿色工地',
          construction:'建筑工地',
          unit:'联发合纵投资有限公司',
          link:'赵泉泉（15698765467）',
          time:'2021-02-12 11:34',
          status:'通过'
        },
        {
          name:'联发合纵二期工地',
          type:'申请绿色工地',
          construction:'建筑工地',
          unit:'联发合纵投资有限公司',
          link:'赵泉泉（15698765467）',
          time:'2021-02-12 11:34',
          status:'不通过'
        }
      ]
    };
  }

  componentWillMount() {

  }

  changeType = (e: any) => {
    const {type} = this.state;
    const index = e.detail.value;
    this.setState({
      chooseType: type[index]
    })
  }

  changeAuditType = (e: any) => {
    const {auditType} = this.state;
    const index = e.detail.value;
    this.setState({
      chooseAuditType: auditType[index]
    })
  }
  toSearch = () => {
    Taro.navigateTo({
      url: './search'
    })
  }


  render() {
    const {type, auditType, chooseType, chooseAuditType,data} = this.state;
    return (
      <View>
          <View className='header'>
            <View className='headerChild'>
              <Picker
                mode='selector'
                className={chooseType.id === '0' ? 'select' : 'select choose'}
                value={0}
                range={type}
                range-key='name'
                onChange={(e) => {
                  this.changeType(e)
                }}
              >
                <Text>{chooseType.name}</Text>
                <AtIcon value='' className='up' />
              </Picker>
            </View>
            <View className='headerChild'>
              <Picker
                mode='selector'
                className={chooseAuditType.id === '0' ? 'select' : 'select choose'}
                value={0}
                range={auditType}
                range-key='name'
                onChange={(e) => {
                  this.changeAuditType(e)
                }}
              >
                <Text>{chooseAuditType.name}</Text>
                <AtIcon value='' className='up' />
              </Picker>
            </View>
            <View className='headerChild right'>
              <Image src={searchImg} className='search' onClick={() => {
                this.toSearch()
              }}
              />
            </View>
          </View>
        <ScrollView
          className='content'
          scrollY
        >
          <View className='contentBg'>
            <ListView data={data} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default AuditList;
