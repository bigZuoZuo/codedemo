import {useState, useCallback, useEffect} from 'react'
import Taro from '@tarojs/taro'

/**  */
export const useErrorThrow = () => {
  const [, throwError] = useState()
  return {
    throwError: (err) =>
      throwError(() => {
        throw err
      }),
    makeThrowable: async (asyncFn, throwDirectly = false) => {
      try {
        return await asyncFn()
      } catch (err) {
        if (throwDirectly) {
          throwError(() => {
            throw err
          })
          return
        }
        showError(err)
      }
    },
  }
}

/** 提示错误 */
export const showError = async (err) => {
  console.warn('捕获到发生错误:', err)
  if (err.code === 100 || err.code === 'not_authorized' || err.arguments?.code === 401) {
    return Taro.redirectTo({url: '/pages/login/index'})
  }
  await Taro.showToast({
    title: `${err.localizedMessage || err.error || err.message || err?.match(/\r?\n([^:]*)/)?.[1]}`,
    icon: 'none',
    duration: 3000,
  })
}

/** 可捕获异步异常的 useCallback */
export const useThrowableCallback = (fn, deps = [], throwDirectly = false) => {
  const {makeThrowable} = useErrorThrow()
  return useCallback((...args) => makeThrowable(fn.bind(undefined, ...args), throwDirectly), deps)
}

/** 可捕获异步异常的 useEffect */
export const useThrowableEffect = (fn, deps, throwDirectly = false) => {
  const {makeThrowable} = useErrorThrow()
  return useEffect(() => {
    ;(async () => {
      await makeThrowable(fn, throwDirectly)
    })()
  }, deps)
}
