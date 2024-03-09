import Taro from '@tarojs/taro'
import {aliyunOssUrl} from '@common/utils/requests'
import get from 'lodash/get';

export interface Photo {
    /**
     * 图片路径
     */
    path: string;
    /**
     * 旋转角度
     */
    rotate: number;
}


/**
 * 上传结果
 */
export type UploadResult = {success:boolean, message?:string, ossKey:string, link?: string};

/**
 * 签名结果
 */
export interface SignatureResult {
    policy:string;
    signature:string;
    accessId:string;
    host:string;
    expire:string;
}

/**
 * 获取签名
 * @param dir 存入oss的路径  例如: inspect/images/2020/04/29/
 */
export async function getSignature(dir:string){
    return Taro.request({
        url: `/simple-oss-server/api/v1/oss/signature`,
        data: {dir},
        method: 'POST',
    });
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
 * 文件直传到oss
 * @param filePath 文件路径 
 * @param dir 存入oss的路径
 * @param newFileName 存入oss的文件名
 * @param signatureResult 签名
 */
export async function uploadFile(filePath:string, dir:string, newFileName: string, signatureResult:SignatureResult): Promise<UploadResult>{
    const key = dir + newFileName;
    let result: UploadResult = {success:false, message:'', ossKey: key};
    try {
        const {policy, signature, accessId } = signatureResult;
        await Taro.uploadFile({
            url: aliyunOssUrl,
            filePath: filePath,
            name: 'file',
            header: {
                'content-type': 'multipart/form-data',
            },
            formData: {
                name: newFileName,
                key,
                policy,
                signature,
                OssAccessKeyId: accessId,
                success_action_status: '200', 
            },
            timeout: 300000, 
            success:(res: any) => {
                if(res.statusCode == 200){
                    result.success = true;
                }else{
                    result.success = true;
                    result.message = `upload error 5010:${JSON.stringify(res)}, dir: ${dir}, newFileName: ${newFileName}, signatureResult: ${JSON.stringify(signatureResult)}`
                    insertLog(result.message)
                }
            },
            fail: (res: any) => {
                result.success = false;
                result.message = `upload error 5011:${JSON.stringify(res)}, dir: ${dir}, newFileName: ${newFileName}, signatureResult: ${JSON.stringify(signatureResult)}`
                insertLog(result.message)
            }
        });        
    } catch (error) {
        result.success = false;
        // result.message = "upload error 5012";
        result.message = `upload error 5012:${JSON.stringify(error)}, dir: ${dir}, newFileName: ${newFileName}, signatureResult: ${JSON.stringify(signatureResult)}`
        insertLog(result.message)
    }
    return result;   
}


/**
 * 
 * @param errMsg 日志内容
 */
export function insertLog(errMsg: string) {
    try {
        const systemInfo = Taro.getStorageSync('systemInfo')
        const appKey = Taro.getStorageSync('appKey')
        const token = Taro.getStorageSync('token')
        const userDetails = Taro.getStorageSync('userDetails')
        const params = {
            userId: get(userDetails,'id'),
            appName: appKey,
            functionName: 'uploadFile',
            log: errMsg + `;systemInfo:${JSON.stringify(systemInfo)};token:${token};userDetails:${JSON.stringify(userDetails)}`
        }
        clientErrorLogs(params)
    }
    catch (e) { }
}