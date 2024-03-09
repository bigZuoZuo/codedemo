import NavigationBar from '@/components/navigation-bar/navigation-bar'
import { Image, View } from '@tarojs/components'
import styles from './index.module.scss'
import { AtButton, AtForm, AtImagePicker, AtTextarea } from 'taro-ui'
import { useEffect, useRef, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { uploadFile } from '@/utils/aliyun-oss'
import { ShareType } from '@/typings'
import { Dialog, Toast } from 'react-vant'
import { api } from '@/api'
import closeIcon from "@/assets/close.png"
import Input from '@/components/Input'

function SharePublish() {
  const { nft_id, share_id } = useRouter().params

  const [share, setShare] = useState<any>({
    images: [],
    title: '',
    content: '',
    audit_status: ShareType.created,
    nft_id: nft_id,
  })

  const initShareRef = useRef<any>({
    images: [],
    title: '',
    content: '',
  })

  useEffect(() => {
    share_id &&
      api.share.queryMyShareDetail(share_id).then((res) => {
        if (res.data?.code === 200) {
          const values = { ...res.data.data, images: res.data.data.images.map((url) => ({ url })) }
          setShare({
            images: values.images,
            title: values.title,
            content: values.content,
            audit_status: values.audit_status,
            // nft_id: nft_id
          })
          initShareRef.current = values
        }
      })
  }, [])


  const uploadImg = async (imgs, operationType) => {
    if (operationType === 'add') {
      Taro.showLoading({ title: '上传中...' })
      const files = imgs.splice(0, 4)

      let tasks: any[] = []
      let taskFiles: any[] = []
      files.forEach(file => {
        if (file.url.slice(0, 5) === "blob:") {
          taskFiles.push(file)
          tasks.push(uploadFile(file.file.path))
        }
      });

      Promise.all(tasks).then(res => {
        taskFiles.forEach((item, index) => item.url = res[index])
        setShare((state) => ({ ...state, images: [...state.images, ...taskFiles] }))
      })
        .catch(err => {
          Taro.showToast({ title: "上传失败～" })
        })
        .finally(() => {
          Taro.hideLoading()
        })

    } else {
      setShare((state) => ({ ...state, images: imgs }))
    }
  }

  const publish = () => {
    if (!share.images.length || !share.title || !share.content) return Toast.info('需要填写完才能发布哦')
    Taro.showLoading({ title: '发布中...' })
    const value = {
      ...share,
      images: share.images.map((img) => img.url),
      audit_status: ShareType.submit,
    }

    /*重新编辑草稿,发布帖子*/
    if (share_id) {
      upatePublish(value)
    } else {
      /*发布帖子*/
      api.share
        .publishMyShare(value)
        .then(() => {
          Taro.showToast({ title: '发布成功', icon: 'success' })
          Taro.reLaunch({ url: `/pages/my-share/index?status=${encodeURIComponent(ShareType.submit)}` })
        })
        .catch(() => {
          Taro.showToast({ title: '发布失败', icon: 'error' })
        })
        .finally(() => {
          Taro.hideLoading()
        })
    }
  }

  /*重新编辑发布草稿*/
  const upatePublish = (value) => {
    api.share
      .updateMyShare(share_id!, value)
      .then(() => {
        Taro.showToast({ title: '发布成功', icon: 'success' })
        Taro.reLaunch({ url: `/pages/my-share/index?status=${encodeURIComponent(ShareType.submit)}` })
      })
      .catch(() => {
        Taro.showToast({ title: '发布失败', icon: 'error' })
      })
      .finally(() => {
        Taro.hideLoading()
      })
  }

  /*更新草稿，从草稿箱过来*/
  const updateDraft = () => {
    Dialog.confirm({
      message: '是否更新草稿内容',
      cancelButtonText: '不更新',
      confirmButtonText: '更新草稿',
      cancelButtonColor: '#fff',
      confirmButtonColor: '#9373FF',
      className: styles.dialog,
      onClose: () => {
        // 返回
        Taro.navigateBack()
      },
      onConfirm: () => {
        Taro.showLoading({ title: '草稿更新中...' })
        const value = {
          ...share,
          images: share.images.map((img) => img.url),
          audit_status: ShareType.created,
        }
        api.share
          .updateMyShare(share_id!, value)
          .then(() => {
            Taro.showToast({ title: '更新成功', icon: 'success' })
            Taro.navigateTo({ url: `/pages/my-share/index?status=${encodeURIComponent(ShareType.created_reject)}` })
          })
          .catch(() => {
            Taro.showToast({ title: '更新失败', icon: 'error' })
          })
          .finally(() => {
            Taro.hideLoading()
          })
      },
    })
  }

  /*保存草稿*/
  const saveDraft = () => {
    let b = false
    Dialog.confirm({
      message: '是否保存草稿',
      cancelButtonText: '不保存',
      confirmButtonText: '保存草稿',
      cancelButtonColor: '#fff',
      confirmButtonColor: '#9373FF',
      className: styles.dialog,
      onClose: () => {
        // 返回
        // 防止点击保存还走进这个方法！ 
        if (b) {
          b = false
          return
        }
        Taro.navigateBack()
      },
      onConfirm: () => {
        b = true
        const value = {
          ...share,
          images: share.images.map((img) => img.url),
          audit_status: ShareType.created,
        }
        Taro.showLoading({ title: '草稿保存中...' })
        api.share
          .publishMyShare(value)
          .then(() => {
            Toast.success({ message: "保存成功,请到我的分享查看" })
            Taro.reLaunch({ url: `/pages/my-share/index?status=${encodeURIComponent(ShareType.created_reject)}` })
          })
          .catch(() => {
            Taro.showToast({ title: '保存失败', icon: 'error' })
          })
          .finally(() => {
            Taro.hideLoading()
          })
      },
    })
  }

  const back = () => {
    if (share_id) {
      const { images, title, content } = initShareRef.current
      // 在重新编辑时，如果分享内容都清空的状态下，直接返回上层目录
      if (!share.images.length && !share.title && !share.content) {
        Taro.navigateBack()
        return
      }
      // 在重新编辑时，如果分享内容有变动(非全空)，提示是否更新草稿
      if (
        title !== share.title ||
        content !== share.content ||
        JSON.stringify(images) !== JSON.stringify(share.images)
      ) {
        updateDraft()
        return
      }
      Taro.navigateBack()
      return
    }

    if (share.images.length || share.title || share.content) {
      saveDraft()
      return
    }
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
      <AtForm className={styles.shareForm} onSubmit={publish}>
        <AtImagePicker
          length={4}
          count={4}
          showAddBtn={share?.images?.length < 4}
          files={share?.images}
          onChange={uploadImg}
          className={styles.shareImgs}
        />
        <Input
          placeholder="写标题更有可能被推荐"
          maxlength={20}
          showCount
          border
          value={share?.title}
          classname={styles.shareTitleInput}
          onChange={(value) => {
            setShare((state) => ({ ...state, title: value.trim() }))
          }} />
        <AtTextarea
          count={false}
          value={share?.content}
          onChange={(value) => {
            setShare((state) => ({ ...state, content: value.trim() }))
          }}
          maxLength={999999}
          placeholder="分享该藏品的相关图文，让更多人看到..."
          className={styles.shareContent}
        />
        <View className={styles.btnBox}>
          <AtButton className={styles.btn} formType="submit">
            发布
          </AtButton>
        </View>
      </AtForm>
    </View>
  )
}

export default SharePublish
