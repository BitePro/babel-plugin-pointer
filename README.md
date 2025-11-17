# babel-plugin-pointer

[![npm version](https://img.shields.io/npm/v/babel-plugin-pointer.svg)](https://www.npmjs.com/package/babel-plugin-pointer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | [中文文档](./README_CN.md)

A Babel plugin that automatically adds `cursor: pointer` style to elements with click event handlers. Supports both Vue 3 and React with intelligent CSS detection.

## ✨ Features

- ✅ **Vue 3 Support**: Automatically detects `@click` and `v-on:click` events
- ✅ **React Support**: Automatically detects `onClick` attributes in JSX
- ✅ **Native JS Support**: Handles `addEventListener('click', ...)` calls
- ✅ **Smart CSS Detection**: Uses `window.getComputedStyle()` to respect existing cursor styles
- ✅ **Non-Invasive**: Never overwrites user-defined cursor values (inline styles, CSS classes, or CSS files)
- ✅ **Zero Runtime Dependencies**: Pure compile-time transformation with minimal runtime helpers
- ✅ **TypeScript Friendly**: Works seamlessly with TypeScript projects

## 📦 Installation

```bash
npm install babel-plugin-pointer --save-dev
```

or with yarn:

```bash
yarn add babel-plugin-pointer --dev
```

or with pnpm:

```bash
pnpm add babel-plugin-pointer -D
```

## 🚀 Usage

### For Vue 3 Projects

In your `vite.config.js`:

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

Or in `babel.config.js`:

```javascript
module.exports = {
  plugins: ['babel-plugin-pointer/vue']
}
```

### For React Projects

In your `babel.config.js` or `.babelrc`:

```javascript
module.exports = {
  plugins: ['babel-plugin-pointer/react']
}
```

For Create React App (using CRACO):

```javascript
// craco.config.js
module.exports = {
  babel: {
    plugins: ['babel-plugin-pointer/react']
  }
}
```

## 📖 Examples

### Vue 3

**Input:**

```vue
<template>
  <button @click="handleClick">Click Me</button>
  <div @click="handleClick" class="custom-cursor">Custom</div>
</template>

<style>
.custom-cursor {
  cursor: help;
}
</style>
```

**Result:**
- First button gets `cursor: pointer` automatically ✅
- Second div keeps `cursor: help` from CSS (not overwritten) ✅

### React

**Input:**

```jsx
function App() {
  return (
    <>
      <button onClick={handleClick}>Click Me</button>
      <div onClick={handleClick} style={{ cursor: 'help' }}>Custom</div>
    </>
  );
}
```

**Result:**
- First button gets `cursor: pointer` automatically ✅
- Second div keeps `cursor: help` from inline style (not overwritten) ✅

### Native JavaScript

**Input:**

```javascript
const button = document.querySelector('.btn');
button.addEventListener('click', handleClick);
```

**Output:**

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

## 🔍 How It Works

### Smart Detection Algorithm

The plugin uses a sophisticated runtime detection approach:

1. **Compile Time**: Injects a helper function `__autoCursorPointer` into your code
2. **Runtime**: When an element with a click handler mounts:
   - Checks if inline `style.cursor` is set
   - If not, uses `window.getComputedStyle()` to check the computed cursor value
   - Only sets `cursor: pointer` if the computed value is `auto` or `default`

This ensures that cursor styles defined in:
- ✅ Inline styles (`:style="{ cursor: 'help' }"`)
- ✅ CSS classes (`class="cursor-wait"`)
- ✅ CSS files (`.my-button { cursor: move; }`)
- ✅ CSS modules or CSS-in-JS

...are always respected and never overwritten.

### Framework-Specific Implementation

#### Vue 3
- Adds `onVnodeMounted` lifecycle hook to check cursor after element is mounted
- Works with Vue's reactivity system

#### React
- Uses `ref` callback to check cursor after element is rendered
- Compatible with React 16.8+ (hooks) and class components

## 🎯 When Cursor is Added

The plugin adds `cursor: pointer` **only when**:

1. Element has a click event handler (`@click`, `onClick`, or `addEventListener`)
2. Element doesn't have inline `style.cursor` set
3. Element's computed cursor is `auto` or `default`

## 🔧 Configuration

Currently, the plugin works out of the box with no configuration needed. Future versions may add options for:

- Custom cursor values
- Filtering specific elements
- Debugging mode

## 📊 Performance

- **Compile Time**: Minimal impact, only processes elements with click handlers
- **Runtime**: Uses `setTimeout(..., 0)` to defer cursor checking, avoiding layout thrashing
- **Bundle Size**: ~1KB helper function per entry point

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 🐛 Bug Reports

If you find a bug, please open an issue on [GitHub Issues](https://github.com/yourusername/babel-plugin-pointer/issues).

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about changes in each version.

## ❤️ Acknowledgments

Thanks to all contributors and users of this plugin!

---

Made with ❤️ for better UX
