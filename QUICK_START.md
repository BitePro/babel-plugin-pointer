# 快速开始指南

## 🚀 30秒快速上手

### Vue 3 项目

1. **安装**
```bash
npm install babel-plugin-pointer --save-dev
```

2. **配置 vite.config.js**
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
            plugins: ['babel-plugin-pointer/vue']
          });
          return result ? { code: result.code } : null;
        }
      }
    }
  ]
})
```

3. **使用**
```vue
<template>
  <button @click="handleClick">点击我</button>
</template>
```

就这么简单！按钮现在会自动显示手型光标 ✋

---

### React 项目

1. **安装**
```bash
npm install babel-plugin-pointer --save-dev
```

2. **配置 babel.config.js**
```javascript
module.exports = {
  plugins: ['babel-plugin-pointer/react']
}
```

3. **使用**
```jsx
function App() {
  return <button onClick={handleClick}>Click Me</button>
}
```

就这么简单！按钮现在会自动显示手型光标 ✋

---

## 💡 常见场景

### 场景1：保留自定义 cursor

**Vue:**
```vue
<button @click="handleClick" class="loading-btn">Loading</button>

<style>
.loading-btn {
  cursor: wait; /* 保持等待光标 */
}
</style>
```

**React:**
```jsx
<button 
  onClick={handleClick} 
  style={{ cursor: 'wait' }}
>
  Loading
</button>
```

插件会自动检测并保留你的自定义 cursor！

### 场景2：原生 JavaScript

```javascript
const button = document.querySelector('.my-btn');
button.addEventListener('click', handleClick);
// 插件自动添加 cursor: pointer
```

---

## 🎯 工作原理

插件在**运行时**智能检测：

1. 检查元素是否有点击事件
2. 检查元素的 computed cursor 值
3. 只有当 cursor 是 `auto` 或 `default` 时才添加 `pointer`

这意味着：
- ✅ CSS 文件中的 cursor 会被保留
- ✅ CSS 类中的 cursor 会被保留
- ✅ 内联 style 中的 cursor 会被保留

---

## 📚 更多信息

- [完整文档 (English)](./README.md)
- [完整文档 (中文)](./README_CN.md)
- [发布指南](./PUBLISHING.md)
- [更新日志](./CHANGELOG.md)

---

开始享受更好的用户体验吧！🎉

