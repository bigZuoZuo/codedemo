// const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  // app.use(
  //   createProxyMiddleware("/singer", {
  //     target: "http://rest.apizza.net",
  //     changeOrigin: true,
  //     ws: true,
  //     pathRewrite: {
  //       "/singer/getLotteryLogs": "/mock/d0689336f53131094f4ec6e05c5df908/getLotteryLogs",
  //       "^/singer": "/mock/d0689336f53131094f4ec6e05c5df908/singer",
  //     },
  //   })
  // );
  // app.use(
  //   createProxyMiddleware("/singer", {
  //     target: "https://dev-activity.iambanban.com",
  //     changeOrigin: true,
  //     ws: true,
  //     pathRewrite: {
  //       "^/singer": "/singer",
  //     },
  //   })
  // );
};
