import { ShareType } from "@/typings";

interface Page {
    page: number;
    size: number;
    sort?:{
        updated_at?: 0 | -1,
        created_at?: 0 | -1
    }
}

export interface QueryShare extends Page {
    /** 查询用户发帖 -- 审核通过的 */
    user_id?:string;
}

export interface Collect {
    type: "post"|"sale";
    type_id: string;
}

/** 查询用户发帖 -- 审核通过的 */
export interface CollectList extends Page {
    user_id?:string;
}

/** 查询 --- 我的分享 */
export interface ShareList extends Page {
    audit_status: ShareType;
}
/* 发布/修改 分享 */
export interface ShareData {
    title: string;
    content: string;
    images: any[];
    audit_status: ShareType;
    nft_id?:string
}

/** 发布评论 */
export interface SendComment {
    type:"post"|"sale";
    type_id: string;
    content: string;
}
/** 查询评论 */
export interface QueryComments extends Page, Omit<SendComment,'content'> {
    fetch_reply_size?:number;
}
/** 发布评论回复 */
export interface SendReply extends SendComment {
    comment_id?: string;
    reply_id?: string;
}
/** 回复评论列表 */
export interface ReplyList extends Page {
    comment_id?: string;
    reply_id?: string;
}


/** 实物 流转 发售 */
export interface FlowSale extends Omit<ShareData,'nft_id'> {
    price: any;
    user_nft_id?: string;
}

/** 查询 实物 流转发售 */
export interface QuerySales extends Page {
    user_id?:string;
}