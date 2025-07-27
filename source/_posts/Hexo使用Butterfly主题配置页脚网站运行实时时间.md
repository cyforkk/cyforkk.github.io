---

title: Hexo使用Butterfly主题配置页脚网站运行实时时间
date: 2025-07-26 11:46:03
tags: 
categories: [Hexo+Butterfly]

---




# Hexo使用Butterfly主题配置页脚网站运行实时时间

### 一、找配置文件

寻找/node_modules/hexo-theme-butterfly/layout/includes/footer.pug文件，添加完之后已经成功了，但是在左下角
![图片标题](image1.png)


里面的代码直接全部替换为

```
- const { nav, owner, copyright, custom_text } = theme.footer

if nav
  .footer-flex
    for block in nav
      .footer-flex-items(style=`${ block.width ? 'flex-grow:' + block.width : '' }`)
        for blockItem in block.content
          .footer-flex-item
            .footer-flex-title= blockItem.title
            .footer-flex-content
              for subitem in blockItem.item
                if subitem.html
                  div!= subitem.html
                else if subitem.url
                  a(href=url_for(subitem.url), target='_blank' title=subitem.title)= subitem.title
                else if subitem.title
                  div!= subitem.title
.footer-running-time
  span 本站已运行：<span id="running-time">0 天 0 小时 0 分钟 0 秒</span>

script.
  function updateRunningTime() {
    const startDate = new Date("2025-07-20T00:00:00"); // 修改为你自己的建站时间
    const now = new Date();
    let diff = Math.floor((now - startDate) / 1000); // 时间差（秒）

    const days = Math.floor(diff / 86400);
    diff -= days * 86400;
    const hours = Math.floor(diff / 3600) % 24;
    diff -= hours * 3600;
    const minutes = Math.floor(diff / 60) % 60;
    const seconds = diff % 60;

    document.getElementById("running-time").innerText =
      `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
  }

  // 页面加载后立即执行一次，之后每秒更新一次
  document.addEventListener("DOMContentLoaded", function () {
    updateRunningTime();
    setInterval(updateRunningTime, 1000);
  });

.footer-other
  .footer-copyright
    if owner.enable
      - const currentYear = new Date().getFullYear()
      - const sinceYear = owner.since
      span.copyright
        if sinceYear && sinceYear != currentYear
          != `&copy;${sinceYear} - ${currentYear} By ${config.author}`
        else
          != `&copy;${currentYear} By ${config.author}`
    if copyright.enable
      - const v = copyright.version ? getVersion() : false
      span.framework-info
        if owner.enable && nav
          span.footer-separator |
        span= _p('footer.framework') + ' '
        a(href='https://hexo.io')= `Hexo${ v ? ' ' + v.hexo : '' }`
        span.footer-separator |
        span= _p('footer.theme') + ' '
        a(href='https://github.com/jerryc127/hexo-theme-butterfly')= `Butterfly${ v ? ' ' + v.theme : '' }`
  if theme.footer.custom_text
    .footer_custom_text!= theme.footer.custom_text

```

 

### 自定义CSS样式（更加美观）

找到/source文件夹，新建css文件夹，在css文件夹中新建custom.css文件，将下面代码全部复制到custom.css文件中

![图片标题](image2.png)


```
.footer-running-time {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 15px 0;
  padding: 12px 18px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(90deg, #ffc0fa, #f375f3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  transition: all 0.3s ease;
  position: relative;
}

.footer-running-time::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 4px 4px;
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}

.footer-running-time i.fas.fa-hourglass {
  font-size: 20px;
  margin-right: 6px;
  color: #ffffff;
  background: #ffc0cb;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  animation: bounce 1.2s infinite;
  z-index: 1;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.05);
  }
}
```

### 让CSS样式生效

找到_config.butterfly.yml文件inject中的head属性

```
inject:
  head:
    - <link rel="stylesheet" href="/css/custom.css"> #增加这一行
```
### 效果图
![图片标题](image3.png)
