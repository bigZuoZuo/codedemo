import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input, ScrollView } from '@tarojs/components'
import { getPollutionSource } from '../../service/user'
import { getPollutionNodeById, getPollutionNodeByType, transformTreeDatas } from './utils'
import { rootSourceBaseUrl } from '@common/utils/requests'

import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import './index.scss'


//图标引用
const checkedImage = `${rootSourceBaseUrl}/assets/common/radio/checked.png`;
const uncheckedImage = `${rootSourceBaseUrl}/assets/common/radio/unchecked.png`;
const treeImage = `${rootSourceBaseUrl}/assets/common/icon-tree.png`;
const iconRight = `${rootSourceBaseUrl}/assets/common/icon-right.png`

interface FpiChoosePollutionProps {
    config: any,
    onOK: (checkedList: any) => void
}

interface FpiChoosePollutionState {
    data: any,
    navbars: any,
    canCheck: boolean,
    isChoose: boolean
}

const unitData = ['污染源', '下级区域'];

export default class FpiChoosePollution extends Component<FpiChoosePollutionProps, FpiChoosePollutionState> {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                type: 1,
                checked: false,
                sourceList:[],
                departmentList:[],
            },
            navbars: false,
            canCheck: true,
            isChoose: true
        }
    }

    static defaultProps = {
        config: []
    }

        // 初始化数据
        getInitData = async () => {
            try {
                const localPollution = await getPollutionSource();
                
                const { data } = localPollution;
                console.log('data',data);
                const departmentList = data.typeIndustrySourceList
                transformTreeDatas(departmentList)

                const sourceList = data.sourceList
                transformTreeDatas(sourceList)

                console.log(departmentList , sourceList);
                

                this.setState({
                    data: {
                        type: 1,
                        checked: false,
                        sourceList,
                        departmentList,
                    }
                })
            }
            catch (e) {
                console.log(e);
            }
        }

        componentWillMount(){
            this.getInitData()
        }

        onCheck=(item)=>{
            const {data} = this.state

        }

        onSubHandle = (item) => {  //当前部门的信息
            // !item.checked && this.props.onOK(item);
        }

        onCheckHandle = (item, e) => {  // 勾选与取消勾选
            e.stopPropagation()
            const {data} = this.state
            let newData = data;
            const newItem = getPollutionNodeById(item.id,data)
            console.log('newItem',newItem);
            
            // this.onCheck(item); 
            if (newItem) {
                if(!isEmpty(newItem.checked)) {
                    return newItem
                }else{
                    newItem.checked = !item.checked;
                    this.setState({
                        data: newData
                    })
                }
            }
        }

        getSumText=()=>{ // 污染源汇总
            const { data } = this.state;
            let departmentList = [];
            let devisionList = [];
            getPollutionNodeByType( data, departmentList);
            getPollutionNodeByType( data, devisionList);
            
            return `${devisionList.length}`
        }

        onOKhandle = () => {
            const { data } = this.state;
            let departmentList = [];
            let devisionList = [];
            getPollutionNodeByType( data, departmentList);
            getPollutionNodeByType( data, devisionList);

            let checkedList = {
                // @ts-ignore
                // departmentList: departmentList,
                // @ts-ignore
                departmentList: devisionList,

            };
            this.props.onOK(checkedList);
        }



    render() {
        const { data , navbars, canCheck , isChoose} = this.state;

      return (
            <View  className={cn('module__container', { 'module__container--hide': data.departmentList.filter(child => child.name).length == 0 })}>
                <Text className='module__title'>{unitData[0]}</Text>
                <View className='module__body'>
                    {
                        data.departmentList.map(item => (
                            <View key={item.id} className='module__item' onClick={this.onSubHandle.bind(this, item)}>
                                {item.name && <Image className={cn('img', { 'img--disabled': !item.code })} onClick={this.onCheckHandle.bind(this, item)} src={item.code ? checkedImage : uncheckedImage} />}
                                <Text className='txt'>{`${item.name}`}</Text>
                                <View className='sub'>
                                    {item.industrySourceList && (
                                        <View className={cn('sub__container', { 'sub__container--disabled': item.checked })}>
                                            <Image className='tree_img' src={treeImage} />
                                            <Text className='tree_txt'>下级</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))
                    }
                </View>
                <Text className='module__title'>{unitData[1]}</Text>
                <View className='module__body'>
                    {
                        data.sourceList.map(item => (
                            <View key={item.id} className='module__item' onClick={this.onSubHandle.bind(this, item)}>
                                {item.name && <Image className={cn('img', { 'img--disabled': !item.code })} onClick={this.onCheckHandle.bind(this, item)} src={item.checked ? checkedImage : uncheckedImage} />}
                                <Text className='txt'>{`${item.name}`}</Text>
                            </View>
                        ))
                    }
                </View>

                <View className='module__container__footer'>
                    <View className='footer__text'>已选污染源：{this.getSumText()}</View>
                    <View className='footer__btn' onClick={this.onOKhandle}>确认</View>
                </View>
            </View>
        )
    }
}