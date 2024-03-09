import classNames from "classnames"
import { useMemo } from "react"
import styles from "./index.module.scss"

interface Props {
    detail: any
}

function productTab (props: Props){
    const { detail } = props

    const node = useMemo(()=>{

        if(!detail?.name) return null

        const tabs = (detail?.tags || []).map((tag, index)=>(
            <div key={index} className={styles.tab} >
                {tag}
            </div>
        ))

        return <>
            <div className={classNames(styles.tab,styles.category)}  > 
                {detail.category_name}
            </div>
            {tabs}
        </>
    },[detail])


    return<div className={styles.productTab} >
        {
            !detail?.is_can_sale ? null :
            <div className={classNames(styles.tab,styles.limit)} >
                {detail?.total}份
            </div>
        }
        {
            node
        }
        
    </div>

}

export default productTab