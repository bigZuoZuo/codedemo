import { api } from "@/api";
import { Button, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { useState } from "react";
import { Field, Popup } from "react-vant";
import { useShare } from "../../store";
import styles from "./index.module.scss"

function CommentSend() {

    const { discoverType } =  useRouter().params

    const [content, setContent] = useState('')

    const { dispatch, state } = useShare()

    const [loading,setloading] = useState(false)

    const sendComment = () => {
        api.comment.send({
            type: discoverType === "sale" ? "sale" : "post",
            type_id: state.detail?.id,
            content
        }).then(res => {
            dispatch({ type: "addNewComtemt", payload: res.data.data })
            setContent('')
        }).finally(() => {
            Taro.hideLoading()
            setloading(false)
        })
    }
    const sendReply = () => {
        const { type_id, comment_id, id } = state.sendMsgData
        api.comment.sendReply({
            type: discoverType === "sale" ? "sale" : "post",
            type_id,
            content,
            comment_id: comment_id ? comment_id : id,
            reply_id: comment_id ? id : undefined
        }).then(res => {
            setContent('')
            dispatch({ type: "addNewReply", payload: {
                data:res.data.data,
                comment_id: res.data.data.comment_id
            } })
        }).finally(() => {
            Taro.hideLoading()
            setloading(false)
        })
    }

    const sendMsg = () => {
        if (!content) return
        if(loading) return
        setloading(true)
        Taro.showLoading({ title: "评论发布中...",mask:true })
        if (!state.sendMsgData) {
            sendComment()
        } else {
            sendReply()
        }

    }

    const closeInput = () => {
        setContent('')
        dispatch({ type: "showCommentInput", payload: { showCommentInput: false } })
    }

    return <Popup
        visible={state.showCommentInput}
        position="bottom"
        onClose={closeInput}
        className={styles.commentSendBox}>
        <Field
            rows={1}
            autosize={{ maxHeight: 200 }}
            value={content}
            onChange={setContent}
            // label="留言"
            // formatter={(str: string) => str.replace(/\s*/g, "")}
            formatter={(str: string) => str.trim()}
            className={styles.input_comment}
            border={false}
            type="textarea"
            placeholder="说些什么..."
            autofocus
        />
        <View className={styles.sendBtnBox} >
            <Button className={styles.sendBtn} onClick={sendMsg} disabled={loading} >发送</Button>
        </View>

    </Popup>
}

export default CommentSend