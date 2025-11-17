/**
 * Babel Plugin Auto Cursor Pointer - 默认导出
 * 
 * 这是一个向后兼容的默认导出，自动检测项目类型
 * 
 * 推荐使用：
 * - Vue 项目: require('babel-plugin-pointer/vue')
 * - React 项目: require('babel-plugin-pointer/react')
 */

const vuePlugin = require('./vue');

// 默认使用 Vue 插件（向后兼容）
module.exports = vuePlugin;
