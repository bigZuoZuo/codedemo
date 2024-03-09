import Taro from "@tarojs/taro"

export function showLoading(title: string = '加载中...') {
  return new Promise((resolve) => {
    Taro.showLoading({title, success: resolve})
  })
}

export function hideLoading() {
  Taro.hideLoading()
}
