// 每日计划页面 - 从 YAML 数据文件加载
document.addEventListener('DOMContentLoaded', function() {
  console.log('开始加载计划数据...');

  // 从 plans.json 加载数据
  fetch('/plans.json')
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('数据加载成功:', data);
      if (data && data.plans && data.plans.length > 0) {
        renderPlans(data.plans);
        initializeFeatures();
      } else {
        console.error('数据格式错误或为空');
        showError('数据格式错误');
      }
    })
    .catch(error => {
      console.error('加载计划数据失败:', error);
      showError('加载失败: ' + error.message);
    });
});

// 显示错误信息
function showError(message) {
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    timeline.innerHTML = `<p style="text-align:center;color:#ff6b6b;padding:20px;">
      <i class="fas fa-exclamation-triangle"></i> ${message}
    </p>`;
  }
}

// 渲染计划列表
function renderPlans(plans) {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  // 清空现有内容
  timeline.innerHTML = '';

  // 按日期倒序排列（最新的在前）
  plans.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 生成每个日期的计划项
  plans.forEach(plan => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';

    // 格式化日期显示（只显示年-月-日）
    const dateObj = new Date(plan.date);
    const formattedDate = dateObj.toISOString().split('T')[0];

    // 标题
    const title = document.createElement('div');
    title.className = 'timeline-item-title';
    title.innerHTML = `<span class="item-circle">${formattedDate}</span>`;

    // 内容
    const content = document.createElement('div');
    content.className = 'timeline-item-content';

    const ul = document.createElement('ul');
    plan.tasks.forEach(task => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.disabled = true; // 只读模式

      const label = document.createElement('label');
      label.textContent = task.text;
      if (task.completed) {
        label.style.textDecoration = 'line-through';
        label.style.opacity = '0.7';
      }

      li.appendChild(checkbox);
      li.appendChild(label);
      ul.appendChild(li);
    });

    content.appendChild(ul);

    timelineItem.appendChild(title);
    timelineItem.appendChild(content);
    timeline.appendChild(timelineItem);
  });
}

// 初始化折叠/展开功能
function initializeFeatures() {
  const timelineItems = document.querySelectorAll('.timeline-item-title');

  timelineItems.forEach(function(title) {
    // 添加收缩按钮
    const toggleBtn = document.createElement('span');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.innerHTML = '▼';
    title.appendChild(toggleBtn);

    // 添加点击事件
    title.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isCollapsed = content.classList.contains('collapsed');

      if (isCollapsed) {
        content.classList.remove('collapsed');
        this.classList.remove('collapsed');
      } else {
        content.classList.add('collapsed');
        this.classList.add('collapsed');
      }
    });
  });

  // 分页功能
  const itemsPerPage = 10;
  let currentPage = 1;
  const allItems = document.querySelectorAll('.timeline-item');
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    allItems.forEach((item, index) => {
      if (index >= start && index < end) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  function createPagination() {
    const timeline = document.querySelector('.timeline');
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    paginationDiv.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 30px;
      padding: 20px;
    `;

    // 上一页按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '← 上一页';
    prevBtn.style.cssText = `
      padding: 8px 16px;
      border: 1px solid var(--card-border);
      background: var(--card-bg);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    `;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        updatePagination();
      }
    };
    paginationDiv.appendChild(prevBtn);

    // 页码按钮容器
    const pageNumbers = document.createElement('div');
    pageNumbers.className = 'page-numbers';
    pageNumbers.style.cssText = 'display: flex; gap: 5px;';
    paginationDiv.appendChild(pageNumbers);

    // 下一页按钮
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '下一页 →';
    nextBtn.style.cssText = prevBtn.style.cssText;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
        updatePagination();
      }
    };
    paginationDiv.appendChild(nextBtn);

    timeline.parentNode.insertBefore(paginationDiv, timeline.nextSibling);
    updatePagination();
  }

  function updatePagination() {
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';

    // 智能分页显示逻辑
    let startPage = 1;
    let endPage = totalPages;

    // 如果总页数超过7页，使用省略号
    if (totalPages > 7) {
      if (currentPage <= 4) {
        // 当前页在前面
        startPage = 1;
        endPage = 5;
      } else if (currentPage >= totalPages - 3) {
        // 当前页在后面
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        // 当前页在中间
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // 第一页
    if (startPage > 1) {
      addPageButton(1);
      if (startPage > 2) {
        addEllipsis();
      }
    }

    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
      addPageButton(i);
    }

    // 最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        addEllipsis();
      }
      addPageButton(totalPages);
    }

    // 更新按钮状态
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns[0].disabled = currentPage === 1;
    pageBtns[1].disabled = currentPage === totalPages;

    if (currentPage === 1) {
      pageBtns[0].style.opacity = '0.5';
      pageBtns[0].style.cursor = 'not-allowed';
    } else {
      pageBtns[0].style.opacity = '1';
      pageBtns[0].style.cursor = 'pointer';
    }

    if (currentPage === totalPages) {
      pageBtns[1].style.opacity = '0.5';
      pageBtns[1].style.cursor = 'not-allowed';
    } else {
      pageBtns[1].style.opacity = '1';
      pageBtns[1].style.cursor = 'pointer';
    }
  }

  function addPageButton(pageNum) {
    const pageNumbers = document.querySelector('.page-numbers');
    const pageBtn = document.createElement('button');
    pageBtn.className = 'page-number';
    pageBtn.textContent = pageNum;
    pageBtn.style.cssText = `
      padding: 8px 12px;
      border: 1px solid var(--card-border);
      background: var(--card-bg);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      min-width: 40px;
    `;

    if (pageNum === currentPage) {
      pageBtn.classList.add('active');
      pageBtn.style.background = 'linear-gradient(135deg, #00d4ff, #090979)';
      pageBtn.style.color = 'white';
      pageBtn.style.borderColor = '#00d4ff';
    }

    pageBtn.onclick = () => {
      currentPage = pageNum;
      showPage(currentPage);
      updatePagination();
    };

    pageNumbers.appendChild(pageBtn);
  }

  function addEllipsis() {
    const pageNumbers = document.querySelector('.page-numbers');
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.style.cssText = `
      padding: 8px 12px;
      color: var(--font-color);
      opacity: 0.5;
    `;
    pageNumbers.appendChild(ellipsis);
  }

  // 初始化分页
  if (allItems.length > itemsPerPage) {
    createPagination();
    showPage(1);
  }
}
