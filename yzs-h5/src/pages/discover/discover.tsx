import {api} from '@/api'
import CustomCard from '@/components/custom-card'
import Tabs from '@/components/custom-tabs'
import ListState from '@/components/list-state/list-state'
import TabBar from '@/components/tab-bar/tabbar'
import {ListData} from '@/typings'
import {View, Text} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {useEffect, useRef, useState} from 'react'
import {List} from 'react-vant'
import {AtTabs, AtTabsPane} from 'taro-ui'
import styles from './discover.module.scss'

const tabbar = [
  {title: '分享', value: 'share', api: api.share.queryShareList},
  {title: '售卖', value: 'sale', api: api.flow.querySales},
]

interface Props {
  state: string
  api: Function
}

function ListComponent(props: Props) {
  const [discover, setDiscover] = useState<ListData>({list: [], total: 0})
  const pageRef = useRef(1)
  const [loading, setLoading] = useState(true)
  const [infiniteLoading, setInfiniteLoading] = useState(true)

  useEffect(() => {
    queryShare()
  }, [])

  const queryShare = () => {
    props
      .api({
        page: pageRef.current,
        size: 10,
      })
      .then((res: any) => {
        if (res?.status === 200 && res?.data?.code === 200) {
          const {data} = res.data
          setDiscover((state) => ({
            list: [...state.list, ...data.items],
            total: data.count,
          }))
          pageRef.current++
        }
      })
      .finally(() => {
        setInfiniteLoading(false)
        setLoading(false)
      })
  }
  const onScrollToLower = () => {
    if (discover.list.length < discover.total && !loading) {
      setLoading(true)
      queryShare()
    }
  }
  const jumpDetail = (item) => {
    const from = props.state === tabbar[1].value ? '' : encodeURIComponent('/pages/discover/discover')
    Taro.navigateTo({url: `/pages/discover-detail/index?&discoverType=${props.state}&id=${item.id}&from=${from}`})
  }

  return (
    <>
      <List
        finished={discover.list.length >= discover.total}
        onLoad={onScrollToLower}
        autoCheck={false}
        loading={loading}
        className={styles.discoverList}
      >
        {discover.list.map((item) => (
          <CustomCard
            id={item.id}
            key={item.id}
            title={item.title}
            avatar={item.avatar}
            userId={item.user_id}
            cover={item.images[0]}
            nickname={item.nick_name}
            is_collect={item.is_collect}
            onClick={() => jumpDetail(item)}
            collect_count={item.collect_count}
            large={props.state === tabbar[1].value}
            rightNode={props.state === tabbar[1].value ? <Text className={styles.price}>¥ {item.price}</Text> : null}
          />
        ))}
      </List>
      <ListState
        isEmpty={!discover.total}
        hasNextPage={loading}
        infiniteLoading={infiniteLoading}
        emptyLabel={'还没有收藏'}
      />
    </>
  )
}

function Discover() {
  const [currentStateInfo, setCurrentStateInfo] = useState({
    current: 0,
    currentState: tabbar[0].value,
  })

  return (
    <View className={styles.discover}>
      <Tabs currentStateInfo={currentStateInfo} tabList={tabbar} setCurrentStateInfo={setCurrentStateInfo}>
        {tabbar.map((item, index) => (
          <AtTabsPane key={index} current={currentStateInfo.current} index={index}>
            <ListComponent state={item.value} api={tabbar[index].api} />
          </AtTabsPane>
        ))}
      </Tabs>
      <TabBar index={1} />
    </View>
  )
}

export default Discover
