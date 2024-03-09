import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View, Image} from '@tarojs/components'
import {Steps} from 'react-vant'
import {useRouter} from '@tarojs/taro'
import {useState, useEffect} from 'react'

import {api} from '@/api'
import {copy} from '@/utils/util'
import copyIcon from '@/assets/icons/copy.png'
import arrowIcon from '@/assets/icons/arrow.png'

import './index.scss'
const STATUS_BEAU = {
  0: '运输中',
  1: '已揽收',
  3: '已签收',
  501: '派送中',
}
function LogisticsPage() {
  const params = useRouter().params
  const [logisticsBeau, setLogisticsBeau] = useState<any>({})
  useEffect(() => {
    async function fetchData() {
      const result: any = await api.order.orderTrackApi(params?.company, params?.number)
      console.error(result.data.data)
      setLogisticsBeau(result.data.data)
    }
    if (params?.company && params?.number) {
      fetchData()
    }
  }, [params])
  return (
    <View className="logistics-container">
      <NavigationBar back color="#fff" background="transparent" title="物流查询" />
      <View wx-if={logisticsBeau?.items?.length} className="logistics-preview">
        <View className="logistics-header">
          <View>运单号：{logisticsBeau?.routeInfo?.cur.number}</View>
          <Image
            src={copyIcon}
            className="icon"
            onClick={() => {
              copy(logisticsBeau?.routeInfo.cur.number)
            }}
          />
        </View>
        <View className="logistics-content">
          <View className="left-content">
            <View>{STATUS_BEAU[logisticsBeau?.items?.[0]?.statusCode || '未知状态']}</View>
            <View className="time">{logisticsBeau?.items?.[0]?.ftime}</View>
          </View>
          <View className="right-content">
            <View className="text">{logisticsBeau?.routeInfo?.from?.name.split(',')[0]}</View>
            <Image src={arrowIcon} className="icon" />
            <View className="text1">
              {(logisticsBeau?.routeInfo?.to?.name || logisticsBeau?.routeInfo?.cur?.name)?.split(',')?.[0] || '-'}
            </View>
          </View>
        </View>
      </View>
      <View wx-if={logisticsBeau?.items?.length} className="logistics-box">
        <Steps direction="vertical" active={0}>
          {logisticsBeau?.items?.map((it, key) => (
            <Steps.Item key={key}>
              <p>{it.ftime}</p>
              <h6>{it.context}</h6>
            </Steps.Item>
          ))}
        </Steps>
      </View>
      <View className="safe-bottom" />
    </View>
  )
}

export default LogisticsPage
