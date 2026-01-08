---
title: Hexo 文章点赞功能 - 增强博客互动体验
date: 2026-01-08 09:49:08
tags:
  - Hexo
  - 教程
  - Butterfly
categories:
  - Hexo博客
cover: /images/wallpaper-img/fj3.png
---

## 前言

想让你的博客更有互动性？想知道哪些文章最受欢迎？文章点赞功能是必不可少的！本教程教你如何在 Hexo + Butterfly 主题中实现一个完整的文章点赞功能。

<!-- more -->

## 📋 目录

- [什么是文章点赞功能](#什么是文章点赞功能)
- [为什么需要点赞功能](#为什么需要点赞功能)
- [实现步骤](#实现步骤)
- [功能特点](#功能特点)
- [自定义指南](#自定义指南)
- [总结](#总结)

## 什么是文章点赞功能

### 1. 定义

**文章点赞功能**是一种互动机制，允许读者对喜欢的文章表达认可和支持。

### 2. 展示形式

点赞功能通常包含：

- ❤️ **心形图标**：直观的点赞按钮
- 🔢 **点赞数**：显示文章获得的点赞总数
- 🎨 **状态反馈**：已点赞和未点赞的视觉区分
- ✨ **动画效果**：点击时的交互动画

### 3. 作用

- **互动反馈**：让读者表达对文章的喜爱
- **内容评估**：了解哪些文章最受欢迎
- **激励创作**：点赞数能激励博主创作更多优质内容
- **增强体验**：提升博客的互动性和趣味性

## 为什么需要点赞功能

### 1. 互动体验

**问题**：静态博客缺乏互动，读者无法表达对文章的喜爱

**解决**：通过点赞功能，读者可以轻松表达认可

### 2. 内容反馈

**问题**：不知道哪些文章最受欢迎，难以调整内容方向

**解决**：点赞数提供直观的内容质量反馈

### 3. 用户参与

**问题**：读者只是被动阅读，缺乏参与感

**解决**：点赞功能让读者成为内容的参与者

### 4. 激励创作

**问题**：创作缺乏正向反馈，难以坚持

**解决**：点赞数能给博主带来成就感和动力

## 实现步骤

### 步骤 1：创建样式文件

在 `source/css/` 目录下创建 `post-like.css` 文件：

```css
/* 文章点赞功能样式 */

/* 点赞容器 */
.post-like-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  padding: 20px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

/* 点赞按钮 */
.post-like-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  user-select: none;
}

.post-like-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.post-like-button:active {
  transform: translateY(0);
}

/* 点赞图标 */
.post-like-icon {
  font-size: 20px;
  transition: all 0.3s ease;
}

/* 点赞数 */
.post-like-count {
  font-size: 18px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}

/* 点赞文字 */
.post-like-text {
  font-size: 16px;
}

/* 已点赞状态 */
.post-like-button.liked {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.post-like-button.liked:hover {
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
}

.post-like-button.liked .post-like-icon {
  animation: heartBeat 0.8s ease-in-out;
}

/* 点击动画 */
.post-like-button.clicking {
  animation: likeClick 0.3s ease-out;
}

/* 心跳动画 */
@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(0.9);
  }
  20%, 40%, 60%, 80% {
    transform: scale(1.3);
  }
  50%, 70% {
    transform: scale(1.1);
  }
}

/* 点击动画 */
@keyframes likeClick {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

/* 淡入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-like-container {
    padding: 15px;
    margin: 20px 0;
  }

  .post-like-button {
    padding: 10px 20px;
    font-size: 14px;
  }

  .post-like-icon {
    font-size: 18px;
  }

  .post-like-count {
    font-size: 16px;
    min-width: 25px;
  }

  .post-like-text {
    font-size: 14px;
  }
}

/* 深色模式适配 */
[data-theme="dark"] .post-like-container {
  background: #1f1f1f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
```

### 步骤 2：创建 JavaScript 文件

在 `source/js/` 目录下创建 `post-like.js` 文件：

```javascript
// 文章点赞功能

// 初始化点赞功能
function initPostLike() {
  // 检查是否是文章页面
  const articleContainer = document.getElementById('article-container');
  if (!articleContainer) return;

  // 检查是否已经添加了点赞按钮
  if (document.querySelector('.post-like-container')) return;

  // 获取当前文章的 URL 作为唯一标识
  const articleUrl = window.location.pathname;

  // 创建点赞容器
  const likeContainer = createLikeButton(articleUrl);

  // 插入到文章底部（在 post-reward 之后）
  const postReward = document.querySelector('.post-reward');
  if (postReward) {
    postReward.after(likeContainer);
  } else {
    // 如果没有 post-reward，插入到文章内容之后
    articleContainer.parentElement.insertBefore(
      likeContainer,
      articleContainer.nextSibling
    );
  }

  // 加载点赞状态
  loadLikeStatus(articleUrl);
}

// 创建点赞按钮
function createLikeButton(articleUrl) {
  const container = document.createElement('div');
  container.className = 'post-like-container';
  container.innerHTML = `
    <button class="post-like-button" id="post-like-btn" data-url="${articleUrl}">
      <i class="fas fa-heart post-like-icon"></i>
      <span class="post-like-count" id="post-like-count">0</span>
      <span class="post-like-text">点赞</span>
    </button>
  `;

  // 添加点击事件
  const button = container.querySelector('#post-like-btn');
  button.addEventListener('click', handleLikeClick);

  return container;
}

// 处理点赞点击
function handleLikeClick(e) {
  const button = e.currentTarget;
  const articleUrl = button.dataset.url;

  // 添加点击动画
  button.classList.add('clicking');
  setTimeout(() => button.classList.remove('clicking'), 300);

  // 获取当前点赞状态
  const likeData = getLikeData(articleUrl);

  if (likeData.liked) {
    // 已点赞，取消点赞
    likeData.liked = false;
    likeData.count = Math.max(0, likeData.count - 1);
    button.classList.remove('liked');
    button.querySelector('.post-like-text').textContent = '点赞';
  } else {
    // 未点赞，添加点赞
    likeData.liked = true;
    likeData.count += 1;
    button.classList.add('liked');
    button.querySelector('.post-like-text').textContent = '已点赞';
  }

  // 更新点赞数显示
  button.querySelector('#post-like-count').textContent = likeData.count;

  // 保存到 localStorage
  saveLikeData(articleUrl, likeData);
}

// 获取点赞数据
function getLikeData(articleUrl) {
  const key = `article_like_${articleUrl}`;
  const data = localStorage.getItem(key);

  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('解析点赞数据失败:', e);
    }
  }

  // 默认数据
  return {
    liked: false,
    count: 0
  };
}

// 保存点赞数据
function saveLikeData(articleUrl, data) {
  const key = `article_like_${articleUrl}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('保存点赞数据失败:', e);
  }
}

// 加载点赞状态
function loadLikeStatus(articleUrl) {
  const button = document.getElementById('post-like-btn');
  if (!button) return;

  const likeData = getLikeData(articleUrl);

  // 更新按钮状态
  if (likeData.liked) {
    button.classList.add('liked');
    button.querySelector('.post-like-text').textContent = '已点赞';
  }

  // 更新点赞数
  button.querySelector('#post-like-count').textContent = likeData.count;
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPostLike);
} else {
  initPostLike();
}

// PJAX 兼容
document.addEventListener('pjax:complete', initPostLike);
```

### 步骤 3：配置 Butterfly 主题

编辑 `_config.butterfly.yml`，在 `inject` 部分添加 CSS 和 JS 引用：

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/post-like.css"> # 文章点赞
  bottom:
    - <script src="/js/post-like.js"></script>
```

### 步骤 4：生成静态文件

运行以下命令生成静态文件：

```bash
hexo clean
hexo generate
```

### 步骤 5：本地预览

启动本地服务器预览效果：

```bash
hexo server
```

访问 `http://localhost:4000/` 并打开任意文章，在文章底部即可看到点赞按钮。

## 功能特点

### ✨ 核心功能

1. **点赞/取消点赞**
   - 点击按钮即可点赞
   - 再次点击取消点赞
   - 支持切换状态

2. **点赞数统计**
   - 实时显示点赞数
   - 每次点赞数量 +1
   - 取消点赞数量 -1

3. **状态持久化**
   - 使用 localStorage 存储
   - 刷新页面状态保持
   - 每篇文章独立统计

4. **视觉反馈**
   - 未点赞：紫色渐变按钮
   - 已点赞：粉红色渐变按钮
   - 点击时：缩放动画
   - 点赞后：心跳动画

### 🎨 设计特点

1. **渐变色设计**
   - 未点赞：紫色系渐变（#667eea → #764ba2）
   - 已点赞：粉红色系渐变（#f093fb → #f5576c）
   - 视觉冲击力强

2. **动画效果**
   - **心跳动画**：点赞后心形图标跳动
   - **点击动画**：按钮点击时缩放
   - **淡入动画**：页面加载时从下方淡入
   - **悬停效果**：鼠标悬停时按钮上浮

3. **响应式设计**
   - 桌面端：完整尺寸显示
   - 移动端：自动缩小适配
   - 字体大小自适应

4. **深色模式支持**
   - 自动适配深色主题
   - 背景色调整
   - 阴影效果优化

### 🔧 技术特点

1. **纯前端实现**
   - 无需后端支持
   - 适合静态博客
   - 部署简单

2. **localStorage 存储**
   - 数据存储在浏览器本地
   - 格式：`article_like_${articleUrl}`
   - 数据结构：`{ liked: boolean, count: number }`

3. **PJAX 兼容**
   - 支持无刷新页面切换
   - 自动重新初始化
   - 防止重复添加

4. **错误处理**
   - localStorage 读写异常捕获
   - JSON 解析错误处理
   - 控制台错误日志

## 自定义指南

### 修改按钮颜色

编辑 `source/css/post-like.css`，修改渐变色：

```css
/* 未点赞状态 */
.post-like-button {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}

/* 已点赞状态 */
.post-like-button.liked {
  background: linear-gradient(135deg, #your-color-3 0%, #your-color-4 100%);
}
```

### 修改按钮位置

编辑 `source/js/post-like.js`，修改插入位置：

```javascript
// 方案 1：插入到文章开头
articleContainer.insertBefore(likeContainer, articleContainer.firstChild);

// 方案 2：插入到评论区之前
const commentSection = document.getElementById('post-comment');
if (commentSection) {
  commentSection.before(likeContainer);
}

// 方案 3：插入到指定元素之后
const targetElement = document.querySelector('.your-selector');
if (targetElement) {
  targetElement.after(likeContainer);
}
```

### 修改按钮文字

编辑 `source/js/post-like.js`，修改文字内容：

```javascript
// 修改未点赞文字
button.querySelector('.post-like-text').textContent = '喜欢';

// 修改已点赞文字
button.querySelector('.post-like-text').textContent = '已喜欢';
```

### 修改动画效果

编辑 `source/css/post-like.css`，自定义动画：

```css
/* 修改心跳动画速度 */
.post-like-button.liked .post-like-icon {
  animation: heartBeat 0.5s ease-in-out; /* 改为 0.5 秒 */
}

/* 修改点击动画效果 */
@keyframes likeClick {
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(0.9) rotate(-5deg); }
  100% { transform: scale(1) rotate(0deg); }
}
```

### 添加音效

编辑 `source/js/post-like.js`，在点击事件中添加音效：

```javascript
function handleLikeClick(e) {
  // ... 原有代码 ...

  // 添加音效
  if (!likeData.liked) {
    const audio = new Audio('/sounds/like.mp3');
    audio.play().catch(e => console.log('音效播放失败:', e));
  }

  // ... 原有代码 ...
}
```

## 注意事项

### 1. localStorage 限制

- **存储容量**：通常为 5-10MB
- **作用域**：仅限当前域名
- **持久性**：用户清除浏览器数据会丢失
- **隐私模式**：部分浏览器隐私模式下不可用

### 2. 数据同步

- **不同浏览器**：数据不同步
- **不同设备**：数据不同步
- **解决方案**：如需同步，需要后端支持

### 3. 点赞数真实性

- **本地存储**：用户可以修改 localStorage
- **刷新重置**：清除浏览器数据会重置
- **解决方案**：如需真实统计，需要后端支持

### 4. PJAX 兼容性

- **重复初始化**：确保检查按钮是否已存在
- **事件监听**：使用 `pjax:complete` 事件
- **内存泄漏**：避免重复添加事件监听器

### 5. 性能优化

- **防抖处理**：避免频繁点击
- **动画性能**：使用 CSS3 动画而非 JavaScript
- **存储优化**：定期清理过期数据

## 常见问题

### Q1: 点赞数不显示？

**原因**：JavaScript 文件未正确加载

**解决**：
1. 检查 `_config.butterfly.yml` 配置是否正确
2. 运行 `hexo clean && hexo generate` 重新生成
3. 清除浏览器缓存

### Q2: 点击没有反应？

**原因**：事件监听器未绑定

**解决**：
1. 打开浏览器控制台查看错误
2. 检查 JavaScript 代码是否有语法错误
3. 确认 Font Awesome 图标库已加载

### Q3: 刷新后点赞状态丢失？

**原因**：localStorage 被清除或浏览器不支持

**解决**：
1. 检查浏览器是否支持 localStorage
2. 确认未使用隐私模式
3. 检查浏览器设置是否禁用了本地存储

### Q4: 移动端显示异常？

**原因**：响应式样式未生效

**解决**：
1. 检查 CSS 文件中的 `@media` 查询
2. 确认视口设置正确
3. 测试不同屏幕尺寸

### Q5: 深色模式下颜色不对？

**原因**：深色模式样式未定义

**解决**：
1. 检查 CSS 文件中的 `[data-theme="dark"]` 样式
2. 确认主题切换功能正常
3. 调整深色模式下的颜色值

## 总结

通过本教程，我们成功实现了一个功能完善、美观大方的文章点赞功能。这个功能不仅提升了博客的互动性，还能帮助我们了解读者的喜好。

### 功能亮点

✅ **纯前端实现**：无需后端支持，适合静态博客
✅ **localStorage 存储**：数据持久化，刷新不丢失
✅ **精美动画**：心跳、点击、淡入等多种动画效果
✅ **响应式设计**：完美适配桌面端和移动端
✅ **深色模式**：自动适配深色主题
✅ **PJAX 兼容**：支持无刷新页面切换
✅ **易于定制**：颜色、位置、文字都可自定义

### 技术要点

- **localStorage API**：浏览器本地存储
- **DOM 操作**：动态创建和插入元素
- **事件处理**：点击事件和状态管理
- **CSS3 动画**：关键帧动画和过渡效果
- **响应式设计**：媒体查询和弹性布局
- **PJAX 兼容**：事件监听和重新初始化

### 适用场景

这个点赞功能特别适合：

- 📝 **个人博客**：增加互动性
- 📚 **技术文档**：收集内容反馈
- 🎨 **作品展示**：了解作品受欢迎程度
- 📖 **教程网站**：评估教程质量

希望这个教程能帮助你为博客添加点赞功能，让你的博客更有互动性！如果你有任何问题或建议，欢迎在评论区留言交流。

## 相关文章

- [Hexo 友链页面 - 增加博客社交属性](/2026/01/07/Hexo友链页面-增加博客社交属性/)
- [Hexo 关于页面 - 打造个性化自我介绍](/2026/01/07/Hexo-关于页面-打造个性化自我介绍/)
- [Hexo 说说功能 - 打造社交化动态页面](/2026/01/07/Hexo说说功能-打造社交化动态页面/)

## 参考资料

- [localStorage API - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)
- [CSS3 动画 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- [Butterfly 主题文档](https://butterfly.js.org/)
- [Font Awesome 图标库](https://fontawesome.com/)
