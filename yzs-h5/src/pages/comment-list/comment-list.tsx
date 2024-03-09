import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {useReachBottom} from '@tarojs/taro'
import {View} from '@tarojs/components'
import cloneDeep from 'lodash.clonedeep'
import dayjs from 'dayjs'

import './comment-list.scss'
import {api} from '@/api'
import {useState, useEffect} from 'react'
import ListState from '@/components/list-state/list-state'
import Taro from '@tarojs/taro'

export const NoticeDetail = ({detail, setDetail}) => {
  return (
    <View className="container comment-list-page-container detail">
      <NavigationBar
        title={detail.title}
        color="#fff"
        background="transparent"
        slotLeft={
          <View className="nav-custom">
            <View onClick={setDetail} aria-role="button" aria-label="返回">
              <View className="weui-navigation-bar__button weui-navigation-bar__btn_goback"></View>
            </View>
          </View>
        }
      />
      <View>{detail.content}</View>
    </View>
  )
}

function CommentList() {
  const [list, setList] = useState([])
  const [detail, setDetail] = useState<any>({})
  const [noMore, setNoMore] = useState('no-more')
  const [currentPage, setCurrentPage] = useState(1)

  const requestList = async (page) => {
    Taro.showLoading({title: '加载中...'})
    setNoMore('loading')
    let cloneList = cloneDeep(list)
    let params: any = {
      pageSize: 10,
      current: page,
      status: 'on',
    }
    if (page === 1) {
      cloneList = []
      setList([])
    }
    const {data: result} = await api.banner.noticeList(params)
    if (result.data?.list?.length) {
      setList(cloneList.concat(result.data?.list))
      setCurrentPage(page)
      if (result.data?.list?.length === result.data.total) {
        setNoMore('no-more')
      } else {
        setNoMore('more')
      }
    } else {
      setNoMore('no-more')
    }
    Taro.hideLoading()
  }

  useReachBottom(() => {
    if (noMore === 'more') {
      requestList(currentPage + 1)
    }
  })

  useEffect(() => {
    requestList(1)
  }, [])

  function navigateToDetail(item) {
    setDetail(item)
  }

  return detail.id ? (
    <NoticeDetail detail={detail} setDetail={() => setDetail({})} />
  ) : (
    <View className="container comment-list-page-container">
      <NavigationBar back color="#fff" background="transparent" />

      {list.map((item: any) => (
        <View className="module" key={item.id} onClick={() => navigateToDetail(item)}>
          <View className="top">
            <View className="ellipsis">{item.title}</View>
            <View className="time">{dayjs(item.date).format('MM月DD日')} </View>
          </View>
          <View className="content">{item.content}</View>
        </View>
      ))}

      <ListState
        isEmpty={!list.length && noMore !== 'loading'}
        infiniteLoading={noMore === 'loading'}
        hasNextPage={noMore === 'more'}
      />
    </View>
  )
}

export default CommentList
