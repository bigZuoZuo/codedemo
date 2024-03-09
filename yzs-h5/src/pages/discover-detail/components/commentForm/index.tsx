import { Image, View, Button } from "@tarojs/components";
import styles from "./index.module.scss";
import shareIcon from "@/assets/share-icon.png";
import collectStarIcon from "@/assets/collect-star-icon.png";
import newsIcon from "@/assets/news-icon.png";
import { api } from "@/api";
import star2 from "@/assets/star2.png"
import Taro, { useRouter } from "@tarojs/taro";
import { ShareType } from "@/typings";
import { useShare } from "../../store";
import { useStore } from "@/store";

function CommentForm() {

    const store = useStore()

    const { status, discoverType } = useRouter().params

    // const [status, setStatus] = useState(state?.detail?.is_collect)

    const { dispatch, state } = useShare()


    const handleStatus = (e) => {
        e.stopPropagation()
        if (!store.state.logined) {
            login()
            return
        }
        api.collect
            .collect({
                type: discoverType === "sale" ? "sale" : "post",
                type_id: state?.detail?.id
            }).then(res => {
                if (res?.data?.code === 200) {
                    dispatch({ type: "is_collect", payload: res.data.data.is_collect })
                }
            })
    }

    const del = () => {
        Taro.showLoading({ title: '删除中...' })
        api.share.delShare(state?.detail?.id).then(res => {
            if (res.data?.code === 200) {
                Taro.reLaunch({ url: '/pages/my-share/index' })
            }
        }).finally(() => {
            Taro.hideLoading()
        })

    }


    const delShare = () => {
        Taro.showModal({
            title: '删除分享',
            content: `确定删除标题为《${state?.detail?.title}》的分享吗?`,
            success: function (res) {
                if (res.confirm) {
                    del()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
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

    return <>
        <View className={styles.commentForm} >
            <View className={styles.formContent} >
                {
                    discoverType === "sale" ? null :
                        status !== ShareType.passed
                            ? <View className={styles.input_box} onClick={sendMsg} >说点什么</View>
                            : <View className={styles.delShareBtn} onClick={delShare} >删除</View>
                }
                <View className={styles.iconBox} ><Image src={shareIcon} className={styles.icon} />{state?.detail?.share_count || ""}</View>
                <View className={styles.iconBox} ><Image src={state?.detail?.is_collect ? star2 : collectStarIcon} className={styles.icon} onClick={handleStatus} />{state?.detail?.collect_count || ""}</View>
                <View className={styles.iconBox}  ><Image src={newsIcon} className={styles.icon} />{state?.detail?.comment_count || ""}</View>

                {
                    discoverType !== "sale" ? null :
                    <Button className={styles.sale_btn} >
                        {
                            store.state?.userId === state.detail?.user_id ? "删除" : "我想要"
                        }
                    </Button>
                    // 删除
                }

            </View>
        </View>

    </>
}

export default CommentForm