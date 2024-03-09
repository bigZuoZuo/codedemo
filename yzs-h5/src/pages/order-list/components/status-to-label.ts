import {OrderState} from '../../../typings'

export function statusToLabel(status: OrderState) {
  let statusString = ''
  let amountLabel = ''
  switch (status) {
    case OrderState.pendingPayment:
      statusString = '待付款'
      amountLabel = '应付款'
      break
    case OrderState.orderPaid:
      statusString = '买家已付款'
      amountLabel = '实付款'
      break
    case OrderState.pendingShipped:
      statusString = '卖家已发货'
      amountLabel = '实付款'
      break
    case OrderState.merchantShipped:
      statusString = '卖家已发货'
      amountLabel = '实付款'
      break
    case OrderState.complete:
      statusString = '已完成'
      amountLabel = '实付款'
      break
    case OrderState.canceled:
      statusString = '已取消'
      amountLabel = '应付款'
      break
    default:
      statusString = '未知'
      break
  }

  return {
    statusString,
    amountLabel,
  }
}
