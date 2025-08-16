---
title: Hexo 常用命令使用和详解
date: 2025-08-11 16:21:42
tags: [Hexo+Butterfly]  
categories: [Hexo博客]
---
# Hexo 常用命令使用和详解

Hexo 作为一款高性能的静态博客框架，其命令行工具设计简洁却功能强大。无论是新手搭建第一个博客，还是老手批量管理内容，掌握核心命令都是提升效率的关键。详细解析 Hexo 常用命令的用法与技巧。



## 一、内容管理：文章与页面的创建与发布

### 1. 创建文章（默认布局为 post）

```
hexo new "文章标题"  # 等价于 hexo new post "文章标题"
```

- **生成路径**：source/_posts/文章标题.md

- **Markdown 头部信息**（Front-matter）：自动生成包含标题、日期、标签等元数据的头部，例如：

```
---
title: 文章标题
date: 2025-08-10 15:30:00
tags:
- Hexo
---
```

### 2. 创建独立页面（如关于页、分类页）

```
hexo new page "页面名称"  # 如 hexo new page "about"
```

- **生成路径**：source/页面名称/[index.md](http://index.md)

- **特点**：页面 URL 为 域名/页面名称（如 https://example.com/about），适合放置固定内容

## 二、生成与预览：本地验证内容效果

### 1. 生成静态文件

```bash
hexo generate  # 简写：hexo g
```

- **作用**：将 Markdown 内容、主题模板编译为静态 HTML/CSS/JS，输出到 public 目录

### 2. 本地预览博客

```bash
hexo server  # 简写：hexo s
```

- **默认访问地址**：http://localhost:4000

- **实用参数**：

- - hexo s -p 5000：指定端口（解决 4000 端口被占用问题）

- - hexo s -i [0.0.0.0](http://0.0.0.0)：允许局域网其他设备访问（如手机预览移动端效果）

### 3. 清理缓存与生成文件

```
hexo clean
```

- **作用**：删除 public 目录（生成的静态文件）和 db.json（缓存数据）

- **何时使用**：

- - 主题更换后（避免旧主题文件残留）

- - 内容更新后页面显示异常（如样式错乱、内容缺失）

- - 部署前（确保发布的是最新版本）

### 4. 高效部署组合命令

```bash
hexo clean && hexo g && hexo s
```

清理→生成→本地预览

**默认访问地址**：http://localhost:4000

```
hexo clean && hexo g -d  # 清理→生成→部署一站式操作
```

先清理旧文件避免缓存干扰，再生成最新静态文件，最后直接部署，是日常发布的最佳实践

