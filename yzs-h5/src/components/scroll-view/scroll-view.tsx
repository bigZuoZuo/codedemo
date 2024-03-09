import {View, Image, ScrollView, ScrollViewProps, ITouchEvent} from '@tarojs/components'
import refreshIcon from '@/assets/refresh.png'

import './scroll-view.scss'
import {CSSProperties, PropsWithChildren, useCallback, useEffect, useRef, useState} from 'react'
import classNames from 'classnames'

enum RefreshStatusEnum {
  INIT,
  PULL_DOWN,
  READY_REFRESH,
  LOADING,
  DONE,
}

interface ExtensionProps {
  height?: string | number
  refreshing?: boolean
}

function RefreshScrollView(props: PropsWithChildren<ScrollViewProps & ExtensionProps>) {
  const [refreshHeight, setRefreshHeight] = useState(0)
  const [refreshStatus, setRefreshStatus] = useState(RefreshStatusEnum.INIT)
  const isUpperRef = useRef(true)
  const lastTouchYRef = useRef(0)
  const MAX_HEIGHT = 50
  const VALID_HEIGHT = 30

  const handleScrollToUpper = useCallback(() => {
    isUpperRef.current = true
  }, [])
  const handleScroll = useCallback(() => {
    isUpperRef.current = false
  }, [])

  const handleTouchStart = useCallback((event: ITouchEvent) => {
    const curTouch = event.touches[0]
    lastTouchYRef.current = curTouch.pageY
  }, [])
  const handleTouchMove = useCallback((event: ITouchEvent) => {
    const curTouch = event.touches[0]
    const moveY = (curTouch.pageY - lastTouchYRef.current) * 0.3
    if (!isUpperRef.current || moveY < 0 || moveY > 2 * MAX_HEIGHT || refreshStatus === RefreshStatusEnum.LOADING) {
      return
    }

    setRefreshHeight(moveY)

    if (moveY < VALID_HEIGHT) {
      setRefreshStatus(RefreshStatusEnum.PULL_DOWN)
    } else {
      setRefreshStatus(RefreshStatusEnum.READY_REFRESH)
    }
  }, [])

  const handleTouchEnd = useCallback(
    (event: ITouchEvent) => {
      lastTouchYRef.current = 0
      if (refreshStatus === RefreshStatusEnum.READY_REFRESH) {
        setRefreshStatus(RefreshStatusEnum.LOADING)
        setRefreshHeight(MAX_HEIGHT)
        props.onRefresherRefresh?.(event)
      } else {
        setRefreshHeight(0)
      }
    },
    [refreshStatus]
  )

  useEffect(() => {
    if (!props.refreshing) {
      setRefreshHeight(0)
      const loadingAnimate = setTimeout(() => {
        setRefreshStatus(RefreshStatusEnum.DONE)
        clearTimeout(loadingAnimate)
      }, 200)
    }
  }, [props.refreshing])

  return (
    <ScrollView
      {...props}
      className={classNames('refresh-scroll-view', props.className)}
      style={{height: props.height, ...(props.style as CSSProperties)}}
      onScrollToUpper={handleScrollToUpper}
      onScroll={handleScroll}
      onScrollToLower={props.onScrollToLower}
      scrollY={true}
    >
      <View
        className={`refresh-icon-view ${refreshStatus === RefreshStatusEnum.LOADING ? 'loading' : ''}`}
        style={{height: refreshHeight + 'px'}}
      >
        <Image
          className={`refresh-icon ${refreshStatus === RefreshStatusEnum.LOADING ? 'loading' : ''}`}
          src={refreshIcon}
          style={{transform: `rotate(${(refreshHeight / MAX_HEIGHT) * 360}deg)`}}
        />
      </View>
      <View
        className="refresh-body-view"
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {props.children}
      </View>
    </ScrollView>
  )
}

export default RefreshScrollView
