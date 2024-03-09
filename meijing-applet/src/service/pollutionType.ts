import Taro from '@tarojs/taro'
import cloneDeep from 'lodash/cloneDeep'

export interface PollutionType {
    id: number;
    name: string;
    code?: string;
}

export interface PollutionSource {
    id: string,
    name: string,
    address: string,
    distance: string,
    pollutionSourceTypeId: string
}

/**
 * 污染类型列表
 */
export async function list() {
    return Taro.request({
        url: `/meijing-inspect-server/api/v1/pollution-types`,
    });
}

/**
 * 污染源类型列表
 */
export async function getPollutionSourceTypeList() {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-source-types`,
    });
}

/**
 * 污染源企业列表
 */
export async function getPollutionSourcesList(params: any) {
    const {typeId,...other} = params;
    if(typeId instanceof Array){
      let arg:any = [];
      typeId.forEach(item=>{
        arg.push(`typeId=${item}`)
      })
      for (let otherKey in other) {
        arg.push(`${otherKey}=${other[otherKey]}`)
      }
      return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources?${arg.join('&')}`,
        method: 'GET',
      });
    }
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources`,
        method: 'GET',
        data: params
    });
}

/** 获取负责人和区域人员、其他人员
 * @params {number} id  - 污染源id
 */
export async function personListById(params: any) {
  return Taro.request({
    url: `/meijing-pollution-source-server/api/v1/pollution-sources/list-by-create-user`,
    method: 'GET',
    data: params
  });
}


/**
 * 污染源状态
 */
export async function pollutionSourceTypeStatus() {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-source-type-status`,
    });
}

/**
 * 污染源上报
 * @param input 事件对象
 */
export async function addReporting(input: any) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/reporting`,
        data: input,
        method: 'POST',
    });
}

/**
 * 污染源详情
 * @param id 污染源编号
 */
export async function getPollutionDetail(id: number | string) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/${id}/detail`
    });
}

/**
 * 删除污染源
 * @param id 污染源编号
 */
export async function delPollutionDetail(id: number | string) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/${id}`,
        method: 'DELETE'
    });
}

/**
 * 获取污染源巡查次数
 * @param id 污染源编号
 */
export async function inspectsByPollutantCount(id: number | string) {
    return Taro.request({
        url: `/meijing-inspect-server/api/v1/inspects/inspects-by-pollutant-count?pollutionSourceId=${id}`
    });
}

/**
 * 污染源企业巡查记录
 */
export async function inspectsByPollutant(myParam: any) {
    const params = cloneDeep(myParam)
    if (!params.startTime || !params.endTime) {
        delete params.startTime;
        delete params.endTime;
    }
    if (params.inspectType == '0') {
        delete params.inspectType;
    }
    return Taro.request({
        url: `/meijing-inspect-server/api/v1/inspects/inspects-by-pollutant`,
        method: 'GET',
        data: params
    });
}

/**
 * 污染源编辑
 * @param input 事件对象
 */
export async function editpollutionPources(params: any) {
    const { id } = params
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/${id}`,
        data: params,
        method: 'POST',
    });
}


/**
 * 污染源状态变更记录
 */
export async function statusChangeLogs(id:number) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/${id}/status-change-logs`,
    });
}

/**
 * 巡查人员变更记录
 */
export async function staffChangeLogs(id:number) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/${id}/staff-change-logs`,
    });
}


/**
 * 根据污染源id查询关联人员
 */
export async function pollutionSourceAssociatedPersons(pollutionSourceId:number | string) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-source-associated-persons/${pollutionSourceId}`,
    });
}
/**
 * 根据污染源id查询关联人员
 */
export async function personList(pollutionSourceId:number) {
  return Taro.request({
    url: `/meijing-pollution-source-server/api/v1/pollution-sources/person-list/${pollutionSourceId}`,
  });
}

/** 根据污染源id批量更新关联人员
 * @params {number} pollutionSourceId  - 污染源id
 * @params {array} data  - 污染源id
 * @params {object} data[0]  - 每条数据
 * @params {string} data[0].duty -   人员名称
 * @params {string} data[0].name   -   结束时间
 * @params {string} data[0].phoneNumber   -   联系电话
 * @returns {object}
 */
export async function updateAssociatedPersons(pollutionSourceId:number,data:any) {
  return Taro.request({
    url: `/meijing-pollution-source-server/api/v1/pollution-source-associated-persons/${pollutionSourceId}`,
    data,
    method: 'POST',
  });
}

/** 获取负责人
 * @params {number} areaCode  - 污染源id
 */
export async function getDepartmentArea(areaCode:number) {
  return Taro.request({
    url: `/simple-user-server/api/v3/departments/department-area`,
    method: 'GET',
    data: {areaCode}
  });
}
/** 获取负责人
 * @params {number} areaCode  - 污染源id
 */
export async function getPeople(data:any) {
  return Taro.request({
    url: `/simple-user-server/api/v2/departments/by-area`,
    method: 'GET',
    data
  });
}

/** 根据经纬度获取负责人
 * @params {number} areaCode  - 污染源id
 */
export async function getPeopleByLocation(location:any) {
    return Taro.request({
        url: `/simple-user-server/api/v3/users/get-by-location`,
        method: 'GET',
        data: location
    });
}

/**
 * 获取属地
 */
export async function getAreaTree() {
  return Taro.request({
    url: `/simple-user-server/api/v3/areas/area-tree`,
    method: 'GET',
  });
}

/** 获取负责人和区域人员、其他人员
 * @params {number} id  - 污染源id
 */
export async function personListByIdForMap(id: number) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/person-list/${id}`,
        method: 'GET',
    });
}


/**
 * 投资单位类型
 */
export async function getInvestmentUnit() {
  return Taro.request({
    url: `/meijing-pollution-source-server/api/v1/investment-unit-types`,
    method: 'GET',
  });
}

/**
 * 污染源子类型
 */
export async function getSubSourceType(PollutionSourceServerId:string|number) {
  return Taro.request({
    url: `/meijing-pollution-source-server/api/v1/industries/get-by-pollution-source-type/${PollutionSourceServerId}`,
    method: 'GET',
  });
}
