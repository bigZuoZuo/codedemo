
import Taro from '@tarojs/taro'

/**
 * 根据监测类型获取站点类型
 * @param monitorTypeCode
 * @returns
 */
export async function getSiteTypeByMonitorType(monitorTypeCode:string) {
    return Taro.request({
        url: `/iot-manager-server/api/v1/site-types/by-monitor-type?monitorTypeCode=${monitorTypeCode}`,
        method: 'GET'
    });
}

/**
 * 根据站点类型获取站点视频
 * @param params
 * @returns
 */
export async function getVideoBySiteType(params: any) {
    return Taro.request({
        url: `/iot-manager-server/api/v1/video/list-by-site-type`,
        method: 'GET',
        data: params
    });
}

/**
 * 根据站点编码获取视频列表
 * @param siteCode
 * @returns
 */
export async function getVideoBySiteCode(siteCode: string) {
    return Taro.request({
        url: `/iot-manager-server/api/v1/video/list-by-site-code?siteCode=${siteCode}`,
        method: 'GET',
    });
}

/**
 * 视频播放详情
 */
 export async function videoPlayDetail(deviceCode: string) {
    return Taro.request({
        url: `/iot-manager-server/api/v1/video/detail?videoCode=${deviceCode}`,
        method: 'GET'
    });
}

/**
 * 视频播放详情
 */
export async function listConstructionVideoInspects(siteCode:string,param: any) {
  return Taro.request({
    // url: `/meijing-inspect-server/api/v1/inspects/by-source-code?sourceCode=${sourceCode}`,
    url: `/meijing-inspect-server/api/v1/inspects/by-source-code?sourceCode=${siteCode}`,
    method: 'GET',
    data:param
  });
}
