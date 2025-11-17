# Publishing Guide

## 发布到 npm 的步骤

### 1. 准备工作

确保你已经完成以下准备：

✅ 代码已测试通过  
✅ 更新了 CHANGELOG.md  
✅ 更新了版本号  
✅ 更新了 README 中的示例  

### 2. 更新 package.json

在发布前，请更新以下字段：

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/babel-plugin-pointer.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/babel-plugin-pointer/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/babel-plugin-pointer#readme",
  "author": "Your Name <your.email@example.com>"
}
```

### 3. 登录 npm

如果还没有登录 npm：

```bash
npm login
```

输入你的 npm 用户名、密码和邮箱。

### 4. 测试打包

在发布前先测试打包：

```bash
npm pack
```

这会生成一个 `.tgz` 文件，你可以检查里面包含的内容。

### 5. 发布到 npm

```bash
npm publish
```

如果这是第一次发布，使用：

```bash
npm publish --access public
```

### 6. 验证发布

发布成功后，验证包是否可用：

```bash
npm info babel-plugin-pointer
```

或访问：https://www.npmjs.com/package/babel-plugin-pointer

### 7. 更新版本

发布后，为下一个版本准备：

```bash
# 补丁版本（bug修复）
npm version patch

# 小版本（新功能）
npm version minor

# 大版本（破坏性更新）
npm version major
```

## 版本号规范

遵循语义化版本（Semantic Versioning）：

- **MAJOR** (主版本号): 不兼容的 API 修改
- **MINOR** (次版本号): 向下兼容的功能性新增
- **PATCH** (修订号): 向下兼容的问题修正

当前版本：`2.0.0`

- `2` - 主版本：重大重构，多框架支持
- `0` - 次版本：初始发布
- `0` - 修订号：无修复

## 发布前检查清单

- [ ] 所有测试通过
- [ ] README.md 和 README_CN.md 是最新的
- [ ] CHANGELOG.md 已更新
- [ ] package.json 中的版本号已更新
- [ ] package.json 中的 repository、author 等信息正确
- [ ] LICENSE 文件存在
- [ ] .npmignore 配置正确
- [ ] 在 demo 项目中测试过
- [ ] 检查了打包内容（npm pack）

## 常见问题

### 包名已存在

如果 `babel-plugin-pointer` 已被占用，可以使用带作用域的包名：

```json
{
  "name": "@yourusername/babel-plugin-pointer"
}
```

### 发布失败

可能的原因：
1. 没有登录 npm：运行 `npm login`
2. 版本号重复：更新 `package.json` 中的版本号
3. 包名重复：更改包名或使用作用域包名
4. 网络问题：检查网络连接或使用 VPN

## 自动化发布（可选）

可以配置 GitHub Actions 自动发布：

1. 在 GitHub 仓库的 Settings → Secrets 中添加 `NPM_TOKEN`
2. 创建 `.github/workflows/publish.yml`：

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 撤销发布

如果需要撤销发布（24小时内）：

```bash
npm unpublish babel-plugin-pointer@2.0.0
```

⚠️ 注意：撤销发布应该谨慎使用，因为可能影响依赖该包的用户。

## 更新已发布的包

如果需要修复已发布版本的问题：

```bash
# 修复代码
git add .
git commit -m "fix: ..."

# 更新版本（自动更新 package.json 并创建 git tag）
npm version patch

# 发布新版本
npm publish

# 推送到 git
git push && git push --tags
```

---

Happy Publishing! 🚀

