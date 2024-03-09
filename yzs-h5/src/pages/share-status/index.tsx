import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {Image, ScrollView, Text, View} from '@tarojs/components'
import styles from './index.module.scss'
import duckIcon from '@/assets/duck.png'
import duck1Icon from '@/assets/duck1.png'
import {useEffect, useState} from 'react'
import {api} from '@/api'
import Taro, {useRouter} from '@tarojs/taro'
import {ShareType} from '@/typings'
import {ImagePreview} from 'react-vant'

function BtnBox(props: {detail: any}) {
  const {detail} = props
  const {status} = useRouter().params

  const del = () => {
    Taro.showLoading({title: '清除中...'})
    api.share
      .delShare(detail?.id)
      .then((res) => {
        if (res.data?.code === 200) {
          Taro.reLaunch({url: `/pages/my-share/index?status=${encodeURIComponent(status || '')}`})
        }
      })
      .finally(() => {
        Taro.hideLoading()
      })
  }
  const cancel = () => {
    Taro.showModal({
      title: status === ShareType.submit ? '取消发布' : '删除',
      content: '此操作将删除这条分享内容，确认进行操作？',
      success: function (res) {
        if (res.confirm) {
          del()
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      },
    })
  }

  const changeStatus = () => {
    Taro.showModal({
      title: '转入草稿',
      content: `转入草稿将会撤销审核状态，如需重新发布，需重新编辑草稿！`,
      success: function (res) {
        if (res.confirm) {
          Taro.showLoading({title: '转入草稿中...'})
          api.share
            .updateMyShare(detail?.id, {
              title: detail?.title,
              content: detail?.content,
              images: detail?.images,
              audit_status: ShareType.created,
            })
            .then((res) => {
              if (res.data?.code === 200) {
                Taro.reLaunch({url: `/pages/my-share/index?status=${encodeURIComponent(status || '')}`})
              }
            })
            .catch((err) => {
              Taro.showToast({title: err.response.data.message, icon: 'none'})
            })
            .finally(() => {
              Taro.hideLoading()
            })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      },
    })
  }

  /*重新编辑草稿*/
  const updateShare = () => {
    Taro.reLaunch({url: `/pages/share-publish/index?nft_id=${detail?.nft_id}&share_id=${detail?.id}`})
  }

  return (
    <View className={styles.brnBox}>
      <View className={styles.btn} onClick={cancel}>
        {status === ShareType.submit ? '取消发布' : '删除'}
      </View>
      {status === ShareType.submit && (
        <View className={styles.btn} onClick={changeStatus}>
          转入草稿
        </View>
      )}
      {status === ShareType.created_reject && (
        <View className={styles.btn} onClick={updateShare}>
          重新编辑
        </View>
      )}
    </View>
  )
}

function ShareStatus() {
  const {id, status, audit_status, back} = useRouter().params
  const [detail, setDetail] = useState<any>(null)

  const handleStatusChange = (type) => {
    if (type !== audit_status)
      Taro.showModal({
        content: `当前分享${
          type === ShareType.passed ? '已通过审核' : type === ShareType.reject ? '未通过审核' : '已被转入草稿'
        }`,
        confirmText: '查看详情',
        cancelText: '返回上级',
        success: function (res) {
          if (res.confirm) {
            let url = `/pages/discover-detail/index?id=${id}&status=${ShareType.passed}`
            if (type === ShareType.reject || type === ShareType.created) {
              url = `/pages/share-status/index?id=${id}&status=${encodeURIComponent(
                ShareType.created_reject
              )}&audit_status=${type}&back=1`
              // url = `/pages/my-share/index?status=${encodeURIComponent(ShareType.created_reject)}`
            }
            Taro.redirectTo({url: url})
          } else if (res.cancel) {
            // console.log('用户点击取消')
            // Taro.reLaunch({ url: `/pages/my-share/index?status=${encodeURIComponent(status || '')}` })
            Taro.navigateBack()
          }
        },
      })
  }

  useEffect(() => {
    id &&
      api.share.queryMyShareDetail(id).then((res) => {
        if (res.data?.code === 200) {
          // handleStatusChange(res.data?.data?.audit_status)
          setDetail(res.data.data)
        }
      })
  }, [])

  const onBack = () => {
    if (back) {
      Taro.navigateTo({
        url: `/pages/my-share/index?status=${encodeURIComponent(status || '')}`,
      })
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className={styles.shareStatus}>
      <NavigationBar title="内容详情" back isNoHome color="#fff" background="#1B1537" />
      <View className={styles.statusTip}>
        <Image className={styles.tipImg} src={status === ShareType.submit ? duckIcon : duck1Icon} />
        {status === ShareType.submit ? (
          <Text>审核中，请耐心等待...</Text>
        ) : (
          <>
            <Text className={styles.tipTitle}>
              {audit_status === ShareType.created ? '重新编辑后发布' : '抱歉，你发布的内容审核未通过...'}
            </Text>
            {audit_status === ShareType.created ? null : <Text className={styles.tipContent}>审核未通过原因</Text>}
            {/* <Text className={styles.tipContent}>{detail?.audit_reason}</Text> */}
          </>
        )}
      </View>
      <Text className={styles.title}>详细信息</Text>
      <ScrollView className={styles.imgs}>
        {detail?.images?.map((item, index) => (
          <Image
            key={index}
            className={styles.img}
            src={item}
            onClick={() => ImagePreview.open({images: detail.images, startPosition: index})}
          />
        ))}
      </ScrollView>
      <Text className={styles.title}>{detail?.title}</Text>
      <Text className={styles.contentText}>{detail?.content}</Text>
      <BtnBox detail={detail} />
    </View>
  )
}

export default ShareStatus
