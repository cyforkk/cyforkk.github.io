---
title: 在 Hexo 博客中插入图片的完整指南
date: 2025-07-28 20:54:26
tags: [Hexo+Butterfly]  
categories: [Hexo博客]
---
# 在 Hexo 博客中插入图片的完整指南

Hexo 是一个基于 Node.js 的静态博客生成器，因其灵活性和扩展性而广受欢迎。然而，在使用 Markdown 编写博客时，插入图片可能会遇到路径问题或格式限制。本文将详细介绍如何在 Hexo 中插入图片的多种方法

---

## 一、插入图片的三种种方法

### 方法 1：使用文章资源文件夹（推荐）

Hexo 提供了一个 `post_asset_folder` 功能，允许为每篇文章创建独立的资源文件夹。修改 Hexo 根目录下的 `_config.yml` 文件：

```yaml
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true 
```

> **说明**：此配置会为每篇新文章自动生成一个与文章同名的文件夹，用于存放图片等资源。

1. **创建新文章**：

   ```bash
   hexo new "你的文章标题"
   ```

   这会在 `source/_posts/` 目录下生成一个同名文件夹（如 `你的文章标题`）和 `.md` 文件。

2. **存放图片**：
   将图片放入生成的文件夹中（例如 `source/_posts/你的文章标题/`）。

3. **插入图片**：
   在 `.md` 文件中使用以下语法：

   ```markdown
   ![替代文字](图片名.jpg)
   ```

   > **提示**：如果图片无法显示，检查路径是否正确（图片名.jpg`）。

---

### 方法 2：使用固定资源文件夹（最简单）

1. **创建统一图片文件夹**：
   在 `source/` 目录下新建一个文件夹（例如 `images/`），用于存放所有文章的图片。

2. **插入图片**：
   在 `.md` 文件中使用以下语法：

   ```markdown
   ![替代文字](/images/图片名.jpg)
   ```

   > **说明**：`/images/` 表示从 Hexo 根目录的 `source/` 文件夹开始查找图片。

---

### 方法 3：使用网络图床（氪金玩家）

如果不想将图片存储在本地，可以使用图床服务（如阿里云 OSS、GitHub Pages）：

1. **上传图片**：
   将图片上传至图床，并获取图片的 URL（例如 `https://example.com/images/图片名.jpg`）。

2. **插入图片**：
   在 `.md` 文件中使用以下语法：

   ```markdown
   ![替代文字](https://example.com/images/图片名.jpg)
   ```

> **隐私保护建议**：  
>
> - 避免使用第三方图床（如免费图床服务），以防图片被他人盗用或丢失。  
> - 推荐使用私有对象存储（如阿里云 OSS、AWS S3）或 GitHub Pages 搭建私有图床。

---

**参考链接**：

- [Hexo 官方文档](https://hexo.io/)
- [Typora 图片管理指南](https://support.typora.io/Working-with-Images/)
- [hexo-asset-img GitHub 仓库](https://github.com/CodeFalling/hexo-asset-img)

---

希望这篇指南能帮助你更好地管理 Hexo 博客中的图片资源！