// 关于页面功能
function initAbout() {
  const container = document.querySelector('.about-container');
  if (container) {
    loadBlogStats();
  }
}

// 初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAbout);
} else {
  initAbout();
}

// PJAX 兼容
document.addEventListener('pjax:complete', initAbout);

// 加载博客统计数据
function loadBlogStats() {
  // 从搜索数据中获取统计信息
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      // 文章数
      const postCount = data.length;
      document.getElementById('post-count').textContent = postCount;

      // 分类数
      const categories = new Set();
      data.forEach(post => {
        if (post.categories && post.categories.length > 0) {
          post.categories.forEach(cat => categories.add(cat));
        }
      });
      document.getElementById('category-count').textContent = categories.size;

      // 标签数
      const tags = new Set();
      data.forEach(post => {
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach(tag => tags.add(tag));
        }
      });
      document.getElementById('tag-count').textContent = tags.size;

      // 总字数
      let totalWords = 0;
      data.forEach(post => {
        if (post.content) {
          // 移除 HTML 标签
          const text = post.content.replace(/<[^>]+>/g, '');
          // 计算中文字符和英文单词
          const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
          const englishWords = text.match(/[a-zA-Z]+/g) || [];
          totalWords += chineseChars.length + englishWords.length;
        }
      });

      // 格式化字数显示
      let wordCountText;
      if (totalWords >= 10000) {
        wordCountText = (totalWords / 10000).toFixed(1) + 'w';
      } else if (totalWords >= 1000) {
        wordCountText = (totalWords / 1000).toFixed(1) + 'k';
      } else {
        wordCountText = totalWords.toString();
      }
      document.getElementById('word-count').textContent = wordCountText;
    })
    .catch(error => {
      console.error('加载博客统计数据失败:', error);
      // 显示默认值
      document.getElementById('post-count').textContent = '0';
      document.getElementById('category-count').textContent = '0';
      document.getElementById('tag-count').textContent = '0';
      document.getElementById('word-count').textContent = '0';
    });
}
