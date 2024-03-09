import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input, ScrollView } from '@tarojs/components'
import UserModule from './UserModule'
import UnitModule from './UnitModule'
import ChooseModule from './ChooseModule'
import { rootSourceBaseUrl } from '../../utils/requests'
import { departmentUsers, departmentUsers_tenant } from '../../service/user'
import { transformTreeData, getNodeByKeyWord, setNodeUnCheck, getNodeById, getNodeByType } from './utils'
import { isOldVersion } from '../../utils/common'
import cn from 'classnames'
import './person.scss'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

//图标引用
const addImageUrl = rootSourceBaseUrl + "/assets/common/add_image.png"

interface FpiChooseProps {
    user: any,
    config: any,
    isEdit?: boolean,
    onAdd: () => void,
    onDetail: (any) => void,
}

interface FpiChooseState {
    data: any,
    navbars: any,
    keyword: any,
    placeholder: any,
    searchList: any,
    isInit: boolean,
}

export default class FpiChoose extends Component<FpiChooseProps, FpiChooseState> {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                id: '',
                name: '',
                type: 1,
                checked: false,
                children: []
            },
            navbars: [],
            keyword: '',
            placeholder: '搜索人员',
            searchList: [],
            isInit: true, // 是否是初始化加载数据
        }
    }

    static defaultProps = {
        config: []
    }

    // 初始化数据
    getInitData = async () => {
        let departmentUsersResp: any = null;
        let divisionCodeParam = ''
        let divisionNameParam = ''
        if (isOldVersion()) {
            const { user: { divisionCode, divisionName } } = this.props;
            departmentUsersResp = await departmentUsers(divisionCode);
            divisionCodeParam = divisionCode
            divisionNameParam = divisionName
        }
        else {
            const { user: { tenant: { divisionCode, divisionName }, tenantUser: { tenantCode } } } = this.props;
            departmentUsersResp = await departmentUsers_tenant(tenantCode);
            divisionCodeParam = divisionCode
            divisionNameParam = divisionName
        }
        try {
            // const childDivisionUsersResp = await childDivisionUsers(divisionCode);
            const { data: departmentUserList } = departmentUsersResp;
            // const { data: divisionUserList=[] } = childDivisionUsersResp;
            const departmentList = departmentUserList.filter(item => item.departmentId);
            transformTreeData(departmentList, divisionNameParam)

            // const divisionList = divisionUserList.map(division => {
            //     return {
            //         id: division.divisionCode,
            //         name: division.divisionName,
            //         type: 3,
            //         checked: false,
            //         origin: division,
            //         children: division.users.map(user => {
            //             return {
            //                 id: user.id,
            //                 name: user.name,
            //                 type: 4,
            //                 checked: false,
            //                 children: [],
            //                 avatar: user.avatar,
            //                 origin: user,
            //                 path: `${divisionName}-${division.divisionName}`
            //             }
            //         }),
            //         path: `${divisionName}`
            //     }
            // })

            let noDepartment = departmentUserList.find(item => item.departmentId == 0)
            let noDepartmentList = noDepartment ? [noDepartment] : []
            transformTreeData(noDepartmentList, divisionNameParam, 4)
            const { isInit } = this.state;
            const { isEdit = true } = this.props;
            if (!isEdit && !isInit) {
                return;
            }
            const { user: { departmentInfo } } = this.props;
            const { id } = departmentInfo || {};
             
            this.setState({
                isInit: false,
                data: {
                    id: divisionCodeParam,
                    name: divisionNameParam,
                    type: 1,
                    checked: false,
                    users: get(noDepartmentList, '[0].users', []),
                    children: [
                        ...departmentList,
                        // ...divisionList,
                    ]
                },
                navbars: [{ id: divisionCodeParam, name: divisionNameParam, isAll: false, checked: false }],
            }, () => {
                if (!isEdit && this.getNodeById(id)) {
                   const temp = this.findParentNodeArray(departmentList, id)
                   this.onSubOver(temp, 0);
                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    componentDidShow() {
        this.getInitData();
    }

    // 依据原数据与节点查找对应的父级节点
    findParentNodeArray(array, parentSubjectCode) {
        const parentSubjectStock: any = [] // 存储父节点
        let going = true // 是否已找到要查到的节点
        var findParentNode = function(array, id) {
            array.forEach(item => {
                if(!going) { return }
                parentSubjectStock.push(item)
                if(item.id === id) {
                    going = false
                } else if(item.children) {
                    findParentNode(item.children, id)
                } else {
                    parentSubjectStock.pop() 
                }
            })
            if(going) parentSubjectStock.pop() 
        }
        findParentNode(array, parentSubjectCode)
        return parentSubjectStock
    }

    getNodeById = (id: number) => {
        const { data } = this.state;
        return getNodeById(id, data);
    }

    // tab切换
    onTab = (index: number) => {
        let { navbars } = this.state;
        if (index !== navbars.length - 1) {
            navbars.splice(index + 1);
            this.setState({
                navbars
            })
        }
    }

    // 遍历下级
    onSubOver = (arr: any, i: number) => {
        let { navbars } = this.state;
        this.setState({
            navbars: [
                ...navbars,
                { id: arr[i].id, name: arr[i].name, isAll: false, checked: arr[i].checked }
            ]
        },() => {
            if (arr.length > i++) {
                this.onSubOver(arr, i++);
            }
        }) 
    }

    // 下级
    onSub = (item: any) => {
        let { navbars } = this.state;
        this.setState({
            navbars: [
                ...navbars,
                { id: item.id, name: item.name, isAll: false, checked: item.checked }
            ]
        })
    }

    // 搜索后，点击进入下级部门
    onSearchSub = (item: any) => {
        const { isEdit = true } = this.props;
        if (isEdit) { return }
        let { navbars, data } = this.state;
        this.setState({
            keyword: '',
        })
        const bars = navbars.splice(0, 1);
        this.setState({
            navbars: bars
        }, () => {
            const temp = this.findParentNodeArray(data.children, item.id)
            this.onSubOver(temp, 0);
        })
    }

    // 勾选和取消
    onCheck = (item) => {
        const { config } = this.props;
        let { data } = this.state;
        let itemConfig = config.find(cfg => cfg.type == item.type);
        if (!isEmpty(config) && isEmpty(itemConfig)) {
            return;
        }
        let newData = data;
        let newItem = getNodeById(item.id, data, item.type);
        if (newItem) {
            if (itemConfig && itemConfig.single && !item.checked) {
                setNodeUnCheck(itemConfig.type, data);
            }
            // @ts-ignore
            newItem.checked = !item.checked;
            this.setState({
                data: newData
            })
        }
    }

    // 获取汇总信息
    getSumText = () => {
        const { config } = this.props;
        const { data } = this.state;
        let departmentList = [];
        let devisionList = [];
        let userList = [];
        getNodeByType(2, data, departmentList);
        getNodeByType(3, data, devisionList);
        getNodeByType(4, data, userList);
        let personConfig = config.find(cfg => cfg.type == 4);
        if (personConfig && (personConfig.single || personConfig.only)) {
            return `${userList.length}人`;
        }
        return `${userList.length}人、${departmentList.length}个部门`
    }

    onInputChange = (e) => {
        const { data } = this.state;
        let list = [];
        getNodeByKeyWord(e.detail.value, data, list);
        console.log(list, "list")
        this.setState({
            keyword: e.detail.value,
            searchList: list
        })
    }

    addPerson = () => {
        const { onAdd } = this.props
        onAdd && onAdd()
    }

    render() {
        const { navbars, keyword, placeholder, searchList } = this.state;
        const { config, onDetail, isEdit = true } = this.props;
        const userConfig = config.find(cfg => cfg.type == 4);
        const isOnlyUser = !isEmpty(userConfig) && userConfig.only;

        return (
            <View className={cn('fpi-choose', { 'fpi-choose--search': keyword })}>
                <View className='fpi-choose__header'>
                    <View className='search'>
                        <Input className='search__input'
                            placeholderClass='search--placeholder'
                            type='text'
                            value={keyword}
                            placeholder={placeholder}
                            onInput={this.onInputChange.bind(this)}
                        />
                    </View>
                    <ScrollView className='scrollView' scrollWithAnimation scrollX>
                        <View className='navbar'>
                            {
                                navbars.map((navbar, index) => (
                                    <View
                                        onClick={this.onTab.bind(this, index)}
                                        key={navbar.id}
                                        className={cn('navbar__item', { 'navbar__item--nav': index < navbars.length - 1 })}
                                    >{navbar.name}</View>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
                <View className='fpi-choose__main'>
                    {
                        navbars.map((navbar, index) => (
                            <View key={navbar.id} className={cn('check-container', { 'check-container--checked': index === navbars.length - 1 })}>
                                <View className='tab__item'>
                                    {/* 部门 */}
                                    <UnitModule
                                        data={this.getNodeById(navbar.id)}
                                        onCheck={this.onCheck}
                                        type={2}
                                        canCheck={!isOnlyUser}
                                        onSub={this.onSub}
                                        isChoose={false}
                                        isEdit={isEdit}
                                    />

                                    {/* 下级区域 */}
                                    <UnitModule
                                        data={this.getNodeById(navbar.id)}
                                        onCheck={this.onCheck}
                                        type={3}
                                        canCheck={!isOnlyUser}
                                        onSub={this.onSub}
                                        isEdit={isEdit}
                                    />

                                    {/* 人员 */}
                                    <UserModule
                                        data={this.getNodeById(navbar.id)}
                                        onCheck={this.onCheck}
                                        // @ts-ignore
                                        isSpace={this.getNodeById(navbar.id).children.filter(child => child.type == 2 || child.type == 3).length == 0}
                                        isChoose={false}
                                        onDetail={onDetail}
                                    />
                                </View>
                            </View>
                        ))
                    }
                </View>

                <View className='fpi-choose__search'>
                    <ChooseModule
                        type={4}
                        data={searchList.filter(child => child.type == 4)}
                        keyword={keyword}
                        onCheck={this.onCheck}
                        isChoose={false}
                        onDetail={onDetail}
                    />
                    <ChooseModule
                        type={3}
                        data={searchList.filter(child => child.type == 3)}
                        keyword={keyword}
                        onCheck={this.onCheck}
                    />
                    <ChooseModule
                        type={2}
                        data={searchList.filter(child => child.type == 2)}
                        keyword={keyword}
                        onCheck={this.onCheck}
                        onDetail={this.onSearchSub}
                    />
                </View>

                <View className='fpi-choose__footer' style={{ display: isEdit && isOldVersion ? 'flex' : 'none' }} onClick={this.addPerson.bind(this)}>
                    <Image src={addImageUrl} className="add_image"></Image>
                    <Text className='userText'>添加人员</Text>
                </View>
            </View>
        )
    }
}