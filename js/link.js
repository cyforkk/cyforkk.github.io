// 友链页面功能
function initLink() {
  const container = document.getElementById('link-container');
  if (container) {
    loadLinks();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLink);
} else {
  initLink();
}

// PJAX 兼容
document.addEventListener('pjax:complete', initLink);

// 加载友链数据
function loadLinks() {
  fetch('/links.json')
    .then(response => response.json())
    .then(data => {
      renderLinks(data);
    })
    .catch(error => {
      console.error('加载友链数据失败:', error);
      showLinkError();
    });
}

// 渲染友链列表
function renderLinks(linkList) {
  const container = document.getElementById('link-container');

  if (!container) {
    console.error('找不到友链容器');
    return;
  }

  // 给容器添加 link-grid 类
  container.classList.add('link-grid');

  if (!linkList || linkList.length === 0) {
    container.innerHTML = '<div class="link-empty">暂无友链</div>';
    return;
  }

  // 直接渲染友链卡片
  let html = '<div id="网站">';

  // 渲染友链卡片
  linkList.forEach((item, index) => {
    const name = escapeHtml(item.name);
    const link = escapeHtml(item.link);
    const avatar = escapeHtml(item.avatar);
    const descr = escapeHtml(item.descr);

    html += `
      <a href="${link}" class="link-card" target="_blank" rel="noopener" style="animation-delay: ${index * 0.1}s">
        <img src="${avatar}" alt="${name}" class="link-avatar" onerror="this.src='/img/friend_404.gif'">
        <div class="link-info">
          <div class="link-name">${name}</div>
          <div class="link-descr">${descr}</div>
        </div>
      </a>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 显示错误信息
function showLinkError() {
  const container = document.getElementById('link-container');
  if (container) {
    container.innerHTML = `
      <div class="link-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>加载友链失败，请稍后再试</p>
      </div>
    `;
  }
}
