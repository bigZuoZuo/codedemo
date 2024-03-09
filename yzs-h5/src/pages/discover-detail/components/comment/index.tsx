import {useStore} from '@/store'
import {formatDate} from '@/utils/formatTime'
import {Image, Text, View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import {useMemo, useState} from 'react'
import {useShare} from '../../store'
import ReplyList from '../replyList'
import styles from './index.module.scss'

function Comment({detail, loop = true}: {detail: any; loop?: boolean}) {
  const {dispatch} = useShare()

  const store = useStore()

  const [moreContent, setMoreContent] = useState(detail?.content.length <= 100 ? detail?.content.length : 100)

  const handlerReply = () => {
    if (!store.state.logined) {
      login()
      return
    }
    dispatch({type: 'showCommentInput', payload: {showCommentInput: true, sendMsgData: detail}})
  }

  const handleMore = (e) => {
    e.stopPropagation()
    setMoreContent((state) => (state === 100 ? detail?.content.length : 100))
  }

  const login = () => {
    const currentPage = '/pages/discover-detail/index' + location.search
    Taro.navigateTo({url: '/pages/login/login?to=' + encodeURIComponent(currentPage)})
  }

  const jumpUser = () => {
    if (!store.state.logined) {
      login()
      return
    }
    Taro.navigateTo({
      url: `/pages/user-page/index?userId=${detail?.user_id}`,
    })
  }

  return (
    <View className={classNames(styles.comment, {[styles.hideBorder]: !loop})}>
      <Image onClick={jumpUser} className={styles.userAvatar} src={detail?.avatar || detail?.user_avatar} />
      <View className={styles.rightContent}>
        <Text className={styles.userName}>
          {detail?.nick_name || detail?.user_nick_name}
          {!detail?.is_author ? null : <View className={styles.author}>作者</View>}
        </Text>
        <Text className={styles.time}>{formatDate(detail?.created_at)} </Text>
        <Text className={styles.content} onClick={handlerReply}>
          {!detail?.parent_reply ? null : (
            <>
              回复&nbsp;<span style={{color: '#B0ACB8'}}>{detail?.parent_reply?.user_nick_name}</span>：
            </>
          )}
          {detail?.content.substr(0, moreContent)}
          {detail?.content.length <= 100 ? null : (
            <>
              ... &nbsp;&nbsp;
              <Text className={styles.moreContent} onClick={handleMore}>
                {moreContent === 100 ? '查看全部' : '收起'}
              </Text>
            </>
          )}
        </Text>
        {loop && detail?.reply_items?.length ? (
          <ReplyList comment_id={detail?.id} reply_items={detail?.reply_items} reply_count={detail?.reply_count} />
        ) : null}
      </View>
    </View>
  )
}

export default Comment
