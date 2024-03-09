import NavigationBar from '@/components/navigation-bar/navigation-bar'
import {Image, View} from '@tarojs/components'
import styles from './index.module.scss'
import {AtButton, AtForm, AtImagePicker, AtTextarea} from 'taro-ui'
import {useState} from 'react'
import Taro, {useRouter} from '@tarojs/taro'
import {uploadFile} from '@/utils/aliyun-oss'
import {ShareType} from '@/typings'
import {Toast} from 'react-vant'
import {api} from '@/api'
import closeIcon from '@/assets/close.png'
import Input from '@/components/Input'
import {FlowSale} from '@/api/type'

function SalePublish() {
  const {assetsId} = useRouter().params

  const [flowData, setFlowData] = useState<FlowSale>({
    images: [],
    title: '',
    content: '',
    price: '',
    audit_status: ShareType.created,
    user_nft_id: assetsId,
  })

  const uploadImg = async (imgs, operationType) => {
    if (operationType === 'add') {
      Taro.showLoading({title: '上传中...'})
      const files = imgs.splice(0, 4)

      let tasks: any[] = []
      let taskFiles: any[] = []
      files.forEach((file) => {
        if (file.url.slice(0, 5) === 'blob:') {
          taskFiles.push(file)
          tasks.push(uploadFile(file.file.path))
        }
      })

      Promise.all(tasks)
        .then((res) => {
          taskFiles.forEach((item, index) => (item.url = res[index]))
          setFlowData((state) => ({...state, images: [...state.images, ...taskFiles]}))
        })
        .catch((err) => {
          Taro.showToast({title: '上传失败～'})
        })
        .finally(() => {
          Taro.hideLoading()
        })
    } else {
      setFlowData((state) => ({...state, images: imgs}))
    }
  }

  const publish = () => {
    if (!flowData.images.length || !flowData.title || !flowData.content || !flowData.price) {
      return Toast.info('需要填写完才能发布售卖哦')
    }
    Taro.showLoading({title: '发布中...'})
    const value = {
      ...flowData,
      images: flowData.images.map((img) => img.url),
      audit_status: ShareType.submit,
      price: +flowData.price?.replace('¥', '') * 100,
    }
    api.flow
      .sale(value)
      .then((res) => {
        if (res.data.code === 200) {
          // 跳转我的售卖管理
          Taro.navigateBack()
        }
      })
      .catch((error) => {
        Taro.showToast({title: error.response.data.message, icon: 'none'})
      })
      .finally(() => {
        Taro.hideLoading()
      })
  }

  const back = () => {
    Taro.navigateBack()
  }

  return (
    <View className={styles.sharePublish}>
      <NavigationBar
        back
        isNoHome
        color="#fff"
        background="#1C1134"
        slotLeft={<Image src={closeIcon} className={styles.closeIcon} onClick={back} />}
      />
      <AtForm className={styles.shareForm}>
        <AtImagePicker
          length={4}
          count={4}
          showAddBtn={flowData?.images?.length < 4}
          files={flowData?.images}
          onChange={uploadImg}
          className={styles.shareImgs}
        />
        <Input
          placeholder="写标题更有可能被推荐"
          maxlength={20}
          showCount
          border
          value={flowData?.title}
          classname={styles.shareTitleInput}
          onChange={(value: string) => {
            setFlowData((state) => ({...state, title: value.trim()}))
          }}
        />
        <AtTextarea
          count={false}
          value={flowData?.content}
          onChange={(value) => {
            setFlowData((state) => ({...state, content: value.trim()}))
          }}
          maxLength={999999}
          placeholder="分享该藏品的相关图文，让更多人看到..."
          className={styles.shareContent}
        />
        <Input
          label="价格"
          color="#9373FF"
          classname={styles.publish_sale}
          textAlign="right"
          // type='number'
          placeholder="请输入售卖价格"
          value={flowData?.price}
          onChange={(value: any) => {
            let str = value?.replace('¥', '')
            const length = `${Math.trunc(str)}`.length
            if (!isNaN(parseFloat(str)) && isFinite(str) && length <= 9 && str.indexOf('.') === -1) {
              // str = str.indexOf(".")!==-1 ? str.substring(0,str.indexOf(".")+3) :str
              setFlowData((state) => ({...state, price: `¥${str}`}))
            }
            if (str === '') {
              setFlowData((state) => ({...state, price: ''}))
            } else {
              setFlowData((state) => ({...state}))
            }
          }}
        />
        <View className={styles.btnBox}>
          <AtButton className={styles.btn} formType="submit" onClick={publish}>
            发布
          </AtButton>
        </View>
      </AtForm>
    </View>
  )
}

export default SalePublish
