// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'preact',
        ts: true,
        'dynamic-import-node': true,
      },
    ],
  ],
  plugins: [
    [
      'react-directives',
      {
        prefix: 'wx',
      },
    ],
    [
      'import',
      {
        libraryName: 'react-vant',
        libraryDirectory: 'es',
        style: false,
      },
    ],
  ],
}
