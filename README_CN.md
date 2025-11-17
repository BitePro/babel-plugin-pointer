# babel-plugin-pointer

[![npm version](https://img.shields.io/npm/v/babel-plugin-pointer.svg)](https://www.npmjs.com/package/babel-plugin-pointer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文文档](./README_CN.md)

一个 Babel 插件，能够自动为带有点击事件的元素添加 `cursor: pointer` 样式。同时支持 Vue 3 和 React，具有智能 CSS 检测功能。

## ✨ 特性

- ✅ **Vue 3 支持**：自动检测 `@click` 和 `v-on:click` 事件
- ✅ **React 支持**：自动检测 JSX 中的 `onClick` 属性
- ✅ **原生 JS 支持**：处理 `addEventListener('click', ...)` 调用
- ✅ **智能 CSS 检测**：使用 `window.getComputedStyle()` 尊重现有的 cursor 样式
- ✅ **非侵入式**：永远不会覆盖用户定义的 cursor 值（内联样式、CSS 类或 CSS 文件）
- ✅ **零运行时依赖**：纯编译时转换，运行时辅助函数极小
- ✅ **TypeScript 友好**：与 TypeScript 项目无缝协作

## 📦 安装

```bash
npm install babel-plugin-pointer --save-dev
```

或使用 yarn:

```bash
yarn add babel-plugin-pointer --dev
```

或使用 pnpm:

```bash
pnpm add babel-plugin-pointer -D
```

## 🚀 使用方法

### Vue 3 项目

在 `vite.config.js` 中配置：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { transformAsync } from '@babel/core'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'vue-babel-pointer',
      async transform(code, id) {
        if (id.endsWith('.vue')) {
          const result = await transformAsync(code, {
            plugins: ['babel-plugin-pointer/vue'],
            filename: id,
            sourceMaps: true
          });
          return result ? { code: result.code, map: result.map } : null;
        }
      }
    }
  ]
})
```

或在 `babel.config.js` 中：

```javascript
module.exports = {
  plugins: ['babel-plugin-pointer/vue']
}
```

### React 项目

在 `babel.config.js` 或 `.babelrc` 中：

```javascript
module.exports = {
  plugins: ['babel-plugin-pointer/react']
}
```

对于 Create React App（使用 CRACO）：

```javascript
// craco.config.js
module.exports = {
  babel: {
    plugins: ['babel-plugin-pointer/react']
  }
}
```

## 📖 示例

### Vue 3

**输入：**

```vue
<template>
  <button @click="handleClick">点击我</button>
  <div @click="handleClick" class="custom-cursor">自定义</div>
</template>

<style>
.custom-cursor {
  cursor: help;
}
</style>
```

**结果：**
- 第一个按钮自动获得 `cursor: pointer` ✅
- 第二个 div 保持 CSS 中的 `cursor: help`（不被覆盖）✅

### React

**输入：**

```jsx
function App() {
  return (
    <>
      <button onClick={handleClick}>点击我</button>
      <div onClick={handleClick} style={{ cursor: 'help' }}>自定义</div>
    </>
  );
}
```

**结果：**
- 第一个按钮自动获得 `cursor: pointer` ✅
- 第二个 div 保持内联样式中的 `cursor: help`（不被覆盖）✅

### 原生 JavaScript

**输入：**

```javascript
const button = document.querySelector('.btn');
button.addEventListener('click', handleClick);
```

**输出：**

```javascript
const button = document.querySelector('.btn');
button.addEventListener('click', handleClick);
if (!button.style.cursor) {
  const computedCursor = window.getComputedStyle(button).cursor;
  if (!computedCursor || computedCursor === 'auto' || computedCursor === 'default') {
    button.style.cursor = 'pointer';
  }
}
```

## 🔍 工作原理

### 智能检测算法

插件使用精密的运行时检测方法：

1. **编译时**：向代码中注入辅助函数 `__autoCursorPointer`
2. **运行时**：当带有点击事件的元素挂载时：
   - 检查是否设置了内联 `style.cursor`
   - 如果没有，使用 `window.getComputedStyle()` 检查计算后的 cursor 值
   - 只有当计算值为 `auto` 或 `default` 时才设置 `cursor: pointer`

这确保了在以下位置定义的 cursor 样式：
- ✅ 内联样式 (`:style="{ cursor: 'help' }"`)
- ✅ CSS 类 (`class="cursor-wait"`)
- ✅ CSS 文件 (`.my-button { cursor: move; }`)
- ✅ CSS 模块或 CSS-in-JS

...都会被尊重，永远不会被覆盖。

### 框架特定实现

#### Vue 3
- 添加 `onVnodeMounted` 生命周期钩子，在元素挂载后检查 cursor
- 与 Vue 的响应式系统配合工作

#### React
- 使用 `ref` 回调在元素渲染后检查 cursor
- 兼容 React 16.8+（Hooks）和类组件

## 🎯 何时添加 Cursor

插件**仅在以下情况**添加 `cursor: pointer`：

1. 元素有点击事件处理器（`@click`、`onClick` 或 `addEventListener`）
2. 元素没有设置内联 `style.cursor`
3. 元素的计算 cursor 值为 `auto` 或 `default`

## 🔧 配置

目前，插件开箱即用，无需配置。未来版本可能会添加以下选项：

- 自定义 cursor 值
- 过滤特定元素
- 调试模式

## 📊 性能

- **编译时**：影响最小，仅处理带有点击事件的元素
- **运行时**：使用 `setTimeout(..., 0)` 延迟 cursor 检查，避免布局抖动
- **打包大小**：每个入口点约 1KB 的辅助函数

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🐛 Bug 报告

如果您发现 bug，请在 [GitHub Issues](https://github.com/yourusername/babel-plugin-pointer/issues) 上提交问题。

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解每个版本的更改详情。

## ❤️ 致谢

感谢所有贡献者和使用者！

---

用 ❤️ 打造更好的用户体验

