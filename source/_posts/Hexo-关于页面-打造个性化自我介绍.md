---
title: Hexo 关于页面 - 打造个性化自我介绍
date: 2026-01-07 22:47:38
tags:
  - Hexo
  - Butterfly
  - 教程
categories:
  - Hexo博客
cover: /images/wallpaper-img/fj4.png
---

## 前言

关于页面是博客中非常重要的一个页面，它是访客了解博主的第一窗口。一个精心设计的关于页面不仅能展示个人信息，还能体现博主的个性和品味。本文将详细介绍如何在 Hexo + Butterfly 主题中实现一个功能完善、美观大方的关于页面。

<!-- more -->

## 什么是关于页面

关于页面（About Page）是博客中用于介绍博主个人信息的专门页面，通常包含：

- **个人简介**：姓名、头像、个人描述
- **技能标签**：掌握的技术栈和技能
- **博客统计**：文章数、分类数、标签数、总字数等
- **联系方式**：GitHub、Email、社交媒体等
- **个人理念**：座右铭、人生格言等

一个好的关于页面能够：
1. 让访客快速了解博主
2. 展示博主的专业能力
3. 提供联系方式，促进交流
4. 增强博客的个性化和亲和力

## 实现步骤

### 步骤 1：创建关于页面

首先使用 Hexo 命令创建关于页面：

```bash
hexo new page about
```

这会在 `source/about/` 目录下生成 `index.md` 文件。

### 步骤 2：编辑页面内容

编辑 `source/about/index.md`，设置页面类型和内容：

```markdown
---
title: 关于我
date: 2025-07-20 23:12:32
type: about
comments: true
---

<div class="about-container">
  <!-- 个人n  <div class="about-card">
    <div class="about-avatar">
      <img src="/images/wallpaper-img/sanye.png" alt="cyforkk">
    </div>
    <h2 class="about-name">cyforkk</h2>
    <p class="about-description">找寻自我</p>
    <div class="about-social">
      <a href="https://github.com/cyforkk" target="_blank" title="GitHub">
        <i class="fab fa-github"></i>
      </a>
      <a href="mailto:cyforkk@gmail.com" target="_blank" title="n        <i class="fas fa-envelope"></i>
      </a>
      <a href="/Gallery/" target="_blank" title="Gallery">
        <i class="fas fa-images"></i>
      </a>
    </div>
  </div>

  <!-- 关于我 -->
  <div class="about-section">
    <h3><i class="fas fa-user"></i> 关于我</h3>
    <p>你好！我是 cyforkk，一名热爱技术的开发者。</p>
    <p>这个博客是我记录学习与生活的地方，在这里我会分享：</p>
    <ul>
      <li>💻 技术学习笔记</li>
      <li>📝 编程经验总结</li>
      <li>🎯 项目实践记录</li>
      <li>🌱 个人成长感悟</li>
    </ul>
  </div>

  <!-- 技能标签 -->
  <div class="about-section">
    <h3><i class="fas fa-code"></i> 技能标签</h3>
    <div class="skill-tags">
      <span class="skill-tag">Java</span>
      <span class="skill-tag">MySQL</span>
      <span class="skill-tag">Git</span>
      <span class="skill-tag">Hexo</span>
      <span class="skill-tag">Markdown</span>
      <span class="skill-tag">前端开发</span>
      <span class="skill-tag">后端开发</span>
    </div>
  </div>

  <!-- 博客统计 -->
  <div class="about-section">
    <h3><i class="fas fa-chart-line"></i> 博客统计</h3>
    <div class="about-stats">
      <div class="stat-item">
        <div class="stat-value" id="post-count">-</div>
        <div class="stat-label">文章数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="category-count">-</div>
        <div class="stat-label">分类数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="tag-count">-</div>
        <div class="stat-label">标签数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="word-count">-</div>
        <div class="stat-label">总字数</div>
      </div>
    </div>
  </div>

  <!-- 联系方式 -->
  <div class="about-section">
    <h3><i class="fas fa-envelope"></i> 联系方式</h3>
    <div class="contact-list">
      <div class="contact-item">
        <i class="fab fa-github"></i>
        <span>GitHub: </span>
        <a href="https://github.com/cyforkk" target="_blank">@cyforkk</a>
      </div>
      <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <span>Email: </span>
        <a href="mailto:cyforkk@gmail.com">cyforkk@gmail.com</a>
      </div>
      <div class="contact-item">
        <i class="fas fa-link"></i>
        <span>网站: </span>
        <a href="https://cyforkk.top" target="_blank">cyforkk.top</a>
      </div>
    </div>
  </div>

  <!-- 座右铭 -->
  <div class="about-section">
    <h3><i class="fas fa-quote-left"></i> 座右铭</h3>
    <blockquote class="about-quote">
      <p>欲速则不达，今日事今日毕。</p>
      <p>业精于勤荒于嬉，行成于思毁于随。</p>
    </blockquote>
  </div>
</div>
```

### 步骤 3：创建样式文件

在 `source/css/` 目录下创建 `about.css` 文件：

```css
/* 关于页面样式 */

/* 容器 */
.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

/* 个人信息卡片 */
.about-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
}

/* 渐变背景 */
.about-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
}

/* 头像 */
.about-avatar {
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
}

.about-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 5px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.about-avatar img:hover {
  transform: scale(1.1) rotate(5deg);
}

/* 名字 */
.about-name {
  position: relative;
  z-index: 1;
  font-size: 28px;
  font-weight: bold;
  color: var(--font-color);
  margin: 15px 0 10px;
}

/* 描述 */
.about-description {
  position: relative;
  z-index: 1;
  font-size: 16px;
  color: var(--font-color);
  opacity: 0.8;
  margin-bottom: 20px;
}

/* 社交图标 */
.about-social {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.about-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: #667eea;
  font-size: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about-social a:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  background: #667eea;
  color: #fff;
}

/* 内容区块 */
.about-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: forwards;
  opacity: 0;
}

.about-section:nth-child(2) { animation-delay: 0.1s; }
.about-section:nth-child(3) { animation-delay: 0.2s; }
.about-section:nth-child(4) { animation-delay: 0.3s; }
.about-section:nth-child(5) { animation-delay: 0.4s; }
.about-section:nth-child(6) { animation-delay: 0.5s; }

.about-section h3 {
  font-size: 22px;
  font-weight: bold;
  color: var(--font-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
  display: flex;
  align-items: center;
  gap: 10px;
}

.about-section h3 i {
  color: #667eea;
}

.about-section p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--font-color);
  margin-bottom: 15px;
}

.about-section ul {
  list-style: none;
  padding: 0;
}

.about-section ul li {
  font-size: 16px;
  line-height: 2;
  color: var(--font-color);
  padding-left: 10px;
}

/* 技能标签 */
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.skill-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 博客统计 */
.about-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

/* 联系方式 */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: var(--font-color);
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(5px);
}

.contact-item i {
  color: #667eea;
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.contact-item a {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-item a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 座右铭 */
.about-quote {
  border-left: 4px solid #667eea;
  padding: 20px 30px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  margin: 0;
}

.about-quote p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--font-color);
  font-style: italic;
  margin-bottom: 10px;
}

.about-quote p:last-child {
  margin-bottom: 0;
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
  .about-container {
    padding: 15px;
  }

  .about-card {
    padding: 30px 20px;
  }

  .about-card::before {
    height: 100px;
  }

  .about-avatar img {
    width: 100px;
    height: 100px;
  }

  .about-name {
    font-size: 24px;
  }

  .about-description {
    font-size: 14px;
  }

  .about-social a {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .about-section {
    padding: 20px;
  }

  .about-section h3 {
    font-size: 20px;
  }

  .about-section p,
  .about-section ul li {
    font-size: 15px;
  }

  .about-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 28px;
  }

  .contact-item {
    font-size: 15px;
  }

  .about-quote {
    padding: 15px 20px;
  }

  .about-quote p {
    font-size: 15px;
  }
}

/* 深色模式适配 */
[data-theme="dark"] .about-card {
  background: #1f1f1f;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .about-section {
  background: #1f1f1f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .about-social a {
  background: rgba(255, 255, 255, 0.1);
  color: #667eea;
}

[data-theme="dark"] .about-social a:hover {
  background: #667eea;
  color: #fff;
}

[data-theme="dark"] .contact-item {
  background: rgba(102, 126, 234, 0.1);
}

[data-theme="dark"] .contact-item:hover {
  background: rgba(102, 126, 234, 0.15);
}

[data-theme="dark"] .about-quote {
  background: rgba(102, 126, 234, 0.1);
}
```

### 步骤 4：创建 JavaScript 文件

在 `source/js/` 目录下创建 `about.js` 文件：

```javascript
// 关于页面功能
function initAbout() {
  const container = document.querySelector('.about-container');
  if (container) {
    loadBlogStats();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAbout);
} else {
  initAbout();
}

// PJAX 兼容
document.addEventListener('pjax:complete', initAbout);

// 加载博客统计数据
function loadBlogStats() {
  // 从搜索数据中获取统计信息
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      // 文章数
      const postCount = data.length;
      document.getElementById('post-count').textContent = postCount;

      // 分类数
      const categories = new Set();
      data.forEach(post => {
        if (post.categories && post.categories.length > 0) {
          post.categories.forEach(cat => categories.add(cat));
        }
      });
      document.getElementById('category-count').textContent = categories.size;

      // 标签数
      const tags = new Set();
      data.forEach(post => {
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach(tag => tags.add(tag));
        }
      });
      document.getElementById('tag-count').textContent = tags.size;

      // 总字数
      let totalWords = 0;
      data.forEach(post => {
        if (post.content) {
          // 移除 HTML 标签
          const text = post.content.replace(/<[^>]+>/g, '');
          // 计算中文字符和英文单词
          const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
          const englishWords = text.match(/[a-zA-Z]+/g) || [];
          totalWords += chineseChars.length + englishWords.length;
        }
      });

      // 格式化字数显示
      let wordCountText;
      if (totalWords >= 10000) {
        wordCountText = (totalWords / 10000).toFixed(1) + 'w';
      } else if (totalWords >= 1000) {
        wordCountText = (totalWords / 1000).toFixed(1) + 'k';
      } else {
        wordCountText = totalWords.toString();
      }
      document.getElementById('word-count').textContent = wordCountText;
    })
    .catch(error => {
      console.error('加载博客统计数据失败:', error);
      // 显示默认值
      document.getElementById('post-count').textContent = '0';
      document.getElementById('category-count').textContent = '0';
      document.getElementById('tag-count').textContent = '0';
      document.getElementById('word-count').textContent = '0';
    });
}
```

### 步骤 5：配置 Butterfly 主题

编辑 `_config.butterfly.yml`，在 `inject` 部分添加 CSS 和 JS 引用：

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/css/about.css"> # 关于页面
  bottom:
    - <script src="/js/about.js"></script>
```

### 步骤 6：添加导航菜单

在 `_config.butterfly.yml` 的 `menu` 部分添加关于页面链接：

```yaml
menu:
  首页: / || fas fa-home
  时间轴: /archives/ || fas fa-archive
  标签: /tags/ || fas fa-tags
  分类: /categories/ || fas fa-folder-open
  关于: /about/ || fas fa-heart
```

### 步骤 7：生成静态文件

运行以下命令生成静态文件：

```bash
hexo clean
hexo generate
```

### 步骤 8：本地预览

启动本地服务器预览效果：

```bash
hexo server
```

访问 `http://localhost:4000/about/` 查看关于页面效果。

## 功能说明

### 1. 个人信息卡片

- **渐变背景**：使用 CSS 渐变创建视觉吸引力
- **头像动画**：鼠标悬停时头像会放大并旋转
- **社交图标**：提供 GitHub、Email、Gallery 等联系方式

### 2. 技能标签

- **渐变背景**：每个技能标签都有渐变色背景
- **悬停效果**：鼠标悬停时标签会上浮并显示阴影
- **灵活布局**：使用 Flexbox 自动换行

### 3. 博客统计

- **动态加载**：从 `search.json` 文件中读取数据
- **实时计算**：自动计算文章数、分类数、标签数、总字数
- **格式化显示**：大数字使用 'k'（千）和 'w'（万）单位
- **网格布局**：使用 CSS Grid 实现响应式布局

### 4. 联系方式

- **图标展示**：使用 Font Awesome 图标
- **悬停效果**：鼠标悬停时背景色变化并向右移动
- **链接跳转**：点击可直接跳转到对应平台

### 5. 座右铭

- **引用样式**：使用 blockquote 样式展示
- **左侧边框**：使用主题色作为左侧装饰
- **斜体文字**：使用斜体增强文学感

## 样式特点

### 1. 渐变色设计

使用紫色系渐变（#667eea 到 #764ba2）作为主题色，营造现代感和科技感。

### 2. 动画效果

- **淡入动画**：页面加载时各区块依次淡入
- **悬停动画**：鼠标悬停时元素会产生交互反馈
- **错开延迟**：各区块动画延迟不同，形成流畅的视觉效果

### 3. 响应式设计

- **移动端适配**：在 768px 以下自动调整布局
- **网格自适应**：统计卡片在移动端变为 2 列布局
- **字体缩放**：移动端字体大小适当缩小

### 4. 深色模式支持

使用 `[data-theme="dark"]` 选择器适配深色模式，确保在不同主题下都有良好的视觉效果。

## 自定义指南

### 修改个人信息

编辑 `source/about/index.md` 文件，修改以下内容：

```html
<!-- 修改头像 -->
<img src="/images/your-avatar.png" alt="your-name">

<!-- 修改名字 -->
<h2 class="about-name">Your Name</h2>

<!-- 修改描述 -->
<p class="about-description">Your Description</p>

<!-- 修改社交链接 -->
<a href="https://github.com/your-username" target="_blank" title="GitHub">
  <i class="fab fa-github"></i>
</a>
```

### 修改技能标签

在技能标签区域添加或删除标签：

```html
<div class="skill-tags">
  <span class="skill-tag">Your Skill 1</span>
  <span class="skill-tag">Your Skill 2</span>
  <span class="skill-tag">Your Skill 3</span>
</div>
```

### 修改主题色

编辑 `source/css/about.css`，修改渐变色：

```css
/* 修改渐变色 */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### 修改座右铭

在座右铭区域修改内容：

```html
<blockquote class="about-quote">
  <p>Your Quote 1</p>
  <p>Your Quote 2</p>
</blockquote>
```

## 注意事项

1. **search.json 文件**：博客统计功能依赖 `search.json` 文件，确保已安装 `hexo-generator-search` 插件
2. **Font Awesome 图标**：确保主题已引入 Font Awesome 图标库
3. **PJAX 兼容**：代码已处理 PJAX 兼容性，支持无刷新页面切换
4. **图片路径**：确保头像图片路径正确，建议使用绝对路径
5. **响应式测试**：建议在不同设备上测试页面效果

## 总结

通过本文的详细教程，我们成功实现了一个功能完善、美观大方的关于页面。这个页面不仅展示了个人信息，还具有动态统计、响应式设计、深色模式支持等现代化特性。

关于页面的核心价值在于：
- **个性化展示**：充分展现博主的个性和特点
- **信息完整**：包含个人简介、技能、统计、联系方式等完整信息
- **视觉美观**：使用渐变色、动画效果等现代设计元素
- **用户友好**：响应式设计确保在各种设备上都有良好体验

希望这个教程能帮助你打造一个独特的关于页面，让访客更好地了解你！

## 相关文章

- [Hexo 友链页面 - 增加博客社交属性](/2026/01/07/Hexo友链页面-增加博客社交属性/)
- [Hexo 说说功能 - 打造社交化动态页面](/2026/01/07/Hexo说说功能-打造社交化动态页面/)
- [Hexo 系列文章功能 - 组织相关内容的最佳实践](/2026/01/07/Hexo系列文章功能-组织相关内容的最佳实践/)

## 参考资料

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Butterfly 主题文档](https://butterfly.js.org/)
- [Font Awesome 图标库](https://fontawesome.com/)
- [CSS Grid 布局指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout)
