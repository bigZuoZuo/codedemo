import {useEffect, useState} from 'react'
import Taro, {useReachBottom, useRouter} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import cloneDeep from 'lodash.clonedeep'

import NavigationBar from '@/components/navigation-bar/navigation-bar'
import ListState from '@/components/list-state/list-state'
import {api} from '@/api'
import {showImageOrVideo} from '../home/home'

import './index.scss'

const ListItem = ({data}) => {
  return (
    <View
      className="collection-box"
      onClick={() => Taro.navigateTo({url: `/pages/official-goods-detail/official-goods-detail?id=${data.id}`})}
    >
      {
        showImageOrVideo({
          type: data?.material_type,
          url: /3D|music|video/.test(data?.material_type) ? data?.cover_url : data?.images[0],
          className: 'collection-image'
        })
      }
      <View className="collection-image-mask">
        <view
          className={/3D/.test(data?.material_type) ? 'd3' : /video/.test(data?.material_type) ? 'd3 video-icon' : ''}
        ></view>
      </View>
      <View className="collection-info">
        <View className="title">{data.name}</View>
        <View className="collection-footer">
          <Text className="collection-subtitle">
            <Text className="unit">￥</Text>
            {data.price}
          </Text>
          <Text className="collection-num">{data.total}份</Text>
        </View>
      </View>
    </View>
  )
}

export default () => {
  const query = useRouter()?.params

  const [list, setList] = useState([])
  const [beau, setBeau] = useState<any>({})
  const [issuerBeau, setIssuerBeau] = useState<any>({})
  const [noMore, setNoMore] = useState('no-more')
  const [currentPage, setCurrentPage] = useState(1)

  const requestList = async (page) => {
    Taro.showLoading({title: '加载中...'})
    setNoMore('loading')
    let cloneList = cloneDeep(list)
    let params: any = {
      categoryId: query?.id,
      skip: page - 1,
      limit: 10,
      sortBy: 'created_at',
      sort: -1,
    }
    if (page === 1) {
      cloneList = []
      setList([])
    }
    const {data: result} = await api.issuer.getNftListApi(params)
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
    if (!query?.id) {
      return
    }
    requestList(1)
    async function fetchData() {
      const {data: result} = await api.issuer.getNftCategoryInfoApi(query?.id)
      const {data: issuer} = await api.issuer.getIssuerInfoApi(query?.issuer_id)
      setBeau(result.data)
      setIssuerBeau(issuer.data)
    }
    fetchData()
  }, [])
  return (
    <View className="collection-page">
      <View className="header-banner">
        <NavigationBar back color="#fff" background="transparent" />
        <Image mode="aspectFill" className="mask" src={beau?.cover} />
      </View>
      <View className="header-title">{beau?.name}</View>
      <View className="issuer-box" onClick={() => Taro.navigateTo({url: `/pages/issuer/index?id=${beau?.issuer_id}`})}>
        <View className="issuer-header">
          <Image mode="aspectFill" className="avatar" src={issuerBeau?.logo} />
          <View className="title">{issuerBeau?.issuer_name}</View>
          <View className="more">更多</View>
        </View>
        <View className="issuer-desc">{issuerBeau?.issuer_desc}</View>
      </View>
      <View className="collection-title">数字藏品</View>
      <View className="collection-view-container">
        {list.map((that) => (
          <ListItem data={that} />
        ))}
      </View>
      <ListState
        isEmpty={!list.length && noMore !== 'loading'}
        infiniteLoading={noMore === 'loading'}
        hasNextPage={noMore === 'more'}
      />
    </View>
  )
}
