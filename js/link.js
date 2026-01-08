function initLink(){const n=document.getElementById("link-container");if(n){loadLinks()}}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initLink)}else{initLink()}document.addEventListener("pjax:complete",initLink);function loadLinks(){fetch("/links.json").then(n=>n.json()).then(n=>{renderLinks(n)}).catch(n=>{console.error("加载友链数据失败:",n);showLinkError()})}function renderLinks(n){const e=document.getElementById("link-container");if(!e){console.error("找不到友链容器");return}e.classList.add("link-grid");if(!n||n.length===0){e.innerHTML='<div class="link-empty">暂无友链</div>';return}let a='<div id="网站">';n.forEach((n,e)=>{const i=escapeHtml(n.name);const t=escapeHtml(n.link);const r=escapeHtml(n.avatar);const s=escapeHtml(n.descr);a+=`
      <a href="${t}" class="link-card" target="_blank" rel="noopener" style="animation-delay: ${e*.1}s">
        <img src="${r}" alt="${i}" class="link-avatar" onerror="this.src='/img/friend_404.gif'">
        <div class="link-info">
          <div class="link-name">${i}</div>
          <div class="link-descr">${s}</div>
        </div>
      </a>
    `});a+="</div>";e.innerHTML=a}function escapeHtml(n){const e=document.createElement("div");e.textContent=n;return e.innerHTML}function showLinkError(){const n=document.getElementById("link-container");if(n){n.innerHTML=`
      <div class="link-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>加载友链失败，请稍后再试</p>
      </div>
    `}}