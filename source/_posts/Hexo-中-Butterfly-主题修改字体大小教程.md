---
title: Hexo 中 Butterfly 主题修改字体大小教程
date: 2025-08-11 20:19:18
tags: [Hexo+Butterfly]  
categories: [Hexo博客]
---
# Hexo 中 Butterfly 主题修改字体大小教程

在使用 Hexo 搭建博客并采用 Butterfly 主题时，有时我们需要根据自己的阅读习惯调整字体大小，下面就来介绍具体的修改方法。

## 找到配置文件

首先，我们需要找到字体大小设置所在的文件，路径为：

```
\node_modules\hexo-theme-butterfly\source\css\var.styl
```

可以通过文件管理器导航到该路径，也可以在博客的开发工具中直接定位到这个文件。

## 修改字体大小参数

打开var.styl文件后，我们会看到关于字体大小的配置代码：

```
// Global Variables
$font-size = hexo-config('font.global_font_size') ? convert(hexo-config('font.global_font_size')) : 18px  // 全局字体大小
$code-font-size = hexo-config('font.code_font_size') ? convert(hexo-config('font.code_font_size')) : var(--global-font-size)  // 代码字体大小
$font-color = #1F2D3D  // 字体颜色
```

- $font-size：这是全局字体大小的设置。代码的意思是，如果在 Hexo 的配置文件中设置了font.global_font_size，则使用该配置的值；如果没有设置，则默认使用 18px（如示例中修改后的数值）。我们可以直接修改这里的默认值（如 18px）来调整全局字体大小。

- $code-font-size：这是代码块字体大小的设置。同理，如果配置了font.code_font_size则使用该值，否则默认使用全局字体大小（var(--global-font-size)）。

## 生效修改

修改完成后，保存文件，然后在终端中执行hexo clean && hexo g && hexo s命令，重新生成并预览博客，就可以看到字体大小的变化了。如果是部署在服务器上，还需要执行hexo d命令重新部署。

通过这种方式，我们可以简单有效地调整 Butterfly 主题下的字体大小，让博客更符合自己的阅读需求。