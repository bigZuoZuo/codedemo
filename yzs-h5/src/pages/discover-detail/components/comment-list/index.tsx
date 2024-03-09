import { api } from "@/api";
import { useStore } from "@/store";
import { Text, View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useRouter } from "@tarojs/taro";
import { useObserver } from "mobx-react";
import { useEffect, useRef, useState } from "react";
import { List } from "react-vant";
import { useShare } from "../../store";
import Comment from "../comment";
import styles from "./index.module.scss"

function CommentList() {

    const { id,discoverType } = useRouter().params

    const currentPageRef = useRef(1)
    const [loading,setLoading] = useState(true)

    const {state, dispatch} = useShare()
    const store = useStore()
    const { comment  } = state


    useEffect(() => {
        queryCommentList()
    }, [])

    const queryCommentList = () => {
        api.comment.queryCommentList({
            type: discoverType === "sale" ? "sale" : "post",
            type_id: id!,
            size: 10,
            page: currentPageRef.current,
            fetch_reply_size:1,
            sort: {
                updated_at: -1
            }
        }).then(res=>{
            currentPageRef.current++
            dispatch({
                type: "comment",
                payload: res?.data?.data
            })
        })
        .finally(()=>{
            setLoading(false)
        })
    }

    const onScrollToLower = () => {
        setLoading(true)
        if(comment.list.length<comment.total){
            queryCommentList()
        }
    }


    const login = () => {
        const currentPage = '/pages/discover-detail/index' + location.search
        Taro.navigateTo({ url: '/pages/login/login?to=' + encodeURIComponent(currentPage) })
    }

    const sendMsg = () => {
        if (!store.state.logined) {
            login()
            return
        }
        dispatch({ type: "showCommentInput", payload: { showCommentInput: true } })
    }



    return useObserver(()=>{
        
        return <View className={styles.commentList} id='commentList' >
        <View className={styles.title} >
            {discoverType==="sale"?"留言":"评论区"}
            <Text className={styles.number} >{state?.detail?.comment_count > 999 ? "999+" : state?.detail?.comment_count || ""}</Text>
        </View>
        {
            discoverType!=="sale" ? null : 
            <View className={styles.sale_user_comment} >
                <Image src={store.state.avatar} className={styles.avatar} />
                <View className={styles.sale_comment_input} onClick={sendMsg} >
                    看对眼就留言，问问更多细节～
                </View>
            </View>
        }
        <List finished={comment.list.length>=comment.total} loading={loading}  onLoad={onScrollToLower}>
            {comment.list.map(item=><Comment detail={item} />)}
        </List>
    </View>
    })
}

export default CommentList