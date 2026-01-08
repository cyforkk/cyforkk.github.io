---
title: Hexo文章阅读进度条-提升阅读体验的视觉反馈
date: 2026-01-08 16:41:49
tags: [Hexo, Butterfly, 教程]
categories: Hexo博客
description: 为 Hexo 博客添加文章阅读进度条功能，在页面顶部实时显示阅读进度，提升用户体验
cover: https://cdn.jsdelivr.net/gh/jerryc127/CDN@latest/cover/default_bg.png
---

## 前言

在阅读长文章时，读者往往想知道自己已经阅读了多少内容，还剩多少内容未读。文章阅读进度条就是为了解决这个问题而设计的功能。它在页面顶部显示一个渐变色的进度条，随着页面滚动实时更新，让读者对阅读进度一目了然。

## 功能特点

- ✅ 页面顶部固定显示
- ✅ 渐变色进度条，视觉效果优雅
- ✅ 实时更新，跟随滚动
- ✅ 仅在文章页面显示
- ✅ 支持 PJAX 无刷新切换
- ✅ 深色模式适配
- ✅ 移动端响应式设计

## 实现步骤

### 1. 创建 JavaScript 文件

在 `source/js/` 目录下创建 `reading-progress.js` 文件：

```javascript
// 文章阅读进度条功能

// 初始化阅读进度条
function initReadingProgress() {
  // 检查是否是文章页面
  const articleContainer = document.getElementById('article-container');
  if (!articleContainer) return;

  // 额外检查：确保是 post 类型页面
  if (GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType !== 'post') return;

  // 检查是否已经添加了进度条
  if (document.querySelector('.reading-progress-bar')) return;

  // 创建进度条元素
  createProgressBar();

  // 监听滚动事件
  window.addEventListener('scroll', updateProgress);

  // 初始化进度
  updateProgress();
}

// 创建进度条
function createProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.innerHTML = '<div class="reading-progress-fill"></div>';

  // 插入到页面顶部
  document.body.insertBefore(progressBar, document.body.firstChild);
}

// 更新进度
function updateProgress() {
  const progressFill = document.querySelector('.reading-progress-fill');
  if (!progressFill) return;

  // 获取文档高度和窗口高度
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // 计算可滚动的高度
  const scrollableHeight = documentHeight - windowHeight;

  // 计算滚动百分比
  const scrollPercentage = scrollableHeight > 0
    ? (scrollTop / scrollableHeight) * 100
    : 0;

  // 更新进度条宽度
  progressFill.style.width = `${Math.min(scrollPercentage, 100)}%`;
}

// 清理函数
function cleanupReadingProgress() {
  window.removeEventListener('scroll', updateProgress);
  const progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar) {
    progressBar.remove();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReadingProgress);
} else {
  initReadingProgress();
}

// PJAX 兼容
document.addEventListener('pjax:complete', () => {
  cleanupReadingProgress();
  initReadingProgress();
});

// 页面卸载时清理
document.addEventListener('pjax:send', cleanupReadingProgress);
```

### 2. 创建 CSS 样式文件

在 `source/css/` 目录下创建 `reading-progress.css` 文件：

```css
/* 文章阅读进度条样式 */

/* 进度条容器 */
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 9999;
  pointer-events: none;
}

/* 进度条填充 */
.reading-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.2s ease-out;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

/* 深色模式适配 */
[data-theme="dark"] .reading-progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .reading-progress-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.8);
}

/* 动画效果 */
@keyframes progressPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.reading-progress-fill {
  animation: progressPulse 2s ease-in-out infinite;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .reading-progress-bar {
    height: 2px;
  }
}
```

### 3. 在主题配置中引入文件

编辑 `themes/butterfly/_config.yml` 文件，在 `inject` 部分添加：

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/reading-progress.css">
  bottom:
    - <script src="/js/reading-progress.js"></script>
```

### 4. 生成静态文件

```bash
hexo clean && hexo generate
```

## 代码解析

### JavaScript 核心逻辑

#### 1. 页面类型检查

```javascript
// 检查是否是文章页面
const articleContainer = document.getElementById('article-container');
if (!articleContainer) return;

// 额外检查：确保是 post 类型页面
if (GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType !== 'post') return;
```

通过两层检查确保进度条只在文章页面显示：
- 第一层：检查是否存在文章容器元素
- 第二层：检查页面类型是否为 `post`

#### 2. 进度计算

```javascript
// 获取文档高度和窗口高度
const windowHeight = window.innerHeight;
const documentHeight = document.documentElement.scrollHeight;
const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

// 计算可滚动的高度
const scrollableHeight = documentHeight - windowHeight;

// 计算滚动百分比
const scrollPercentage = scrollableHeight > 0
  ? (scrollTop / scrollableHeight) * 100
  : 0;
```

进度计算公式：
- **可滚动高度** = 文档总高度 - 窗口高度
- **滚动百分比** = (当前滚动位置 / 可滚动高度) × 100

#### 3. PJAX 兼容处理

```javascript
// PJAX 兼容
document.addEventListener('pjax:complete', () => {
  cleanupReadingProgress();
  initReadingProgress();
});

// 页面卸载时清理
document.addEventListener('pjax:send', cleanupReadingProgress);
```

- `pjax:send`：页面切换前清理旧的进度条和事件监听器
- `pjax:complete`：页面加载完成后重新初始化进度条

### CSS 样式设计

#### 1. 固定定位

```css
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  pointer-events: none;  /* 不阻挡鼠标事件 */
}
```

- `position: fixed`：固定在页面顶部
- `z-index: 9999`：确保在最上层显示
- `pointer-events: none`：不影响页面其他元素的交互

#### 2. 渐变色效果

```css
.reading-progress-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}
```

- 使用线性渐变创建优雅的颜色过渡
- 添加阴影效果增强视觉层次

#### 3. 平滑过渡

```css
.reading-progress-fill {
  transition: width 0.2s ease-out;
}
```

使用 CSS 过渡实现进度条宽度变化的平滑动画。

## 效果展示

实现后的效果：

1. **页面顶部进度条**：固定在页面最顶部，不影响其他内容
2. **渐变色设计**：从蓝紫色到紫色的渐变，视觉效果优雅
3. **实时更新**：随着页面滚动，进度条宽度实时变化
4. **深色模式适配**：在深色模式下自动调整样式
5. **移动端优化**：在移动设备上高度调整为 2px

## 自定义配置

### 修改进度条颜色

编辑 `reading-progress.css`，修改渐变色：

```css
.reading-progress-fill {
  /* 修改为你喜欢的颜色 */
  background: linear-gradient(90deg, #ff6b6b 0%, #feca57 100%);
}
```

### 修改进度条高度

```css
.reading-progress-bar {
  height: 5px;  /* 修改为你想要的高度 */
}
```

### 修改动画速度

```css
.reading-progress-fill {
  transition: width 0.3s ease-out;  /* 修改过渡时间 */
}
```

### 禁用脉冲动画

如果不喜欢脉冲动画效果，可以删除或注释掉：

```css
/* 注释掉这部分 */
/*
.reading-progress-fill {
  animation: progressPulse 2s ease-in-out infinite;
}
*/
```

## 常见问题

### 1. 进度条不显示

**原因**：可能是文件路径不正确或未正确引入

**解决方法**：
- 检查文件是否在正确的目录下
- 确认 `_config.yml` 中的 `inject` 配置正确
- 运行 `hexo clean && hexo generate` 重新生成

### 2. 进度条在非文章页面也显示

**原因**：页面类型检查失效

**解决方法**：
- 确保 JavaScript 中的页面类型检查代码完整
- 检查 `GLOBAL_CONFIG_SITE.pageType` 是否正确

### 3. PJAX 切换后进度条消失

**原因**：未正确处理 PJAX 事件

**解决方法**：
- 确保添加了 `pjax:complete` 和 `pjax:send` 事件监听器
- 检查清理函数是否正确移除了事件监听器

### 4. 进度条计算不准确

**原因**：页面高度计算有误

**解决方法**：
- 检查是否有动态加载的内容影响页面高度
- 可以在内容加载完成后手动调用 `updateProgress()`

## 性能优化

### 1. 节流处理

如果担心滚动事件触发过于频繁，可以添加节流：

```javascript
// 节流函数
function throttle(func, wait) {
  let timeout;
  return function() {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(this, arguments);
      }, wait);
    }
  };
}

// 使用节流
window.addEventListener('scroll', throttle(updateProgress, 100));
```

### 2. 使用 requestAnimationFrame

更平滑的动画效果：

```javascript
let ticking = false;

function updateProgress() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // 更新进度条的代码
      ticking = false;
    });
    ticking = true;
  }
}
```

## 扩展功能

### 1. 添加百分比显示

在进度条上显示具体的百分比：

```javascript
function updateProgress() {
  // ... 原有代码 ...

  // 添加百分比显示
  const percentage = Math.round(scrollPercentage);
  progressFill.setAttribute('data-percentage', `${percentage}%`);
}
```

```css
.reading-progress-fill::after {
  content: attr(data-percentage);
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: white;
}
```

### 2. 添加章节标记

在进度条上标记文章的各个章节：

```javascript
function addChapterMarkers() {
  const headings = document.querySelectorAll('h2, h3');
  headings.forEach(heading => {
    const position = (heading.offsetTop / documentHeight) * 100;
    // 创建章节标记
  });
}
```

## 总结

文章阅读进度条是一个简单但实用的功能，它能够：

1. **提升用户体验**：让读者清楚地知道阅读进度
2. **增强视觉效果**：渐变色进度条美观大方
3. **易于实现**：代码简洁，易于理解和维护
4. **高度可定制**：可以根据个人喜好调整样式

通过本教程，你已经学会了如何为 Hexo 博客添加文章阅读进度条功能。这个功能不仅实用，而且能够显著提升博客的专业度和用户体验。

## 参考资料

- [Butterfly 主题文档](https://butterfly.js.org/)
- [MDN - Scroll Events](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/scroll_event)
- [CSS Linear Gradient](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gradient/linear-gradient)

---

**相关文章**：
- [Hexo 图片懒加载 - 提升页面加载速度的最佳实践](/2026/01/08/Hexo图片懒加载-提升页面加载速度的最佳实践/)
- [Hexo 文章点赞功能 - 增强博客互动体验](/2026/01/08/Hexo文章点赞功能-增强博客互动体验/)
- [Hexo 性能优化 - 代码压缩配置教程](/2026/01/07/Hexo性能优化-代码压缩配置教程/)
