---
title: Hexo 友链页面 - 增加博客社交属性
date: 2026-01-07 22:35:08
categories: Hexo博客
tags:
  - Hexo
  - Butterfly
  - 教程
---

# Hexo 友链页面 - 增加博客社交属性

想让你的博客更有社交属性？想和其他博主互相交流？友链页面是必不可少的！本教程教你如何在 Hexo + Butterfly 主题中实现一个完整的友链功能。

## 📋 目录

1. 什么是友链
2. 为什么需要友链
3. 实现步骤
4. 功能特点
5. 使用说明
6. 总结

## 什么是友链

### 1. 定义

**友情链接**（Friend Links）是博客之间互相推荐的链接，通常展示在专门的友链页面上。

### 2. 展示形式

友链通常以卡片形式展示，包含：
- 🖼️ **网站头像**：网站的 Logo 或代表图片
- 📝 **网站名称**：网站的标题
- 🔗 **网站链接**：网站的 URL
- 💬 **网站描述**：一句话介绍

### 3. 作用

- **互相推广**：增加网站曝光度
- **建立联系**：与其他博主交流
- **提升 SEO**：增加外链权重
- **丰富内容**：让博客更有人情味

## 为什么需要友链

### 1. 社交属性

**问题**：博客是孤立的，缺乏与其他博主的联系

**解决**：通过友链建立博客圈子，互相交流学习

### 2. 流量互换

**问题**：新博客流量少，难以被发现

**解决**：通过友链互相推荐，增加访问量

### 3. SEO 优化

**问题**：搜索引擎收录慢，排名低

**解决**：友链提供外链，提升网站权重

### 4. 内容发现

**问题**：不知道有哪些优质博客

**解决**：通过友链发现同类型的优质内容

## 实现步骤

### 第一步：创建友链页面

使用 Hexo 命令创建友链页面：

```bash
hexo new page link
```

编辑 `source/link/index.md`，设置页面类型：

```markdown
---
title: 友情链接
date: 2026-01-07 22:18:43
type: link
comments: true
---

<div id="link-container">
  <div class="link-loading">加载中...</div>
</div>
```

### 第二步：创建友链数据文件

在 `source/_data/` 目录下创建 `links.yml`：

```yaml
- name: Hexo
  link: https://hexo.io/zh-cn/
  avatar: https://hexo.io/icon/favicon-196x196.png
  descr: 快速、简洁且高效的博客框架

- name: Butterfly
  link: https://butterfly.js.org/
  avatar: https://butterfly.js.org/img/avatar.png
  descr: 一个基于 Hexo 的 Material Design 风格主题

- name: GitHub
  link: https://github.com/
  avatar: https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png
  descr: 全球最大的代码托管平台
```

**字段说明**：
- `name`：网站名称
- `link`：网站链接
- `avatar`：头像链接
- `descr`：网站描述

### 第三步：创建数据生成器

在 `scripts/` 目录下创建 `link-generator.js`：

```javascript
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

hexo.extend.generator.register('link', function(locals) {
  const linkPath = path.join(hexo.source_dir, '_data', 'links.yml');

  if (!fs.existsSync(linkPath)) {
    return [];
  }

  try {
    const linkData = yaml.load(fs.readFileSync(linkPath, 'utf8'));

    return [{
      path: 'links.json',
      data: JSON.stringify(linkData || [])
    }];
  } catch (error) {
    console.error('生成友链数据失败:', error);
    return [];
  }
});
```

**作用**：将 YAML 格式的友链数据转换为 JSON，供前端加载。

### 第四步：创建样式文件

在 `source/css/` 目录下创建 `link.css`：

```css
/* 友链容器 */
#link-container {
  margin: 20px 0;
}

/* 友链说明 */
.link-notice {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #49b1f5;
}

.link-notice h3 {
  margin-top: 0;
  color: #49b1f5;
}

.link-notice code {
  background: rgba(73, 177, 245, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  color: #49b1f5;
  font-weight: bold;
}

/* 友链网格布局 */
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* 友链卡片 */
.link-card {
  display: flex;
  align-items: center;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: var(--font-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
  opacity: 0;
  animation-fill-mode: forwards;
}

/* 顶部渐变边框 */
.link-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #49b1f5, #ff7242);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.link-card:hover::before {
  transform: scaleX(1);
}

/* 卡片悬停效果 */
.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 头像 */
.link-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 3px solid transparent;
  transition: all 0.3s ease;
}

.link-card:hover .link-avatar {
  transform: rotate(360deg);
  border-color: #49b1f5;
}

/* 信息区域 */
.link-info {
  flex: 1;
  min-width: 0;
}

/* 网站名称 */
.link-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--font-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 网站描述 */
.link-descr {
  font-size: 14px;
  color: var(--font-color);
  opacity: 0.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 加载中 */
.link-loading {
  text-align: center;
  padding: 40px;
  color: var(--font-color);
  opacity: 0.7;
}

/* 空状态 */
.link-empty {
  text-align: center;
  padding: 40px;
  color: var(--font-color);
  opacity: 0.5;
}

/* 错误状态 */
.link-error {
  text-align: center;
  padding: 40px;
  color: #ff7242;
}

.link-error i {
  font-size: 48px;
  margin-bottom: 10px;
}

/* 淡入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .link-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .link-card {
    padding: 15px;
  }

  .link-avatar {
    width: 50px;
    height: 50px;
  }

  .link-name {
    font-size: 16px;
  }

  .link-descr {
    font-size: 13px;
  }
}

/* 深色模式适配 */
[data-theme="dark"] .link-card {
  background: #1f1f1f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .link-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

[data-theme="dark"] .link-notice {
  background: #1f1f1f;
}
```

**特点**：
- ✅ Grid 网格布局，自适应列数
- ✅ 卡片悬停效果（上移、阴影、头像旋转）
- ✅ 渐变顶部边框动画
- ✅ 淡入动画，错开延迟
- ✅ 响应式设计，移动端友好
- ✅ 深色模式适配

### 第五步：创建 JavaScript 文件

在 `source/js/` 目录下创建 `link.js`：

```javascript
// 友链页面功能
function initLink() {
  const container = document.getElementById('link-container');
  if (container) {
    loadLinks();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLink);
} else {
  initLink();
}

// PJAX 兼容
document.addEventListener('pjax:complete', initLink);

// 加载友链数据
function loadLinks() {
  fetch('/links.json')
    .then(response => response.json())
    .then(data => {
      renderLinks(data);
    })
    .catch(error => {
      console.error('加载友链数据失败:', error);
      showLinkError();
    });
}

// 渲染友链列表
function renderLinks(linkList) {
  const container = document.getElementById('link-container');

  if (!container) {
    console.error('找不到友链容器');
    return;
  }

  if (!linkList || linkList.length === 0) {
    container.innerHTML = '<div class="link-empty">暂无友链</div>';
    return;
  }

  // 添加友链说明
  let html = `
    <div class="link-notice">
      <h3>🔗 友链说明</h3>
      <p>欢迎交换友链！请在评论区留言，格式如下：</p>
      <p>
        <code>名称</code>：你的网站名称<br>
        <code>链接</code>：你的网站地址<br>
        <code>头像</code>：你的头像链接<br>
        <code>描述</code>：一句话介绍
      </p>
      <p>💡 本站信息：</p>
      <p>
        <code>名称</code>：cyforkk<br>
        <code>链接</code>：https://cyforkk.top/<br>
        <code>头像</code>：https://cyforkk.top/images/wallpaper-img/sanye.png<br>
        <code>描述</code>：找寻自我
      </p>
    </div>
    <div class="link-grid">
  `;

  // 渲染友链卡片
  linkList.forEach((item, index) => {
    const name = escapeHtml(item.name);
    const link = escapeHtml(item.link);
    const avatar = escapeHtml(item.avatar);
    const descr = escapeHtml(item.descr);

    html += `
      <a href="${link}" class="link-card" target="_blank" rel="noopener" style="animation-delay: ${index * 0.1}s">
        <img src="${avatar}" alt="${name}" class="link-avatar" onerror="this.src='/img/friend_404.gif'">
        <div class="link-info">
          <div class="link-name">${name}</div>
          <div class="link-descr">${descr}</div>
        </div>
      </a>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 显示错误信息
function showLinkError() {
  const container = document.getElementById('link-container');
  if (container) {
    container.innerHTML = `
      <div class="link-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>加载友链失败，请稍后再试</p>
      </div>
    `;
  }
}
```

**功能**：
- ✅ 从 `/links.json` 加载数据
- ✅ 动态渲染友链卡片
- ✅ HTML 转义防止 XSS 攻击
- ✅ 错误处理和友好提示
- ✅ PJAX 兼容性
- ✅ 图片加载失败处理

### 第六步：注入 CSS 和 JS

编辑 `_config.butterfly.yml`，在 `inject` 部分添加：

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/link.css"> # 友链页面
  bottom:
    - <script src="/js/link.js"></script>
```

### 第七步：添加导航菜单

在 `_config.butterfly.yml` 的 `menu` 部分添加：

```yaml
menu:
  友链: /link/ || fas fa-link
```

### 第八步：生成并部署

```bash
# 清理缓存
hexo clean

# 生成静态文件
hexo generate

# 启动本地服务器测试
hexo server

# 部署到 GitHub Pages
hexo deploy
```

## 功能特点

### ✨ 核心功能

1. **数据管理**
   - YAML 格式，易于编辑
   - 自动转换为 JSON
   - 支持批量添加

2. **美观界面**
   - 卡片式设计
   - Grid 网格布局
   - 流畅动画效果

3. **交互体验**
   - 悬停效果（上移、阴影、旋转）
   - 渐变边框动画
   - 错开淡入动画

4. **响应式设计**
   - 自适应列数
   - 移动端优化
   - 触摸友好

5. **深色模式**
   - 自动适配主题
   - 颜色变量控制
   - 平滑过渡

6. **安全性**
   - HTML 转义
   - XSS 防护
   - 图片加载失败处理

7. **兼容性**
   - PJAX 支持
   - 事件监听
   - 错误处理

## 使用说明

### 添加友链

编辑 `source/_data/links.yml`，添加新的友链：

```yaml
- name: 你的网站名称
  link: https://your-website.com/
  avatar: https://your-website.com/avatar.png
  descr: 你的网站描述
```

### 修改友链

直接编辑 `links.yml` 文件，修改对应字段即可。

### 删除友链

从 `links.yml` 文件中删除对应的友链条目。

### 自定义样式

编辑 `source/css/link.css`，修改样式变量：

```css
/* 修改主题色 */
.link-notice {
  border-left: 4px solid #your-color;
}

/* 修改卡片间距 */
.link-grid {
  gap: 30px; /* 默认 20px */
}

/* 修改卡片圆角 */
.link-card {
  border-radius: 16px; /* 默认 12px */
}
```

### 自定义说明

编辑 `source/js/link.js`，修改友链说明部分：

```javascript
// 修改本站信息
<p>
  <code>名称</code>：你的网站名称<br>
  <code>链接</code>：你的网站地址<br>
  <code>头像</code>：你的头像链接<br>
  <code>描述</code>：你的网站描述
</p>
```

## 总结

通过本教程，我们实现了一个完整的友链功能，包括：

### ✅ 已实现功能

1. **数据管理**：YAML 格式，易于维护
2. **自动生成**：YAML 转 JSON，无需手动处理
3. **美观界面**：卡片式设计，Grid 布局
4. **动画效果**：悬停、淡入、旋转等
5. **响应式**：自适应不同屏幕尺寸
6. **深色模式**：自动适配主题
7. **安全性**：HTML 转义，XSS 防护
8. **兼容性**：PJAX 支持，错误处理

### 📊 效果展示

访问 `http://localhost:4000/link/` 查看效果：

- 🎨 精美的卡片式布局
- ✨ 流畅的动画效果
- 📱 完美的移动端适配
- 🌙 深色模式支持
- 🔒 安全的数据处理

### 🎯 下一步

1. **添加更多友链**：与其他博主交换友链
2. **优化样式**：根据个人喜好调整设计
3. **增加功能**：如友链分类、搜索等
4. **定期维护**：检查友链有效性

### 💡 提示

- 定期检查友链是否有效
- 与友链博主保持联系
- 优先添加活跃的博客
- 注意友链的质量而非数量

---

**相关文章**：
- [Hexo 性能优化 - 代码压缩配置教程](/2026/01/07/Hexo性能优化-代码压缩配置教程/)
- [Hexo SEO 优化 - 站点地图配置教程](/2026/01/07/Hexo-SEO优化-站点地图配置教程/)
- [Hexo 说说功能 - 打造社交化动态页面](/2026/01/07/Hexo说说功能-打造社交化动态页面/)

**参考资源**：
- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Butterfly 主题文档](https://butterfly.js.org/)
- [YAML 语法指南](https://yaml.org/)
