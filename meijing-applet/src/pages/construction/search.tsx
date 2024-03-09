import Taro, {Component, Config} from '@tarojs/taro';
import {ScrollView,View} from '@tarojs/components';
import SearchBox from '@common/components/SearchBox'
import ListView from "./components/listView";
import './list.scss';

interface SearchProps {
}

interface SearchState {
  queryContent:string;
  data:any;
}

class Search extends Component<SearchProps, SearchState> {
  config: Config = {
    navigationBarTitleText: '绿色工地审核-搜索'
  };

  constructor() {
    super(...arguments);
    this.state = {
      queryContent:'',
      data:[],
    };
  }

  onInputChange = (value) => {
    console.log('key=>',value)
    this.setState({
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
    })
  }

  render() {
    const {queryContent,data} = this.state;
    return (
      <View>
        <SearchBox
          value={queryContent}
          placeholder='搜索申请工地名称'
          onInput={this.onInputChange.bind(this)}
        />
          <ScrollView
            className='content'
            style={{backgroundColor:'#fff'}}
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

export default Search;
