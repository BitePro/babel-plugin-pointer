/**
 * Babel Plugin Auto Cursor Pointer - React 版本
 * 
 * 专门用于 React/JSX 项目
 * 自动为带有 onClick 事件的元素添加 cursor: pointer
 * 
 * 功能：
 * 1. 检测 JSX 中的 onClick 属性
 * 2. 检测原生 addEventListener('click', ...)
 * 3. 运行时智能检测，不覆盖已有的 cursor 样式（包括 CSS 中定义的）
 */

const { createHelperFunction, handleAddEventListener } = require('./utils');

module.exports = function ({ types: t }) {
  let helperInjected = false;
  
  return {
    name: 'babel-plugin-pointer/react',
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
      
      // 处理 addEventListener('click', handler)
      CallExpression(path) {
        const handled = handleAddEventListener(path, t);
        if (handled) {
          helperInjected = true;
        }
      },
      
      // 处理 JSX 中的 onClick 属性
      JSXOpeningElement(path) {
        const { node } = path;
        
        // 检查是否有 onClick 属性
        const hasOnClick = node.attributes.some(attr => 
          t.isJSXAttribute(attr) && 
          t.isJSXIdentifier(attr.name, { name: 'onClick' })
        );
        
        if (hasOnClick) {
          helperInjected = true;
          
          // 检查是否已经有 ref 属性
          const hasRef = node.attributes.some(attr =>
            t.isJSXAttribute(attr) && 
            t.isJSXIdentifier(attr.name, { name: 'ref' })
          );
          
          if (!hasRef) {
            // 添加 ref 回调来调用辅助函数
            node.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('ref'),
                t.jsxExpressionContainer(
                  t.arrowFunctionExpression(
                    [t.identifier('el')],
                    t.callExpression(
                      t.identifier('__autoCursorPointer'),
                      [t.identifier('el')]
                    )
                  )
                )
              )
            );
          }
          // 如果已经有 ref，我们不处理，避免冲突
        }
      }
    }
  };
};

