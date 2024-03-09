export function formatDate(time: Date) {
  if (!time) return ''

  const currentTime = +new Date()
  const beforeTime = +new Date(time)
  /**当天整点00:00:00时间*/
  const currentDateStamp = new Date(new Date().toLocaleDateString()).getTime()
  const n = 24 * 60 * 60 * 1000
  let hours: any = new Date(time).getHours()
  hours = hours < 10 ? `0${hours}` : hours
  let minutes: any = new Date(time).getMinutes()
  minutes = minutes < 10 ? `0${minutes}` : minutes
  let seconds: any = new Date(time).getSeconds()
  seconds = seconds < 10 ? `0${seconds}` : seconds

  if (currentDateStamp < beforeTime) {
    return `${hours}:${minutes}:${seconds}`
  }

  if (currentTime - beforeTime < 7 * n) {
    return Math.ceil((currentTime - beforeTime) / n) + '天前发布'
  }

  /** 当前年 */
  const year = new Date().getFullYear()
  /** 当前月 */
  let month: any = new Date().getMonth()
  /** 当前月初时间*/
  const monthStart = new Date(year, month, 1).getTime()

  let date: any = new Date().getDate()
  date = date < 10 ? `0${date}` : date

  if (currentTime - beforeTime < monthStart) {
    return Math.ceil((currentTime - beforeTime) / (7 * n)) + '周前发布'
  }

  month = month < 10 ? `0${month}` : month

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('.')  + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('.')
}

export const formatNumber = (n: number) => {
  const ns = n.toString()
  return ns[1] ? ns : '0' + ns
}
