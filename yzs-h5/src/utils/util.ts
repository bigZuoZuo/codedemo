import {IAddress} from '@/typings'
import Taro, {ENV_TYPE, getEnv} from '@tarojs/taro'



/**
 * 格式化秒
 * @param result
 * @returns {string}
 */
export function formatSecond(second: number, showSecond: boolean = false): string {
  const h = Math.floor((second / 3600) % 24)
  const m = Math.floor((second / 60) % 60)
  const s = Math.floor(second % 60)

  let result = ''

  if (showSecond) {
    result = s + '秒'
  }

  if (m > 0) {
    result = m + '分' + result
  }
  if (h > 0) {
    result = h + '时' + result
  }

  return result
}
export function formatSecond2(second: number, showSecond: boolean = false): string {
  const h = Math.floor((second / 3600) % 24)
  const m = Math.floor((second / 60) % 60)
  const s = Math.floor(second % 60)

  let result = ''

  if (showSecond) {
    result = s + ''
    if (s >= 10) {
      result = s + ''
    } else {
      result = '0' + s
    }
  }

  if (m > 0) {
    if (m >= 10) {
      result = m + ':' + result
    } else {
      result = '0' + m + ':' + result
    }
  } else {
    result = '00:' + result
  }

  if (h > 0) {
    if (h >= 10) {
      result = h + ':' + result
    } else {
      result = '0' + h + ':' + result
    }
  }

  return result
}

export function arrayToObjectWithId<T extends {id: string}>(array: T[]): Record<string, T> {
  return array.reduce((prev, cur) => {
    prev[cur.id] = cur
    return prev
  }, {} as Record<string, T>)
}

export const mergeAddress = (addressInfo?: IAddress) => {
  return addressInfo ? addressInfo.province + addressInfo.city + addressInfo.area + addressInfo.address : ''
}

export const delay = (timeout: number = 3000) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export const maskAddress = (address?: string) => {
  console.log("address",address)
  return address ? `${address?.substring(0, 7)}...${address?.slice(-6)}` : ''
}

export const copy = (content: string) => {
  Taro.setClipboardData({
    data: content || '',
    success: function () {
      Taro.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 2000,
      })
    },
  })
}

export function debounce(func: (...args: unknown[]) => void, ms = 1000) {
  let timer: unknown
  return function (...args: unknown[]) {
    if (timer) {
      clearTimeout(timer as number)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, ms)
  }
}

export function debounceFirst(func: (...args: unknown[]) => void, ms = 350) {
  let timer: unknown
  return function (...args: unknown[]) {
    if (timer) {
      return
    }
    func.apply(this, args)
    timer = setTimeout(() => {
      timer = 0
    }, ms)
  }
}

type runFn = (...arg: any[]) => any

const ua = navigator.userAgent.toLowerCase()

export const os = {
  isWeapp: getEnv() === ENV_TYPE.WEAPP,
  isWechatWeb: getEnv() === ENV_TYPE.WEB && ua.indexOf('micromessenger') !== -1,
  isPlainWeb: getEnv() === ENV_TYPE.WEB && ua.indexOf('micromessenger') === -1,
  isWeb: getEnv() === ENV_TYPE.WEB,
}

export const runInPlatform = (options: {weapp?: runFn; wechatWeb?: runFn; plainWeb?: runFn; web?: runFn}) => {
  if (getEnv() === ENV_TYPE.WEAPP) {
    return options.weapp
  }
  if (getEnv() === ENV_TYPE.WEB) {
    const ua = navigator.userAgent.toLowerCase()

    if (options.wechatWeb && ua.indexOf('micromessenger') !== -1) {
      return options.wechatWeb
    }

    if (options.plainWeb && ua.indexOf('micromessenger') === -1) {
      return options.plainWeb
    }

    return options.web
  }
}
