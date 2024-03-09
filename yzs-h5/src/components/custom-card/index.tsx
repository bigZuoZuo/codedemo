import { Image, Text, View } from "@tarojs/components";
import styles from "./index.module.scss";
import star1 from "@/assets/star1.png"
import star2 from "@/assets/star2.png"
import React, { useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { api } from "@/api";
import { useStore } from "@/store";
import classNames from "classnames";


interface CustomCardProps {
    /** 封面 */
    cover: string;
    /** 标题 */
    title: string;
    /** 头像 */
    avatar: string;
    /** 用户id, 非必传 用于跳转用户详情页 */
    userId?: string,
    /** 昵称 */
    nickname: string;
    /** 是否收藏 */
    is_collect?: boolean;
    /** 点击卡片 */
    onClick?: Function;
    id: string;
    /** 收藏数量 */
    collect_count?: number | string;
    /** 禁止收藏 */
    disabledCollect?: boolean;
    /** 自适应大卡片 */
    large?: boolean;
    /** 底部信息栏 右侧自定义信息 */
    rightNode?: React.ReactNode;
    /** 描述 */
    desNode?: React.ReactNode;
    /** 类型 用于收藏 */
    collect_type?: "post" | "sale",
}

function CustomCard(props: CustomCardProps) {

    const { cover, title, avatar, nickname, is_collect,
        onClick, id, collect_count = '', disabledCollect = false,
        large, rightNode,desNode=null, collect_type="post" , userId} = props


    const [collect, setCollect] = useState({
        status: is_collect,
        count: collect_count || 0
    })

    const route = useRouter()
    const store = useStore()


    const handleStatus = (e: { stopPropagation: () => void; }) => {
        e.stopPropagation()
        if (disabledCollect) return
        if (!store.state.logined) {
            Taro.navigateTo({ url: '/pages/login/login?to=' + encodeURIComponent(route.path) })
            return
        }
        api.collect
            .collect({
                type: collect_type,
                type_id: id
            }).then(res => {
                if (res?.data?.code === 200) {
                    setCollect(state => ({
                        status: !state.status,
                        count: !state.status ? +state.count + 1 : +state.count - 1
                    }))
                }
            })
    }

    const clickCard = () => {
        onClick && onClick()
    }


    const jumpUserDetail = (e) => {
        e.stopPropagation()
        if(userId) {
            if(!route.path.indexOf("/user?")&&route.params?.userId===userId) {
                return Taro.showToast({
                    title: "已在当前用户页面",
                    icon: "none"
                })
            }
            Taro.navigateTo({
                url: `/pages/user-page/index?userId=${userId}`
            })
        }
    }

    return <View className={classNames(styles.custom_card, { [styles.custom_card_large]: large })} onClick={clickCard} >
        <Image className={styles.cover} src={cover} />
        <Text className={styles.title} >
            {title}
            {desNode}
        </Text>
        
        <View className={styles.infoStatus} >
            <View className={styles.info}>
                <Image className={styles.userAvatar} src={avatar} onClick={jumpUserDetail} />
                <Text className={styles.userName} >
                    {
                        nickname
                    }
                </Text>
            </View>
            <View className={styles.collect_count} >
                {
                    rightNode || (<>
                        <Image className={styles.star} src={collect.status ? star2 : star1} onClick={handleStatus} />
                        {collect.count || ''}
                    </>)
                }

            </View>
        </View>
    </View>
}

export default CustomCard