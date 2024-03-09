/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/web': {
      target: 'http://wf-question.qixiuu.com/question-api',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/getInfo': {
      target: 'http://wf-question.qixiuu.com/question-api',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/login': {
      target: 'http://wf-question.qixiuu.com/question-api',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/system': {
      target: 'http://wf-question.qixiuu.com/question-api',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/common': {
      target: 'http://wf-question.qixiuu.com/question-api',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/question-api': {
      target: 'http://wf-question.qixiuu.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
