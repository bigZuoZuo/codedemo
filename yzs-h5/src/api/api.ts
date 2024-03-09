/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface GUserRegMiniprogramBody {
  code: string
  userInfo?: { avatar?: string; nickName?: string }
}

export interface GHomeSearchListIn {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip: number
  title?: string
  sortBy: 'created_at' | 'price' | 'heat'

  /** @format int32 */
  sort: 1 | -1
}

export interface GAuditByCondIn {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  title?: string
  sortBy?: 'created_at'

  /** @format int32 */
  sort?: 1 | -1
}

export interface CommentBody {
  auditId: string
  content: string
}

export interface CommentListBody {
  auditId: string

  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip: number
  title?: string
  sortBy: 'created_at' | 'price' | 'heat'

  /** @format int32 */
  sort: 1 | -1
}

export interface HomeHotSearchListIn {
  /**
   * @format int32
   * @min 1
   * @max 20
   */
  limit: number
}

export interface HomeShareCollect {
  nftId: string
  userId?: string
}

export interface HomeCollectUserIn {
  nftId?: string
  auditId?: string
  userId?: string
}

export interface HomeSearchHeatFSIn {
  nftId: string
}

export interface UserPublishNFC {
  id: string
  title?: string
  content?: string
  price?: string
  link?: string
}

export interface MePublishNFTBody {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at'

  /** @format int32 */
  sort?: 1 | -1
  title?: string
  state?: 'created' | 'pending' | 'passed' | 'failed' | 'offsell' | 'canceled'
}

export interface MeBuyOrSellerNFTBody {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at'
  title?: string

  /** @format int32 */
  sort?: 1 | -1
}

export interface MeUserColletBody {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at'

  /** @format int32 */
  sort?: 1 | -1
}

export interface GUserAddressBody {
  province?: string
  city?: string
  area?: string
  street?: string
  address?: string
  mobile: string
  contactName: string
}

export interface GUserAddressUpdateBody {
  province?: string
  city?: string
  area?: string
  street?: string
  address?: string
  mobile?: string
  contactName?: string
  isDefault?: boolean
}

export interface HomeCancelCollectUserIn {
  nftId?: string
  auditId?: string
}

export interface OrderCreateBodyPM {
  nftId?: string
  auditId?: string
  blindboxId?: string
  address?: string
  contactName?: string
  contactMobile: string
  type: 'platform' | 'user' | 'blind_box'
  skuInfo?: string

  /** @format int32 */
  amount: number
}

export interface OrderCreateBodySM {
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  nftId: string
  price: string
  address?: string
  contactName?: string
  contactMobile: string
}

export interface GOrderTNBody {
  orderId: string
  trackNumber: string
}

export interface OrderId {
  orderId: string
}

export interface ApiPaymentBody {
  outTradeNo: string
  orderId: string
  tradeType?: 'JSAPI' | 'NATIVE' | 'APP' | 'MWEB'
}

export interface GOrderPaymentFakeBody {
  eventType: string
  outTradeNo: string
}

export interface GOrderByCondIn {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at'

  /** @format int32 */
  sort?: 1 | -1
  state?: 'pending' | 'shipped' | 'received' | 'completed' | 'canceled'
  buyerId?: string
}

export interface OrderIds {
  orderIds: string[]
  paymentStatus?: 'success' | 'fail'
}

export interface OrderIdAddressRel {
  orderId: string
  address: string
  contactName?: string
  contactMobile?: string
}

export interface BaseBody {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at'

  /** @format int32 */
  sort?: 1 | -1
}

export interface GUploadImagesBody {
  uploadURL: string[]
}

export interface ReplyBody {
  auditId: string
  content: string
  commentId: string
  repliedId: string
  repliedNickName: string
  repliedAvatar?: string
}

export interface UserPublishNFCStatus {
  nftId?: string
  nftNumber: string
}

export interface ReplyListBody {
  auditId: string
  commentId: string

  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip: number
  sortBy?: 'created_at' | 'price' | 'heat'

  /** @format int32 */
  sort?: 1 | -1
}

export interface UserPublishNFCCreated {
  userId?: string
  nftId?: string
  userName: string
  nftNumber: string
  skuId?: string
  title: string
  content: string
  images: string[]
  price?: string
  link: string
  avatar?: string
}

export interface IdSchema {
  id: string
}

export interface MeUserShareBody {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at'

  /** @format int32 */
  sort?: 1 | -1
}

export interface AuditNftListBody {
  userId: string

  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip: number
  sortBy?: string

  /** @format int32 */
  sort?: 1 | -1
}

export interface MeUserReplyBody {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at'

  /** @format int32 */
  sort?: 1 | -1
}

export interface AssetBody {
  /**
   * @format int32
   * @min 1
   * @max 500
   */
  limit?: number

  /**
   * @format int32
   * @min 0
   * @max 500
   */
  skip?: number
  sortBy?: 'created_at' | 'name' | 'price'

  /** @format int32 */
  sort?: 1 | -1
  type?: 'nft' | 'blind_box'
  sourceType?: 'buy' | 'airdrop' | 'blind_box' | 'synthesis'
}

export interface OrderCreateBody {
  type: 'platform' | 'user' | 'blind_box'
  address?: string
  contactName?: string
  contactMobile: string
  items: { item_id: string; sku_id?: string; amount: number }[]
}

export interface UserBlindBoxBody {
  blindboxId: string
  blindboxNumber: string
}

export interface SendSmsVerificationCodeBody {
  mobile: string
  type: 'login'
  sessionId: string
  sig: string
  token: string
}

export interface UserLoginByMobileBody {
  mobile: string
  verificationCode: string
  activeNewUser?: boolean
}

export interface GMeProfileBody {
  avatar?: string
  nickName?: string
}

export interface MeChangeMobileBody {
  newMobile: string
  verificationCode: string
}

export interface UserLoginByOffiAccountBody {
  code: string
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios'
import { Collect, CollectList, QueryShare, ShareList, ShareData, SendComment, QueryComments, ReplyList, SendReply, FlowSale, QuerySales } from './type'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || 'https://p4030174-uundefined-2f7661ec.app.run.fish/api/v1',
    })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`
      )
      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = (format && this.format) || void 0

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      requestParams.headers.common = { Accept: '*/*' }
      requestParams.headers.post = {}
      requestParams.headers.put = {}

      body = this.createFormData(body as Record<string, unknown>)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    })
  }
}

/**
 * @title project-4020174
 * @version 1.0.0
 * @baseUrl https://p4030174-uundefined-2f7661ec.app.run.fish/api/v1
 *
 * Backend Project
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  user = {
    /**
     * No description
     *
     * @tags user
     * @name MiniprogramLoginCreate
     * @request POST:/user/miniprogram/login
     */
    miniprogramLoginCreate: (data: GUserRegMiniprogramBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramSearchIndexCreate
     * @summary search home index
     * @request POST:/user/miniprogram/searchIndex
     */
    miniprogramSearchIndexCreate: (data: GHomeSearchListIn, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/searchIndex`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftSearchCreate
     * @request POST:/user/miniprogram/nft/search
     */
    miniprogramNftSearchCreate: (data: GAuditByCondIn, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/search`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftCommentCreate
     * @summary comment nft
     * @request POST:/user/miniprogram/nft/comment
     */
    miniprogramNftCommentCreate: (data: CommentBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/comment`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftCommentListCreate
     * @summary NFT comment list
     * @request POST:/user/miniprogram/nft/comment/list
     */
    miniprogramNftCommentListCreate: (data: CommentListBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/comment/list`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramSearchIndexHeatUpdate
     * @summary update nft heat
     * @request PUT:/user/miniprogram/searchIndex/heat
     */
    miniprogramSearchIndexHeatUpdate: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/searchIndex/heat`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramHotSearchCreate
     * @summary hot search for home index
     * @request POST:/user/miniprogram/hotSearch
     */
    miniprogramHotSearchCreate: (data: HomeHotSearchListIn, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/hotSearch`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramShareCreate
     * @summary user share NFT
     * @request POST:/user/miniprogram/share
     */
    miniprogramShareCreate: (data: HomeShareCollect, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/share`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramCollectCreate
     * @summary User collect NFT or Audit, if auditId is not empty, collect audit.
     * @request POST:/user/miniprogram/collect
     */
    miniprogramCollectCreate: (data: HomeCollectUserIn, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/collect`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramFuzzySearchCreate
     * @summary fuzzySearch  for heatInc
     * @request POST:/user/miniprogram/fuzzySearch
     */
    miniprogramFuzzySearchCreate: (data: HomeSearchHeatFSIn, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/fuzzySearch`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramClickSearchCreate
     * @summary clickSearch for heatInc
     * @request POST:/user/miniprogram/clickSearch
     */
    miniprogramClickSearchCreate: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/clickSearch`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftPublishCreate
     * @summary user miniProgram publish/republish NFT
     * @request POST:/user/miniprogram/nft/publish
     */
    miniprogramNftPublishCreate: (data: UserPublishNFC, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/publish`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNftPublishCreate
     * @summary my publish NFT
     * @request POST:/user/miniprogram/me/nft/publish
     */
    miniprogramMeNftPublishCreate: (data: MePublishNFTBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nft/publish`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNftBuyerCreate
     * @request POST:/user/miniprogram/me/nft/buyer
     */
    miniprogramMeNftBuyerCreate: (data: MeBuyOrSellerNFTBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nft/buyer`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNftSellerCreate
     * @summary my seller NFT
     * @request POST:/user/miniprogram/me/nft/seller
     */
    miniprogramMeNftSellerCreate: (data: MeBuyOrSellerNFTBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nft/seller`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNfcDetail
     * @summary NFC detail
     * @request GET:/user/miniprogram/nfc/{id}
     */
    miniprogramNfcDetail: ({id,type}:{id:string;type?:'nfc'|'chain';}, params: RequestParams = {}) => {
      const url = type === "chain" ? "/zsw/asset/" :"/user/miniprogram/nfc/"
      return this.request<any, any>({
        path: url+id,
        method: 'GET',
        ...params,
      })
    },

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNfcCollectCreate
     * @summary user' collect
     * @request POST:/user/miniprogram/me/nfc/collect
     */
    miniprogramMeNfcCollectCreate: (data: MeUserColletBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nfc/collect`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramAddressCreate
     * @summary user add address
     * @request POST:/user/miniprogram/address
     */
    miniprogramAddressCreate: (data: GUserAddressBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/address`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramAddressList
     * @request GET:/user/miniprogram/address
     */
    miniprogramAddressList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/address`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramAddressUpdate
     * @summary user update address
     * @request PUT:/user/miniprogram/address/{id}
     */
    miniprogramAddressUpdate: (id: string, data: GUserAddressUpdateBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/address/${id}`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramAddressDelete
     * @summary user delete address
     * @request DELETE:/user/miniprogram/address/{id}
     */
    miniprogramAddressDelete: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/address/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramAddressDetail
     * @request GET:/user/miniprogram/address/{id}
     */
    miniprogramAddressDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/address/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramCollectCancelCreate
     * @request POST:/user/miniprogram/collect/cancel
     */
    miniprogramCollectCancelCreate: (data: HomeCancelCollectUserIn, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/collect/cancel`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramCollectDetail
     * @summary find the NFC whether user collect it or  not s.homeCollectUserIn
     * @request GET:/user/miniprogram/collect/{id}
     */
    miniprogramCollectDetail: (id: string, query?: { type?: string }, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/collect/${id}`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramOrderPmarketCreate
     * @summary Primary market , user create order in searchIndex(Transactions between users and platforms )
     * @request POST:/user/miniprogram/order/pmarket
     */
    miniprogramOrderPmarketCreate: (data: OrderCreateBodyPM, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/order/pmarket`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramOrderSmarketCreate
     * @summary Secondary market , user create order in searchIndex(Transactions between users and platforms )
     * @request POST:/user/miniprogram/order/smarket
     */
    miniprogramOrderSmarketCreate: (data: OrderCreateBodySM, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/order/smarket`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeOrderCreate
     * @request POST:/user/miniprogram/me/order
     */
    miniprogramMeOrderCreate: (data: GOrderByCondIn, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/order`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramPhonenumberCreate
     * @summary miniProgram get user phoneNumber
     * @request POST:/user/miniprogram/phonenumber
     */
    miniprogramPhonenumberCreate: (data: GUserRegMiniprogramBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/phonenumber`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNfcCreate
     * @summary user' NFC list
     * @request POST:/user/miniprogram/me/nfc
     */
    miniprogramMeNfcCreate: (data: BaseBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nfc`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftReplyCreate
     * @request POST:/user/miniprogram/nft/reply
     */
    miniprogramNftReplyCreate: (data: ReplyBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/reply`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftPublishStatusCreate
     * @summary query the NFC can publish
     * @request POST:/user/miniprogram/nft/publish/status
     */
    miniprogramNftPublishStatusCreate: (data: UserPublishNFCStatus, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/publish/status`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNftBuyerDetail
     * @request GET:/user/miniprogram/me/nft/buyer/{id}
     */
    miniprogramMeNftBuyerDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nft/buyer/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftReplyListCreate
     * @request POST:/user/miniprogram/nft/reply/list
     */
    miniprogramNftReplyListCreate: (data: ReplyListBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/reply/list`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNftSellerDetail
     * @request GET:/user/miniprogram/me/nft/seller/{id}
     */
    miniprogramMeNftSellerDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nft/seller/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNftPublishDetail
     * @request GET:/user/miniprogram/me/nft/publish/{id}
     */
    miniprogramMeNftPublishDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nft/publish/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftPublishCreatedCreate
     * @summary user publish audit created
     * @request POST:/user/miniprogram/nft/publish/created
     */
    miniprogramNftPublishCreatedCreate: (data: UserPublishNFCCreated, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/publish/created`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftPublishCancelCreate
     * @summary cancel the publish NFC
     * @request POST:/user/miniprogram/nft/publish/cancel
     */
    miniprogramNftPublishCancelCreate: (data: IdSchema, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/publish/cancel`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramDetailDetail
     * @request GET:/user/miniprogram/detail/{id}
     */
    miniprogramDetailDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/detail/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftCommentReadUpdate
     * @summary set nft comment to is read status
     * @request PUT:/user/miniprogram/nft/comment/read/{id}
     */
    miniprogramNftCommentReadUpdate: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/comment/read/${id}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeStatList
     * @summary get login user's stat data
     * @request GET:/user/miniprogram/me/stat
     */
    miniprogramMeStatList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/stat`,
        method: 'GET',
        ...params,
      }),
    blockchainApi: () =>
      this.request<any, any>({
        path: `/user/blockchain/account`,
        method: 'POST',
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNfcShareCreate
     * @summary user' share NFC
     * @request POST:/user/miniprogram/me/nfc/share
     */
    miniprogramMeNfcShareCreate: (data: MeUserShareBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nfc/share`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramAuditUserPublishCreate
     * @summary user passed audit list
     * @request POST:/user/miniprogram/audit/user/publish
     */
    miniprogramAuditUserPublishCreate: (data: AuditNftListBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/audit/user/publish`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramNftStatDetail
     * @summary get an audit NFT stat data
     * @request GET:/user/miniprogram/nft/stat/{id}
     */
    miniprogramNftStatDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/nft/stat/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeNfcReplyCreate
     * @summary user' replies
     * @request POST:/user/miniprogram/me/nfc/reply
     */
    miniprogramMeNfcReplyCreate: (data: MeUserReplyBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nfc/reply`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeAssetCreate
     * @summary get user assets
     * @request POST:/user/miniprogram/me/asset
     */
    miniprogramMeAssetCreate: (data: any, params: RequestParams = {}) => {

      if(data?.type==="chain"){
        return this.request<any, any>({
          path: `/zsw/asset`,
          method: 'GET',
          type: ContentType.Json,
          ...params,
        })
      }

      if (data?.type === 'nft') {
        return this.request<any, any>({
          path: `/me/all_asset`,
          method: 'GET',
          query: {
            pageSize: data.limit,
            current: data.skip / data.limit + 1,
          },
          type: ContentType.Json,
          ...params,
        })
      } else {
        return this.request<any, any>({
          path: `/user/miniprogram/me/asset`,
          method: 'POST',
          body: data,
          type: ContentType.Json,
          ...params,
        })
      }
    },
    miniprogramMeAssetListCreate: (data: any, params: RequestParams = {}) => {
      return this.request<any, any>({
        path: `/user/miniprogram/me/asset`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      })
    },

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramOrderCreateCreate
     * @summary Generic order creation
     * @request POST:/user/miniprogram/order/create
     */
    miniprogramOrderCreateCreate: (data: OrderCreateBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/order/create`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeBlindboxOpenUpdate
     * @summary open blindbox by user_blind_box_id
     * @request PUT:/user/miniprogram/me/blindbox/open/{id}
     */
    miniprogramMeBlindboxOpenUpdate: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/blindbox/open/${id}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeBlindboxGetCreate
     * @request POST:/user/miniprogram/me/blindbox/get
     */
    miniprogramMeBlindboxGetCreate: (data: UserBlindBoxBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/blindbox/get`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeSynthesisMakeUpdate
     * @request PUT:/user/miniprogram/me/synthesis/make/{id}
     */
    miniprogramMeSynthesisMakeUpdate: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/synthesis/make/${id}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name LoginByMobileCreate
     * @request POST:/user/loginByMobile
     */
    loginByMobileCreate: (data: UserLoginByMobileBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/loginByMobile`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeProfileUpdate
     * @summary update user avatar or nick name, and new jwt token return.
     * @request PUT:/user/miniprogram/me/profile
     */
    miniprogramMeProfileUpdate: (data: GMeProfileBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/profile`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeProfileList
     * @request GET:/user/miniprogram/me/profile
     */
    miniprogramMeProfileList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/profile`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MiniprogramMeChangeMobileUpdate
     * @request PUT:/user/miniprogram/me/changeMobile
     */
    miniprogramMeChangeMobileUpdate: (data: MeChangeMobileBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/changeMobile`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    bindMobileApi: (data: MeChangeMobileBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/bindMobile`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name userKycSet
     * @request POST:/user/kyc
     */
    userKycSet: (data: MeChangeMobileBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/kyc`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name LoginByOffiAccountCreate
     * @request POST:/user/loginByOffiAccount
     */
    loginByOffiAccountCreate: (data: UserLoginByOffiAccountBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/loginByOffiAccount`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetAuthroizeUrlList
     * @request GET:/user/getAuthroizeUrl
     */
    getAuthroizeUrlList: (query: { redirectUri: string; scope: string }, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/getAuthroizeUrl`,
        method: 'GET',
        query: query,
        ...params,
      }),

    bindWx: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/bindWx`,
        method: 'POST',
        body: data,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name OffiaccountJssdkList
     * @request GET:/user/offiaccount/jssdk
     */
    offiaccountJssdkList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/offiaccount/jssdk?url=${location.href}`,
        method: 'GET',
        ...params,
      }),

    /**获取用户公开信息*/
    getUserInfo: (id: string) =>
      this.request<any, any>({
        path: `/user/${id}`,
        method: 'GET',
      }),


  }
  order = {
    /**
     * No description
     *
     * @tags order
     * @name TrackNumberCreate
     * @summary seller/platform input the order trackNumber
     * @request POST:/order/trackNumber
     */
    trackNumberCreate: (data: GOrderTNBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/trackNumber`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name CompletedCreate
     * @summary confirm
     * @request POST:/order/completed
     */
    completedCreate: (data: OrderId, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/completed`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name PaymentCreate
     * @summary prepaid payment
     * @request POST:/order/payment
     */
    paymentCreate: (data: ApiPaymentBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/payment`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name PaymentFakeCreate
     * @summary payment fake
     * @request POST:/order/payment/fake
     */
    paymentFakeCreate: (data: ApiPaymentBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/payment/fake`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name PaymentNotifyFakeCreate
     * @summary miniProgram payment  successful Wechat notify
     * @request POST:/order/payment/notify/fake
     */
    paymentNotifyFakeCreate: (data: GOrderPaymentFakeBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/payment/notify/fake`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name PaymentNotifyCreate
     * @summary refer https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7&index=8
     * @request POST:/order/payment/notify
     */
    paymentNotifyCreate: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/payment/notify`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name DeleteCreate
     * @summary batch remove order
     * @request POST:/order/delete
     */
    deleteCreate: (data: OrderIds, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/delete`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name CancelCreate
     * @summary cancel the order
     * @request POST:/order/cancel
     */
    cancelCreate: (data: OrderId, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/cancel`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name AddressUpdate
     * @summary update the order address
     * @request PUT:/order/address
     */
    addressUpdate: (data: OrderIdAddressRel, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/address`,
        method: 'PUT',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    prePurchase: (id: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/nft/${id}/prePurchase`,
        method: 'GET',
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name OrderDetail
     * @summary user  order detail
     * @request GET:/order/{id}
     */
    orderDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/${id}`,
        method: 'GET',
        ...params,
      }),
    // 查询物流
    orderTrackApi: (company: any, trackNumber: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/order/track/${company}/${trackNumber}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags order
     * @name orderPay
     * tradeType：ali 支付宝h5 wx 微信h5 uac 银联云闪付 h5tomini 微信h5转小程序
orderId：订单ID
returnUrl：支付完成后跳转的url，如果不需要可以不提供
     */
    orderPay: (query: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/order/payment/unionpay/url',
        method: 'GET',
        query,
        ...params,
      }),

    userChannelRecord: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/userchannel/record',
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  usera = {
    /**
     * No description
     *
     * @tags usera
     * @name UserMiniprogramMeNftCreate
     * @request POST:/usera/user/miniprogram/me/nft
     */
    userMiniprogramMeNftCreate: (data: BaseBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/usera/user/miniprogram/me/nft`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  upload = {
    /**
     * No description
     *
     * @tags upload
     * @name AuthorizeApplyList
     * @request GET:/upload/authorize/apply
     */
    authorizeApplyList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/upload/authorize/apply`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags upload
     * @name ImagesCreate
     * @request POST:/upload/images
     */
    imagesCreate: (data: GUploadImagesBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/upload/images`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  banner = {
    /**
     * No description
     *
     * @tags banner
     * @name BannerList
     * @request GET:/banner
     */
    bannerList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/banner`,
        method: 'GET',
        ...params,
      }),
    zoneList: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/p/partner-zones/list/${data.page}?size=${data.size}`,
        method: 'GET',
        ...params,
      }),
    noticeList: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/notice`,
        method: 'GET',
        query: data,
        ...params,
      }),
  }
  // 专区
  zone = {
    zoneDetail: (params: any) =>
      this.request<any, any>({
        path: `/p/partner-zones/${params}`,
        method: 'GET',
      }),
  }
  activity = {
    /**
     * No description
     *
     * @tags activity
     * @name ActivityDetail
     * @summary query active by active id
     * @request GET:/activity/{id}
     */
    activityDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/activity/${id}`,
        method: 'GET',
        ...params,
      }),
  }
  nfc = {
    /**
     * No description
     *
     * @tags nfc
     * @name GetNfc
     * @summary query NFC sku
     * @request GET:/nfc/sku/{id}
     */
    getNfc: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/nfc/sku/${id}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags nfc
     * @name CategoryDetail
     * @request GET:/nfc/category/{id}
     */
    categoryDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/nfc/category/${id}`,
        method: 'GET',
        ...params,
      }),
  }
  test = {
    /**
     * No description
     *
     * @tags test
     * @name TestList
     * @request GET:/test
     */
    testList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/test`,
        method: 'GET',
        ...params,
      }),
  }
  blindbox = {
    /**
     * No description
     *
     * @tags blindbox
     * @name ListCreate
     * @request POST:/blindbox/list
     */
    listCreate: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/blindbox/list`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags blindbox
     * @name BlindboxDetail
     * @request GET:/blindbox/{id}
     */
    blindboxDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/blindbox/${id}`,
        method: 'GET',
        ...params,
      }),
  }
  synthesis = {
    /**
     * No description
     *
     * @tags synthesis
     * @name ListCreate
     * @request POST:/synthesis/list
     */
    listCreate: (data: BaseBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/synthesis/list`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    syncTime: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/sync',
        method: 'GET',
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags synthesis
     * @name SynthesisDetail
     * @request GET:/synthesis/{id}
     */
    synthesisDetail: (id: string, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/synthesis/${id}`,
        method: 'GET',
        ...params,
      }),
  }
  sms = {
    /**
     * No description
     *
     * @tags sms
     * @name SendVerificationCodeCreate
     * @request POST:/sms/sendVerificationCode
     */
    sendVerificationCodeCreate: (data: SendSmsVerificationCodeBody, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/sms/sendVerificationCode`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  level = {
    /**
     * No description
     *
     * @tags level
     * @name ListList
     * @request GET:/level/list
     */
    listList: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/level/list`,
        method: 'GET',
        ...params,
      }),
  }
  article = {
    /**
     * No description
     *
     * @tags article
     * @name article
     * @request GET:/article
     */
    getArticle: (query: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/article/get',
        method: 'GET',
        query,
        ...params,
      }),
    getNews: (id: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/news/${id}`,
        method: 'GET',
        ...params,
      }),
  }
  issuer = {
    getIssuerInfoApi: (id: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/issuer/${id}`,
        method: 'GET',
        ...params,
      }),
    getIssuerNftCategoryListApi: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/issuer/nftcategory',
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
    getNftCategoryInfoApi: (id: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/nfc/category/${id}`,
        method: 'GET',
        ...params,
      }),
    getNftListApi: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/nfc',
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  }
  pin = {
    // 获取密钥
    getUserKeyApi: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/user/key',
        method: 'GET',
        ...params,
      }),
    // 设置操作密码
    getUserTradePasswordApi: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/user/tradepassword',
        method: 'PUT',
        body: data,
        ...params,
      }),
    // 重置操作密码
    resetUserTradePasswordApi: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/user/tradepassword/reset',
        method: 'PUT',
        body: data,
        ...params,
      }),
  }
  zsw = {
    // 检测资产是否可转移
    checkIsTransfer: (id: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/zsw/oauth2/transfer/status/${id}`,
        method: 'GET',
        ...params,
      }),
    // 获取中数文oauth2 授权url
    getZSWOauth2Ulr: (query: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/zsw/oauth2/url',
        method: 'GET',
        query,
        ...params,
      }),
    // 绑定中数文账号
    bindZSWAccount: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/zsw/oauth2/bind',
        method: 'POST',
        body: data,
        ...params,
      }),
    // 绑定中数文账号
    bindBClientZSWAccount: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/zsw/bauth/bind',
        method: 'POST',
        body: data,
        ...params,
      }),
    // 资产转移
    transferApi: (id: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/zsw/oauth2/transfer/${id}`,
        method: 'PUT',
        ...params,
      }),
  }
  entity = {
    // 查看是不是正品/已绑定
    entityVerifyApi: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/entity/verify',
        method: 'GET',
        query: data,
        ...params,
      }),
    entityBindApi: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/entity/bind',
        method: 'POST',
        body: data,
        ...params,
      }),
  }
  give = {
    // 查看转赠状态
    giveStatusApi: (id: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/user/miniprogram/me/nft/give/status/${id}`,
        method: 'GET',
        ...params,
      }),
    // 转赠
    giveApi: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/user/miniprogram/me/nft/give',
        method: 'PUT',
        body: data,
        ...params,
      }),
  }
  invite = {
    // 获取邀请码链接接口
    getInviteCodeApi: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/user/invitecode',
        method: 'GET',
        ...params,
      }),
    // 获取邀请码记录接口
    getInviteListApi: (query: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/user/invitelog',
        method: 'GET',
        query,
        ...params,
      }),
    inviteRecord: (data: any, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/user/inviterecord',
        method: 'POST',
        body: data,
        ...params,
      }),
  }
  /** 分享帖子 */
  share = {
    /** 查询分享  */
    queryShareList: (data: QueryShare, params: RequestParams = {}) =>
      this.request<any, any>({
        path: '/post/query/share',
        method: 'POST',
        body: data,
        ...params,
      }),
    /**  查询已发布的分享详情*/
    queryShareDetail: (id: string) =>
      this.request<any, any>({
        path: '/post/share/' + id,
        method: 'GET'
      }),
    /*查询我的分享*/
    queryMyShare: (data: ShareList) =>
      this.request<any, any>({
        path: '/post/query/myshare',
        method: 'POST',
        body: data,
      }),
    /*删除分享*/
    delShare: (id: string) =>
      this.request<any, any>({
        path: '/post/' + id,
        method: 'DELETE'
      }),
    /*查询个人的分享详情*/
    queryMyShareDetail: (id: string) =>
      this.request<any, any>({
        path: '/post/myshare/' + id,
        method: 'GET'
      }),
    /*修改/更新分享*/
    updateMyShare: (id: string, data: ShareData) =>
      this.request<any, any>({
        path: '/post/' + id,
        method: 'PATCH',
        body: data,
      }),
    /*发布分享*/
    publishMyShare: (data: ShareData) =>
      this.request<any, any>({
        path: '/post',
        method: 'POST',
        body: data,
      }),

  }
  /** 收藏*/
  collect = {
    /**查看收藏状态*/
    queryCollect: (id: string) =>
      this.request<any, any>({
        path: '/collect/' + id,
        method: 'GET',
      }),
    /*添加/取消收藏*/
    collect: (data: Collect) =>
      this.request<any, any>({
        path: '/collect/toggle',
        method: 'POST',
        body: data,
      }),
    /*查询我的收藏(分享)*/
    getList: (data: CollectList) =>
      this.request<any, any>({
        path: '/collect/query/myshare',
        method: 'POST',
        body: data,
      }),
    /*查询用户的收藏*/
    getUserList: (data: CollectList) =>
      this.request<any, any>({
        path: '/collect/query/usershare',
        method: 'POST',
        body: data,
      }),
  }
  /** 评论 */
  comment = {
    /** 发送评论 */
    send: (data: SendComment) =>
      this.request<any, any>({
        path: '/comment',
        method: 'POST',
        body: data,
      }),
    /** 查看评论列表 */
    queryCommentList: (data: QueryComments) =>
      this.request<any, any>({
        path: '/comment/query',
        method: 'POST',
        body: data,
      }),
    /** 评论回复查询 */
    queryReplyList: (data: ReplyList) =>
      this.request<any, any>({
        path: '/comment/reply/query',
        method: 'POST',
        body: data,
      }),
    /** 发布评论回复 */
    sendReply: (data: SendReply) =>
      this.request<any, any>({
        path: '/comment/reply',
        method: 'POST',
        body: data,
      }),
  }
  /** sale */
  flow = { 
      /** 发布售卖  */
      sale: (data: FlowSale ) =>
      this.request<any, any>({
        path: '/sale',
        method: 'POST',
        body: data,
      }),
      /** 查询售卖分享*/
      querySales: (data:QuerySales) => 
      this.request<any, any>({
        path: '/sale/query/share',
        method: 'POST',
        body: data,
      }),
      /** 查询已发布的售卖详情 */
      querySale: (id:string) => 
      this.request<any, any>({
        path: '/sale/share/' + id,
        method: 'GET'
      }),
      /** 查询我的售卖 */
      myShare:(data: ShareList) => 
      this.request<any, any>({
        path: '/sale/query/myshare',
        method: 'POST',
        body: data,
      }),
  }
}
