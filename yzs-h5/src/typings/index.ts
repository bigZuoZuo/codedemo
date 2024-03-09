// https://shimo.im/docs/cckVKqTrJ8Whhwrr/read

export interface IListResponse<T> {
  list: T[]
  total: number
}

export interface IBase {
  payment_status: string
  state: string
  id: string
  created_at: string
  updated_at: string
}

export interface IHotKey extends IBase {
  name: string
}

export interface IKeyword extends IBase {
  title: string
}

export interface IUser extends IBase {
  mobile: string
  open_id: string
  session_key: string
  nick_name: string
  avatar: string
  account: string
  is_disable: string
}

export enum BannerType {
  // 如果type是 outlink，那link是外部链接数据.
  outlink = 'outlink',
  // 如果type是 innerlink, 那link是内部链接数据,即使活动id
  innerlink = 'innerlink',
  // 如果type是 blindboxlink, 那link是盲盒id，跳到盲盒购买页面
  blindboxlink = 'blindboxlink',
  // 如果type是 nftlink, 那link是藏品id，跳到藏品页面
  nftlink = 'nftlink',
  //如果 link_type 是 syntheticlink, 那么 link字段的值就是 合成项目ID（synthetic_id）,该合成项目必须是已上线的
  syntheticlink = 'syntheticlink',
  news = 'news',
}

export interface IBanner extends IBase {
  image: string
  link: string
  link_type: BannerType
  number: string
  state: string
  title: string
}

export interface INFTCategory extends IBase {
  category_desc: string
  category_title: string
}

export enum NFCState {
  draft = 'draft',
  onsale = 'onsale',
  offsale = 'offsale',
  soldout = 'soldout',
  //已出售
  selled = 'saled',
}

export enum INFCType {
  collection = 'collection',
  collectionEntity = 'collectionEntity',
}

export enum ICollectType {
  nft = 'nft',
  audit = 'audit',
}

export interface ICollect extends IBase {
  audit_id: string
  content: string
  heat: number
  link: string
  nft_id: string
  nft_number: string
  price: string
  state: string
  title: string
  type: ICollectType
  user_id: string
  user_name: string
}

export interface INFC extends IBase {
  [x: string]: any
  name: string
  title: string
  category_id: string
  category_name: string
  images?: string[]
  price: string
  price_attribute?: string
  total: number
  sale: number
  desc: string
  heat: string
  start_time: string
  end_time: string
  token_id: string
  transaction_hash: string
  state: NFCState
  type: INFCType

  is_can_sale: boolean
  is_purchase: boolean
  limit_number: number

  issuer_name: string
  nft_number: string
}

export interface ISku extends IBase {
  nft_id: string
  price: string
  attribute: string
  images: string[]
  amount: number
  sale_total: number
  is_purchase: boolean
  limit_number: number
}

export enum AuditState {
  created = 'created',
  pending = 'pending',
  passed = 'passed',
  refused = 'failed',
  unshelve = 'offsell',
  cancel = 'canceled',
}

export interface IAudit extends IBase {
  avatar: string
  user_id: string
  nft_id: string
  images: string[]
  title: string
  content: string
  price: string
  link: string
  user_name: string
  state: AuditState
  desc: string
  is_purchase: boolean
  limit_number: number
  available_number: number
  category_id: string
  category_name: string
  end_time: string
  heat: number
  is_can_sale: boolean
  name: string
  nfc_price: string
  nfc_state: string
  nft_number: string
  sale: number
  start_time: string
  token_id: number
  total: number
  transaction_hash: string
  type: INFCType
}

// 我的资产
export interface IAsset extends IBase {
  chain_type: any;
  available_number: number
  category_id: string
  material_type: string
  cover_url: string
  category_name: string
  desc: string
  end_time: string
  heat: number
  images: string[]
  is_can_sale: boolean
  is_purchase: boolean
  limit_number: number
  name: string
  nfc_number: string
  nft_id: string
  price: string
  sale: number
  start_time: string
  unlock_time?: string
  state: string
  title: string
  token_id: number
  amount: number
  total: number
  transaction_hash: string
  type: INFCType
  user_id: string
  issuer_name?: string
}

export interface IBlindBoxAsset extends IBase {
  amount: number
  blind_box_id: string
  blind_box_number: string
  blind_name: string
  created_at: string
  id: string
  images?: string[]
  is_turn_on: boolean
  play_instruction: string
  price: string
  sale_amount: number
  state: string
  title: string
  updated_at: string
  user_id: string
}

export enum OrderState {
  // created = 'created',
  /**
   * 待支付
   */
  pendingPayment = 'pending',
  /**
   * 已支付
   */
  orderPaid = 'paid',
  /**
   * 已支付待发货
   */
  pendingShipped = 'shipped',
  /**
   * 已发货待收货
   */
  merchantShipped = 'received',
  /**
   * 已完成
   */
  complete = 'completed',
  /**
   * 已取消
   */
  canceled = 'canceled',
  /**
   * 已退款
   */
  // refunded = 'refunded',
}

export enum OrderType {
  platform = 'platform',
  user = 'user',
  blind_box = 'blind_box',
}

export enum OrderDeliveryType {
  onLine = 'online',
  inKine = 'in_kine',
}

export enum PaymentStatus {
  success = 'success',
  fail = 'fail',
  pending = 'pending',
}

export interface IOrder extends IBase {
  track_number: string
  delivery_type: OrderDeliveryType
  address: string
  amount: number
  buyer_id: string
  buyer_name: string
  buyer_avatar: string
  contact_mobile: string
  contact_name: string
  received_at: string
  deal_at: string
  canceled_at: string
  refunded_at: string
  is_deleted: false
  items?: IOrderItem[]
  payment_status: PaymentStatus
  price: string
  seller_id: string
  seller_name: string
  state: OrderState
  type: OrderType
  time_expire?: string
  time_start?: string
}

export interface IOrderItem extends IBase {
  amount: 1
  desc: string
  extra: string
  images: string[]
  item_id: string
  price: string
  sku_id: string
  sn_list: string[]
  title: string
}

export interface IComment extends IBase {
  avatar: string
  content: string
  audit_id: string
  nick_name: string
  user_id: string

  reply_avatar?: string
  reply_id?: string
  reply_nick_name?: string
}

export enum IBlindBoxState {
  draft = 'draf',
  onsale = 'onsale',
  offsale = 'offsale',
}

export interface IBlindBox extends IBase {
  blind_name: string
  title: string
  images?: string[]
  price: string
  amount: number
  sale_amount: number
  play_instruction: string
  nft_type: string
  probability: number
  state: IBlindBoxState

  collections?: IBlindBoxCollection[]
}

export interface IBlindBoxCollection extends IBase {
  material_type: string
  cover_url: string
  blind_id: string
  nft_id: string
  amount: number
  sale_amount: number
  weights: number
  available_number: number
  blind_box_id: string
  category_id: string
  category_name: string
  desc: string
  heat: number
  images: string[]
  name: string
  price: string
  sale: number
  title: string
  token_id: number
  total: number
  type: INFCType

  level?: 'S' | 'SS' | 'SSS' | 'A' | 'B'
}

export interface IAddress extends IBase {
  address: string
  area: string
  city: string
  contact_name: string
  is_default: boolean
  mobile: string
  province: string
  street: string
  user_id: string
}
export interface ListData {
  list: any[];
  total: number
}

export enum ShareType {
  // created", "submit", "passed", "reject", "created+reject"
  /*创建*/
  created='created',
  /*已分享*/
  passed='passed',
  /*审核中*/
  submit='submit',
  /*失败*/
  reject='reject',
  /*草稿*/
  created_reject = 'created+reject'
}