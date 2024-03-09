export default {
  appName: "who",
  pkg: {
    ios: ["com.rewan.who.ios"],
    android: ["com.who.android"],
  },
  domain: "91hotplay.com",
  // 接口服务器协议
  protocol: {
    development: "https",
    production: "https",
  },
  api_domain: {
    development: "https://dev.91hotplay.com",
    production: "https://api.91hotplay.com",
    alpha: "https://alpha.91hotplay.com",
  },
  oss: "https://xs-image-proxy.oss-cn-hangzhou.aliyuncs.com/",
  download: {
    ios: "http://a.app.qq.com/o/simple.jsp?pkgname=com.imbb.banban.android", // iOS下载地址
    android: "http://a.app.qq.com/o/simple.jsp?pkgname=com.imbb.banban.android", // Android下载地址
  },

  mock: {
    server_env: "development",
    lan: "zh-CN",
    uid: {
      development: "105000671",
      production: "110628765",
      alpha: "110628765",
    },
    token: {
      development:
        "4b0bHj4cb8CXe9O81yH8JAt5k40IwFslQN5sAlikBr7Sdalqq7q8l7nsMUEXxx4qVEKQh__2FAXn9nj81U__2FmGu2lbVXbRtRwKUnF0HqlCe__2FTM__2FqVs5Le3Evo__2BPr",
      production:
        "4b0bHj4cb8CXe9O81yH8JAt5k40IwFslQN5sAlikBr7Sdalqq7q8l7nsMUEXxx4qVEKQh__2FAXn9nj81U__2FmGu2lbVXbRtRwKUnF0HqlCe__2FTM__2FqVs5Le3Evo__2BPr",
      alpha:
        "a837__2FgrJzyjjtFxc__2B2TRRuPi49bqWbm7ddiSQ4U99Cs9miDUDU1__2BvCWXj5kT7Q04QWO9__2FVS__2FsJvaxFqpyOqgrZptE__2FjO8zxIwHTm5Uc57P2m__2F8AWjmwICuTu",
    },
  },
};
