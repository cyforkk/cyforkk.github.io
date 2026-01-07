function initTalking(){const t=document.getElementById("talking-container");if(t){loadTalking()}}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initTalking)}else{initTalking()}document.addEventListener("pjax:complete",initTalking);function loadTalking(){fetch("/talking.json").then(t=>t.json()).then(t=>{renderTalking(t)}).catch(t=>{console.error("加载说说数据失败:",t);showError()})}function renderTalking(t){const n=document.getElementById("talking-container");if(!n){console.error("找不到说说容器");return}if(!t||t.length===0){n.innerHTML='<div class="talking-empty">暂无说说</div>';return}let e="";t.forEach((t,n)=>{e+=`
      <div class="talking-item" style="animation-delay: ${n*.1}s">
        <div class="talking-content">${escapeHtml(t.content)}</div>
        <div class="talking-meta">
          <div class="talking-date">
            <i class="far fa-clock"></i>
            <span>${formatDate(t.date)}</span>
          </div>
          <div class="talking-from">
            <i class="fas fa-map-marker-alt"></i>
            <span>${escapeHtml(t.from||"Web")}</span>
          </div>
        </div>
      </div>
    `});n.innerHTML=e}function formatDate(t){const n=new Date(t);const e=new Date;const a=e-n;if(a<6e4){return"刚刚"}if(a<36e5){return Math.floor(a/6e4)+" 分钟前"}if(a<864e5){return Math.floor(a/36e5)+" 小时前"}if(a<6048e5){return Math.floor(a/864e5)+" 天前"}const i=n.getFullYear();const r=String(n.getMonth()+1).padStart(2,"0");const o=String(n.getDate()).padStart(2,"0");const l=String(n.getHours()).padStart(2,"0");const c=String(n.getMinutes()).padStart(2,"0");return`${i}-${r}-${o} ${l}:${c}`}function escapeHtml(t){const n=document.createElement("div");n.textContent=t;return n.innerHTML}function showError(){const t=document.getElementById("talking-container");if(t){t.innerHTML=`
      <div class="talking-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>加载说说失败，请稍后再试</p>
      </div>
    `}}