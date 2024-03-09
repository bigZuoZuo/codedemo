import {Text, View, Button} from '@tarojs/components'

import {useStore} from '@/store'
import {useObserver} from 'mobx-react'
import {AtFloatLayout} from 'taro-ui'
import {useState} from 'react'
import {api} from '@/api'
import {runInAction} from 'mobx'
import Taro from '@tarojs/taro'

import './form.scss'
import Input from '@/components/Input'

function UserNameForm({openNickNameDialog, setOpenNickNameDialog}) {
  const store = useStore()

  return useObserver(() => {
    const [nickNameInputContent, setNickNameInputContent] = useState('')

    async function confirmNickName() {
      if (nickNameInputContent.length < 4 || nickNameInputContent.length > 20) {
        Taro.showToast({title: '限制4-20个字符，可由中英文、数字及特殊符号组成', icon: 'none'})
        return
      }
      const profile = await api.user.miniprogramMeProfileUpdate({
        nickName: nickNameInputContent,
      })

      runInAction(() => {
        store.state.nickName = nickNameInputContent
        Taro.setStorageSync('access_token', profile.data.token)
        let loginResponse = JSON.parse(Taro.getStorageSync('YZS_USER_INFO') || '{}')
        loginResponse.nickName = nickNameInputContent
        Taro.setStorageSync('YZS_USER_INFO', JSON.stringify(loginResponse))
        setOpenNickNameDialog(false)
      })
    }
 
    return (
      <View>
        <AtFloatLayout
          className="account-dialog"
          title="修改用户名"
          isOpened={openNickNameDialog}
          onClose={() => setOpenNickNameDialog(false)}
        >
          <View className="account-dialog-body">
            {/* <Input
              className="account-input"
              placeholder="请输入用户名"
              onInput={(event) => setNickNameInputContent(event.detail.value)}
            /> */}
            <Input classname="account-input" placeholder='请输入用户名' value={nickNameInputContent} onChange={setNickNameInputContent} />
            <Text className="account-input-tips">限制4-20个字符，可由中英文、数字及特殊符号组成</Text>
          </View>

          <View className="account-dialog-footer">
            <Button className="btn account-dialog-btn" plain size="mini" onClick={() => setOpenNickNameDialog(false)}>
              取消
            </Button>
            <Button className="btn account-dialog-btn" type="primary" size="mini" onClick={confirmNickName}>
              确认
            </Button>
          </View>
        </AtFloatLayout>
      </View>
    )
  })
}

export default UserNameForm
