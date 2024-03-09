import {api} from '@/api'
import {useStore} from '@/store'
import {Button, View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {runInAction} from 'mobx'
import {useState} from 'react'
import {AtForm, AtInput, AtFloatLayout} from 'taro-ui'

import './form.scss'

function KYCModal({kyc, openDialog, setOpenDialog}) {
  const store = useStore()

  const [name, setName] = useState('')
  const [idCard, setIdCard] = useState('')
  const [posting, setPosting] = useState(false)

  async function onSubmit() {
    if (!name) {
      Taro.showToast({title: '请输入真实姓名', icon: 'none'})
      return
    }
    if (!idCard) {
      Taro.showToast({title: '请输入身份证号', icon: 'none'})
      return
    }
    if (idCard.length !== 18) {
      Taro.showToast({title: '请输入正确的身份证号', icon: 'none'})
      return
    }

    if (posting) {
      return
    }
    setPosting(true)
    Taro.showLoading({title: '认证中'})

    api.user
      .userKycSet({realName: name, idCardNumber: idCard} as any)
      .then(() => {
        setPosting(false)
        Taro.hideLoading()

        runInAction(() => {
          store.state.isKycAuth = true
          let loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
          loginResponse.isKycAuth = true
          Taro.setStorageSync('YZS_USER_INFO', JSON.stringify(loginResponse))
          if (kyc === 'no') {
            Taro.reLaunch({
              url: '/pages/account/account',
            })
          }
          setOpenDialog(false)
        })
      })
      .catch((error) => {
        setPosting(false)
        Taro.hideLoading()
        let message = error?.response?.data?.message
        if (/wallet_account_fail/.test(message)) {
          setOpenDialog(false)
          runInAction(() => {
            store.state.isKycAuth = true
            let loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
            loginResponse.isKycAuth = true
            Taro.setStorageSync('YZS_USER_INFO', JSON.stringify(loginResponse))
            if (kyc === 'no') {
              Taro.reLaunch({
                url: '/pages/account/account',
              })
            } else {
              Taro.showModal({
                title: '实名认证成功',
                content: '实名认证成功，暂时无法生成钱包地址，您可以点击"我的->钱包地址"再次尝试生成钱包地址！',
              })
            }
          })
        } else {
          Taro.showModal({
            title: '实名认证失败',
            content: message,
          })
        }
      })
  }

  return (
    <View>
      <AtFloatLayout
        className="account-dialog"
        title="实名认证"
        isOpened={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <AtForm className="account-dialog-body">
          <AtInput
            border={false}
            clear
            title="真实姓名"
            type="text"
            placeholder="请输入真实姓名"
            name="realName"
            value={name}
            onChange={(event) => setName(event.toString())}
          />
          <AtInput
            border={false}
            clear
            title="身份证号"
            type="text"
            placeholder="请输入身份证号"
            name="idCardNumber"
            maxlength={18}
            value={idCard}
            onChange={(event) => setIdCard(event.toString())}
          />
        </AtForm>

        <View className="account-dialog-footer">
          <Button className="btn account-dialog-btn" plain size="mini" onClick={() => setOpenDialog(false)}>
            取消
          </Button>
          <Button className="btn account-dialog-btn" type="primary" size="mini" onClick={onSubmit}>
            提交
          </Button>
        </View>
      </AtFloatLayout>
    </View>
  )
}

export default KYCModal
