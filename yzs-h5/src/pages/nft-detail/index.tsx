import { useEffect, useState } from 'react'
import { useObserver } from 'mobx-react'
import Taro, { FC, useDidHide, useRouter } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import findIndex from 'lodash.findindex'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import { INFC } from '@/typings'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import EmptyFigure from '@/components/empty-figure/empty-figure'
import RenderHtml from '@/components/render-html/render-html'
import copyIcon from '@/assets/icons/copy.png'
import { copy, maskAddress } from '@/utils/util'
import { store } from '@/store'
import { api } from '@/api'

import { showImageOrVideo } from '../home/home'
import styles from './index.module.scss'
import { Toast } from 'react-vant'

const GIVE_TEXT = {
  ok: '藏品转赠',
  in_transfer: '转赠中',
  // in_transfer: '藏品转赠',
  locking: '锁定期',
  // locking: '藏品转赠',
  not_holder: '非持有人',
  uplink_in: '上链中',
  nft_limit: '未开放转赠',
}
const ZSW_TEXT = {
  unbind_zsw: '藏品未在后台绑定',
  in_transfer: '二级流通',
  ok: '二级流通',
  already_transfer: '已二级流通',
  not_show: '不显示',
}
const NftDetail: FC = () => {
  const router = useRouter()
  const [levelList, setLevelList] = useState<any>([])
  const [title, setTitle] = useState('')
  const [more, setMore] = useState(false)
  const id = router.params.id
  let chain_type = router.params.chain_type === "国版链" ? "国版链" : ""
  const assetsId = router.params.assetsId
  const from = router.params.from

  // 绑定中数文账号
  useEffect(() => {
    if (!router.params.code) return
    async function fetchData() {
      await api.zsw.bindZSWAccount({ code: router.params.code })
      Taro.showToast({ title: '账号绑定成功', icon: 'none' })
      Taro.reLaunch({ url: `pages/nft-detail/index?id=${id}&assetsId=${assetsId}&from=${from}` })
    }
    fetchData()
  }, [router.params.code])

  useEffect(() => {
    if (!id) return
    async function fetchData() {
      const { data: result } = await api.level.listList()
      setLevelList(result.data.list)
    }
    fetchData()
  }, [id])
  useEffect(() => {
    if (router.params.from) {
      setTitle('藏品详情')
    }
  }, [router.params.from])
  useDidHide(() => {
    setTitle('')
  })
  useEffect(() => {
    if (!id) return
    store.loadByApi({ api: api.user.miniprogramNfcDetail({ id, type: chain_type ? "chain" : "nfc" }) })
  }, [id])

  const [modal, setModal] = useState<any>(false)
  const [checkIsTransfer, setCheckIsTransfer] = useState<any>(false)

  const [checkIsGive, setCheckIsGive] = useState<any>(false)
  useEffect(() => {
    if (!assetsId || !router.params.from) return
    api.zsw.checkIsTransfer(assetsId).then(({ data }) => {
      setCheckIsTransfer(data.data)
    })
    api.give.giveStatusApi(assetsId).then(({ data }) => {
      setCheckIsGive(data.data)
      // setCheckIsTransfer('not_show')
    })
  }, [assetsId])

  if (!store.detailSet[id!]) {
    store.observableDetail({ id: id! })
  }

  // const [contractAddress, setContractAddress] = useState('')
  return useObserver(() => {
    const detail = store.detailSet[id!] as INFC

    // useEffect(() => {
    //   if (!detail.category_id) return
    //   store.loadByApi({api: api.nfc.categoryDetail(detail.category_id)}).then((resp) => {
    //     setContractAddress(resp.contract_address)
    //   })
    // }, [detail.category_id])

    const isTwoButton =
      ['ok'].indexOf(checkIsTransfer) > -1 &&
      checkIsGive === 'ok' &&
      ['ok', 'locking', 'in_transfer', 'not_holder', 'nft_limit'].indexOf(checkIsGive) > -1
    const isShowFooter =
      (['ok'].indexOf(checkIsTransfer) > -1 && checkIsGive === 'ok') ||
      ['ok', 'locking', 'in_transfer', 'not_holder', 'nft_limit'].indexOf(checkIsGive) > -1

    console.log(isShowFooter, '<isShowFooter-isTwoButton>', isTwoButton)

    const html = detail?.desc?.toString().replace(/<img/g, `<img margin: 4px auto;"`)
    const index = findIndex(levelList, ['name', detail?.level])

    return (
      <View className={styles.page}>
        {/* {from === 'assets' ?
        <NavigationBar
          color="#fff"
          title={title}
          back
          background="transparent"
          onBack={() => {
            Taro.navigateTo({url: '/pages/property/property'})
            return true
          }}
        />
        : */}
        <NavigationBar color="#fff" title={title} back background="transparent" />
        {detail ? (
          <View className={styles.nftWrap}>
            <View className={styles.imageWrapper}>
              {
                showImageOrVideo({
                  type: detail?.material_type,
                  url: /3D|music|video/.test(detail?.material_type) ? detail?.cover_url : detail?.images?.[0],
                  className: styles.image,
                  canClick: true,
                  oUrl: detail?.images?.[0],
                  extra: /video/.test(detail?.material_type) ? 'nft-detail video-icon' : 'nft-detail',
                  // dataTab: detail?.chain_type,
                  // dataTabStyle: styles['cover-img-box'],
                })
              }
              {/* <view
                className={
                  /3D/.test(detail?.material_type)
                    ? styles.d3
                    : /video/.test(detail?.material_type)
                    ? `${styles['d3']} ${styles['video-icon']}`
                    : ''
                }
              ></view> */}
            </View>
            <View className={styles.infoBox}>
              {detail?.level && levelList.length && detail?.type !== 'collectionEntity' ? (
                <Image mode="aspectFill" src={levelList[index].icon} className={styles.level} />
              ) : null}
              <View className={styles.name}>{detail?.name}</View>

              <View className={styles.card}>
                <View className={styles.title}>发行方</View>
                <View className={styles.fieldset}>
                  {/* 发行方名称 */}
                  {detail?.issuer_name || '--'}
                  {/* <View className={styles.value}>{detail?.issuer_name || '--'}</View> */}
                </View>
              </View>

              <View className={styles.card}>
                <View className={styles.title}>区块链信息</View>
                <View className={styles.fieldset}>
                  合约地址
                  <View className={styles.value}>
                    {maskAddress(chain_type ? detail.mint_hash : detail.transaction_hash)}
                    <Image
                      src={copyIcon}
                      className={styles.icon}
                      onClick={() => {
                        copy(chain_type ? detail.mint_hash : detail.transaction_hash)
                      }}
                    />
                  </View>
                </View>

                {/* <View className={styles.fieldset}>
                  Token ID
                  <View className={styles.value}>
                    {detail?.token_id}
                    <Image
                      src={copyIcon}
                      className={styles.icon}
                      onClick={() => {
                        copy(detail?.token_id + '')
                      }}
                    />
                  </View>
                </View> */}

                {/*<View className={styles.fieldset}>
                  认证标准
                  <View className={styles.value}>ERC721</View>
                </View>
                 <View className={styles.fieldset}>
                  认证网络
                  <View className={styles.value}>国家级版权交易保护联盟链</View>
                </View> */}
              </View>

              <View className={styles.card}>
                <View className={styles.title}>作品简介</View>
                <View className={styles['bod-body']}>
                  <RenderHtml>{html}</RenderHtml>
                </View>
              </View>
              <View className="safe-bottom" />
            </View>
            <View className="fixed-footer flex-between-center">
              {/* <View
                wx-if={['ok'].indexOf(checkIsTransfer) > -1 && checkIsGive === 'ok'}
                className='fixed-footer-btn fixed-footer-btn-confirm'
                onClick={() => {
                  Taro.showModal({
                    title: '提示',
                    content: '确定发布该藏品到二级市场吗？',
                    cancelText: '取消',
                    confirmText: '确定',
                    success: async ({confirm}) => {
                      if (confirm) {
                        Taro.showLoading({title: '藏品发布中...'})
                        api.zsw
                          .transferApi(assetsId)
                          .then((res) => {
                            Taro.hideLoading()
                            window.location.replace(res.data.data.redirectUrl)
                          })
                          .catch((err) => {
                            Taro.hideLoading()
                            if (
                              ['还未绑定中数文账号', '中数文账号授权过期'].indexOf(err?.response?.data?.message) > -1
                            ) {
                              setModal(true)
                            } else {
                              Taro.showToast({title: err?.response?.data?.message, icon: 'none'})
                            }
                          })
                      }
                    },
                  })
                }}
              >
                {ZSW_TEXT[checkIsTransfer]}
              </View> */}
              {(['ok'].indexOf(checkIsTransfer) > -1 && checkIsGive === 'ok') || true ? (
                <View
                  className="fixed-footer-btn-more"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMore(!more)
                  }}
                >
                  更多
                  {more ? (
                    <View
                      className="fixed-footer-tooltip"
                      onClick={(e) => {
                        e.stopPropagation()
                        chain_type==="国版链" && Taro.showToast({ title: "超际平台暂未上线,请稍后再试", icon: 'none'  })
                        chain_type!=="国版链" && Taro.showToast({ title: ZSW_TEXT[checkIsTransfer], icon: 'none' })
                        setMore(false)
                      }}
                    >
                      <View className="arrow">
                        <View className="content"></View>
                      </View>
                      藏品流通
                    </View>
                  ) : null}
                </View>
              ) : (
                <View className="fixed-footer-btn-more" />
              )}
              <View className={styles.footerBtn}>
                <View
                  className="fixed-footer-btn fixed-footer-btn-transparent2"
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/share-publish/index?nft_id=${id}`,
                    })
                  }}
                >
                  发帖
                </View>
                <View
                  className="fixed-footer-btn fixed-footer-btn-transparent2"
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/flow-sale-publish/index?assetsId=${assetsId}`,
                    })
                  }}>
                  出售
                </View>
                <View
                  wx-if={chain_type !== "国版链"}
                  className="fixed-footer-btn fixed-footer-btn-back2"
                  onClick={() => {
                    if (detail.chain_type === "国版链") {
                      Toast.info("国版链藏品不支持转赠！")
                      return
                    }
                    if (checkIsGive == 'ok') {
                      Taro.navigateTo({
                        url: `/pages/nft-gift/index?id=${id}&assetsId=${assetsId}&status=${checkIsGive}`,
                      })
                    } else {
                      // Taro.showToast({title: GIVE_TEXT[checkIsGive], icon: 'none'})
                      Toast.info(GIVE_TEXT[checkIsGive])
                    }
                  }}
                >
                  转赠
                </View>
              </View>

            </View>
          </View>
        ) : (
          <View className={styles.container}>
            <View className={styles.empty}>
              <EmptyFigure label="商品已经下架了，看看别的" down />
            </View>
          </View>
        )}
        <AtModal
          isOpened={modal}
          onClose={() => {
            setModal(false)
          }}
        >
          <AtModalHeader>确认绑定吗？</AtModalHeader>
          <AtModalContent>你当前账号尚未绑定中数文平台账号，请前往绑定后，再进行资产转移。</AtModalContent>
          <AtModalAction>
            <Button
              onClick={() => {
                setModal(false)
              }}
              className="taro-cancel-button"
            >
              取消
            </Button>
            <Button
              onClick={() => {
                setModal(false)
                window.location.replace('/third-auth')
                // api.zsw
                //   .getZSWOauth2Ulr({returnUrl: baseUrl + '/nft-detail' + location.search})
                //   .then(() => {
                //     // window.location.replace(result.data.data.url)
                //     window.location.replace('/third-auth')
                //   })
                //   .catch(() => {})
              }}
              className="taro-confirm-button"
            >
              去绑定
            </Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  })
}

export default NftDetail
