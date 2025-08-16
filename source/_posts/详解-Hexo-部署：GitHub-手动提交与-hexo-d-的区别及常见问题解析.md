---
title: 详解 Hexo 部署：GitHub 手动提交与 hexo -d 的区别及常见问题解析
date: 2025-08-16 22:26:51
tags: [Hexo+Butterfly]  
categories: [Hexo博客]
---
# 详解 Hexo 部署：GitHub 手动提交与 hexo -d 的区别及常见问题解析

在使用 Hexo 搭建博客并部署到 GitHub 的过程中，很多人会遇到这样的困惑：手动提交 GitHub 有记录，hexo d却没有；仓库里找不到public文件夹，博客却能正常显示。本文将从核心区别、原理分析到问题排查，帮你彻底理清 Hexo 与 GitHub 的部署逻辑。

## 一、GitHub 手动提交 vs hexo d：核心区别

两者看似都是 "提交到 GitHub"，但本质上是**操作对象和目标分支的不同**，具体区别如下：

| 维度               | GitHub 手动提交（git push）                                  | hexo d（hexo deploy）                                        |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **提交内容**       | 提交 Hexo 源码（source文件夹、themes主题、_config.yml配置等） | 仅提交public文件夹中的静态文件（HTML/CSS/JS 等可直接访问的网页文件） |
| **目标分支**       | 通常是main或master分支（源码分支）                           | 通常是gh-pages分支（GitHub Pages 专用部署分支）              |
| **依赖配置**       | 无需特殊配置，仅需 Git 基础命令                              | 必须在_config.yml中配置deploy字段（指定仓库和分支）          |
| **提交记录可见性** | 提交记录显示在源码分支（如main）的 Git 历史中                | 提交记录显示在部署分支（如gh-pages）的 Git 历史中            |
| **典型用途**       | 备份源码、多设备同步开发                                     | 快速发布博客（将静态文件部署到可访问的分支）                 |

### 关键原理：Hexo 的 "源码 - 静态文件" 分离机制

Hexo 是静态博客生成器，工作流程分为两步：

1. hexo g（hexo generate）：将source中的 Markdown 文章、主题配置等**源码**，生成可直接在浏览器中访问的**静态文件**（存放在public文件夹）；

1. hexo d：将public文件夹的内容推送到部署分支（如gh-pages），供 GitHub Pages 展示。

而手动提交通常是将**源码**推送到源码分支（如main），两者操作的是不同的 "内容" 和 "分支"。

## 二、为什么 GitHub 仓库没有public文件夹？

public文件夹是 Hexo 生成的静态文件目录，但它**通常不会出现在你的源码仓库中**，原因有三：

### 1. .gitignore文件默认排除了public

Hexo 初始化项目时，会自动生成.gitignore文件，其中包含一行：

```
public/  # 忽略public文件夹
```

这是因为public是**动态生成的文件**（每次hexo g都会重新生成），无需纳入源码版本管理（避免冗余和冲突）。

查看你的.gitignore文件即可验证：

```
cat .gitignore  # 终端中执行，查看是否包含public/
```

### 2. public文件被部署到了其他分支

hexo d推送的public文件，默认会被推送到_config.yml中配置的部署分支（如gh-pages），而不是你日常提交源码的main分支。

例如，你的配置可能是：

```
# _config.yml
deploy:
  type: git
  repo: https://github.com/你的用户名/你的仓库名.git
  branch: gh-pages  # public文件被推送到gh-pages分支
```

此时，public文件只存在于gh-pages分支，而你查看的main分支自然没有这个文件夹。

### 3. 自动化部署工具隐藏了public

如果使用 GitHub Actions 等自动化工具，流程通常是：

1. 你提交源码到main分支；

1. Actions 自动执行hexo g生成public；

1. Actions 将public推送到gh-pages分支（全程在云端完成）。

这种情况下，本地和源码仓库（main分支）都不会出现public文件夹，但gh-pages分支中存在（用于展示）。

## 三、为什么hexo d没有提交记录？

手动提交有记录，hexo d却没有，核心原因是**提交记录在你没注意的分支中**，具体排查方向：

### 1. 检查hexo d的目标分支

hexo d的提交记录会出现在部署分支（如gh-pages），而不是源码分支（main）。

在 GitHub 仓库页面切换到部署分支（如gh-pages），即可看到hexo d的提交记录：



### 2. 排查hexo d是否实际执行成功

如果hexo d执行失败（如配置错误），则不会产生提交记录。检查终端输出：

- 成功提示：Deploy done: git

- 失败提示：可能包含 "Permission denied"（权限问题）、"Repository not found"（仓库地址错误）等。

常见失败原因及解决：

- 仓库地址错误：修正_config.yml中的repo字段；

- 权限不足：配置 SSH 密钥（推荐）或使用 HTTPS 时输入正确的账号密码；

- 未安装部署插件：执行npm install hexo-deployer-git --save安装。

### 3. 确认部署配置是否指向正确仓库

如果_config.yml中的repo配置指向了其他仓库（如测试仓库），hexo d的记录会出现在该仓库中，而非你当前查看的仓库。

检查配置：

```yaml
# _config.yml
deploy:
  type: git
  repo: 你的仓库地址  # 确认是否与你查看的仓库一致
  branch: gh-pages # # 确认是否与你查看的分支一致
```

## 四、实用技巧：正确管理提交记录和部署流程

### 1. 同时管理源码和部署记录

- **源码分支（main）**：手动提交git add . && git commit -m "更新文章" && git push，备份源码；

- **部署分支（gh-pages）**：执行hexo clean && hexo g -d，自动部署静态文件，记录在gh-pages分支。

### 2. 快速查看hexo d的提交记录

通过终端命令查看部署分支的历史（以gh-pages为例）：

```
# 克隆仓库并查看gh-pages分支
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名
git checkout gh-pages  # 切换到部署分支
git log  # 查看hexo d的提交记录
```

### 3. 避免混淆的最佳实践

- 给源码提交和部署提交添加区分性备注：

- - 源码提交：git commit -m "feat: 添加Hexo主题配置"

- - 部署提交：在_config.yml中配置message（自定义部署提交信息）：

```
deploy:
  type: git
  repo: 你的仓库地址
  branch: gh-pages
  message: "deploy: 发布新文章 {{ now('YYYY-MM-DD') }}"  # 自动添加日期
```

- 在 GitHub 仓库的 "Settings-Pages" 中，明确记录部署分支（如 "Deploy from branch: gh-pages"），方便后续查阅。

## 五、总结：核心要点速览

| 问题                   | 本质原因                                   | 解决 / 验证方法                            |
| ---------------------- | ------------------------------------------ | ------------------------------------------ |
| 手动提交与hexo d的区别 | 提交内容（源码 vs 静态文件）和目标分支不同 | 查看.gitignore和_config.yml的deploy配置    |
| 仓库没有public文件夹   | 被.gitignore排除，或存在于部署分支         | 切换到gh-pages分支查看，或检查.gitignore   |
| hexo d没有提交记录     | 记录在部署分支，或部署失败                 | 切换到部署分支查看历史，或检查终端错误信息 |

理解 Hexo 的 "源码 - 静态文件分离" 和 GitHub 的 "分支部署机制"，是解决这些问题的关键。记住：public是临时生成的展示文件，源码才是需要长期管理的核心；hexo d的记录藏在部署分支里，切换分支就能找到。按本文的方法排查，你就能清晰掌控博客的部署流程了。



