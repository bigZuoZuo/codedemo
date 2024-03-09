import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi';
// import { stringify } from 'querystring';
const baseUrl = process.env.BASE_URL;
const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const errorHandler = (error: any) => {
  console.log(error)
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;

  notification.error({
    message: `failed: ${status}: ${url}`,
    description: errortext,
  });
};

const request = extend({
  // errorHandler, // 默认错误处理
  prefix: baseUrl,
  // 默认请求头
  headers: {
    'x-token': localStorage.getItem('headers_token') || '',
  },
  credentials: 'include', // 默认请求是否带上cookie
});

request.interceptors.request.use((url, options) => {
  return {
    url: `${url}`,
    options: {
      ...options,
    },
  };
});

request.interceptors.response.use(async (response: any) => {
  const data = await response.clone().json();
  //   , msg
  const { code, msg } = data;
  // code===200 请求成功
  if (code === 401) {
    notification.error({
      message: '提示',
      description: '登录失效，请重新登录！',
    });
    const { query = {} } = history.location;
    const { redirect } = query;
    localStorage.removeItem('headers_token');
    // Note: There may be security issues, please note 
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
      });
    }
  } else if (code === 403) {
    notification.warning({
      message: '提示',
      description: msg,
    });
  }
  //   else if (code != 200) {
  //     notification.info({
  //       message: '提示',
  //       description: msg,
  //     });
  //   }
  return response;
});

export const http = {
  get: (url: string, data?: any, options?: any) => {
    return request.get(url, { ...options, params: data });
  },
  put: (url: string, data?: any, options?: any) => {
    return request.put(url, { ...options, data });
  },
  post: (url: string, data?: any, options?: any) => {
    return request.post(url, { ...options, data });
  },
  delete: (url: string, data?: any, options?: any) => {
    return request.delete(url, { ...options, data });
  },
  patch: (url: string, data?: any, options?: any) => {
    return request.patch(url, { ...options, data });
  },
};

export default request;
