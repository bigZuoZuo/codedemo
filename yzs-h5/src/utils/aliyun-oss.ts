import {api} from '@/api'
import Taro from '@tarojs/taro'
import {AxiosResponse} from 'axios'

function authorizeInfo() {
  const cacheObject = {
    response: null as AxiosResponse<any> | null,
    expireTime: Date.now(),
  }

  return async () => {
    if (cacheObject.response && cacheObject.expireTime > Date.now()) {
      return cacheObject.response
    }

    const response = await api.upload.authorizeApplyList()

    cacheObject.expireTime = Date.now() + 10000
    cacheObject.response = response
    return response
  }
}

const getAuthorizeInfo = authorizeInfo()

export const uploadFile = async (filePath: string): Promise<string> => {
  if (filePath.startsWith('https://')) {
    return Promise.resolve(filePath)
  }

  const response = await getAuthorizeInfo()
  const url = 'https:' + response.data.data.host
  const filePaths = filePath.split('/')
  const fileName = filePaths[filePaths.length - 1]
  const key = response.data.data.dirPath + fileName

  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url,
      filePath: filePath,
      name: 'file',
      formData: {
        key,
        policy: response.data.data.policy,
        OSSAccessKeyId: response.data.data.OSSAccessKeyId,
        signature: response.data.data.Signature,
      },
      success() {
        resolve([url, key].join('/'))
      },
      fail: reject,
    })
  })
}

export const uploadFiles = async (filePaths: string[]): Promise<string[]> => {
  await getAuthorizeInfo()
  return Promise.all(filePaths.map((filePath: string) => uploadFile(filePath)))
}
