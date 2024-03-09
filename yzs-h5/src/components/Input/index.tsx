import classNames from "classnames"
import styles from "./index.module.scss"

interface Input {
    value?: string;
    onChange?: Function;
    placeholder?: string;
    border?: boolean;
    maxlength?: number;
    type?: 'text' | 'number' | 'password' | 'phone' | 'idcard' | 'digit'
    /**是否显示长度*/
    showCount?: boolean;
    /** 字体颜色*/
    color?: string;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 字体方向 */
    textAlign?: "left" | "right";
    classname?: string;
    /** 输入框左侧标题，若传入为空，则不显示标题*/
    label?: string; 
}

function Input(props: Input) {
    const { value = "", onChange, placeholder = "请输入",
        border, maxlength, type, color = "#fff",
        backgroundColor = "transparent", textAlign = "left",
        classname,label,showCount } = props

    const handleChange = (e) => {
        onChange && onChange(e?.target?.value.trim())
    }

    return <div 
        className={classNames(
            styles.input_box,
            {
                [styles.inpu_label]:label,
                [styles.input_border]: border,
                [styles.input_count]: showCount,

            }, 
            classname)
        } 
        data-count={`${value.length}/${maxlength}`}
        data-label={`${label}`}
        >
        <input
            className={styles.input_}
            value={value}
            placeholder={placeholder}
            type={type}
            onChange={handleChange}
            maxLength={maxlength}
            style={{
                color,
                backgroundColor,
                textAlign
            }} />
    </div>
}

export default Input