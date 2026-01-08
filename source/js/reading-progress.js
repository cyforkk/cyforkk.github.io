// 文章阅读进度条功能

// 初始化阅读进度条
function initReadingProgress() {
  // 检查是否是文章页面
  const articleContainer = document.getElementById('article-container');
  if (!articleContainer) return;

  // 额外检查：确保是 post 类型页面
  if (GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType !== 'post') return;

  // 检查是否已经添加了进度条
  if (document.querySelector('.reading-progress-bar')) return;

  // 创建进度条元素
  createProgressBar();

  // 监听滚动事件
  window.addEventListener('scroll', updateProgress);

  // 初始化进度
  updateProgress();
}

// 创建进度条
function createProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  progressBar.innerHTML = '<div class="reading-progress-fill"></div>';

  // 插入到页面顶部
  document.body.insertBefore(progressBar, document.body.firstChild);
}

// 更新进度
function updateProgress() {
  const progressFill = document.querySelector('.reading-progress-fill');
  if (!progressFill) return;

  // 获取文档高度和窗口高度
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // 计算可滚动的高度
  const scrollableHeight = documentHeight - windowHeight;

  // 计算滚动百分比
  const scrollPercentage = scrollableHeight > 0
    ? (scrollTop / scrollableHeight) * 100
    : 0;

  // 更新进度条宽度
  progressFill.style.width = `${Math.min(scrollPercentage, 100)}%`;
}

// 清理函数
function cleanupReadingProgress() {
  window.removeEventListener('scroll', updateProgress);
  const progressBar = document.querySelector('.reading-progress-bar');
  if (progressBar) {
    progressBar.remove();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReadingProgress);
} else {
  initReadingProgress();
}

// PJAX 兼容
document.addEventListener('pjax:complete', () => {
  cleanupReadingProgress();
  initReadingProgress();
});

// 页面卸载时清理
document.addEventListener('pjax:send', cleanupReadingProgress);
