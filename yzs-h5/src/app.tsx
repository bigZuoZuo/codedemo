import {useEffect} from 'react'
import {Provider} from 'mobx-react'
import {getStorageSync, eventCenter} from '@tarojs/taro'
// import {runInAction} from 'mobx'
// import {history} from '@tarojs/router'
import QueryString from 'qs'

import 'react-vant/es/styles'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import {api} from '@/api'

import {useStore} from './store'
import {os} from '@/utils/util'
import {CommonDialogWrapper} from '@/components/common-dialog'
import {PinInputPopupViewWrapper} from '@/components/pin/pin'

import './app.scss'
import 'taro-ui/dist/style/index.scss'

import Taro from '@tarojs/taro'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')



if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  require('umtrack-wx').init({
    appKey: '6200d84fe0f9bb492bf630e4',
    useOpenid: true,
    autoGetOpenid: true,
  })
}

const App = (props) => {
  const store = useStore()

  useEffect(() => {
    if (!/https/.test(location.origin) && !/localhost/.test(location.origin)) {
      let url = location.origin.replace('www.', '')
      url = /https/.test(url) ? url : url.replace('http', 'https')
      location.href = url + location.pathname + location.search
    }
  }, [])

  useEffect(() => {
    const inManualLogout = getStorageSync('logout')
    if (!inManualLogout) {
      store.loginProbe().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const searchQuery = QueryString.parse(location.search.slice(1))
    eventCenter.on('__taroRouterChange', ({toLocation}) => {
      const currentPage = toLocation?.path || ''
      // console.warn(store.state.openId, store.state.phoneNumber)
      //必须微信环境 必须微信支付页面
      if (os.isWechatWeb && /paying/.test(currentPage) && store.state.logined && !store.state.openId) {
        if (!searchQuery.code) {
          Taro.showLoading({title: '微信绑定中'})
          const url = new URL(window.location.href)
          const search = QueryString.parse(url.search.slice(1) ?? '')
          url.search = `?${QueryString.stringify(search)}`
          async function fetchData() {
            const response = await api.user.getAuthroizeUrlList({
              redirectUri: encodeURIComponent(url.href),
              scope: 'snsapi_userinfo',
            })
            Taro.hideLoading()
            window.location.replace(response.data.url)
          }
          fetchData()
        }
      }
    })
  }, [])

  //监听窗口事件
  useEffect(() => {
    const search: any = QueryString.parse(window.location.search.slice(1) ?? '')
    if (os.isWechatWeb) {
      if (search?.channelcode || search?.channelpre_code) {
        sessionStorage.setItem('channelCode', search?.channelcode || search?.channelpre_code)
      }
      if (search?.invitation) {
        sessionStorage.setItem('invitation', search?.invitation)
      }
    } else {
      Taro.removeStorageSync('channelCode')
      if (search?.channelcode || search?.channelpre_code) {
        Taro.setStorageSync('channelCode', search?.channelcode || search?.channelpre_code)
      }
      Taro.removeStorageSync('invitation')
      if (search?.invitation) {
        Taro.setStorageSync('invitation', search?.invitation)
      }
    }
  }, [])

  return (
    <Provider store={store}>
      <CommonDialogWrapper>
        <PinInputPopupViewWrapper>{props.children}</PinInputPopupViewWrapper>
      </CommonDialogWrapper>
    </Provider>
  )
}

export default App
