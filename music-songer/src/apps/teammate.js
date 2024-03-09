export default {
  appName: "teammate",
  pkg: {
    ios: ["com.im.teammate.ios"],
    android: ["com.im.teammate.android", "com.peerless.android", "com.imbb.bixin.android"],
  },
  domain: "imhotplay.com",
  // 接口服务器协议
  protocol: {
    development: "https",
    production: "https",
  },
  api_domain: {
    development: "https://dev.iambanban.com",
    production: "https://api.imhotplay.com",
    alpha: "https://api.imhotplay.com",
  },
  oss: "https://xs-image-proxy.oss-cn-hangzhou.aliyuncs.com/",
  download: {
    ios: "https://apps.apple.com/cn/app/%E7%9A%AE%E9%98%9F%E5%8F%8B/id1475056760?l=en", // iOS下载地址
    android: "http://a.app.qq.com/o/simple.jsp?pkgname=com.im.teammate.android&ckey=CK14436409808", // Android下载地址
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
