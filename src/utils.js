/**
 * 共享工具函数
 */

/**
 * 生成辅助函数 AST
 * 这个函数会在运行时检查元素的 cursor 样式
 */
function createHelperFunction(t) {
  return t.functionDeclaration(
    t.identifier('__autoCursorPointer'),
    [t.identifier('element')],
    t.blockStatement([
      // if (!element) return;
      t.ifStatement(
        t.unaryExpression('!', t.identifier('element')),
        t.returnStatement()
      ),
      // 使用setTimeout确保元素已经渲染到DOM
      t.expressionStatement(
        t.callExpression(
          t.identifier('setTimeout'),
          [
            t.arrowFunctionExpression(
              [],
              t.blockStatement([
                // if (!element.style.cursor)
                t.ifStatement(
                  t.unaryExpression(
                    '!',
                    t.memberExpression(
                      t.memberExpression(
                        t.identifier('element'),
                        t.identifier('style')
                      ),
                      t.identifier('cursor')
                    )
                  ),
                  t.blockStatement([
                    // const computedCursor = window.getComputedStyle(element).cursor;
                    t.variableDeclaration('const', [
                      t.variableDeclarator(
                        t.identifier('computedCursor'),
                        t.memberExpression(
                          t.callExpression(
                            t.memberExpression(
                              t.identifier('window'),
                              t.identifier('getComputedStyle')
                            ),
                            [t.identifier('element')]
                          ),
                          t.identifier('cursor')
                        )
                      )
                    ]),
                    // if (!computedCursor || computedCursor === 'auto' || computedCursor === 'default')
                    t.ifStatement(
                      t.logicalExpression(
                        '||',
                        t.logicalExpression(
                          '||',
                          t.unaryExpression('!', t.identifier('computedCursor')),
                          t.binaryExpression(
                            '===',
                            t.identifier('computedCursor'),
                            t.stringLiteral('auto')
                          )
                        ),
                        t.binaryExpression(
                          '===',
                          t.identifier('computedCursor'),
                          t.stringLiteral('default')
                        )
                      ),
                      t.expressionStatement(
                        t.assignmentExpression(
                          '=',
                          t.memberExpression(
                            t.memberExpression(
                              t.identifier('element'),
                              t.identifier('style')
                            ),
                            t.identifier('cursor')
                          ),
                          t.stringLiteral('pointer')
                        )
                      )
                    )
                  ])
                )
              ])
            ),
            t.numericLiteral(0)
          ]
        )
      )
    ])
  );
}

/**
 * 生成运行时检查代码（用于 addEventListener）
 */
function createRuntimeCheckStatement(t, elementNode) {
  return t.ifStatement(
    // 条件：!element.style.cursor
    t.unaryExpression(
      '!',
      t.memberExpression(
        t.memberExpression(
          t.cloneNode(elementNode),
          t.identifier('style')
        ),
        t.identifier('cursor')
      )
    ),
    // 代码块
    t.blockStatement([
      // const computedCursor = window.getComputedStyle(element).cursor;
      t.variableDeclaration('const', [
        t.variableDeclarator(
          t.identifier('computedCursor'),
          t.memberExpression(
            t.callExpression(
              t.memberExpression(
                t.identifier('window'),
                t.identifier('getComputedStyle')
              ),
              [t.cloneNode(elementNode)]
            ),
            t.identifier('cursor')
          )
        )
      ]),
      // if (!computedCursor || computedCursor === 'auto' || computedCursor === 'default')
      t.ifStatement(
        t.logicalExpression(
          '||',
          t.logicalExpression(
            '||',
            t.unaryExpression('!', t.identifier('computedCursor')),
            t.binaryExpression(
              '===',
              t.identifier('computedCursor'),
              t.stringLiteral('auto')
            )
          ),
          t.binaryExpression(
            '===',
            t.identifier('computedCursor'),
            t.stringLiteral('default')
          )
        ),
        // element.style.cursor = 'pointer';
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(
              t.memberExpression(
                t.cloneNode(elementNode),
                t.identifier('style')
              ),
              t.identifier('cursor')
            ),
            t.stringLiteral('pointer')
          )
        )
      )
    ])
  );
}

/**
 * 获取函数调用的名称
 */
function getCalleeName(callee) {
  if (!callee) return null;
  
  if (callee.type === 'Identifier') {
    return callee.name;
  }
  
  if (callee.type === 'MemberExpression' && callee.property) {
    return callee.property.name;
  }
  
  return null;
}

/**
 * 处理原生 addEventListener
 */
function handleAddEventListener(path, t) {
  const { node } = path;
  
  if (
    t.isMemberExpression(node.callee) &&
    t.isIdentifier(node.callee.property, { name: 'addEventListener' }) &&
    node.arguments.length >= 2
  ) {
    const firstArg = node.arguments[0];
    
    if (t.isStringLiteral(firstArg, { value: 'click' })) {
      const elementNode = node.callee.object;
      const addCursorStatement = createRuntimeCheckStatement(t, elementNode);
      
      const statementPath = path.getStatementParent();
      if (statementPath) {
        statementPath.insertAfter(addCursorStatement);
      }
      return true;
    }
  }
  
  return false;
}

module.exports = {
  createHelperFunction,
  createRuntimeCheckStatement,
  getCalleeName,
  handleAddEventListener
};

