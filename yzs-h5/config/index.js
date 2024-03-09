const path = require('path')

const config = {
  env: {
    releaseHouse: new Date().getHours(),
    releaseMinutes: new Date().getMinutes(),
  },
  projectName: 'yzs-h5-mini-app-taro',
  date: '2022-2-12',
  designWidth: 780,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    780: 1.922 / 2,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {
    YZS_MODE: JSON.stringify(process.env.YZS_ENV || ''),
  },
  copy: {
    patterns: [],
    options: {},
  },
  sass: {
    projectDirectory: path.resolve(__dirname, '../'),
  },
  framework: 'preact',
  alias: {
    '@': path.resolve(__dirname, '../src'),
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    publicPath: '/',
    router: {
      mode: 'browser', // 或者是 'browser' hash
      customRoutes: {
        // "页面路径": "自定义路由"
        '/pages/home/home': ['/', '/home', '/index'],
        '/pages/login/login': '/login',
        '/pages/login-phone/login-phone': '/login-phone',
        '/pages/login-captcha/login-captcha': '/login-captcha',
        '/pages/property/property': '/property',
        '/pages/property-list/property': '/property-list',
        '/pages/order-list/order-list': '/order-list',
        '/pages/order-detail/order-detail': '/order-detail',
        '/pages/privacy-policy/privacy-policy': '/privacy-policy',
        '/pages/setup/setup': '/setup',
        '/pages/comment-list/comment-list': '/comment-list',
        '/pages/account/account': '/account',
        '/pages/personal/personal': '/personal',
        '/pages/blind-box-detail/blind-box-detail': '/blind-box-detail',
        '/pages/official-goods-detail/official-goods-detail': '/official-goods-detail',
        '/pages/place-order/place-order': '/place-order',
        '/pages/pay-success/pay-success': '/pay-success',
        '/pages/paid-middle/paid-middle': '/paid-middle',
        '/pages/pay/pay': '/paying',
        '/pages/article/article': '/article',
        '/pages/web-viewer/web-viewer': '/web-viewer',
        '/pages/combind-center/index': '/combind-center',
        '/pages/my-collect/index':'/my-collect',
        '/pages/my-share/index': '/my-share',
        '/pages/combind-detail/index': '/combind-detail',
        '/pages/nft-detail/index': '/nft-detail',
        '/pages/issuer/index': '/issuer',
        '/pages/collection/index': '/collection',
        '/pages/pin/index': '/pin',
        '/pages/pin-confirm/index': '/pin-confirm',
        '/pages/pin-success/index': '/pin-success',
        '/pages/nft-gift/index': '/nft-gift',
        '/pages/delivery-address/index': '/delivery-address',
        '/pages/delivery-address-list/index': '/delivery-address-list',
        '/pages/exchange-detail/index': '/entity-binding',
        '/pages/exchange/index': '/exchange',
        '/pages/logistics/index': '/logistics',
        '/pages/invitation/index': '/invitation',
        '/pages/zone/index': '/zone',
        '/pages/third-auth/index': '/third-auth',
        '/pages/discover/discover': '/discover',
        '/pages/share-status/index': '/share-status',
        '/pages/share-publish/index': '/share-publish',
        '/pages/user-page/index':'/user',
        '/pages/wallet-page/index': '/wallet-page',
        '/pages/flow-sale-publish/index': '/flow-sale-publish',
        '/pages/discover-detail/index' : '/discover-detail',
        '/pages/my-flow-sale/index': '/my-flow-sale'
      },
    },
    staticDirectory: 'static',
    esnextModules: ['taro-ui'],
    postcss: {
      'postcss-nesting': {},
      nesting: {},
      postcssNesting: {},
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    output: {
      filename: 'js/[name].[hash].js',
      chunkFilename: 'js/[name].[chunkhash].js',
    },
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[chunkhash].css',
    },
  },
  weapp: {
    module: {
      postcss: {
        // css modules 功能开关与相关配置
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module，下文详细说明
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
