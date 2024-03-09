import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Button, Block } from '@tarojs/components'
import DepartmentSelect  from '../../components/DepartmentSelect/index'
import { UserStore } from '@common/store/user'
import './index.scss'
import { inject, observer } from '@tarojs/mobx';
import { navBackWithData } from '@common/utils/common';

interface MyProps{
    userStore: UserStore
}

interface MyState{
    divisionCode: string;
    dataCode: string;
    type:string;
}

@inject('userStore')
@observer
class Index extends Component<MyProps, MyState>{
    config: Config = {
        navigationBarTitleText: '部门选择',
    }

    constructor(props){
        super(props);
        this.state = {
            divisionCode: '',
            dataCode: 'departmentChoosedData',
            type:''
        }
    }

    componentWillMount() {
        let { dataCode, divisionCode,type } = this.$router.params;

        if(!divisionCode || divisionCode == ''){
            divisionCode = this.props.userStore.userDetails.divisionCode;
        }

        if(dataCode && dataCode != '') {
            this.setState({
                dataCode,
                divisionCode
            });
        }
        if(type){
          this.setState({
            type,
          });
        }
    }

    onOkHandle = (selected: any) => {
        const { dataCode } = this.state;
        navBackWithData({
            [dataCode]: selected,
        });
    }

    render() {
        const {divisionCode,type} = this.state;

        return (
            <View>
                <DepartmentSelect
                    onOkHandle = {this.onOkHandle}
                    divisionCode = {divisionCode}
                    type={type}
                ></DepartmentSelect>
            </View>
        );
    }
}
export default Index
