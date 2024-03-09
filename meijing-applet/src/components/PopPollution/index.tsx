import Taro, { Component } from '@tarojs/taro';
import { CoverView, CoverImage } from '@tarojs/components'
import { rootSourceBaseUrl } from '@common/utils/requests'
import { personListByIdForMap } from '../../service/pollutionType'
import { get, isEmpty } from 'lodash'
import cn from 'classnames'
import './index.scss'

interface PopPollutionProps {
    onClose: () => void,
    data: any,
}

interface PopPollutionState {
    personList: any,
}

const closed = rootSourceBaseUrl + "/assets/task_dispatch/closed.png";
const locationImg = rootSourceBaseUrl + "/assets/map/location.png";
const phoneImg = rootSourceBaseUrl + "/assets/map/phone.png";
const detailImg = rootSourceBaseUrl + "/assets/map/detail.png";
const navigatorImg = rootSourceBaseUrl + "/assets/map/navigator.png";

class PopPollution extends Component<PopPollutionProps, PopPollutionState> {

    constructor(props) {
        super(props)
        this.state = {
            personList: []
        }
    }

    componentDidMount() {
        this.getRelatedPerson(this.props.data)
    }

    componentWillReceiveProps(nextProps) {
        this.getRelatedPerson(nextProps.data)
    }

    getRelatedPerson = (data: any) => {
        try {
            personListByIdForMap(data.id).then(res => {
                const objPersons = get(res, 'data', {})
                const personList: any = []
                if (objPersons.departmentManager && objPersons.departmentManager.userId) {
                    personList.push(objPersons.departmentManager)
                }
                if (objPersons.areaLinkMan && objPersons.areaLinkMan.userId) {
                    personList.push(objPersons.areaLinkMan)
                }
                personList.push(...objPersons.otherLinkMen)
                this.setState({ personList })
            })
        }
        catch (err) { }
    }

    parseDistance(distance: number) {
        return (distance / 1000).toFixed(2) + "km";
    }

    onPhone = (person: any) => {
        if (person.phone) {
            Taro.makePhoneCall({
                phoneNumber: person.phone
            })
        }
    }

    onDetail = () => {
        const { data = {} } = this.props
        Taro.navigateTo({
            url: `/pages/pollution-manage/detail?id=${data.id}`
        })
    }

    onGo = () => {
        const { data: { longitude, latitude } } = this.props
        Taro.openLocation({
            longitude: longitude,
            latitude: latitude
        })
    }

    render() {
        const { data = {} } = this.props
        const { personList = [] } = this.state
        return (
            <CoverView className={cn('pop-pollution', { 'pop-pollution__empty': isEmpty(personList), 'pop-pollution__row': (personList.length <= 2 && personList.length >= 1), 'pop-pollution__more': personList.length > 2 })}>
                <CoverImage className='pop-close' src={closed} onClick={this.props.onClose} />
                <CoverView className='pop-title'>{get(data, 'name')}</CoverView>
                <CoverView className='pop-body'>
                    <CoverView className='pop-type'>{get(data, 'pollutionSourceTypeName')}{data.industryName ? `-${data.industryName}` : ''}</CoverView>
                    <CoverView className='pop-address'>
                        <CoverImage className='address-img' src={locationImg} />
                        <CoverView className='address-txt'>{get(data, 'address')}（距你{this.parseDistance(data.distance)}）</CoverView>
                    </CoverView>
                    <CoverView className='pop-peoples'>
                        {
                            personList.map((person, index) => (
                                <CoverView key={person.id} className={`people-item people-item__${index % 4}`}>
                                    <CoverView className='people-item-segment'></CoverView>
                                    <CoverView className='people-contact'>
                                        <CoverView className='contact-info'>{get(person, 'duty', '--')}</CoverView>
                                        <CoverView className='contact-name'>{get(person, 'name', '--')}</CoverView>
                                    </CoverView>
                                    <CoverView className='people-phone' onClick={this.onPhone.bind(this, person)}>
                                        <CoverImage className='phone-img' src={phoneImg} />
                                    </CoverView>
                                </CoverView>
                            ))
                        }
                    </CoverView>
                </CoverView>
                <CoverView className='pop-btns'>
                    <CoverView className='btn-item' onClick={this.onDetail}>
                        <CoverImage className='item-img' src={detailImg} />
                        <CoverView className='item-txt'>查看详情</CoverView>
                    </CoverView>
                    <CoverView className='item-split'></CoverView>
                    <CoverView className='btn-item' onClick={this.onGo}>
                        <CoverImage className='item-img' src={navigatorImg} />
                        <CoverView className='item-txt'>导航</CoverView>
                    </CoverView>
                </CoverView>
            </CoverView>
        );
    }
}
export default PopPollution
