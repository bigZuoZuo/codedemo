import { api } from "@/api";
import NavigationBar from "@/components/navigation-bar/navigation-bar";
import { ListData, ShareType } from "@/typings";
import { ScrollView, View, Image, Text } from "@tarojs/components";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from './index.module.scss'
import star2 from "@/assets/star2.png"
import star1 from "@/assets/star1.png"
import duck1Icon from "@/assets/duck1.png"
import { formatTime } from "@/utils/formatTime";
import Taro, { useRouter } from "@tarojs/taro";
import ListState from "@/components/list-state/list-state";



function ShareItem(props: { detail: any; refresh: Function; tabType: ShareType }) {

    const { detail, refresh, tabType } = props


    const handleStatus = (e) => {
        e.stopPropagation()
        api.collect
            .collect({
                type: "post",
                type_id: detail?.id
            }).then(res => {
                if (res?.data?.code === 200) {
                    refresh()
                }
            })
    }

    const jumpShareDetail = () => {
        if (tabType === ShareType.passed) {
            const from = encodeURIComponent("/pages/my-share/index")
            Taro.navigateTo({ url: `/pages/discover-detail/index?id=${detail?.id}&audit_status=${encodeURIComponent(detail.audit_status)}&status=${ShareType.passed}&from=${from}` })
        } else {
            Taro.navigateTo({ url: `/pages/share-status/index?id=${detail?.id}&audit_status=${encodeURIComponent(detail.audit_status)}&status=${encodeURIComponent(tabType)}` })
        }
    }

    return <View className={styles.item} onClick={jumpShareDetail} >
        {
            detail?.images?.[0] ? <Image className={styles.cover} src={detail.images[0]} />
                : tabType === ShareType.created_reject &&
                <View className={classNames(styles.cover, styles.cover_null)}>
                    <Image className={styles.null_img} src={duck1Icon} />
                    没有传图呢
                </View>
        }

        <Text className={classNames(styles.title,{[styles.titlePadding]:detail?.audit_status === ShareType.reject})} >
            {detail?.title || "未编辑"}
            <View wx-if={tabType === ShareType.created_reject && detail?.audit_status === ShareType.reject} className={styles.audit_reject} >
                <View className={styles.audit_reject_text} >审核失败</View>
            </View>
        </Text>
        <View className={styles.foot} wx-if={detail?.audit_status === ShareType.passed} >
            <Image className={styles.star} src={detail?.is_collect ? star2 : star1} onClick={handleStatus} /> {detail?.collect_count || 0}
        </View>
        <View className={styles.saveTime} wx-if={tabType === ShareType.created_reject} >
            保存时间：{formatTime(new Date(detail?.updated_at))}
        </View>
    </View>
}




function ShareList(props: { tabType: ShareType }) {

    const [shareList, setShareList] = useState<ListData>({ list: [], total: 0 })
    const pageRef = useRef(1)

    const [loading, setLoading] = useState(true)
    const [hasNextPage, serHasNextPage] = useState(true)


    useEffect(() => {
        initQueryShareList()
    }, [props.tabType])

    const initQueryShareList = () => {
        pageRef.current = 1
        setLoading(true)
        queryShareList('init')
    }

    const queryShareList = (type?: 'init') => {
        serHasNextPage(true)
        api.share.queryMyShare({
            page: pageRef.current,
            size: 10,
            audit_status: props.tabType,
        }).then(res => {
            setShareList(state => ({
                list: type === 'init' ? res.data.data.items : [...state.list, ...res.data.data.items],
                total: res.data.data.count
            }))
            pageRef.current++
        }).finally(() => {
            setLoading(false)
            serHasNextPage(false)
        })
    }


    const onScrollToLower = () => {
        if (shareList.list.length < shareList.total) queryShareList()
    }

    return <ScrollView
        scrollY={true}
        scrollAnchoring={true}
        refresherEnabled={true}
        enhanced={true}
        style={{ width: '100%', height: '85vh' }}
        onScrollToLower={onScrollToLower}
        lowerThreshold={100}>
        <View className={styles.list} >
            {shareList.list.map(item => <ShareItem key={item.id} tabType={props.tabType} detail={item} refresh={initQueryShareList} />)}

        </View>
        <ListState
            isEmpty={loading? false : !shareList.total}
            hasNextPage={hasNextPage}
            infiniteLoading={loading}
            emptyLabel="还没有分享内容"
        />
    </ScrollView>
}

const tabs = [
    {
        title: '已分享',
        value: ShareType.passed
    },
    {
        title: '审核中',
        value: ShareType.submit
    },
    {
        title: '草稿',
        value: ShareType.created_reject
    }
]

function MyShare() {

    const { status } = useRouter().params as { status: ShareType }

    const [currentTab, srtCurrentTab] = useState(status || ShareType.passed)

    const changeTab = (tab) => {
        srtCurrentTab(tab)
    }

    const onBack = () => {
        Taro.navigateTo({
            url: "/pages/personal/personal"
        })
    }

    return <View className={styles.myShare} >
        <NavigationBar back color="#fff" onBack={onBack} title="我的分享" background="#1C1134"/>
        <View className={styles.tabs} >
            {tabs.map(tab => (
                <View
                    key={tab.value}
                    className={classNames({ [styles.currentTab]: currentTab === tab.value })}
                    onClick={() => changeTab(tab.value)}>{tab.title}</View>
            ))}
        </View>
        <ShareList tabType={currentTab} />
    </View>
}

export default MyShare