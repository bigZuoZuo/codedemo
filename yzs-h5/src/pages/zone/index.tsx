import {useEffect, useState} from 'react'
import Taro, {useRouter} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
// import cloneDeep from 'lodash.clonedeep'

import NavigationBar from '@/components/navigation-bar/navigation-bar'
import ListState from '@/components/list-state/list-state'
import {api} from '@/api'
import {showImageOrVideo} from '../home/home'

import './index.scss'

const ListItem = ({data}) => {
  return (
    <View
      className="zone-box"
      onClick={() => Taro.navigateTo({url: `/pages/official-goods-detail/official-goods-detail?id=${data.id}`})}
    >
      {
        showImageOrVideo({
          type: data?.material_type,
          url: /3D|music|video/.test(data?.material_type) ? data?.cover_url : data?.images[0],
          className: 'zone-image'
        })
      }
      <View className="zone-image-mask">
        <view
          className={/3D/.test(data?.material_type) ? 'd3' : /video/.test(data?.material_type) ? 'd3 video-icon' : ''}
        ></view>
      </View>
      <View className="zone-info">
        <View className="title">{data.name}</View>
        <View className="zone-tab">
          <Text className="tab-one">限量</Text>
          <Text className="tab-two">{data?.total ?? '-'}份</Text>
        </View>
        <View className="zone-tab">
          <Text wx-if={data?.category_name} className="tab-three">
            {data?.category_name}
          </Text>
        </View>
        <View className="zone-footer">
          <Text className="zone-subtitle">
            <Text className="unit">￥</Text>
            {data.price}
          </Text>
          {/* <Text className="zone-num">{data.total}份</Text> */}
        </View>
      </View>
    </View>
  )
}

export default () => {
  const query = useRouter()?.params

  const [list, setList] = useState([])
  const [beau, setBeau] = useState<any>({})
  const [noMore] = useState('no-more')
  // const [currentPage, setCurrentPage] = useState(1)

  // const requestList = async (page) => {
  //   Taro.showLoading({title: '加载中...'})
  //   setNoMore('loading')
  //   let cloneList = cloneDeep(list)
  //   let params: any = {
  //     categoryId: query?.id,
  //     skip: page - 1,
  //     limit: 10,
  //     sortBy: 'created_at',
  //     sort: -1,
  //   }
  //   if (page === 1) {
  //     cloneList = []
  //     setList([])
  //   }
  //   const {data: result} = await api.issuer.getNftListApi(params)
  //   if (result.data?.list?.length) {
  //     setList(cloneList.concat(result.data?.list))
  //     setCurrentPage(page)
  //     if (result.data?.list?.length === result.data.total) {
  //       setNoMore('no-more')
  //     } else {
  //       setNoMore('more')
  //     }
  //   } else {
  //     setNoMore('no-more')
  //   }
  //   Taro.hideLoading()
  // }

  // useReachBottom(() => {
  //   if (noMore === 'more') {
  //     requestList(currentPage + 1)
  //   }
  // })

  useEffect(() => {
    if (!query?.id) {
      return
    }
    // requestList(1)
    async function fetchData() {
      const {data: result} = await api.zone.zoneDetail(query?.id)
      setBeau(result?.payload?.data)
      setList(result?.payload?.data?.link_nfts?.nodes || [])
    }
    fetchData()
  }, [])
  return (
    <View className="zone-page">
      <View className="header-banner">
        <NavigationBar back color="#fff" background="transparent" />
        <Image mode="aspectFill" className="mask" src={beau?.detail_head_url} />
      </View>
      <View className="issuer-box">
        <View className="issuer-header">
          <View className="title">{beau?.title}</View>
          <View className="more">{beau?.link_nfts?.total || 0}款</View>
        </View>
        <View
          className="issuer-desc"
          dangerouslySetInnerHTML={{__html: beau?.desc?.toString().replace(/<img/g, `<img margin: 4px auto;"`)}}
        ></View>
      </View>
      <View className="zone-view-container">
        {list.map((that: any) => (
          <ListItem data={that.data} />
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
