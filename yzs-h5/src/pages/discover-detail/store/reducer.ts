import { ListData } from "@/typings";

type Action = {
    type?: string,
    payload: any
}
type IcontextDis = (Action) => void

interface IState {
    detail: any;
    comment: ListData;
    showCommentInput: boolean;
    sendMsgData?: any;
}

export interface IContext {
    state: IState;
    dispatch: IcontextDis
}

export const initState = {
    detail: null,
    comment: {
        list: [],
        total: 0
    },
    showCommentInput: false
}


const handleReplys = (state:IState,payload,type:string) => {
    const {comment_id,data} = payload
    state.comment.list.forEach(item=>{
        if(item.id===comment_id){
            if(type==='cover') {
                item.reply_items = data.list
                state.detail.reply_count = data.total
            }
            if(type==="more") {
                item.reply_items = [...item.reply_items,...data.list]
                state.detail.reply_count = data.total
            }
            if(type==='add'){
                item.reply_items = [data,...item.reply_items]
                item.reply_count++
            }
        }
    })
    state.showCommentInput = false
    return {...state}
}

const handleCommentInput = (state:IState,payload) => {
    const { showCommentInput, sendMsgData } = payload
    return {
        ...state,
        showCommentInput,
        sendMsgData
    }
}

export const reducer = (preState: IState, action: Action) => {
    let { type,payload } = action;
    switch (type) {
        case 'showCommentInput':
            return handleCommentInput(preState,payload)
        case 'discoverDetail':
            return { ...preState, detail: payload };
        case 'is_collect':

            return { ...preState, detail: {
                ...preState.detail,
                is_collect: payload,
                collect_count: payload ? ++preState.detail.collect_count : --preState.detail.collect_count
            } };
        case 'comment':
            return { ...preState, comment:{
                list: [...preState.comment.list,...payload.list],
                total: payload.total
            } };
        case 'addNewComtemt':
            preState.detail.comment_count++
            preState.showCommentInput = false
            preState.comment = {
                list:[{...payload,reply_items:[],reply_count:0},...preState.comment.list],
                total: ++preState.comment.total
            }
            return {...preState}
        case 'reply_cover': // 覆盖评论所带显示的三条回复
            return handleReplys(preState,payload,'cover')
        case 'reply_more': // 查看更多回复
            return handleReplys(preState,payload,'more')
        case 'addNewReply':
            return handleReplys(preState,payload,'add')
        default:
            return preState;
    }
}