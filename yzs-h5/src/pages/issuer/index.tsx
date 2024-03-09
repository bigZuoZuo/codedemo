import {useEffect, useState} from 'react'
import Taro, {useReachBottom, useRouter} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import cloneDeep from 'lodash.clonedeep'

import NavigationBar from '@/components/navigation-bar/navigation-bar'
import ListState from '@/components/list-state/list-state'
import {api} from '@/api'

import './index.scss'

const ListItem = ({data}) => {
  return (
    <View
      className="collection-box"
      onClick={() => Taro.navigateTo({url: `/pages/collection/index?id=${data.id}&issuer_id=${data.issuer_id}`})}
    >
      <Image mode="aspectFill" className="collection-image" src={data.cover} />
      <View className="collection-image-mask"></View>
      <View className="collection-info">
        <View className="title">{data.name}</View>
        <View className="collection-footer">
          <Text className="collection-subtitle">藏品：{data.nft_count}种</Text>
        </View>
      </View>
    </View>
  )
}

export default () => {
  const query = useRouter()?.params

  const [list, setList] = useState([])
  const [beau, setBeau] = useState<any>({})
  const [noMore, setNoMore] = useState('no-more')
  const [currentPage, setCurrentPage] = useState(1)

  const requestList = async (page) => {
    Taro.showLoading({title: '加载中...'})
    setNoMore('loading')
    let cloneList = cloneDeep(list)
    let params: any = {
      issuerId: query?.id,
      skip: page - 1,
      limit: 10,
      sortBy: 'created_at',
      sort: -1,
    }
    if (page === 1) {
      cloneList = []
      setList([])
    }
    const {data: result} = await api.issuer.getIssuerNftCategoryListApi(params)
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
      const {data: result} = await api.issuer.getIssuerInfoApi(query?.id)
      setBeau(result.data)
    }
    fetchData()
  }, [])
  return (
    <View className="issuer-page">
      <View className="header-banner">
        <NavigationBar back color="#fff" background="transparent" />
        <Image mode="aspectFill" className="mask" src={beau?.cover} />
        <View className="content">
          <Image mode="aspectFill" className="avatar" src={beau?.logo} />
          <Text className="title">{beau?.issuer_name}</Text>
        </View>
      </View>
      <View className="issuer-desc">{beau?.issuer_desc}</View>
      <View className="collection-title">数字系列</View>

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
