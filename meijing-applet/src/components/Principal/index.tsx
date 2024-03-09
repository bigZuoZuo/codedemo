import Taro, {Component,} from '@tarojs/taro';
import {CoverView, CoverImage} from '@tarojs/components'
import {rootSourceBaseUrl} from '@common/utils/requests'
import isEmpty from 'lodash/isEmpty'

import {get} from 'lodash'
// import cn from 'classnames'
import './index.scss'

interface PrincipalProps {
  onClose: () => void,
  data: any,
  nowData: any,
}

interface PrincipalState {

}

const closed = rootSourceBaseUrl + "/assets/task_dispatch/closed.png";
const phoneImg = rootSourceBaseUrl + "/assets/map/phone.png";
const noPeopleImg = rootSourceBaseUrl + "/assets/pollution-manage/no-people.png";


class Principal extends Component<PrincipalProps, PrincipalState> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  onPhone = (phoneNumber: any) => {
    if (phoneNumber) {
      Taro.makePhoneCall({
        phoneNumber: phoneNumber
      })
    }
  }

  render() {
    const {data, nowData} = this.props;
    const currentAreaInfo = get(data, 'currentAreaInfo') || {};
    const parentAreaInfo = get(data, 'parentAreaInfo') || {};
    return (
      <CoverView className='pop-pollution'>
        <CoverImage className='pop-close' src={closed} onClick={this.props.onClose} />
        <CoverView className='pop-title'>{get(nowData, 'address')}</CoverView>
        {(isEmpty(currentAreaInfo.areaCode)  && isEmpty(parentAreaInfo.areaCode) ) &&
        <CoverView>
          <CoverView className='img-warp noTop'>
            <CoverImage className='people-img' src={noPeopleImg} />
          </CoverView>
          <CoverView className='text'>暂无负责人</CoverView>
        </CoverView>
        }

        <CoverView className='scroll'>
          {currentAreaInfo &&
          <CoverView>
            <CoverView className='pop-sub-title' style={{paddingTop: '20px'}}>
              {currentAreaInfo.areaName || ''}
            </CoverView>
            {!currentAreaInfo &&
            <CoverView>
              <CoverView className='img-warp '>
                <CoverImage className='people-img' src={noPeopleImg} />
              </CoverView>
              <CoverView className='text'>暂无负责人</CoverView>
            </CoverView>
            }
            {currentAreaInfo &&
            <CoverView>
              {currentAreaInfo.departmentList.map((item: any,index:number) => {
                return (
                  <CoverView key={index} className='pop-body pop-body1'>
                    <CoverView className='pop-peoples'>
                      <CoverView className='people-item people-item__0'>
                        <CoverView className='people-contact'>
                          <CoverView className='contact-info'>{item.departmentName}负责人</CoverView>
                          <CoverView className='contact-name'>{item.managerName || '暂无负责人'}</CoverView>
                        </CoverView>
                        <CoverView className='people-phone' onClick={this.onPhone.bind(this, item.managerPhoneNumber)}>
                          <CoverImage className='phone-img' src={phoneImg} />
                        </CoverView>
                      </CoverView>
                      <CoverView className='people-item people-item__1'>
                        <CoverView className='people-contact'>
                          <CoverView className='contact-info'>{item.relatedAreaName}调度员</CoverView>
                          <CoverView className='contact-name'>{item.linkmanName || '暂无负责人'}</CoverView>
                        </CoverView>
                        <CoverView className='people-phone' onClick={this.onPhone.bind(this, item.linkPhoneNumber)}>
                          <CoverImage className='phone-img' src={phoneImg} />
                        </CoverView>
                      </CoverView>
                    </CoverView>
                  </CoverView>
                )
              })

              }

            </CoverView>
            }

            <CoverView className='pop-sub-title'>
              <CoverView>{parentAreaInfo.areaName||''}</CoverView>
            </CoverView>
            <CoverView className='pop-body'>
              {!parentAreaInfo &&
              <CoverView>
                <CoverView  className='img-warp mt'>
                  <CoverImage className='people-img' src={noPeopleImg} />
                </CoverView>
                <CoverView className='text'>暂无负责人</CoverView>
              </CoverView>
              }
              <CoverView className='pop-peoples'>
                {
                  parentAreaInfo && parentAreaInfo.departmentList.map((person:any,index:number)=>(
                    <CoverView key={person.id}  className={`people-item people-item__${index % 4}`}>
                      <CoverView className='people-contact'>
                        <CoverView className='contact-info'>{person.departmentName||'--'}负责人</CoverView>
                        <CoverView className='contact-name'>{person.linkmanName||'暂无'}</CoverView>
                      </CoverView>
                      <CoverView className='people-phone' onClick={this.onPhone.bind(this, person.linkPhoneNumber)}>
                        <CoverImage className='phone-img' src={phoneImg} />
                      </CoverView>
                    </CoverView>
                  ))
                }
              </CoverView>
            </CoverView>
          </CoverView>
          }


        </CoverView>


      </CoverView>
    );
  }
}

export default Principal
