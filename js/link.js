function initLink(){const n=document.getElementById("link-container");if(n){loadLinks()}}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initLink)}else{initLink()}document.addEventListener("pjax:complete",initLink);function loadLinks(){fetch("/links.json").then(n=>n.json()).then(n=>{renderLinks(n)}).catch(n=>{console.error("加载友链数据失败:",n);showLinkError()})}function renderLinks(n){const e=document.getElementById("link-container");if(!e){console.error("找不到友链容器");return}if(!n||n.length===0){e.innerHTML='<div class="link-empty">暂无友链</div>';return}let r=`
    <div class="link-notice">
      <h3>🔗 友链说明</h3>
      <p>欢迎交换友链！请在评论区留言，格式如下：</p>
      <p>
        <code>名称</code>：你的网站名称<br>
        <code>链接</code>：你的网站地址<br>
        <code>头像</code>：你的头像链接<br>
        <code>描述</code>：一句话介绍
      </p>
      <p>💡 本站信息：</p>
      <p>
        <code>名称</code>：cyforkk<br>
        <code>链接</code>：https://cyforkk.top/<br>
        <code>头像</code>：https://cyforkk.top/images/wallpaper-img/sanye.png<br>
        <code>描述</code>：找寻自我
      </p>
    </div>
    <div class="link-grid">
  `;n.forEach((n,e)=>{const i=escapeHtml(n.name);const t=escapeHtml(n.link);const o=escapeHtml(n.avatar);const c=escapeHtml(n.descr);r+=`
      <a href="${t}" class="link-card" target="_blank" rel="noopener" style="animation-delay: ${e*.1}s">
        <img src="${o}" alt="${i}" class="link-avatar" onerror="this.src='/img/friend_404.gif'">
        <div class="link-info">
          <div class="link-name">${i}</div>
          <div class="link-descr">${c}</div>
        </div>
      </a>
    `});r+="</div>";e.innerHTML=r}function escapeHtml(n){const e=document.createElement("div");e.textContent=n;return e.innerHTML}function showLinkError(){const n=document.getElementById("link-container");if(n){n.innerHTML=`
      <div class="link-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>加载友链失败，请稍后再试</p>
      </div>
    `}}