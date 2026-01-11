// ==================== 阅读进度条 ====================
(function() {
  // 创建进度条元素
  const progressBar = document.createElement('div');
  progressBar.id = 'reading-progress';
  document.body.appendChild(progressBar);

  // 更新进度条
  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

    progressBar.style.width = scrollPercent + '%';
  }

  // 监听滚动事件
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
})();

// ==================== 图片懒加载 ====================
(function() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loading');
        img.src = img.dataset.src;

        img.onload = () => {
          img.classList.remove('loading');
          img.classList.add('loaded');
        };

        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
})();

// ==================== 页面滚动动画 ====================
(function() {
  const animatedElements = document.querySelectorAll('.scroll-animation');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(el => scrollObserver.observe(el));
})();

// ==================== 首页文章卡片序号 ====================
(function() {
  const postItems = document.querySelectorAll('#recent-posts > .recent-post-item');
  postItems.forEach((item, index) => {
    item.setAttribute('data-index', index + 1);
  });
})();

// ==================== 代码块复制功能增强 ====================
(function() {
  const codeBlocks = document.querySelectorAll('figure.highlight');

  codeBlocks.forEach(block => {
    // 检查是否已有复制按钮
    if (block.querySelector('.copy-btn')) return;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '复制';
    copyBtn.onclick = function() {
      const code = block.querySelector('.code') || block.querySelector('pre');
      const text = code.innerText || code.textContent;

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '已复制!';
        setTimeout(() => {
          copyBtn.textContent = '复制';
        }, 2000);
      });
    };

    const tools = block.querySelector('.highlight-tools');
    if (tools) {
      tools.appendChild(copyBtn);
    }
  });
})();

// ==================== 文章更新时间提示 ====================
(function() {
  const postMeta = document.querySelector('#post-meta');
  if (!postMeta) return;

  const updatedTime = postMeta.querySelector('[datetime]');
  if (!updatedTime) return;

  const updateDate = new Date(updatedTime.getAttribute('datetime'));
  const now = new Date();
  const daysDiff = Math.floor((now - updateDate) / (1000 * 60 * 60 * 24));

  // 如果文章超过 180 天未更新，显示提示
  if (daysDiff > 180) {
    const notice = document.createElement('div');
    notice.className = 'post-updated';
    notice.innerHTML = `<i class="fas fa-exclamation-triangle"></i>本文最后更新于 ${daysDiff} 天前，文章内容可能已过时。`;

    const articleContainer = document.querySelector('#article-container');
    if (articleContainer) {
      articleContainer.insertBefore(notice, articleContainer.firstChild);
    }
  }
})();

// ==================== 平滑滚动 ====================
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// ==================== 外链新窗口打开 ====================
(function() {
  const links = document.querySelectorAll('a[href^="http"]');
  links.forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
})();

// ==================== 图片点击放大 ====================
(function() {
  const images = document.querySelectorAll('#article-container img');

  images.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.onclick = function() {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
      `;

      const clonedImg = img.cloneNode();
      clonedImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
      `;

      overlay.appendChild(clonedImg);
      document.body.appendChild(overlay);

      overlay.onclick = function() {
        document.body.removeChild(overlay);
      };
    };
  });
})();

// ==================== 返回顶部按钮增强 ====================
(function() {
  const goUpBtn = document.querySelector('#go-up');
  if (!goUpBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      goUpBtn.style.opacity = '1';
      goUpBtn.style.visibility = 'visible';
    } else {
      goUpBtn.style.opacity = '0';
      goUpBtn.style.visibility = 'hidden';
    }
  });

  goUpBtn.onclick = function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
})();

// ==================== 控制台输出 ====================
(function() {
  console.log('%c Butterfly 主题魔改版 ', 'background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #fff; padding: 10px 20px; border-radius: 5px; font-size: 16px; font-weight: bold;');
  console.log('%c 欢迎来到我的博客！', 'color: #4facfe; font-size: 14px;');
})();
