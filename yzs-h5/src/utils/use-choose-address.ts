import {IAddress} from '@/typings'
import Taro, {eventCenter, useRouter} from '@tarojs/taro'
import {useCallback, useEffect, useRef} from 'react'

const useChooseAddress = () => {
  const router = useRouter()
  let resolveRef = useRef<(value: IAddress) => void>()

  const onShow = useCallback(async () => {
    if (!resolveRef.current) {
      return
    }

    const data = await Taro.getStorage({key: 'addressInfo'})
    resolveRef.current?.(data.data as IAddress)
  }, [])

  useEffect(() => {
    const onShowEventId = router.onShow
    eventCenter.on(onShowEventId, onShow)
    return () => {
      eventCenter.off(onShowEventId, onShow)
    }
  }, [])

  return function chooseAddress() {
    Taro.navigateTo({url: '/pages/delivery-address-list/index?choose=1'})
    return new Promise<IAddress>((resolve) => (resolveRef.current = resolve))
  }
}

export default useChooseAddress
