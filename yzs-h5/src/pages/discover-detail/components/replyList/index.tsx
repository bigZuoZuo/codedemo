import { api } from "@/api";
import { View } from "@tarojs/components";
import { useRef, useState } from "react";
import { useShare } from "../../store";
import Comment from "../comment";
import styles from "./index.module.scss"

function ReplyList(props: { reply_items: any[], reply_count: number;comment_id:string }) {

    const { state, dispatch } = useShare()

    const pageRef = useRef(1)
    const [loading,setLoading] = useState(false)

    const [isShowAll,setIsShowAll] = useState(false)


    const handlerMore = () => {
        if(props.reply_count<= props.reply_items.length) {
            setIsShowAll(state=>!state)
            return
        }
        if(loading ) return
        setLoading(true)
        api.comment.queryReplyList({
            comment_id: props.comment_id,
            size: 10,
            page: pageRef.current,
            sort: {
                created_at: -1
            }
        }).then(res=>{
            dispatch({type:pageRef.current!==1?"reply_more":"reply_cover", payload:{
                comment_id:props.comment_id,
                data: res.data.data
            } })
            pageRef.current++
        }).finally(()=>{
            setLoading(false)
        })
    }


    return <View className={styles.replyList} >
        {props.reply_items.map((item,index) => {
            // if(!isShowAll&&index===2) return
            if(props.reply_count<= props.reply_items.length&&isShowAll&&index>=1){
                return null
            }
            return <Comment key={item.id} detail={item} loop={false} />
        })}
        {
            props.reply_count <= 1 ? null :
                <View className={styles.more} onClick={handlerMore} >{
                    props.reply_count<= props.reply_items.length
                    ? isShowAll ? "展开全部" : "收起" 
                    : `展示更多回复`
                }</View>
        }
    </View>
}

export default ReplyList