/**
 * Babel Plugin Auto Cursor Pointer - Vue 版本
 * 
 * 专门用于 Vue 3 项目
 * 自动为带有 @click 或 v-on:click 事件的元素添加 cursor: pointer
 * 
 * 功能：
 * 1. 检测 Vue 3 编译后的 createVNode/createElementVNode 调用
 * 2. 检测原生 addEventListener('click', ...)
 * 3. 运行时智能检测，不覆盖已有的 cursor 样式（包括 CSS 中定义的）
 */

const { createHelperFunction, getCalleeName, handleAddEventListener } = require('./utils');

module.exports = function ({ types: t }) {
  let helperInjected = false;
  
  return {
    name: 'babel-plugin-pointer/vue',
    visitor: {
      // 在程序退出时注入辅助函数
      Program: {
        exit(path) {
          if (helperInjected) {
            const helperFunction = createHelperFunction(t);
            path.unshiftContainer('body', helperFunction);
            helperInjected = false;
          }
        }
      },
      
      // 处理 CallExpression
      CallExpression(path) {
        const { node } = path;
        
        // 1. 处理 addEventListener('click', handler)
        const handledAddEventListener = handleAddEventListener(path, t);
        if (handledAddEventListener) {
          helperInjected = true;
          return;
        }
        
        // 2. 检查是否是 Vue 3 的 createVNode 或 createElementVNode 调用
        const calleeName = getCalleeName(node.callee);
        if (
          calleeName && 
          (calleeName.includes('createVNode') || 
           calleeName.includes('createElementVNode') ||
           calleeName.includes('createBlock') ||
           calleeName === '_createVNode' ||
           calleeName === '_createElementVNode' ||
           calleeName === '_createBlock')
        ) {
          const modified = handleVueCreateVNode(node, t);
          if (modified) {
            helperInjected = true;
          }
        }
      }
    }
  };
};

/**
 * 处理 Vue 3 的 createVNode 调用
 * 格式: createVNode(tag, props, children)
 * 我们需要检查 props 中是否有 onClick，如果有就添加 onVnodeMounted 钩子来检查cursor
 * @returns {boolean} 是否进行了修改
 */
function handleVueCreateVNode(node, t) {
  // createVNode 至少有 2 个参数：tag 和 props
  if (node.arguments.length < 2) return false;
  
  const propsArg = node.arguments[1];
  
  // props 必须是一个对象表达式或者 null
  if (!propsArg || t.isNullLiteral(propsArg)) return false;
  
  if (t.isObjectExpression(propsArg)) {
    // 检查是否有 onClick 或 onClick 相关的属性
    const hasClickHandler = propsArg.properties.some(prop => {
      if (t.isObjectProperty(prop) || t.isObjectMethod(prop)) {
        const key = prop.key;
        if (t.isIdentifier(key)) {
          return key.name === 'onClick' || key.name === 'onclick';
        }
        if (t.isStringLiteral(key)) {
          return key.value === 'onClick' || key.value === 'onclick';
        }
      }
      return false;
    });
    
    if (hasClickHandler) {
      // 检查是否已经有 onVnodeMounted 钩子
      const hasVnodeMountedHook = propsArg.properties.some(prop => {
        if (t.isObjectProperty(prop)) {
          const key = prop.key;
          if (t.isIdentifier(key) && key.name === 'onVnodeMounted') return true;
          if (t.isStringLiteral(key) && key.value === 'onVnodeMounted') return true;
        }
        return false;
      });
      
      if (!hasVnodeMountedHook) {
        // 添加 onVnodeMounted 钩子来运行时检查 cursor
        // onVnodeMounted: (vnode) => __autoCursorPointer(vnode.el)
        propsArg.properties.push(
          t.objectProperty(
            t.identifier('onVnodeMounted'),
            t.arrowFunctionExpression(
              [t.identifier('vnode')],
              t.callExpression(
                t.identifier('__autoCursorPointer'),
                [
                  t.memberExpression(
                    t.identifier('vnode'),
                    t.identifier('el')
                  )
                ]
              )
            )
          )
        );
        
        return true; // 表示进行了修改
      }
    }
  }
  
  return false;
}

