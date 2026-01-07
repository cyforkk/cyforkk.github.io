---
title: 每日计划
date: 2024-01-05 20:00:00
type: "plan"
comments: true
aside: false
---

<style>
.plan-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.plan-card {
  flex: 1;
  min-width: 280px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 15px 20px;
  border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow);
  transition: transform 0.3s, box-shadow 0.3s;
}

.plan-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.plan-title i {
  margin-right: 8px;
  font-size: 1.1em;
}

.progress-box {
  background: rgba(128,128,128, 0.15);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.plan-meta {
  font-size: 12px;
  color: var(--font-color);
  opacity: 0.7;
  display: flex;
  justify-content: space-between;
}

.section-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 40px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--theme-color);
  display: inline-block;
}

/* Timeline 美化样式 */
.timeline {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 30px;
  margin: 30px 0;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #00d4ff, #090979);
}

.timeline-item-content ul {
  list-style: none !important;
  padding-left: 0 !important;
  margin: 0;
}

.timeline-item-content li {
  position: relative;
  margin: 8px 0;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 12px 20px 12px 45px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.timeline-item-content li:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #00d4ff;
}

.timeline-item-content li::before {
  content: '✓';
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f0f0f0;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #999;
  font-weight: bold;
  transition: all 0.3s ease;
}

.timeline-item-content li:has(input[type="checkbox"]:checked)::before {
  background: #e8f5e8;
  border-color: #4CAF50;
  color: #4CAF50;
}

.timeline-item-content li:has(input[type="checkbox"]:not(:checked))::before {
  content: '';
  background: #f8f8f8;
  border-color: #ccc;
}

.timeline-item-content input[type="checkbox"] {
  display: none;
}

.timeline-item-title {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 15px;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-item-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #00d4ff, #090979);
  border-radius: 2px;
}

.timeline-item-title .item-circle {
  color: var(--font-color);
  font-weight: 600;
  font-size: 1.1em;
  margin-left: 15px;
}

.timeline-item-title .toggle-btn {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #090979);
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.timeline-item-title .toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
}

.timeline-item-title.collapsed .toggle-btn {
  transform: rotate(-90deg);
  background: linear-gradient(135deg, #ff6b6b, #feca57);
}

.timeline-item-title.collapsed .toggle-btn:hover {
  transform: rotate(-90deg) scale(1.1);
}

.timeline-item-content {
  transition: all 0.3s ease;
  overflow: hidden;
}

.timeline-item-content.collapsed {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
}

.timeline.blue {
  background: var(--card-bg);
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
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
    
    // 上一页按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '← 上一页';
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
    paginationDiv.appendChild(pageNumbers);
    
    // 下一页按钮
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '下一页 →';
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
    
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'page-number';
      pageBtn.textContent = i;
      if (i === currentPage) pageBtn.classList.add('active');
      
      pageBtn.onclick = () => {
        currentPage = i;
        showPage(currentPage);
        updatePagination();
      };
      
      pageNumbers.appendChild(pageBtn);
    }
    
    // 更新按钮状态
    document.querySelector('.page-btn').disabled = currentPage === 1;
    document.querySelectorAll('.page-btn')[1].disabled = currentPage === totalPages;
  }
  
  // 初始化分页
  if (allItems.length > itemsPerPage) {
    createPagination();
    showPage(1);
  }
});
</script>



<hr>

{% timeline 每日计划,blue %}

<!-- timeline 2026-01-07 -->
- [x] 完成每日计划页面
- [x] 完成图片统计页面
<!-- endtimeline -->



{% endtimeline %}