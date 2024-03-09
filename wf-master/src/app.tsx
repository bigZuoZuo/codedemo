import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import Brand from './components/Brand';
import { fetchMenuData } from './services/user/api';
import { menuDataHandle } from '@/utils';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg:any = await queryCurrentUser();
      const menuData = await fetchMenuData();
      const list = menuDataHandle(menuData.data);
      console.log(list,"请求menuData---")
      msg.menuData = list;
      if (list.length && list[0].children?.length) {
        msg.rootRoute = list[0].children[0].path;
      }
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}
//  支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState }: any) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      // 如果没有登录，重定向到 login
      if (!localStorage.getItem('headers_token') && location.pathname !== loginPath) {
        history.push(loginPath);
      } else if (localStorage.getItem('headers_token') && location.pathname === loginPath) {
        history.push('/');
      } else if (localStorage.getItem('headers_token') && location.pathname === '/') {
        // console.log(initialState?.currentUser?.rootRoute, '---------------');
        history.push(initialState?.currentUser?.rootRoute);
      }
    },
    menuHeaderRender: (logo: any) => {
      return <Brand logo={logo} />;
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // ...initialState?.settings,
    menu: {
      // 每当 initialState?.currentUser?.user?.id 发生修改时重新执行 request
      params: {
        userId: initialState?.currentUser?.user?.id,
      },
      request: async () => {
        console.log('menu===',initialState?.currentUser)
        return initialState.currentUser.menuData;
      },
      locale: false,
    },
  };
};

const authHeaderInterceptor = (url: string, options: {}) => {
  const headers_token = localStorage.getItem('headers_token');
  const authHeader = {
    Authorization: headers_token ? `Bearer ${headers_token}` : '',
  };
  // console.log(url,"-------------")
  if ([url].includes('/getSecret') || [url].includes('/login')) {
    return {
      url: `/question-api${url}`,
      options: { ...options, interceptors: true },
    };
  }
  return {
    url: `/question-api${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
export const request: RequestConfig = {
  errorHandler: (err) => {
    console.log('err', err);
  },
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  // errorConfig: {
  //   adaptor: (resData) => {
  //     console.log(resData,"----------------------")
  //     return {
  //       ...resData,
  //       success: resData.ok,
  //       errorMessage: resData.message,
  //     };
  //   },
  // },
};
// src/app.ts
