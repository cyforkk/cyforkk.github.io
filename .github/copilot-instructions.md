# Hexo Butterfly 博客项目指南

这是一个使用 Hexo 框架和 Butterfly 主题的个人博客项目。

## 项目结构

主要目录:
- `source/_posts/` - 博客文章的 Markdown 文件
- `source/categories/` - 分类页面配置
- `source/tags/` - 标签页面配置
- `_config.yml` - Hexo 主配置文件
- `_config.butterfly.yml` - Butterfly 主题配置文件

## 文章编写规范

### Front-matter 格式
所有博客文章(source/_posts/下的 .md 文件)必须包含以下格式的 Front-matter:

```markdown
---
title: 文章标题
date: YYYY-MM-DD HH:mm:ss
tags: [标签1, 标签2]
categories: [分类]
---
```

## 主题定制

主题配置在 `_config.butterfly.yml` 中管理，主要包括:
- 导航菜单设置
- 文章样式配置 
- 页面布局设置
- 图片和背景设置

对主题的任何修改都应该在此文件中进行，而不是修改主题源码。

## 部署工作流

1. 创建新文章:
```bash
hexo new "文章标题"
```

2. 生成静态文件:
```bash
hexo generate
```

3. 本地预览:
```bash
hexo server
```

## 注意事项

- 图片资源应放在 `source/images/` 目录下
- 文章的永久链接格式已配置为 `YYYY/MM/DD/文章标题`
- 使用相对路径引用图片
