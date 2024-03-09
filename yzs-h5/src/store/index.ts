import {api} from '../api'
import {RequestParams} from '../api/api'
import {IBase} from '../typings'
import Taro from '@tarojs/taro'
import {observable, action, flow, extendObservable, runInAction} from 'mobx'
import {useLocalStore} from 'mobx-react'
import {delay, os} from '@/utils/util'
import QueryString from 'qs'
import {wechatConfig} from '@/utils/wechat-config'

type Api = typeof api
type NameSpace = Exclude<keyof Api, 'test' | 'request' | 'setSecurityData' | 'instance'>
type User = Api['user']
type Order = Api['order']
type Banner = Api['banner']
type Activity = Api['activity']
type Nfc = Api['nfc']
type BlindBox = Api['blindbox']
type Invoices = {}

export type ApiNS = User & Invoices & Order & Banner & Activity & Nfc & BlindBox

const defaultLoginState = {
  nickName: '',
  phoneNumber: '',
  avatar: '',
  userId: '',
  account: '',
  openId: '',
  logined: false,
  isKycAuth: false,
  haveTradePassword: false,
  /**国版链账号*/
  zswAccount:''
}

/**
 * Store 只做三件事
 * 1. 管理用户的登录状态
 * 2. 收集用户的数据，保证数据的唯一性 (listSet 也可以优化成一 Proxy 对象，数据从 detailSet 中获取)
 * 3. 把 plain 数据转换成 proxy
 * 在 UI 上经常需要先把 ID 转换到 detailSet 中，store.observableDetailIfNull({ id: xxx })
 * 目前没有想到更好的方法省略这一步
 */
class Store {
  @observable state = {
    ...defaultLoginState,
  }

  @observable detailSet = {} as Record<string, IBase>

  @observable listSet = {} as Record<
    string,
    {
      list: IBase[]
      /**
       * @deprecated 目前不需要
       */
      fallFlowList: IBase[][]
    }
  >

  @action
  observableDetail<T extends {id: string}>(value: T | T[]) {
    if (Array.isArray(value)) {
      value.forEach((item) => this.observableDetail(item))
      return
    }
    if (!value || !value.id) {
      return
    }

    const originalDetail = store.detailSet[value.id]
    if (!originalDetail) {
      extendObservable(store.detailSet, {[value.id]: value})
      return
    }

    store.detailSet[value.id] = Object.assign({}, originalDetail, value)
  }

  @action
  observableDetailIfNull<T extends {id: string}>(value: T | T[]) {
    if (Array.isArray(value)) {
      value.forEach((item) => this.observableDetail(item))
      return
    }
    if (!value || !value.id) {
      return
    }

    const originalDetail = store.detailSet[value.id]
    if (!originalDetail) {
      extendObservable(store.detailSet, {[value.id]: value})
      return
    }
  }

  @action
  observableListIfNull<T extends keyof ApiNS>(key: T) {
    const originalList = store.listSet[key]
    if (!originalList) {
      extendObservable(store.listSet, {
        [key]: observable.object({
          list: [],
          fallFlowList: [],
        }),
      })
      return
    }
  }

  @action
  observableList<T extends keyof ApiNS>(key: T, set: {list: IBase[]; fallFlowList: IBase[][]}) {
    const originalList = store.listSet[key]
    if (!originalList) {
      this.observableListIfNull(key)
    }

    store.listSet[key].list = set.list ?? []
    store.listSet[key].fallFlowList = set.fallFlowList ?? []
  }

  @action
  removeByListSet<T extends keyof ApiNS>(key: T, id: string) {
    if (!store.listSet[key]) {
      return
    }
    if (store.listSet[key].list.some((item) => id === item.id)) {
      store.listSet[key].list = store.listSet[key].list.filter((item) => id !== item.id)
    }
  }

  @action
  addToListSet<T extends keyof ApiNS>(key: T, id: string) {
    if (!this.detailSet[id]) {
      console.warn('not in detailSet')
      return
    }
    if (!store.listSet[key]) {
      console.warn(`${key} not observable`)
      return
    }
    if (store.listSet[key].list.some((item) => item.id === id)) {
      console.warn(`${key} has same id ${id}`)
      return
    }
    store.listSet[key].list = [this.detailSet[id], ...store.listSet[key].list]
  }

  /**
   * @deprecated 使用 loadApiOrSelectDetail, 支持更多的参数
   */
  async loadOrSelectDetail<T extends keyof ApiNS>(this: any, name: T, body: string, params?: RequestParams) {
    const detail = this.detailSet[body]
    /**
     * keys > 2 是因为会使用 id 初始化 detail
     */
    if (detail && Object.keys(detail).length > 2) {
      return this.detailSet[body]
    }
    const response = await this.load(name, body, params)
    return response
  }

  async loadApiOrSelectDetail<F extends (...args: any[]) => Promise<any>>(this: any, fetch: F, ...body: Parameters<F>) {
    const detail = this.detailSet[body]
    if (detail && Object.keys(detail).length > 2) {
      return this.detailSet[body]
    }
    const response = await this.loadByApi({api: fetch(...body)})
    return response
  }

  /**
   * @deprecated 使用 loadByApi
   */
  load = flow(function* <T extends keyof ApiNS>(
    this: any,
    name: T,
    body: Parameters<ApiNS[T]>[0],
    params?: RequestParams
  ) {
    const key = Object.keys(api).find((key) => {
      const namespace = api[key as NameSpace]
      if (!namespace || typeof namespace !== 'object') return false
      return name in namespace
    }) as NameSpace | undefined
    if (!key) {
      throw new Error('not support name with: ' + name)
    }

    const namespace = api[key] as any
    if (!namespace) {
      throw new Error('not support namespace with: ' + key)
    }

    const response = yield this.loadByApi({api: namespace[name]?.(body, params)})
    return response
  })

  /**
   * 把接口返回数据直接加到 mobx 的工具方法
   * 会将最终的数据解包后返回
   */
  loadByApi = flow(function* (this: any, options: {api: Promise<any>}) {
    // @ts-ignore
    const response = yield options.api
    const responseData = response.data

    if (responseData.list) {
      this.observableDetail(responseData.list)
    }

    if (responseData.id) {
      this.observableDetail(responseData)
    }

    if (responseData.result === 'ok' || responseData.resutl === 'ok' || responseData.code==200) {
      const data = responseData.data
      if (!data) {
        return responseData
      }
      if (data.list) {
        this.observableDetail(data.list)
      }
      if (data.id) {
        this.observableDetail(data)
      }
      return data
    }

    return responseData
  })

  /**
   * 以下是登录模块的 actions
   */
  async logout() {
    await Taro.removeStorage({key: 'access_token'})
    await Taro.setStorage({key: 'logout', data: true})
    await Taro.removeStorage({key: 'YZS_USER_INFO'}).catch(() => {})

    runInAction(() => {
      this.state = {...defaultLoginState}
    })
  }

  /**
   * 登录探针
   */
  loginProbe = flow(function* (this: any, userInfo?: {avatar: string; nickName: string}) {
    let loginResponse
    Taro.showLoading({title: '加载中...'})
    if (os.isWeapp) {
      const loginRst = yield Taro.login()
      loginResponse = yield api.user.miniprogramLoginCreate({code: loginRst.code, userInfo})
    }

    if (os.isWeb) {
      try {
        const accessToken = yield Taro.getStorageSync('access_token')
        if (accessToken) {
          loginResponse = yield api.user.miniprogramMeProfileList().catch(() => {})
        }
      } catch (error) {
        console.log('🚀 ~ file: index.ts ~ line 260 ~ Store ~ loginProbe=flow ~ error', error)
      }
    }

    // if (os.isWechatWeb && /paying/.test(location.pathname)) {
    //   const searchQuery = QueryString.parse(location.search.slice(1))
    //   // 后台已经有用户信息，静默登录，获取用户信息需要用户点击微信登录
    //   if (!searchQuery.code && loginResponse?.data?.openId) {
    //     const response = yield api.user.getAuthroizeUrlList({
    //       redirectUri: encodeURIComponent(window.location.href.replace(/code=/g, 'pre_code=')),
    //       // 后台已经有用户信息，静默登录, 否则像用户获取用户信息
    //       scope: 'snsapi_base',
    //     })
    //     Taro.hideLoading()
    //     // window.location.href = response.data.url
    //     window.location.replace(response.data.url)
    //     return
    //   }

    //   if (!searchQuery.code && !loginResponse) {
    //     const currentPage = location.hash.slice(1)
    //     Taro.navigateTo({
    //       url: `/pages/login/login?to=${
    //         currentPage.startsWith('/pages/login/login') ? '' : encodeURIComponent(currentPage)
    //       }`,
    //     })
    //   }

    //   // 拿到 Code 去后端刷新用户信息
    //   if (searchQuery.code && !loginResponse) {
    //     try {
    //       loginResponse = yield api.user.loginByOffiAccountCreate({code: searchQuery.code as string})
    //     } catch (error) {
    //       // 用户可能刷新，但是不需要更新用户的 Code
    //     }
    //   }
    //   //
    Taro.hideLoading()

    if (os.isWechatWeb) {
      try {
        yield wechatConfig()
        ;(wx as any).ready(function () {
          console.log('wx.ready success')
          // 朋友圈分享功能
          ;(wx as any).updateTimelineShareData({
            title: '鸭藏', // 分享标题
            link: 'https://market.platypus.art', // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl:
              'https://platypus.oss-cn-hongkong.aliyuncs.com/0181b28c-32fe-4bf5-8fa6-5991d2bc4fb6/1662091004768cb1e6557-28d0-4500-a642-39cf6acfef00?x-oss-process=image/format,webp/quality,Q_60', // 分享图标
          })
          // 朋友分享功能
          ;(wx as any).updateAppMessageShareData({
            title: '鸭藏', // 分享标题
            desc: '好藏品，藏鸭藏。鸭藏作为公司倾力打造的数字文创发行平台，将陆续推出优质的数字文创项目，为用户提供精彩创新的数字文创卓越体验，为实体产业带来实效持续的数字文创交叉赋能。', // 分享描述
            link: 'https://market.platypus.art', // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl:
              'https://platypus.oss-cn-hongkong.aliyuncs.com/0181b28c-32fe-4bf5-8fa6-5991d2bc4fb6/1662091004768cb1e6557-28d0-4500-a642-39cf6acfef00?x-oss-process=image/format,webp/quality,Q_60', // 分享图标
          })
        })
        ;(wx as any).error(function (res: any) {
          console.log('wx.error', res)
        })
      } catch (error) {}
    }
    // }

    Taro.hideLoading()
    if (!loginResponse) {
      return
    }

    const token = loginResponse.data.token
    // 用 token 登录没有返回新 token
    if (token) {
      yield Taro.setStorageSync('access_token', token)
    }
    let channelCode
    if (os.isWechatWeb) {
      channelCode = sessionStorage.getItem('channelCode')
    } else {
      channelCode = Taro.getStorageSync('channelCode')
    }
    if (channelCode) {
      yield api.order.userChannelRecord({
        code: channelCode,
        operation_type: 'register',
      })
    }

    // 强制绑定微信
    let openId = loginResponse.data.openId || ''
    if (os.isWechatWeb && /paying/.test(location.pathname)) {
      const searchQuery = QueryString.parse(location.search.slice(1))
      if (searchQuery.code && !openId) {
        // try {
        //   yield wechatConfig()
        // } catch (error) {}
        try {
          loginResponse = yield api.user.bindWx({code: searchQuery.code})
        } catch (error) {
          // store.logout()
          return
        }
      }
    }
    yield Taro.setStorageSync(
      'YZS_USER_INFO',
      JSON.stringify({...loginResponse.data, phoneNumber: loginResponse.data.mobile})
    )
    let invitation
    if (os.isWechatWeb) {
      invitation = sessionStorage.getItem('invitation')
    } else {
      invitation = Taro.getStorageSync('invitation')
    }
    if (invitation && loginResponse.data.newUser) {
      yield api.invite.inviteRecord({
        invite_code: invitation,
      })
    }
    this.state.userId = loginResponse.data.userId
    this.state.nickName = loginResponse.data.nickName
    this.state.avatar = loginResponse.data.avatar
    this.state.account = loginResponse.data.account
    this.state.logined = true
    this.state.phoneNumber = loginResponse.data.mobile || ''
    this.state.openId = loginResponse.data.openId || ''
    this.state.isKycAuth = !!loginResponse.data.isKycAuth
    this.state.haveTradePassword = !!loginResponse.data.haveTradePassword
    this.state.zswAccount = loginResponse.data.zswAccount
    return loginResponse.data
  })

  loginByMobile = flow(function* (this: any, phone: string, captcha: string) {
    let invitation
    if (os.isWechatWeb) {
      invitation = sessionStorage.getItem('invitation')
    } else {
      invitation = Taro.getStorageSync('invitation')
    }
    // if (invitation && response.data.newUser) {
    //   yield api.invite.inviteRecord({
    //     invite_code: invitation,
    //   })
    // }
    let params: any = {
      mobile: phone,
      verificationCode: captcha,
    }
    if (invitation) {
      params = {
        ...params,
        invite_code: invitation,
      }
    }
    if (!os.isWechatWeb) {
      params = {
        ...params,
        activeNewUser: true,
      }
    }
    const response = yield api.user.loginByMobileCreate(params as any)

    const token = response.data.token
    yield Taro.setStorageSync('access_token', token)

    let channelCode
    if (os.isWechatWeb) {
      channelCode = sessionStorage.getItem('channelCode')
    } else {
      channelCode = Taro.getStorageSync('channelCode')
    }
    if (channelCode) {
      yield api.order.userChannelRecord({
        code: channelCode,
        operation_type: 'register',
      })
    }

    this.state.userId = response.data.userId
    this.state.nickName = response.data.nickName
    this.state.avatar = response.data.avatar
    this.state.account = response.data.account
    this.state.isKycAuth = !!response.data.isKycAuth
    this.state.haveTradePassword = !!response.data.haveTradePassword
    this.state.logined = true
    this.state.phoneNumber = response.data.mobile || ''
    this.state.openId = response.data.openId || ''
    this.state.zswAccount = response.data.zswAccount || ''
  })

  /**
   * 用户手动触发登录
   */
  loginWithUserProfile = flow(function* (this: any) {
    const {userInfo} = yield Taro.getUserProfile({desc: '你的昵称和头像'})
    const inManualLogout = Taro.getStorageSync('logout')

    if (inManualLogout) {
      this.loginProbe()
      Taro.removeStorage({key: 'logout'})
      Taro.removeStorage({key: 'YZS_USER_INFO'}).catch(() => {})
      return
    }

    Taro.removeStorage({key: 'logout'})
    Taro.removeStorage({key: 'YZS_USER_INFO'}).catch(() => {})

    try {
      yield this.loginProbe({
        avatar: userInfo.avatarUrl,
        nickName: userInfo.nickName,
      })

      setTimeout(async () => {
        await this.loginProbe({
          avatar: userInfo.avatarUrl,
          nickName: userInfo.nickName,
        })
      }, 1000)
    } catch (error) {
      console.log(error)
    }
  })

  /**
   * 登录改成了异步的了，需要后面再用到的时候判断钱包是否已经生成了
   */
  retryLoginToGenerateWallet = flow(function* () {
    if (this.state.account) {
      return
    }
    let retryCount = 5
    while (retryCount) {
      yield this.loginProbe()
      if (this.state.account) {
        return
      }
      yield delay(1000)
      retryCount--
    }
    throw new Error('generate account fail')
  })
}

export const store = new Store()

// @ts-ignore
Taro.store = store

export type IStore = typeof store

export const useStore = () => {
  return useLocalStore(() => store)
}
