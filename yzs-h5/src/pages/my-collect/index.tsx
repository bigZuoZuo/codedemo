import NavigationBar from "@/components/navigation-bar/navigation-bar";
import { Image, ScrollView, Text, View } from "@tarojs/components";
import styles from "./index.module.scss";
import star2 from "@/assets/star2.png";
import classNames from "classnames";
import { api } from "@/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { ListData } from "@/typings";
import Taro from "@tarojs/taro";
import ListState from "@/components/list-state/list-state";




function Item(props: { detail: any, refresh: Function }) {

    const { detail, refresh } = props


    const handleStatus = (e) => {
        e.stopPropagation()
        api.collect
            .collect({
                type: "post",
                type_id: detail?.post?.id
            }).then(res => {
                if (res?.data?.code === 200) {
                    refresh()
                }
            })
    }


    const jumpShareDetail = () => {
        const from = encodeURIComponent("/pages/my-collect/index")
        Taro.navigateTo({ url: `/pages/discover-detail/index?id=${detail?.post?.id}&from=${from}` })
    }



    return <View className={styles.item} onClick={jumpShareDetail}>
        <Image className={styles.cover} src={detail?.post?.images?.[0]} />
        <Text className={styles.title} >{detail?.post?.title}</Text>
        <View className={styles.tabs} >
            {detail?.nft?.is_purchase && <View className={classNames(styles.tab)} >限量款</View>}
            {detail?.nft?.category_name  && <View className={classNames(styles.tab, styles.tab2)} >{detail?.nft?.category_name}</View>}
        </View>
        <View className={styles.footStatus} >
            <View className={styles.price} >¥{detail?.nft?.price}</View>
            <Image className={styles.star} src={star2} onClick={handleStatus} />
        </View>
    </View>

}



function MyCollect() {

    const [collectList, setCollectList] = useState<ListData>({ list: [], total: 0 })
    const pageRef = useRef(1)


    const [loading, setLoading] = useState(true)
    const [hasNextPage, serHasNextPage] = useState(false)

    useEffect(() => {
        refresh()
    }, [])



    const queryCollectList = (type?: 'init') => {
        api.collect.getList({
            page: pageRef.current,
            size: 10,
            sort: {
                created_at: -1
            }
        }).then(res => {
            if (res.data?.code === 200) {
                setCollectList(state => ({
                    list: type === 'init' ? res.data.data.items : [...state.list, ...res.data.data.items],
                    total: res.data.data.count
                }))
                pageRef.current++
            }
        }).finally(()=>{
            serHasNextPage(false)
            setLoading(false)
        })
    }

    const onScrollToLower = () => {
        if (collectList.list.length < collectList.total) {
            serHasNextPage(true)
            queryCollectList()
        }
    }

    const refresh = useCallback(() => {
        pageRef.current = 1
        setLoading(true)
        queryCollectList('init')
    }, [])



    return <View className={styles.collectPage} >
        <NavigationBar back color="#fff" title="我的收藏" background="#1C1134" />
        <ScrollView
            scrollY={true}
            scrollAnchoring={true}
            refresherEnabled={true}
            enhanced={true}
            style={{ width: '100%', height: '92vh', overflowAnchor: 'auto', paddingBottom: '1vh' }}
            onScrollToLower={onScrollToLower}
            lowerThreshold={100}>
            <View className={styles.list} >
                {collectList.list.map(item => <Item key={item.id} detail={item} refresh={refresh} />)}
            </View>
            <ListState
            isEmpty={!collectList.total}
            hasNextPage={hasNextPage}
            infiniteLoading={loading}
            emptyLabel={"还没有收藏"}
        />
        </ScrollView>
    </View>
}
export default MyCollect