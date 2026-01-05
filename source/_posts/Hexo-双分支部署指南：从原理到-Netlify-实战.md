---
title: Hexo 双分支部署指南：从原理到 Netlify 实战
date: 2025-08-17 00:00:56
tags: [Hexo+Butterfly]  
categories: [Hexo博客]
---
# Hexo 双分支部署指南：从原理到 Netlify 实战

在 Hexo 博客部署中，很多人会困惑于hexo d自动部署与 GitHub 手动提交的区别，以及如何通过双分支结构优雅地部署到 Netlify。本文将清晰拆解两种部署方式的核心差异，并手把手教你用双分支策略实现 Netlify 部署，兼顾源码安全与静态文件发布需求。

## 一、核心概念：hexo d与 GitHub 手动提交的区别

简单说，两者的本质是**操作对象和目标分支的不同**，具体区别如下：

| 维度                         | hexo d（自动部署）                                 | GitHub 手动提交（git push）                                 |
| ---------------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| **操作对象**                 | 仅处理public文件夹（静态文件：HTML/CSS/JS 等）     | 处理 Hexo 源码（source文章、themes主题、_config.yml配置等） |
| **依赖配置**                 | 依赖_config.yml中的deploy字段（指定仓库和分支）    | 依赖 Git 基础命令（add/commit/push），无需特殊配置          |
| **分支用途**                 | 通常部署到静态文件分支（如gh-pages/netlify-pages） | 通常提交到源码分支（如main）                                |
| **核心作用**                 | 快速发布静态文件到展示平台                         | 备份源码、多设备同步开发                                    |
| **是否需要****package.json** | 不需要（仅推送静态文件）                           | 需要（源码分支需依赖管理）                                  |

### 关键原理：Hexo 的 “源码 - 静态文件” 分离

Hexo 是静态博客生成器，工作流分为两步：

1. hexo g（生成）：将source中的 Markdown 源码转换为public中的静态文件；

1. hexo d（部署）：将public推送到指定分支。

手动提交则是直接管理源码，两者需通过不同分支隔离，否则会导致文件覆盖（这也是建议双分支的核心原因）。

## 二、双分支部署策略：源码与静态文件分离

双分支策略的核心是**用两个分支分别管理源码和静态文件**，既保护源码安全，又满足不同平台的部署需求。推荐分支命名：

- main：存放 Hexo 源码（Markdown 文章、主题、配置等）；

- netlify-pages：存放public静态文件（供 Netlify 直接部署）。

## 三、部署到 Netlify 的两种方式（按需求选择）

### 方式 1：静态文件分支部署（直接用public内容）

适合场景：希望直接部署本地生成的public文件，跳过 Netlify 云端构建，无需package.json。

#### 步骤 1：创建静态文件分支

```bash
# 1. 新建并切换到空分支（无历史记录，更干净）
git checkout --orphan netlify-pages

# 2. 删除当前分支所有文件（避免污染源码）
git rm -rf .

# 3. 本地生成最新public（确保包含所有文章）
hexo clean && hexo generate

# 4. 将public内容复制到当前分支根目录（注意是内容，不是文件夹）
cp -r public/* .

# 5. 提交静态文件
git add .
git commit -m "部署静态文件到netlify-pages"
git push -u origin netlify-pages  # 推送到远程静态分支
```

#### 步骤 2：配置 Netlify（无需构建）

1. 登录 Netlify，关联你的 GitHub 仓库；

1. 进入站点设置 → **Build & deploy** → **Build settings**：

- - **Branch to deploy**：选择netlify-pages；

- - **Build command**：留空（或填#，表示不执行构建）；

- - **Publish directory**：填.（点号，表示直接发布分支根目录的静态文件）。

1. 点击 “Deploy site”，Netlify 会直接读取netlify-pages分支的静态文件并部署。

### 方式 2：源码分支部署（云端生成public）

适合场景：希望 Netlify 自动生成public，需依赖package.json管理依赖，适合多设备同步开发。

#### 步骤 1：准备源码分支

```bash
# 1. 切换到源码分支（如main，若不存在则创建）
git checkout -b main

# 2. 确保本地有完整源码（关键文件）
ls  # 应包含：source/、themes/、_config.yml、package.json、package-lock.json

# 3. 若缺失package.json，重新初始化（正常Hexo项目默认包含）
npm init -y  # 生成基础package.json
npm install hexo --save  # 安装Hexo核心依赖

# 4. 提交源码
git add .
git commit -m "提交Hexo源码（含package.json）"
git push -u origin main  # 推送到远程源码分支
```

#### 步骤 2：配置 Netlify（云端构建）

1. 进入 Netlify 站点设置 → **Build settings**：

- - **Branch to deploy**：选择main；

- - **Build command**：填npm install && hexo generate（安装依赖→生成 public）；

- - **Publish directory**：填public（指定静态文件目录）。

1. 点击 “Deploy site”，Netlify 会自动执行：

- - 拉取main分支源码 → 安装依赖 → 生成public → 部署静态文件。

## 四、关键说明与注意事项

### 1. 分支隔离是核心

- 两个分支必须严格隔离：main只存源码，netlify-pages只存静态文件，避免互相污染；

- 用.gitignore确保main分支忽略public（避免源码分支包含静态文件）：

```bash
# main分支的.gitignore
public/
node_modules/
```

### 2. 静态文件分支部署注意事项

- 本地生成public时必须完整：执行hexo clean && hexo generate后，检查public中是否有index.html和文章对应的 HTML 文件；

- 更新文章时，需重新生成public并同步到netlify-pages分支：

```bash
hexo clean && hexo generate  # 生成新public
git checkout netlify-pages
rm -rf *  # 删除旧文件
cp -r public/* .  # 复制新文件
git add . && git commit -m "更新文章" && git push
```

### 3. 源码分支部署注意事项

- package.json必须包含必要依赖：至少有hexo（否则 Netlify 会提示 “hexo: command not found”）；

- 主题和配置文件必须完整：themes文件夹和_config.yml需提交到main分支，否则云端生成的public会缺失样式；

- 构建命令可简化：若package.json中定义了build脚本，可直接用npm run build：

```json
// package.json
"scripts": {
  "build": "hexo clean && hexo generate"
}
```

此时 Netlify 的 Build command 可改为npm install && npm run build。

## 五、总结：核心要点速览

| 部署方式     | 分支名称      | 关键配置（Netlify）                                          | 适用场景                              |
| ------------ | ------------- | ------------------------------------------------------------ | ------------------------------------- |
| 静态文件部署 | netlify-pages | Build command：留空；Publish dir：.                          | 本地生成 public，追求部署速度和稳定性 |
| 源码云端构建 | main          | Build command：npm install && hexo generate；Publish dir：public | 多设备开发，需要自动生成静态文件      |

通过双分支策略，你可以根据需求灵活选择部署方式：想直接用public就选静态文件分支，想让云端自动处理就选源码分支。两种方式都能完美适配 Netlify，既保证源码安全，又能顺畅发布博客。
