import Taro from '@tarojs/taro'
import {rootConstructionSourceBaseUrl} from "@common/utils/requests";
import get from "lodash/get";

export async function inspectReport(pollutionSourceId: number) {
    return Taro.request({
        url: `/meijing-inspect-server/api/v1/construction-site-patrol/latest`,
        method: 'GET',
        data:{
            pollutionSourceId
        }
    });
}
export async function inspectReportNew(pollutionSourceId: number, inventoryType: string | undefined) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/latest`,
    method: 'GET',
    data: {
      pollutionSourceId,
      inventoryType
    }
  });
}

export async function inspectDetails(Id: number) {
  const url = `/meijing-inspect-server/api/v2/construction-site-patrol/detail-by-inspect/${Id}`
  // if (['green-construct', 'mj-construction'].includes(Taro.getStorageSync('appKey'))) {
  //   url = `/meijing-inspect-server/api/v2/construction-site-patrol/detail-by-inspect/${Id}`
  // }
  return Taro.request({
    url,
    method: 'GET'
  });
}

// 巡查内容提交
export async function inspectContentSumbit(param:any){
    return Taro.request({
        url: '/meijing-inspect-server/api/v1/construction-site-patrol/special-item-patrol',
        method: 'POST',
        data: {
            ...param
        }
    })
}
// 巡查内容提交
export async function inspectContentSubmitNew(param:any){
  return Taro.request({
    url: '/meijing-inspect-server/api/v2/construction-site-patrol/special-item-patrol',
    method: 'POST',
    data: {
      ...param
    }
  })
}

// 巡查上报提交
export async function inspectSumbit(param:any){
    return Taro.request({
        url: '/meijing-inspect-server/api/v1/construction-site-patrol/report',
        method: 'POST',
        data: {
            ...param
        }
    })
}
// 巡查上报提交
export async function inspectSubmitNew(param:any){
  return Taro.request({
    url: '/meijing-inspect-server/api/v2/construction-site-patrol/report',
    method: 'POST',
    data: {
      ...param
    }
  })
}

// 通过经纬度获取最近的工地
export async function getSiteId(param:any, keywords: string = ''){
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/near-construction-site-list`,
        method: 'GET',
        data: {
            offset: 0,
            limit: 20,
            keywords: keywords,
            ...param
        }
    })
}

// 当地方案
export async function getSiteRecords(param: any) {
    return Taro.request({
        url: `/meijing-pollution-source-server/api/v1/pollution-sources/construction-site-records`,
        method: 'GET',
        data: {
            ...param,
        }

    });
}

// 查询上传内容的详细
export async function getUpdatedItem(id: number) {
    return Taro.request({
        url: `/meijing-inspect-server/api/v1/construction-site-patrol/itemDetail/${id}`,
        method: 'GET'
    });
}

// 查询上传内容的详细
export async function getUpdatedItemNew(id: number) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/itemDetail/${id}`,
    method: 'GET'
  });
}

// 更新检查项
export async function getUpdate(params: any) {
    return Taro.request({
        url: `/meijing-inspect-server/api/v1/construction-site-patrol/updateSpecialPatrolItem/${params.id}`,
        method: 'POST',
        data: {
            ...params
        }
    });
}

export async function getUpdateNew(params: any) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/updatePatrolItem/${params.id}`,
    method: 'POST',
    data: {
      ...params
    }
  });
}

// 根据id获取污染源详情
export async function getPollutionById(pollutionId: any) {
  return Taro.request({
    url: `/meijing-pollution-source-server/api/v1/pollution-sources/${pollutionId}/detail`,
    method: 'GET',
  })
}
// 删除工地巡查其他问题
export async function delPatrolItem(patrolItemId: string) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/deletePatrolItem/${patrolItemId}`,
    method: 'POST',
  })
}

// 查询工地巡查列表
export async function getPatrolInfoList(data: any) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/patrol-info-list`,
    method: 'GET',
    data
  })
}

const successIcon = `${rootConstructionSourceBaseUrl}/assets/pages/work/success.png`
const warningIcon = `${rootConstructionSourceBaseUrl}/assets/pages/work/warning.png`
const orangeIcon = `${rootConstructionSourceBaseUrl}/assets/pages/work/icon-orange.png`

export const currentLevel = {
  // 全部做到
  ALL_DONE: {
    color: '#0cb984',
    img: successIcon,
  },
  // 一般问题
  GENERAL: {
    color: '#f89633',
    img: orangeIcon,
  },
  // 严重问题
  SERIOUS: {
    color: '#0cb984',
    img: warningIcon,
  },
}

export const QuestionImg = {
  'icon-a-zu30043': successIcon,
  'icon-a-zu30042': orangeIcon,
  'icon-a-zu30041': warningIcon,
}

// 查询巡查记录详情
export async function getPatrolInfo(patrolId: string) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/patrol-info/${patrolId}`,
    method: 'GET',
  })
}
// 查询巡查记录详情-巡查检查项
export async function getPatrolItemList(patrolId: string) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/patrol-item-list/${patrolId}`,
    method: 'GET',
  })
}
// 查询巡查记录详情-发现的问题
export async function getInspectItemList(patrolId: string) {
  return Taro.request({
    url: `/meijing-inspect-server/api/v2/construction-site-patrol/patrol-inspect-list/${patrolId}`,
    method: 'GET',
  })
}


/**
 *
 * @param errMsg 日志内容
 */
export function insertLog(errMsg: any) {
  try {
    const systemInfo = Taro.getStorageSync('systemInfo')
    const appKey = Taro.getStorageSync('appKey')
    const token = Taro.getStorageSync('token')
    const userDetails = Taro.getStorageSync('userDetails')
    const params = {
      userId: get(userDetails,'id'),
      appName: appKey,
      functionName: '工地巡查上报',
      log: JSON.stringify(errMsg) + `;systemInfo:${JSON.stringify(systemInfo)};token:${token};userDetails:${JSON.stringify(userDetails)}`
    }
    clientErrorLogs(params)
  }
  catch (e) { }
}


/**
 * 
 * @param params 参数
 */
 export async function clientErrorLogs(params:any){
  return Taro.request({
      url: `/simple-user-server/api/v3/client-error-logs`,
      data: params,
      method: 'POST',
  });
}

/**
 * 更新工地巡查项
 * @param params 参数
 */
 export async function updateAttribute(params:any){
  return Taro.request({
      url: `/meijing-pollution-source-server/api/v1/pollution-sources/update-attribute`,
      data: params,
      method: 'POST',
  });
}