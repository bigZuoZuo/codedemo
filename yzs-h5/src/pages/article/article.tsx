import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {View, RichText} from '@tarojs/components'
import {useRouter} from '@tarojs/taro'
import {useState, useEffect} from 'react'

import {api} from '@/api'

function ArticlePage() {
  const params = useRouter().params
  const [beau, setBeau] = useState<any>({})
  useEffect(() => {
    if (!params.channel) {
      return
    }
    async function fetchData() {
      const result = await api.article.getArticle({channel: params.channel})
      setBeau(result.data.data)
    }
    fetchData()
  }, [params.channel])
  useEffect(() => {
    if (!params.news) {
      return
    }
    async function fetchData() {
      const result = await api.article.getNews(params.news)
      setBeau(result.data.data)
    }
    fetchData()
  }, [params.news])

  return (
    <View
      className="container"
      style={{
        background: '#1b1135',
        minHeight: '100vh',
      }}
    >
      <NavigationBar back color="#fff" background="#1b1135" title={beau.title} />
      {params.news ? (
        <View
          style={{
            padding: '15px 20px 0',
            fontSize: '14px',
            color: '#fff',
            whiteSpace: 'pre-wrap',
          }}
        >
          {beau.title}
        </View>
      ) : null}
      {params.news ? (
        <View
          style={{
            padding: '0px 20px',
            fontSize: '14px',
            color: '#fff',
            whiteSpace: 'pre-wrap',
          }}
        >
          {beau.describe}
        </View>
      ) : null}
      <RichText
        style={{
          padding: '0px 20px 15px',
          display: 'block',
          background: '#1b1135',
          fontSize: '14px',
          color: '#fff',
          whiteSpace: 'pre-wrap',
        }}
        nodes={beau.content}
      ></RichText>
      <View className="safe-bottom" />
    </View>
  )
}

export default ArticlePage
