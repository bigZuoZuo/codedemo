module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    devServer: {
      // 调试微信时，修改 hosts，启静态服务
      writeToDisk: true,
      port: 10086,
      host: "localhost"
    },
  },
}
