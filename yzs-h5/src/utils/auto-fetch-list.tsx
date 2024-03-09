import {ApiNS, IStore, store, useStore} from '../store'
import {IBase} from '../typings'
import Taro, {usePullDownRefresh, useReachBottom} from '@tarojs/taro'
import {createRef, Component, useState, useEffect, useRef} from 'react'

type FetchFn = (...args: any) => Promise<any>

const namespaceMapByFetchFn = new WeakMap()

interface AutoFetchListOption<T extends keyof ApiNS, F extends FetchFn> {
  /**
   * @deprecated 优先使用灵活性更高的 fetch prop 代替
   */
  fetchApi?: T
  extendsBody?: (data: any, pagination: any) => Partial<Parameters<ApiNS[T]>[0]>
  isFallFlow?: boolean
  observable?: boolean

  disableAutoRefresh?: boolean
  disableAutoLoadMore?: boolean

  fetch?: F
  extendsBodyByFetch?: () => Partial<Parameters<F>[0]>
}

export interface AutoFetchListProps {
  loading: boolean
  list: IBase[]
  /**
   * TODO: 暂未实现
   */
  reaction: {
    list: IBase[]
  }
  paginationInfo: {
    isRefresh: boolean
    currentPage: number
    hasNextPage: boolean
    total: number
  }
  specifyStoreKey: string

  refreshLoading: boolean
  infiniteLoading: boolean

  onPullDownRefresh: () => void
  onReachBottom: () => void
}

/**
 * @deprecated 使用 useAutoFetchList 代替, 这个函数是直接从小程序迁移到 mobx 的产物
 */
export function autoFetchList<T extends keyof ApiNS>({
  fetchApi,
  extendsBody,
  isFallFlow = false,
  observable = false,
}: AutoFetchListOption<T, any>) {
  return (PageComponent: any): any => {
    return class extends Component<{store: IStore; state?: string}> {
      state = {
        loading: false,
        list: [],
        fallFlowList: [] as IBase[][],
        /**
         * TODO: 暂未实现
         */
        reaction: {
          list: [],
        },
        paginationInfo: {
          isRefresh: false,
          currentPage: 0,
          hasNextPage: false,
          total: 0,
        },
        specifyStoreKey: '',

        refreshLoading: false,
        infiniteLoading: false,
      }

      subRef = createRef<any>()

      getNameSpace(specifyStoreKey?: string) {
        const _specifyStoreKey = specifyStoreKey || this.state.specifyStoreKey || this.props.state
        return fetchApi + (_specifyStoreKey ? `_${_specifyStoreKey}` : '')
      }

      updateState(data: any) {
        this.setState(data, () => {
          if (observable) {
            const namespace = this.getNameSpace()
            store.observableList(namespace as T, {
              list: this.state.list,
              fallFlowList: this.state.fallFlowList,
            })
          }
        })
      }

      async loadBackupData() {
        const body = extendsBody?.({...this.state, ...this.subRef.current.state}, this.state.paginationInfo) ?? {}
        this.setState({
          loading: true,
        })

        const nextPage = this.state.paginationInfo.isRefresh ? 0 : this.state.paginationInfo.currentPage + 1

        const {list, total} = await store
          .load(fetchApi!, {
            limit: 20,
            skip: nextPage * 20,
            ...body,
          })
          .catch((error) => {
            this.setState({
              loading: false,
            })
            return Promise.reject(error)
          })

        let currentTotal = this.state.list.length

        if (this.state.paginationInfo.isRefresh) {
          this.updateState({list})
          currentTotal = list.length
        } else {
          this.updateState({list: [...this.state.list, ...list]})
          currentTotal += list.length
        }

        if (isFallFlow) {
          const fallFlowList = this.state.fallFlowList
          fallFlowList[this.state.paginationInfo.isRefresh ? 0 : this.state.fallFlowList.length] = list
          this.updateState({fallFlowList: [...fallFlowList]})
        }

        this.state.paginationInfo.total = total
        this.state.paginationInfo.isRefresh = false
        this.state.paginationInfo.currentPage = nextPage
        this.state.paginationInfo.hasNextPage = currentTotal < total

        this.setState({
          loading: false,
          paginationInfo: {...this.state.paginationInfo},
        })
      }

      componentDidMount() {
        this.setState(
          {
            list: [],
            fallFlowList: [],
            refreshLoading: false,
            infiniteLoading: false,
            loading: false,
            paginationInfo: {
              currentPage: 0,
              hasNextPage: false,
              total: 0,
              isRefresh: true,
            },
          },
          () => this.loadBackupData().catch()
        )
      }

      onLoad(options: Record<string, string | undefined>) {
        this.setState(options)
      }

      onPullDownRefresh() {
        Taro.stopPullDownRefresh()
        if (this.state.refreshLoading) {
          return
        }

        this.setState(
          {
            refreshLoading: true,
            paginationInfo: {...this.state.paginationInfo, isRefresh: true},
          },
          () => {
            this.loadBackupData().finally(() => this.setState({refreshLoading: false}))
          }
        )
      }

      onReachBottom() {
        if (!this.state.paginationInfo.hasNextPage) {
          return
        }

        if (this.state.infiniteLoading) {
          return
        }

        this.setState({infiniteLoading: true})
        this.loadBackupData().finally(() => this.setState({infiniteLoading: false}))
      }

      render() {
        const state = this.state

        if (observable) {
          const namespace = this.getNameSpace(this.props.state)
          if (!store.listSet[namespace]?.list) {
            store.observableList(namespace as any, {
              list: [],
              fallFlowList: [],
            })
          }
        }

        return (
          <PageComponent
            ref={this.subRef}
            {...this.props}
            {...state}
            onPullDownRefresh={this.onPullDownRefresh.bind(this)}
            onReachBottom={this.onReachBottom.bind(this)}
          />
        )
      }
    }
  }
}

/**
 * 子组件中不知是否可以触发
 */
export function useAutoFetchList<T extends keyof ApiNS, F extends FetchFn>(
  props: AutoFetchListOption<T, F> & {specifyStoreKey?: string}
) {
  const store = useStore()

  const [loading, setLoading] = useState(false)
  const refreshLoadingRef = useRef(false)
  const infiniteLoadingRef = useRef(true)

  const fetchedListRef = useRef<IBase[]>([])
  const paginationInfoRef = useRef({
    currentPage: 0,
    hasNextPage: false,
    total: 0,
    isRefresh: true,
  })

  const _specifyStoreKey = props.specifyStoreKey

  let apiPrefix = ''
  if (props.fetchApi) {
    apiPrefix = props.fetchApi
  }

  if (props.fetch) {
    apiPrefix = namespaceMapByFetchFn.get(props.fetch!)
    if (!apiPrefix) {
      apiPrefix = Math.random().toString()
      namespaceMapByFetchFn.set(props.fetch, apiPrefix)
    }
  }

  const namespace = apiPrefix + (_specifyStoreKey ? `_${_specifyStoreKey}` : '')

  function updateList(list: IBase[]) {
    fetchedListRef.current = list
    if (props.observable) {
      store.observableList(namespace as T, {
        list: list,
        fallFlowList: [],
      })
    }
  }

  /**
   * 加载数据
   */
  async function loadBackupData() {
    const body = props.extendsBodyByFetch?.() ?? (props.extendsBody?.({}, paginationInfoRef.current) as any)
    setLoading(true)

    const nextPage = paginationInfoRef.current.isRefresh ? 0 : paginationInfoRef.current.currentPage + 1

    const limit = body?.limit ?? 20
    const skip = limit * nextPage
    const result = await (props.fetch
      ? store.loadByApi({api: props.fetch({limit, skip, ...body})})
      : store.load(props.fetchApi!, {limit, skip, ...body})
    ).catch((error) => {
      paginationInfoRef.current.isRefresh = false
      refreshLoadingRef.current = false
      infiniteLoadingRef.current = false
      setLoading(false)
      return Promise.reject(error)
    })
    const {list, total} = result?.data || result || {}

    let currentTotal = fetchedListRef.current.length
    if (paginationInfoRef.current.isRefresh) {
      updateList(list)
      currentTotal = list.length
    } else {
      updateList([...fetchedListRef.current, ...list])
      currentTotal += list.length
    }

    paginationInfoRef.current.total = total
    paginationInfoRef.current.isRefresh = false
    paginationInfoRef.current.currentPage = nextPage
    paginationInfoRef.current.hasNextPage = currentTotal < total
    refreshLoadingRef.current = false
    infiniteLoadingRef.current = false
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  function refresh() {
    setTimeout(() => Taro.stopPullDownRefresh(), 100)
    if (refreshLoadingRef.current) {
      return
    }
    refreshLoadingRef.current = true
    paginationInfoRef.current.isRefresh = true
    loadBackupData()
  }

  function loadMore() {
    if (!paginationInfoRef.current.hasNextPage) {
      return
    }
    if (infiniteLoadingRef.current) {
      return
    }
    infiniteLoadingRef.current = true
    loadBackupData()
  }

  // 017f0586-ffab-4095-b910-001166eed336

  // 下拉刷新
  usePullDownRefresh(() => {
    if (props.disableAutoRefresh) {
      return
    }
    refresh()
  })

  // 加载更多
  useReachBottom(() => {
    if (props.disableAutoLoadMore) {
      return
    }
    loadMore()
  })

  if (props.observable) {
    store.observableListIfNull(namespace as any)
  }

  return {
    loading,
    data: fetchedListRef.current,
    isRefreshLoading: refreshLoadingRef.current,
    isInfiniteLoading: infiniteLoadingRef.current,
    paginationInfo: paginationInfoRef.current,

    getObservableList() {
      return store.listSet[namespace].list
    },

    refresh,
    loadMore,
  }
}
