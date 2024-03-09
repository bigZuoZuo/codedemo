import NavigationBar from '@/components/navigation-bar/navigation-bar'
import { View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
// import Taro from "@tarojs/taro"
import CommentList from './components/comment-list'
import CommentSend from './components/comment-send'
import CommentForm from './components/commentForm'
import Detail from './components/detail'
import './index.scss'
import ContextProvider from './store'


function DiscoverDetail() {

  const from = useRouter().params?.from

  const onBack = () => {

    if(from) {
      Taro.reLaunch({
        url: from
      })
    } else {
      Taro.navigateBack()
    }
  }
  
  return (
    <View className="discover-detail">
      <NavigationBar onBack={onBack} title="内容详情" back isNoHome color="#fff" background="#1B1537"/>
      <ContextProvider>
        <Detail/>
        <CommentList />
        <CommentForm />
        <CommentSend/>
      </ContextProvider>
    </View>
  )
}

export default DiscoverDetail
