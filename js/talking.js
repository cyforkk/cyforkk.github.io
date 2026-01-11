// 说说页面功能
function initTalking() {
  const container = document.getElementById('talking-container');
  if (container) {
    loadTalking();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTalking);
} else {
  initTalking();
}

// PJAX 兼容
document.addEventListener('pjax:complete', initTalking);

// 加载说说数据
function loadTalking() {
  fetch('/talking.json')
    .then(response => response.json())
    .then(data => {
      renderTalking(data);
    })
    .catch(error => {
      console.error('加载说说数据失败:', error);
      showError();
    });
}

// 渲染说说列表
function renderTalking(talkingList) {
  const container = document.getElementById('talking-container');

  if (!container) {
    console.error('找不到说说容器');
    return;
  }

  if (!talkingList || talkingList.length === 0) {
    container.innerHTML = '<div class="talking-empty">暂无说说</div>';
    return;
  }

  let html = '';
  talkingList.forEach((item, index) => {
    html += `
      <div class="talking-item" style="animation-delay: ${index * 0.1}s">
        <div class="talking-content">${escapeHtml(item.content)}</div>
        <div class="talking-meta">
          <div class="talking-date">
            <i class="far fa-clock"></i>
            <span>${formatDate(item.date)}</span>
          </div>
          <div class="talking-from">
            <i class="fas fa-map-marker-alt"></i>
            <span>${escapeHtml(item.from || 'Web')}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚';
  }

  // 小于1小时
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + ' 分钟前';
  }

  // 小于1天
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + ' 小时前';
  }

  // 小于7天
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + ' 天前';
  }

  // 超过7天，显示具体日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 显示错误信息
function showError() {
  const container = document.getElementById('talking-container');
  if (container) {
    container.innerHTML = `
      <div class="talking-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>加载说说失败，请稍后再试</p>
      </div>
    `;
  }
}
