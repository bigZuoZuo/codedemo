export default {
  appName: "partying",
  pkg: {
    ios: ["com.ola.chat"],
    android: ["com.imbb.oversea.android"],
  },
  domain: "partying.sg",
  api_domain: {
    development: "http://test.overseaban.com",
    production: "https://api.partying.sg",
    alpha: "https://api.partying.sg",
  },

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

  oss: "https://partying.oss-ap-southeast-1.aliyuncs.com",
  download: {
    ios: "",
    android: "",
  },
  mock: {
    server_env: "development",
    lan: "zh_tw",
    uid: {
      development: null,
      production: null,
      alpha: null,
    },
    token: {
      development:
        "79c4qKx0YXpa1wKhn5SBe7g2TA1BvS9vNRq6DFbdoHqJ0idihrWIoMW1g0Kxn__2Bo__2BtiNlJxni__2BCJG08QLlwzD7gywOH5MpiaOuSrX25g__2BYEk2dVCYWr0",
      production:
        "45f6MY0koOwIzOOt__2FWv22j11VDJXVVNICEPUULzXutZNQj2xIicq__2BRE51wcC6CCL2tuqCmtrd5Eq1HaEI9bN__2FSRleObOW9czGfHvWbdIyWnWFctineM",
      alpha: null,
    },
  },
};
