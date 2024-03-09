import {IOrder, OrderState} from '../typings'
import {useEffect, useState} from 'react'
import {useStore} from '../store'
import dayjs from 'dayjs'
import {runInAction} from 'mobx'
import {formatSecond} from './util'

export function useOrderTiming(orderId: string) {
  const store = useStore()

  const orderDetail = store.detailSet[orderId] as IOrder
  const [timing, setTiming] = useState(0)
  const [rerender, setRerender] = useState(false)

  useEffect(() => {
    if (orderDetail.state !== OrderState.pendingPayment) {
      return
    }

    const now = dayjs(Date.now())
    const expiredAt = dayjs(orderDetail.time_expire)
    const remainTime = expiredAt.diff(now, 'second')

    const timeout = setTimeout(() => {
      setRerender(!rerender)
    }, 1000)

    if (remainTime <= 0) {
      clearTimeout(timeout)
      setTiming(0)

      runInAction(() => {
        // 取消状态
        orderDetail.state = OrderState.canceled
        orderDetail.canceled_at = dayjs().format()

        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, orderId)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.complete}` as any, orderId)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.merchantShipped}` as any, orderId)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingPayment}` as any, orderId)
        store.removeByListSet(`miniprogramMeOrderCreate_${OrderState.pendingShipped}` as any, orderId)
        store.addToListSet(`miniprogramMeOrderCreate_${OrderState.canceled}` as any, orderId)
      })
      return
    }

    setTiming(remainTime)
    return () => {
      clearTimeout(timeout)
    }
  }, [orderDetail.state, rerender])

  return orderDetail.state !== OrderState.pendingPayment ? '' : formatSecond(timing, true)
}
