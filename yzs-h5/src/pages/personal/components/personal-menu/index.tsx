import {useState, useEffect} from 'react'
import {Image, View} from '@tarojs/components'
import {FC} from '@tarojs/taro'
import styles from './index.module.scss'
import {AtModal, AtModalContent} from 'taro-ui'
// import Taro from '@tarojs/taro'

import csIcon from './static/icon-cs.png'
import messageIcon from './static/icon-message.png'
import accountIcon from './static/icon-account.png'
import settingIcon from './static/icon-setting.png'
import inviteBG from '@/assets/invite-bg.png'
import DebounceNavigator from '@/components/debounce-navigator/debounce-navigator'
import {useObserver} from 'mobx-react'
import {api} from '@/api'

const PersonalMenu: FC<{unread?: number; beau: any}> = (_props) => {
  const [isOpened, setIsOpened] = useState(false)

  const [beau, setBeau] = useState<any>({})
  useEffect(() => {
    async function fetchData() {
      const result = await api.article.getArticle({channel: 'customer-service'})
      setBeau(result.data.data)
    }
    fetchData()
  }, [])

  const menu = [
    {icon: messageIcon, label: '消息', url: '/pages/comment-list/comment-list', badge: 0}, //_props.unread
    {icon: accountIcon, label: '账号与安全', url: '/pages/account/account', badge: 0},
    {icon: csIcon, label: '联系客服', url: 'click', badge: 0},
    {icon: settingIcon, label: '设置', url: '/pages/setup/setup', badge: 0},
  ]

  const logined = _props.beau.logined
  const mapMenu = menu.map((i) => ({
    ...i,
    url: logined ? i.url : '/pages/login/login?to=' + encodeURIComponent(i.url),
  }))

  return useObserver(() => (
    <View className={styles.menu}>
      {mapMenu.map((i) =>
        !/click/.test(i.url) ? (
          <DebounceNavigator url={i.url}>
            <View className={styles.item}>
              <Image className={styles.icon} src={i.icon} />
              <View className={styles.label}>{i.label}</View>
              {Boolean(i.badge) && (
                <View className={styles.badge}>
                  <View className={styles.count}>{i.badge}</View>
                </View>
              )}
            </View>
          </DebounceNavigator>
        ) : (
          <View className={styles.item} onClick={() => setIsOpened(true)}>
            <Image className={styles.icon2} src={i.icon} mode="aspectFit" />
            <View className={styles.label}>{i.label}</View>
          </View>
        )
      )}
      <DebounceNavigator url={logined ? '/pages/invitation/index' : '/pages/login/login'}>
        <View className={styles.invite}>
          <Image src={inviteBG} />
        </View>
      </DebounceNavigator>

      <AtModal isOpened={isOpened} onClose={() => setIsOpened(false)}>
        <AtModalContent>
          <Image className={styles.modalIcon} src={beau.content} mode="aspectFit" />
          <View>{beau.title}</View>
        </AtModalContent>
      </AtModal>
    </View>
  ))
}

export default PersonalMenu
