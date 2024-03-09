import {WebView} from '@tarojs/components'
import {useRouter} from '@tarojs/taro'

const WebViewer = () => {
  const {params} = useRouter()
  return <WebView src={params.link || ''}></WebView>
}

export default WebViewer
