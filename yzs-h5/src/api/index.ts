import Taro from '@tarojs/taro'
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import adapter from 'axios-miniprogram-adapter'
import {Api} from './api'

if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  axios.defaults.adapter = adapter
}

let _baseUrl = 'https://market-beta.platypus.art'
let _requestBaseUrl = 'https://platypus-api.platypus.art/api/v1'
// @ts-ignore
console.log('YZS_MODE=========>', YZS_MODE)
// @ts-ignore
if (YZS_MODE === 'uat') {
  // beta bucket
  _baseUrl = 'https://platypus-h5-uat.platypus.art'
  _requestBaseUrl = 'https://platypus-api-uat.platypus.art/api/v1'
}
// @ts-ignore
if (YZS_MODE === 'dev') {
  // test bucket
  _baseUrl = 'https://test-h5.platypus.art'
  // _requestBaseUrl = 'https://p4030174-u808-072ec0c4.app.run.fish/api/v1'
  _requestBaseUrl = 'https://p4030174-u902-6ceeceae.app.run.fish/api/v1'
  // _requestBaseUrl = 'https://platypus-api-uat.platypus.art/api/v1'
}
// @ts-ignore
if (YZS_MODE === 'prod') {
  // test bucket
  _baseUrl = 'https://market.platypus.art'
  _requestBaseUrl = 'https://platypus-api.platypus.art/api/v1'
}

// export const baseUrl = 'https://market.platypus.art'
export const baseUrl = _baseUrl

export const authZSWUrl = 'https://zsw-h5-1308822543.cos.ap-hongkong.myqcloud.com/index.html#/pages/login/index'

// TODO: 1.  移除vconsole html
// 2. https://test-h5.platypus.art 更改微信支付跳转
// 3. 接口地址更改
// 4. get-weixin-code.html

export const api = new Api({
  baseURL: _requestBaseUrl,
  secure: true,
  securityWorker: async () => {
    try {
      let accessToken
      try {
        accessToken = await Taro.getStorageSync('access_token')
      } catch (err) {
        console.log(err)
      }
      if (!accessToken) {
        return
      }
      return {
        headers: {
          jwtsessiontoken: accessToken,
        },
      }
    } catch (error) {
      console.log('🚀 ~ file: index.ts ~ line 25 ~ securityWorker: ~ error', error)
    }
  },
})

const records = [] as Array<{
  url?: string
  request: AxiosRequestConfig
  response: Promise<AxiosResponse>
  resolve?: (data: AxiosResponse) => void
}>

api.instance.interceptors.request.use((value) => {
  const sessionId = records.length
  value.headers ??= {}
  value.headers['x-session-id'] = sessionId
  let resolve: ((data: AxiosResponse) => void) | undefined = undefined
  records[sessionId] = {
    url: value.baseURL! + value.url!,
    request: value,
    response: new Promise((rs) => (resolve = rs)),
  }
  records[sessionId].resolve = resolve
  return value
})

api.instance.interceptors.response.use(
  (value) => {
    if (value.data.code === 401 && !/paid-middle/.test(location.pathname)) {
      Taro.setStorageSync('logout', true)
      Taro.removeStorageSync('YZS_USER_INFO')
      Taro.removeStorageSync('access_token')
      window.location.replace('/login')
      return value
    }
    value.request.header ??= {}
    const sessionId = value.request.header['x-session-id']
    records[sessionId]?.resolve?.(value)
    return value
  },
  (value) => {
    if (value.response.status === 401 && !/paid-middle/.test(location.pathname)) {
      Taro.setStorageSync('logout', true)
      Taro.removeStorageSync('YZS_USER_INFO')
      Taro.removeStorageSync('access_token')
      window.location.replace('/login')
      return Promise.reject(value)
    }
    value.request.header ??= {}
    const sessionId = value.request.header['x-session-id']
    records[sessionId]?.resolve?.(value.response)
    return Promise.reject(value)
  }
)

let isUploading = false

export const uploadRecord = async function () {
  if (isUploading) return
  isUploading = true
  console.log('uploading')

  if (!records.length) {
    Taro.showToast({title: '接口快照已清空，请重新走一遍流程'})
    return
  }

  const newRecords = await Promise.all(
    records.map(async (value) => ({
      ...value,
      response: await value.response,
    }))
  )

  const sessionId = (Math.random() * 1000000).toFixed(0)
  axios.post(
    'https://personal-1g3oo8ktdf28d558-1256652038.ap-guangzhou.app.tcloudbase.com/koa-starter/record',
    newRecords.map((item) => ({
      url: item.url,
      method: item.request.method,
      status: item.response.status,
      statusText: item.response.statusText,
      requestHeaders: item.request.headers,
      requestData: item.request.data,
      responseData: item.response.data,
      responseHeaders: item.response.headers,
      token: item.request.headers?.jwtsessiontoken,
      sessionId,
    }))
  )

  console.log('upload success')
  isUploading = false

  records.length = 0
  console.log('🚀', sessionId)
  return sessionId
}

// @ts-ignore
Taro.uploadRecord = uploadRecord
