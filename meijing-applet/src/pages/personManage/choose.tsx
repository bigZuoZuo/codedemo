import Taro, {Component, Config} from '@tarojs/taro'
import ChoosePerson from '../../components/ChoosePerson';

interface MyProps {

}

interface MyState {
  departmentCode:string|number,
  nowCheckId:any,
  chooseType:string
}

export default class Index extends Component<MyProps, MyState> {
  config: Config = {
    navigationBarTitleText: '选择人员'
  }
  constructor(props) {
    super(props);
    const {departmentCode,checkId,chooseType} = this.$router.params;
    console.log('chooseType==>',chooseType)
    this.state = {
      departmentCode,
      nowCheckId:checkId,
      chooseType
    };
  }

  clickOnePerson = (user) => {
    Taro.navigateTo({
      url: `./edit?userId=${user.id}`
    })
  }

  render() {
    const {departmentCode,nowCheckId,chooseType} = this.state;
    return (
      <ChoosePerson
        config={[
          {
            type:4,
            single:true
          }
        ]}
        chooseType={chooseType}
        nowCheckId={nowCheckId}
        departmentCode={departmentCode}
        onDetail={this.clickOnePerson.bind(this)}
      />
    )
  }
}
