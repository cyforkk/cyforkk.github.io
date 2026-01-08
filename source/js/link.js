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

  if (!linkList || linkList.length === 0) {
    container.innerHTML = '<div class="link-empty">暂无友链</div>';
    return;
  }

  // 添加友链说明
  let html = `
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
  `;

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
