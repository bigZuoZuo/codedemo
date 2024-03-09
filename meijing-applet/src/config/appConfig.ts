/**
 * 当前小程序环境 枚举值：开发(develop)、体验、正式
 */
//@ts-ignore
const currentEnv = __wxConfig.envVersion

// 跑CI时，替换[appCode]字符串 yimeijing-applet(易美境)、yimeijing-sxlt-applet(绍兴蓝天)
export const currentAppCode: string = currentEnv === 'develop' ? 'yimeijing-applet' : '[appCode]'

// 不同小程序的文案显示配置
export const AppCodeNames = {
    'yimeijing-applet': {
        loginPageTitle: '易美境',
        appName: '易美境'
    },
    'yimeijing-sxlt-applet': {
        loginPageTitle: '绍兴蓝天',
        appName: '绍兴蓝天'
    }
}