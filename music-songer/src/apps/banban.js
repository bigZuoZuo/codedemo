export default {
  appName: "banban",
  pkg: {
    android: [
      "com.imbb.banban.android",
      "com.im.xhj.android",
      "com.yjtd.peini",
      "com.rewan.zhizhi",
      "com.imbb.cp",
      "com.imbb.naitang.android",
    ],
    ios: ["com.im.xhj.ipa"],
    windows: ["com.im.banban.desktop"],
  },
  domain: "iambanban.com",

  thinkingdata: {
    development: {
      appid: "4135588af6af4645a222978cdaeda0cf",
      domain: "https://data.banban.chat",
    },
    alpha: {
      appid: "4135588af6af4645a222978cdaeda0cf",
      domain: "https://data.banban.chat",
    },
    production: {
      appid: "7acc569375a54bf9af70204c04e78313",
      domain: "https://data.banban.chat",
    },
  },

  api_domain: {
    development: "https://dev.iambanban.com",
    production: "https://api.iambanban.com",
    alpha: "https://alpha.yinjietd.com",
  },

  oss: "https://xs-image-proxy.oss-cn-hangzhou.aliyuncs.com/",
  download: {
    ios: "http://a.app.qq.com/o/simple.jsp?pkgname=com.imbb.banban.android", // iOS下载地址
    android: "http://a.app.qq.com/o/simple.jsp?pkgname=com.imbb.banban.android", // Android下载地址
  },

  //   mock native.getUserInfo返回的数据
  mock: {
    server_env: "development",
    lan: "zh_cn",
    uid: {
      // development: "118434562",
      development: "118434784",
      // development: "118434100",
      production: "110628765",
      alpha: "110628765",
    },
    token: {
      development:
        // "1978jXOz2FS__2Bfh__2F6bKSQMlwrZRLH0QJkB__2BFXCQtEHZ2SEoUoU3YzAkEwoOZgIdaOkcd2dw3yemnPQqUeqm0X15czBhcXhYFL0l__2FwfLwaXYl73kkDAQuk65tA",
        "4439358tr0Rz64Xwpm5xZnCRgHVarV__2BhiGGojrn7u3jXFXe9lUJAcFyRC2fIij5f__2Fty__2FCEQ__2FSoZT__2FBwPzVpI91eRq4RjkNQ86Ewu4KP__2FmXyhXgOoYvkffeI2",
      production:
        "65d8by4O__2BT5UZyLbR__2BkbA3o9eg890IkxDdCqasFN68jNvKNSFNRR__2BQuikJuHiQuDycMR0JKpu2H8RYOIHzwwE7WSBKM9KloZKKSalmmBjLffm2LMAGk",
      alpha:
        "aaa6j6iaq2YznpHyL6oLBMqtPGMaBhGdTTpdKzxAtr__2BATpq9NOKnvRVcblDEtPDgQsbeWdZmrmDiLQcHYP__2F1ls5TpsWsZFCgySBAiuTUTcbBiyryqx3onswF",
    },
  },
};
