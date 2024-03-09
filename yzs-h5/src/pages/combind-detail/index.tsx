import {useEffect, useState} from 'react'
import {useObserver} from 'mobx-react'
import {Image, View, Text, Button, ScrollView} from '@tarojs/components'
import Taro, {FC, useRouter} from '@tarojs/taro'
import {AtCurtain, AtFloatLayout, AtTabs, AtTabsPane} from 'taro-ui'
import findIndex from 'lodash.findindex'

import {Swiper, SwiperSlide} from 'swiper/react/swiper-react.js'

import 'swiper/swiper.scss' // core Swiper

import {INFC} from '@/typings'
import NavigationBar from '@/components/navigation-bar/navigation-bar'
import challengeImg from '@/assets/marketing/hcdtz.png'
import dialogHeader from '@/assets/marketing/dialog-header.png'
import logo from '@/assets/icons/logo.png'
import {useStore} from '@/store'
import {api} from '@/api'

import CombindCondition from './components/combind-condition/combind-condition'
import CombindCard from './components/combind-card/combind-card'
import styles from './index.module.scss'
import light from './light.module.scss'
import hole from './hole'
import {showImageOrVideo} from '../home/home'

const CombindCenter: FC = () => {
  const store = useStore()
  const router = useRouter()

  if (!store.detailSet[router.params.id!]) {
    store.observableDetail({id: router.params.id!})
  }
  const [levelList, setLevelList] = useState<any>([])
  useEffect(() => {
    if (!router.params.id) return
    async function fetchData() {
      const {data: result} = await api.level.listList()
      setLevelList(result.data.list)
    }
    fetchData()
  }, [router.params.id])
  useEffect(() => {
    router.params.id && store.loadByApi({api: api.synthesis.synthesisDetail(router.params.id)})
  }, [router.params.id])

  return useObserver(() => {
    const detail = store.detailSet[router.params.id!] as any
    const [show, setShow] = useState(false)
    const [nftNumber, setNftNumber] = useState('')
    const [level, setLevel] = useState('')
    const [beau, setBeau] = useState<any>({})
    const [fadeInUpBig, setFadeInUpBig] = useState<any>(false)

    useEffect(() => {
      async function fetchData() {
        try {
          const resp = await api.user.miniprogramMeSynthesisMakeUpdate(detail.synthesis_rules?.[current]?.id)
          setNftNumber(resp.data?.data?.nft_number)
          if (resp.data?.data?.level) {
            setLevel(levelList[findIndex(levelList, ['name', resp.data?.data?.level])].icon)
          }
          setBeau(resp.data?.data)
          // setShow(true)
          setFadeInUpBig('end')
          store.loadByApi({api: api.synthesis.synthesisDetail(router.params.id!)})
        } catch (err) {
          setFadeInUpBig('mistake' + err?.response?.data?.message)
          // Taro.showToast({icon: 'none', title: '合成失败'})
        }
      }
      
      if (fadeInUpBig === true) {
        fetchData()
      } else if (fadeInUpBig === 'end') {
        setTimeout(() => {
          setFadeInUpBig(false)
          hole.tryHole(true)
          setShow(true)
        }, 3000)
      } else if (/mistake/.test(fadeInUpBig)) {
        setTimeout(() => {
          setFadeInUpBig(false)
          hole.tryHole(true)
          if (/no more stock/.test(fadeInUpBig)) {
            Taro.showToast({icon: 'none', title: '合成失败， 合成藏品没有库存。'})
          } else if (/no nfts/.test(fadeInUpBig)) {
            Taro.showToast({icon: 'none', title: '合成失败， 合成未配置藏品，请稍后合成。'})
          } else if (/还未开始/.test(fadeInUpBig)) {
            Taro.showToast({icon: 'none', title: '合成失败， 合成藏品尚未开始，请稍后合成。'})
          } else if (/已经结束/.test(fadeInUpBig)) {
            Taro.showToast({icon: 'none', title: '合成失败， 合成藏品已经结束。'})
          } else if (/nft amount/.test(fadeInUpBig)) {
            Taro.showToast({icon: 'none', title: '您的消耗材料不足，请先购买消耗材料。'})
          } else {
            Taro.showToast({icon: 'none', title: fadeInUpBig.replace('mistake', '') || '合成失败，请稍后合成。'})
          }
        }, 3000)
      }
    }, [fadeInUpBig])

    const handleSubmit = async () => {
      // hole.tryHole()
      // setFadeInUpBig(true)
      // return
      if (!detail) return
      const base_nft = detail?.synthesis_rules?.[current]?.base_nft || {}
      if (base_nft.owned < 1) {
        Taro.showToast({icon: 'none', title: '您的消耗材料不足，请先购买消耗材料。'})
        return
      }
      if (!consume_nfts.every((i) => i.owned >= i.amount)) {
        Taro.showToast({icon: 'none', title: '您的消耗材料不足，请先购买消耗材料。'})
        return
      }
      Taro.showModal({
        title: '提示',
        content: '确定合成吗？',
        success: function (res) {
          if (res.confirm) {
            hole.tryHole()
            setFadeInUpBig(true)
          } else if (res.cancel) {
          }
        },
      })
    }

    const handleComplete = () => {
      setShow(false)

      Taro.navigateTo({
        url: `/pages/nft-detail/index?id=${beau?.id}&assetsId=${beau?.user_nft_id}&from=assets`,
      })
    }

    const [current, setCurrent] = useState(0)

    const base_nft = detail?.synthesis_rules?.[current]?.base_nft || {}
    const consume_nfts = detail?.synthesis_rules?.[current]?.consume_nfts || []

    const [targetList, setTargetList] = useState<INFC[]>([])
    const [float, setFloat] = useState(-1)

    useEffect(() => {
      Taro.getSystemInfo({
        success: (res) => {
          const ios = !!(res.system.toLowerCase().search('ios') + 1)
          hole.blackHole('blackhole', ios ? 6000 : 3000)
        },
      }).catch(() => {
        hole.blackHole('blackhole', 3000)
      })
    }, [])
    useEffect(() => {
      if (!detail?.synthesis_rules) return

      Promise.all(
        detail?.synthesis_rules?.map(async (i) => {
          const {data} = await api.user.miniprogramNfcDetail({id:i.result_nft_id})
          return data
        })
      ).then((result) => setTargetList(result))
    }, [detail?.synthesis_rules])

    return (
      <View className={styles.page}>
        <NavigationBar color="#fff" back background="transparent" />

        <Image src={challengeImg} mode="aspectFit" className={styles.challenge} />
        <View className={styles.titleLabel}>{detail?.name}</View>
        <View className={styles.hcContainer}>
          <View className={styles.action} onClick={() => setFloat(0)}>
            合成说明
          </View>
          <View className={styles.swiperBox}>
            <Swiper
              className={styles.swiper}
              slidesPerView={2}
              centeredSlides={true}
              spaceBetween={60}
              onSlideChange={(ev) => {
                setCurrent(ev.activeIndex)
              }}
            >
              {targetList.map((item, i) => (
                <SwiperSlide>
                  <View
                    style={i === current ? {} : {opacity: 0.5}}
                    onClick={() => {
                      Taro.navigateTo({url: `/pages/nft-detail/index?id=${item.id}`})
                    }}
                  >
                    <CombindCard
                      level={
                        item?.level && levelList.length && levelList[findIndex(levelList, ['name', item?.level])].icon
                      }
                      material_type={item.material_type}
                      cover_url={item.cover_url}
                      image={item.images?.[0] || ''}
                      name={item.name}
                    />
                  </View>
                </SwiperSlide>
              ))}
            </Swiper>
          </View>
          <div id="blackhole" className={light.blackhole}>
            <div className={light.centerHover} id="centerHover"></div>
          </div>
          <View className={styles.combind} onClick={handleSubmit}>
            立即合成
          </View>
          {Boolean(consume_nfts?.length) && (
            <View>
              <View className={styles.prefixBox}>合成条件</View>
              <CombindCondition fadeInUpBig={false} baseNft={base_nft} rules={consume_nfts} />
            </View>
          )}
        </View>

        <View className="success-box-container">
          <AtCurtain isOpened={show} onClose={() => setShow(false)} className="success-box-dialog-container">
            <View className="success-box-dialog-header">恭喜您获得</View>
            <View className="success-box-dialog-flag">
              <View className="success-box-dialog-flag-container">
                {level ? <Image mode="aspectFill" src={level} className="success-box-dialog-flag-level" /> : null}
                {
                  showImageOrVideo({
                    type: beau?.material_type,
                    url: /3D|music|video/.test(beau?.material_type) ? beau?.cover_url : beau?.images?.[0],
                    className: 'success-box-dialog-flag-image'
                  })
                }
                <View className="success-box-dialog-flag-image-mask"></View>
                <Text className="success-box-dialog-flag-title">{beau?.name}</Text>
                <View className="success-box-dialog-flag-number-wrap">
                  <Text className="success-box-dialog-flag-number-label">编号</Text>
                  <Text className="success-box-dialog-flag-number">{nftNumber}</Text>
                </View>
              </View>
            </View>
            <View className="success-box-dialog-header success-box-dialog-footer">
              <Button onClick={handleComplete} className="success-box-dialog-next">
                完成
              </Button>
            </View>
          </AtCurtain>
          <AtFloatLayout isOpened={float !== -1} className="dialog-box-how-to-play-dialog" onClose={() => setFloat(-1)}>
            <View className="dialog-box-how-to-play-container">
              <View className="dialog-box-how-to-play-header">
                <Image src={dialogHeader} className="dialog-box-how-to-play-header-bg" />
                <View className="dialog-box-how-to-play-header-top">
                  <Image src={logo} className="dialog-box-how-to-play-header-logo" />
                  <View
                    className="at-curtain__btn-close at-curtain__btn-close--bottom dialog-box-how-to-play-header-close"
                    onClick={() => setFloat(-1)}
                  ></View>
                </View>
              </View>

              <View className="dialog-box-how-to-play-tabbar">
                <AtTabs
                  current={float}
                  tabList={[{title: '项目说明'}, {title: '玩法介绍'}]}
                  onClick={(i) => setFloat(i)}
                >
                  <AtTabsPane index={0} current={float}>
                    <View className="dialog-box-how-to-play-panel">
                      <View className="dialog-box-how-to-play-panel-wrap">
                        <ScrollView scrollY={true} className="dialog-box-how-to-play-panel-content-container">
                          <Text className="dialog-box-how-to-play-panel-content">{detail?.introduction}</Text>
                        </ScrollView>
                      </View>
                    </View>
                  </AtTabsPane>
                  <AtTabsPane index={1} current={float}>
                    <View className="dialog-box-how-to-play-panel">
                      <View className="dialog-box-how-to-play-panel-wrap">
                        <ScrollView scrollY={true} className="dialog-box-how-to-play-panel-content-container">
                          <Text className="dialog-box-how-to-play-panel-content">
                            {detail?.synthesis_rules?.[current]?.play_instruction}
                          </Text>
                        </ScrollView>
                      </View>
                    </View>
                  </AtTabsPane>
                </AtTabs>
              </View>
            </View>
          </AtFloatLayout>
        </View>

        {/* <View className="safe-bottom"></View> */}
      </View>
    )
  })
}

export default CombindCenter
