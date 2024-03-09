import {api} from '@/api'
import CustomCard from '@/components/custom-card'
import Tabs from '@/components/custom-tabs'
import ListState from '@/components/list-state/list-state'
import {ListData} from '@/typings'
import {View, Text} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {useRouter} from '@tarojs/taro'
import classNames from 'classnames'
import {useEffect, useRef, useState} from 'react'
import {List} from 'react-vant'
import {AtTabsPane} from 'taro-ui'
import styles from './index.module.scss'

const tabs = [
  {
    index: 0,
    title: '收藏',
    value: 'collect',
    api: api.collect.getUserList,
  },
  {
    index: 1,
    title: '分享',
    value: 'share',
    api: api.share.queryShareList,
  },
  {
    index: 2,
    title: '出售',
    value: 'sale',
    api: api.flow.querySales,
  },
]

interface Props {
  currentTab: any
}

function ListComponent(props: Props) {
  const {currentTab} = props

  const {userId: user_id} = useRouter().params

  const [listData, setListData] = useState<ListData>({list: [], total: 0})
  const [loading, setLoading] = useState(true)
  const [infiniteLoading, setInfiniteLoading] = useState(true)

  const pageRef = useRef(1)

  useEffect(() => {
    queryList()
  }, [])

  const queryList = () => {
    currentTab
      .api({
        user_id,
        page: pageRef.current,
        size: 10,
        sort: {[currentTab.value === tabs[0].value ? 'created_at' : 'updated_at']: -1},
      })
      .then((res) => {
        if (res?.status === 200 && res?.data?.code === 200) {
          const {data} = res.data
          setListData((state) => ({
            list: [...state.list, ...data.items],
            total: data.count,
          }))
          pageRef.current++
        }
      })
      .finally(() => {
        setLoading(false)
        setInfiniteLoading(false)
      })
  }

  const onScrollToLower = () => {
    setLoading(true)
    if (listData.list.length < listData.total) {
      queryList()
    }
  }

  const jump = (id: string) => {
    const from = encodeURIComponent(`/pages/user-page/index?userId=${user_id}&index=${currentTab.index}`)
    Taro.navigateTo({
      url: `/pages/discover-detail/index?id=${id}&from=${from}&discoverType=${
        currentTab.value === 'sale' ? 'sale' : ''
      }`,
    })
  }

  return (
    <>
      <List
        className={styles.list}
        finished={listData.list.length >= listData.total}
        loading={loading}
        onLoad={onScrollToLower}
      >
        {listData.list.map((item) => (
          <>
            <CustomCard
              key={item.id}
              userId={item.user_id}
              id={item?.post?.id || item?.id}
              title={item.post?.title || item?.title}
              avatar={item.post?.avatar || item?.avatar}
              onClick={() => jump(item?.post?.id || item?.id)}
              nickname={item.post?.nick_name || item?.nick_name}
              cover={item.post?.images?.[0] || item?.images?.[0]}
              disabledCollect={currentTab.value === tabs[0].value}
              collect_type={currentTab.value === 'sale' ? 'sale' : 'post'}
              collect_count={item.post?.collect_count || item?.collect_count}
              is_collect={currentTab.value === tabs[0].value ? true : item.is_collect}
              desNode={currentTab.value === 'sale' ? <Text className={styles.des}>¥ {item.price}</Text> : null}
            />
          </>
        ))}
      </List>
      <ListState
        isEmpty={!listData.total}
        hasNextPage={loading}
        infiniteLoading={infiniteLoading}
        emptyLabel={`还没有${currentTab.title}`}
      />
    </>
  )
}

function UserList() {
  const {index} = useRouter().params

  const [currentStateInfo, setCurrentStateInfo] = useState({
    current: index ? +index : 0,
    currentState: tabs[index ? +index : 0].value,
  })

  return (
    <Tabs
      tabList={tabs}
      className={styles.tabs}
      currentStateInfo={currentStateInfo}
      setCurrentStateInfo={setCurrentStateInfo}
    >
      {tabs.map((item, index) => (
        <AtTabsPane key={index} current={currentStateInfo.current} index={index}>
          <ListComponent currentTab={item} />
        </AtTabsPane>
      ))}
    </Tabs>
  )
}
export default UserList
