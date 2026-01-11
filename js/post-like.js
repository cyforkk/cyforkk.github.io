// 文章点赞功能

// 初始化点赞功能
function initPostLike() {
  // 检查是否是文章页面
  const articleContainer = document.getElementById('article-container');
  if (!articleContainer) return;

  // 额外检查：确保是 post 类型页面
  if (GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType !== 'post') return;

  // 检查是否已经添加了点赞按钮
  if (document.querySelector('.post-like-container')) return;

  // 获取当前文章的 URL 作为唯一标识
  const articleUrl = window.location.pathname;

  // 创建点赞容器
  const likeContainer = createLikeButton(articleUrl);

  // 插入到文章底部（在 post-reward 之后）
  const postReward = document.querySelector('.post-reward');
  if (postReward) {
    postReward.after(likeContainer);
  } else {
    // 如果没有 post-reward，插入到文章内容之后
    articleContainer.parentElement.insertBefore(
      likeContainer,
      articleContainer.nextSibling
    );
  }

  // 加载点赞状态
  loadLikeStatus(articleUrl);
}

// 创建点赞按钮
function createLikeButton(articleUrl) {
  const container = document.createElement('div');
  container.className = 'post-like-container';
  container.innerHTML = `
    <button class="post-like-button" id="post-like-btn" data-url="${articleUrl}">
      <i class="fas fa-heart post-like-icon"></i>
      <span class="post-like-count" id="post-like-count">0</span>
      <span class="post-like-text">点赞</span>
    </button>
  `;

  // 添加点击事件
  const button = container.querySelector('#post-like-btn');
  button.addEventListener('click', handleLikeClick);

  return container;
}

// 处理点赞点击
function handleLikeClick(e) {
  const button = e.currentTarget;
  const articleUrl = button.dataset.url;

  // 添加点击动画
  button.classList.add('clicking');
  setTimeout(() => button.classList.remove('clicking'), 300);

  // 获取当前点赞状态
  const likeData = getLikeData(articleUrl);

  if (likeData.liked) {
    // 已点赞，取消点赞
    likeData.liked = false;
    likeData.count = Math.max(0, likeData.count - 1);
    button.classList.remove('liked');
    button.querySelector('.post-like-text').textContent = '点赞';
  } else {
    // 未点赞，添加点赞
    likeData.liked = true;
    likeData.count += 1;
    button.classList.add('liked');
    button.querySelector('.post-like-text').textContent = '已点赞';
  }

  // 更新点赞数显示
  button.querySelector('#post-like-count').textContent = likeData.count;

  // 保存到 localStorage
  saveLikeData(articleUrl, likeData);
}

// 获取点赞数据
function getLikeData(articleUrl) {
  const key = `article_like_${articleUrl}`;
  const data = localStorage.getItem(key);

  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('解析点赞数据失败:', e);
    }
  }

  // 默认数据
  return {
    liked: false,
    count: 0
  };
}

// 保存点赞数据
function saveLikeData(articleUrl, data) {
  const key = `article_like_${articleUrl}`;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('保存点赞数据失败:', e);
  }
}

// 加载点赞状态
function loadLikeStatus(articleUrl) {
  const button = document.getElementById('post-like-btn');
  if (!button) return;

  const likeData = getLikeData(articleUrl);

  // 更新按钮状态
  if (likeData.liked) {
    button.classList.add('liked');
    button.querySelector('.post-like-text').textContent = '已点赞';
  }

  // 更新点赞数
  button.querySelector('#post-like-count').textContent = likeData.count;
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPostLike);
} else {
  initPostLike();
}

// PJAX 兼容
document.addEventListener('pjax:complete', initPostLike);
