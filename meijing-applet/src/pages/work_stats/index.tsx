import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { rootSourceBaseUrl } from '@common/utils/requests'
import './index.scss'
import { inject, observer } from '@tarojs/mobx'
import { UserStore } from '@common/store/user';
import { get } from 'lodash';


//巡查工作统计
const gongzuotongji = rootSourceBaseUrl + "/assets/discovery/gongzuotongji.png";
//分析报告
const fenxibaogao = rootSourceBaseUrl + "/assets/discovery/fenxibaogao.png";
//工作日志
const worklog = rootSourceBaseUrl + "/assets/discovery/rizhi.png";
//工地巡查统计
const gongditongji = rootSourceBaseUrl + "/assets/discovery/gongditongji.png";
//行业部门统计
const hangyebumen = rootSourceBaseUrl + "/assets/discovery/hangyebumen.png";
//区域工作统计
const quyutongji = rootSourceBaseUrl + "/assets/discovery/quyu.png";
//专项巡查统计
const zhuanxiangtongji = rootSourceBaseUrl + "/assets/discovery/zx.png";

interface WorkProps {
    userStore: UserStore
}

@inject("userStore")
@observer
class WorkStats extends Taro.Component<WorkProps> {

    constructor() {
        super(...arguments)
    }

    config: Config = {
        navigationBarTitleText: '工作统计'
    }

    // 工作统计
    onGztjHandle = () => {
        const { userStore: { userDetails } } = this.props
        let path = `grid?divisionCode=${userDetails.divisionCode}&title=${encodeURIComponent('工作统计')}`;
        Taro.navigateTo({
            url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
        })
    }

    // 统计分析
    jumpToDataAnalyst = () => {
        let path = `analyst?title=${encodeURIComponent('统计分析')}`;
        Taro.navigateTo({
            url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
        })
    }

    jumpToLog = () => {
        Taro.navigateTo({
            url: '/pages/log/index'
        })
    }

    jumpToGongdi = () => {
        let path = `work/construction?title=${encodeURIComponent('工地巡查统计')}`;
        Taro.navigateTo({
            url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
        })
    }

    jumpToHangye = () => {
        let path = `work/industry?title=${encodeURIComponent('行业部门统计')}`;
        Taro.navigateTo({
            url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
        })
    }

    jumpToQuyu = () => {
        let path = `work/region?title=${encodeURIComponent('区域工作统计')}`;
        Taro.navigateTo({
            url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
        })
    }

    jumpToZhuanXiang = ()=> {
      let path = `work/patrol?title=${encodeURIComponent('专项巡查统计')}`;
      Taro.navigateTo({
        url: '/common/pages/webview/index?url=' + encodeURIComponent(path)
      })
    }

    render() {
        const divisionFree = get(this.props.userStore.userDetails, 'divisionFree', false)
        return (
            <View className="work_stats">
                {/* <View className='list-item' onClick={this.onGztjHandle}>
                    <Image className='img' src={gongzuotongji} />
                    <Text className='txt'>巡查统计</Text>
                </View>
                <View className='list-item' onClick={this.jumpToDataAnalyst}>
                    <Image className='img' src={fenxibaogao} />
                    <Text className='txt'>统计分析</Text>
                </View> */}
                <View className='list-item' onClick={this.jumpToLog}>
                    <Image className='img' src={worklog} />
                    <Text className='txt'>日志导出</Text>
                </View>
                {!divisionFree && (
                    <View className='list-item' onClick={this.jumpToGongdi}>
                        <Image className='img' src={gongditongji} />
                        <Text className='txt'>工地巡查统计</Text>
                    </View>
                )}

                <View className='list-item' onClick={this.jumpToHangye}>
                    <Image className='img' src={hangyebumen} />
                    <Text className='txt'>行业部门统计</Text>
                </View>
                {!divisionFree && (
                    <View className='list-item' onClick={this.jumpToQuyu}>
                        <Image className='img' src={quyutongji} />
                        <Text className='txt'>区域工作统计</Text>
                    </View>
                )}
                <View className='list-item' onClick={this.jumpToZhuanXiang}>
                    <Image className='img' src={zhuanxiangtongji} />
                    <Text className='txt'>专项巡查统计</Text>
                </View>
            </View>
        )
    }

} export default WorkStats
