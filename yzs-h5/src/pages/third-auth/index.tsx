import NavigationBar from '@/components/navigation-bar/navigation-bar'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './third-auth.scss'
import CJLogo from '@/assets/icons/cj-logo.png'
import { api } from '@/api'
import { useState, useCallback } from 'react'
import { useStore } from '@/store'
import { Toast } from 'react-vant'

function ThirdAuth() {
  const [checked, setChecked] = useState(true)
  const store = useStore()

  const handleKyc = () => {
    Taro.showModal({
      title: '',
      content: '请先完成实名认证',
      cancelText: '取消',
      confirmText: '去认证',
      success: ({ confirm }) => {
        if (confirm) {
          Taro.redirectTo({
            url: '/pages/account/account?kyc=no',
          })
        }
      },
    })
  }

  const handleBind = useCallback(async () => {
    if (!store.state.isKycAuth) {
      handleKyc()
      return
    }
    Taro.showLoading({ title: '绑定中' })
    try {
      const res = await api.zsw
        .bindBClientZSWAccount({
          permissions: checked ? ['public'] : [],
        })
      if (res.data.code === 200 && res.data.message === "success" || res.data.result == 'ok') {
        Toast.success('绑定成功！')
        store.state.zswAccount = res.data.data.zswAccount
        Taro.navigateBack()
      } else if (res.data.message == 'need_kyc') {
        handleKyc()
      }
      else {
        Taro.showToast({ title: '绑定失败', icon: 'error' })
      }
    } catch (error) {
      Taro.showToast({ title: error?.response?.data?.message||"绑定失败", icon: 'error' })
    }

    Taro.hideLoading()
  }, [])

  return (
    <View className="container third-auth-page-container">
      <NavigationBar back isNoHome color="#fff" background="transparent" title="授权超际平台" />
      <Image src={CJLogo} mode="aspectFit" className="auth-icon" />
      <View className="auth-super-title">超际</View>
      <View className="auth-box">
        <View className="auth-title">确认后超际将获得以下内容</View>
        <View className="auth-subtitle">• 获得你的手机号码</View>
        <View className="auth-subtitle">• 获得你的实名认证信息（姓名和身份证号码）</View>
        <View
          onClick={() => {
            setChecked(!checked)
          }}
          className={`auth-checkbox ${checked && 'checked'}`}
        >
          <View className="auth-subtitle">获得你的公开信息（昵称、头像）</View>
        </View>
      </View>
      <View className="auth-tips">*请确保你的手机号码、姓名、身份证号码一致，否则授权失败。</View>
      <View className="auth-button" onClick={handleBind}>
        确认授权
      </View>
    </View>
  )
}

export default ThirdAuth
