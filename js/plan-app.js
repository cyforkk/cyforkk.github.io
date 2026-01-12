/**
 * 计划清单主应用
 * 处理页面渲染和交互逻辑
 */

const PlanApp = (function() {
  // 状态
  let currentPlan = null;
  let currentTasks = [];
  let isLoading = false;

  // 状态配置
  const STATUS_CONFIG = {
    pending: { label: '待开始', icon: 'fa-clock', color: '#909399' },
    in_progress: { label: '进行中', icon: 'fa-spinner', color: '#E6A23C' },
    completed: { label: '已完成', icon: 'fa-check-circle', color: '#67C23A' },
    failed: { label: '已失败', icon: 'fa-times-circle', color: '#F56C6C' }
  };

  // 优先级配置
  const PRIORITY_CONFIG = {
    1: { label: '最低', color: '#909399' },
    2: { label: '较低', color: '#67C23A' },
    3: { label: '普通', color: '#409EFF' },
    4: { label: '较高', color: '#E6A23C' },
    5: { label: '最高', color: '#F56C6C' }
  };

  /**
   * 初始化应用
   */
  function init() {
    // 初始化认证模块
    PlanAuth.init();

    // 监听登录/登出事件
    window.addEventListener('plan:login', handleLogin);
    window.addEventListener('plan:logout', handleLogout);

    // 渲染初始 UI
    renderApp();

    // 如果已登录，加载数据
    if (PlanAPI.isLoggedIn()) {
      loadTodayPlan();
    }
  }

  /**
   * 渲染应用主体
   */
  function renderApp() {
    const container = document.querySelector('.plan-app-container');
    if (!container) return;

    const isLoggedIn = PlanAPI.isLoggedIn();
    const user = PlanAPI.getUser();

    container.innerHTML = `
      <!-- 头部 -->
      <div class="plan-header">
        <div class="plan-header-left">
          <h2 class="plan-title">
            <i class="fas fa-tasks"></i> 每日计划
          </h2>
        </div>
        <div class="plan-header-right">
          ${isLoggedIn ? renderUserInfo(user) : renderLoginButton()}
        </div>
      </div>

      <!-- 主体内容 -->
      <div class="plan-body">
        ${isLoggedIn ? renderMainContent() : renderGuestContent()}
      </div>
    `;

    // 绑定事件
    bindEvents();
  }

  /**
   * 渲染用户信息
   */
  function renderUserInfo(user) {
    return `
      <div class="plan-user-info">
        <img src="${user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=User'}"
             alt="avatar" class="plan-user-avatar">
        <span class="plan-user-name">${user?.username || '用户'}</span>
        <button class="plan-logout-btn" onclick="PlanApp.logout()">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    `;
  }

  /**
   * 渲染登录按钮
   */
  function renderLoginButton() {
    return `
      <button class="plan-login-btn" onclick="PlanAuth.showModal()">
        <i class="fas fa-sign-in-alt"></i> 登录
      </button>
    `;
  }

  /**
   * 渲染游客内容
   */
  function renderGuestContent() {
    return `
      <div class="plan-guest">
        <div class="plan-guest-icon">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <h3>开始管理你的每日计划</h3>
        <p>登录后可以创建、管理和追踪你的每日任务</p>
        <div class="plan-guest-features">
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>任务状态追踪</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-clock"></i>
            <span>自动过期提醒</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-chart-line"></i>
            <span>完成率统计</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-copy"></i>
            <span>模板复刻</span>
          </div>
        </div>
        <button class="plan-start-btn" onclick="PlanAuth.showModal()">
          <i class="fab fa-github"></i> GitHub 登录开始使用
        </button>
        <button class="plan-start-btn secondary" onclick="PlanAuth.showModal('register')">
          <i class="fas fa-envelope"></i> 邮箱注册
        </button>
      </div>
    `;
  }

  /**
   * 渲染主内容区
   */
  function renderMainContent() {
    return `
      <div class="plan-main">
        <!-- 左侧边栏 -->
        <div class="plan-sidebar">
          <!-- 日期显示 -->
          <div class="plan-date-card">
            <div class="date-display">
              <span class="date-day">${new Date().getDate()}</span>
              <div class="date-info">
                <span class="date-month">${new Date().toLocaleDateString('zh-CN', { month: 'long' })}</span>
                <span class="date-weekday">${new Date().toLocaleDateString('zh-CN', { weekday: 'long' })}</span>
              </div>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="plan-actions-card">
            <h4><i class="fas fa-bolt"></i> 快捷操作</h4>
            <button class="action-btn" onclick="PlanApp.createTodayPlan()">
              <i class="fas fa-plus"></i> 创建今日计划
            </button>
            <button class="action-btn secondary" onclick="PlanApp.showHistory()">
              <i class="fas fa-history"></i> 历史记录
            </button>
          </div>

          <!-- 统计卡片 -->
          <div class="plan-stats-card">
            <h4><i class="fas fa-chart-pie"></i> 今日统计</h4>
            <div class="stats-content" id="stats-content">
              <div class="stat-item">
                <span class="stat-value" id="stat-total">0</span>
                <span class="stat-label">总任务</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="stat-completed">0</span>
                <span class="stat-label">已完成</span>
              </div>
              <div class="stat-item">
                <span class="stat-value" id="stat-rate">0%</span>
                <span class="stat-label">完成率</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧任务区 -->
        <div class="plan-content">
          <div class="plan-content-header">
            <h3><i class="fas fa-list-check"></i> 今日任务</h3>
            <button class="add-task-btn" onclick="PlanApp.showAddTaskForm()" id="add-task-btn" style="display: none;">
              <i class="fas fa-plus"></i> 添加任务
            </button>
          </div>

          <!-- 进度条 -->
          <div class="plan-progress" id="plan-progress" style="display: none;">
            <div class="progress-bar">
              <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
            </div>
            <span class="progress-text" id="progress-text">0%</span>
          </div>

          <!-- 任务列表 -->
          <div class="plan-task-list" id="task-list">
            <div class="plan-loading">
              <i class="fas fa-spinner fa-spin"></i> 加载中...
            </div>
          </div>

          <!-- 添加任务表单 -->
          <div class="add-task-form" id="add-task-form" style="display: none;">
            <input type="text" id="new-task-input" placeholder="输入任务内容..."
                   onkeypress="if(event.key==='Enter') PlanApp.addTask()">
            <select id="new-task-priority">
              <option value="3">普通优先级</option>
              <option value="5">最高</option>
              <option value="4">较高</option>
              <option value="2">较低</option>
              <option value="1">最低</option>
            </select>
            <button onclick="PlanApp.addTask()">
              <i class="fas fa-plus"></i>
            </button>
            <button class="cancel-btn" onclick="PlanApp.hideAddTaskForm()">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 绑定事件
   */
  function bindEvents() {
    // 可以在这里添加更多事件绑定
  }

  /**
   * 加载今日计划
   */
  async function loadTodayPlan() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    taskList.innerHTML = '<div class="plan-loading"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';

    const result = await PlanAPI.getTodayPlan();

    if (result.success) {
      currentPlan = result.data.plan;
      currentTasks = result.data.tasks || [];

      if (currentPlan) {
        renderTasks();
        updateStats();
        document.getElementById('add-task-btn').style.display = 'inline-flex';
        document.getElementById('plan-progress').style.display = 'flex';
      } else {
        renderNoPlan();
      }
    } else {
      taskList.innerHTML = `
        <div class="plan-error">
          <i class="fas fa-exclamation-circle"></i>
          <p>加载失败: ${result.error?.message || '未知错误'}</p>
          <button onclick="PlanApp.loadTodayPlan()">重试</button>
        </div>
      `;
    }
  }

  /**
   * 渲染无计划状态
   */
  function renderNoPlan() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = `
      <div class="plan-empty">
        <i class="fas fa-calendar-plus"></i>
        <p>今天还没有计划</p>
        <button onclick="PlanApp.createTodayPlan()">
          <i class="fas fa-plus"></i> 创建今日计划
        </button>
      </div>
    `;
  }

  /**
   * 渲染任务列表
   */
  function renderTasks() {
    const taskList = document.getElementById('task-list');

    if (currentTasks.length === 0) {
      taskList.innerHTML = `
        <div class="plan-empty">
          <i class="fas fa-inbox"></i>
          <p>暂无任务，点击上方添加</p>
        </div>
      `;
      return;
    }

    // 按状态和优先级排序
    const sortedTasks = [...currentTasks].sort((a, b) => {
      const statusOrder = { in_progress: 0, pending: 1, completed: 2, failed: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.priority - a.priority;
    });

    taskList.innerHTML = sortedTasks.map(task => renderTaskItem(task)).join('');
  }

  /**
   * 渲染单个任务项
   */
  function renderTaskItem(task) {
    const status = STATUS_CONFIG[task.status];
    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG[3];
    const isCompleted = task.status === 'completed';
    const isFailed = task.status === 'failed';

    return `
      <div class="task-item ${task.status}" data-id="${task._id}">
        <div class="task-checkbox">
          <input type="checkbox"
                 id="task-${task._id}"
                 ${isCompleted ? 'checked' : ''}
                 ${isFailed ? 'disabled' : ''}
                 onchange="PlanApp.toggleTask('${task._id}', this.checked)">
          <label for="task-${task._id}"></label>
        </div>
        <div class="task-content">
          <span class="task-text ${isCompleted || isFailed ? 'done' : ''}">${escapeHtml(task.content)}</span>
          <div class="task-meta">
            <span class="task-status" style="color: ${status.color}">
              <i class="fas ${status.icon}"></i> ${status.label}
            </span>
            <span class="task-priority" style="background: ${priority.color}">
              P${task.priority}
            </span>
          </div>
        </div>
        <div class="task-actions">
          ${!isCompleted && !isFailed ? `
            <button class="task-action-btn edit" onclick="PlanApp.showEditTask('${task._id}')" title="编辑">
              <i class="fas fa-edit"></i>
            </button>
            <button class="task-action-btn start" onclick="PlanApp.startTask('${task._id}')"
                    title="开始" ${task.status === 'in_progress' ? 'style="display:none"' : ''}>
              <i class="fas fa-play"></i>
            </button>
          ` : ''}
          <button class="task-action-btn delete" onclick="PlanApp.deleteTask('${task._id}')" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * 更新统计
   */
  function updateStats() {
    const total = currentTasks.length;
    const completed = currentTasks.filter(t => t.status === 'completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-rate').textContent = rate + '%';

    // 更新进度条
    document.getElementById('progress-fill').style.width = rate + '%';
    document.getElementById('progress-text').textContent = `${completed}/${total} (${rate}%)`;
  }

  /**
   * 创建今日计划
   */
  async function createTodayPlan() {
    if (currentPlan) {
      PlanAuth.showToast('今日计划已存在', 'warning');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const result = await PlanAPI.createPlan({ date: today });

    if (result.success) {
      currentPlan = result.data.plan;
      currentTasks = [];
      PlanAuth.showToast('计划创建成功！', 'success');
      renderTasks();
      updateStats();
      document.getElementById('add-task-btn').style.display = 'inline-flex';
      document.getElementById('plan-progress').style.display = 'flex';
    } else {
      PlanAuth.showToast(result.error?.message || '创建失败', 'error');
    }
  }

  /**
   * 显示添加任务表单
   */
  function showAddTaskForm() {
    document.getElementById('add-task-form').style.display = 'flex';
    document.getElementById('new-task-input').focus();
  }

  /**
   * 隐藏添加任务表单
   */
  function hideAddTaskForm() {
    document.getElementById('add-task-form').style.display = 'none';
    document.getElementById('new-task-input').value = '';
  }

  /**
   * 添加任务
   */
  async function addTask() {
    const input = document.getElementById('new-task-input');
    const prioritySelect = document.getElementById('new-task-priority');
    const content = input.value.trim();

    if (!content) {
      PlanAuth.showToast('请输入任务内容', 'warning');
      return;
    }

    if (!currentPlan) {
      PlanAuth.showToast('请先创建计划', 'warning');
      return;
    }

    const result = await PlanAPI.createTask({
      planId: currentPlan._id,
      content,
      priority: parseInt(prioritySelect.value)
    });

    if (result.success) {
      currentTasks.push(result.data.task);
      renderTasks();
      updateStats();
      hideAddTaskForm();
      PlanAuth.showToast('任务添加成功！', 'success');
    } else {
      PlanAuth.showToast(result.error?.message || '添加失败', 'error');
    }
  }

  /**
   * 切换任务完成状态
   */
  async function toggleTask(taskId, checked) {
    const newStatus = checked ? 'completed' : 'pending';
    const result = await PlanAPI.updateTaskStatus(taskId, newStatus);

    if (result.success) {
      const task = currentTasks.find(t => t._id === taskId);
      if (task) {
        task.status = newStatus;
        task.completedAt = checked ? new Date().toISOString() : null;
      }
      renderTasks();
      updateStats();
    } else {
      PlanAuth.showToast(result.error?.message || '更新失败', 'error');
      // 恢复 checkbox 状态
      document.getElementById(`task-${taskId}`).checked = !checked;
    }
  }

  /**
   * 开始任务
   */
  async function startTask(taskId) {
    const result = await PlanAPI.updateTaskStatus(taskId, 'in_progress');

    if (result.success) {
      const task = currentTasks.find(t => t._id === taskId);
      if (task) {
        task.status = 'in_progress';
        task.startedAt = new Date().toISOString();
      }
      renderTasks();
      updateStats();
      PlanAuth.showToast('任务已开始！', 'success');
    } else {
      PlanAuth.showToast(result.error?.message || '更新失败', 'error');
    }
  }

  /**
   * 删除任务
   */
  async function deleteTask(taskId) {
    if (!confirm('确定要删除这个任务吗？')) return;

    const result = await PlanAPI.deleteTask(taskId);

    if (result.success) {
      currentTasks = currentTasks.filter(t => t._id !== taskId);
      renderTasks();
      updateStats();
      PlanAuth.showToast('任务已删除', 'success');
    } else {
      PlanAuth.showToast(result.error?.message || '删除失败', 'error');
    }
  }

  /**
   * 显示编辑任务模态框
   */
  function showEditTask(taskId) {
    const task = currentTasks.find(t => t._id === taskId);
    if (!task) {
      PlanAuth.showToast('任务不存在', 'error');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'plan-modal edit-task-modal';
    modal.innerHTML = `
      <div class="plan-modal-overlay" onclick="PlanApp.closeEditTask()"></div>
      <div class="plan-modal-content edit-task-modal-content">
        <div class="plan-modal-header">
          <h3><i class="fas fa-edit"></i> 编辑任务</h3>
          <button class="plan-modal-close" onclick="PlanApp.closeEditTask()">&times;</button>
        </div>
        <div class="plan-modal-body">
          <div class="edit-task-form">
            <div class="form-group">
              <label for="edit-task-content">任务内容</label>
              <input type="text" id="edit-task-content" value="${escapeHtml(task.content)}"
                     placeholder="输入任务内容..." maxlength="200">
            </div>
            <div class="form-group">
              <label for="edit-task-priority">优先级</label>
              <select id="edit-task-priority">
                <option value="5" ${task.priority === 5 ? 'selected' : ''}>P5 - 最高</option>
                <option value="4" ${task.priority === 4 ? 'selected' : ''}>P4 - 较高</option>
                <option value="3" ${task.priority === 3 ? 'selected' : ''}>P3 - 普通</option>
                <option value="2" ${task.priority === 2 ? 'selected' : ''}>P2 - 较低</option>
                <option value="1" ${task.priority === 1 ? 'selected' : ''}>P1 - 最低</option>
              </select>
            </div>
            <div class="form-group">
              <label>当前状态</label>
              <div class="edit-task-status">
                <span class="status-badge ${task.status}">${STATUS_CONFIG[task.status].label}</span>
              </div>
            </div>
            <div class="edit-task-actions">
              <button class="edit-cancel-btn" onclick="PlanApp.closeEditTask()">
                <i class="fas fa-times"></i> 取消
              </button>
              <button class="edit-save-btn" onclick="PlanApp.saveEditTask('${taskId}')">
                <i class="fas fa-check"></i> 保存
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // 聚焦到输入框
    setTimeout(() => {
      const input = document.getElementById('edit-task-content');
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);

    // 绑定回车键保存
    const contentInput = modal.querySelector('#edit-task-content');
    contentInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveEditTask(taskId);
      }
    });
  }

  /**
   * 关闭编辑任务模态框
   */
  function closeEditTask() {
    const modal = document.querySelector('.edit-task-modal');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * 保存编辑的任务
   */
  async function saveEditTask(taskId) {
    const contentInput = document.getElementById('edit-task-content');
    const prioritySelect = document.getElementById('edit-task-priority');

    const content = contentInput.value.trim();
    const priority = parseInt(prioritySelect.value);

    if (!content) {
      PlanAuth.showToast('任务内容不能为空', 'warning');
      contentInput.focus();
      return;
    }

    // 检查是否有变化
    const task = currentTasks.find(t => t._id === taskId);
    if (task && task.content === content && task.priority === priority) {
      closeEditTask();
      return;
    }

    // 禁用保存按钮
    const saveBtn = document.querySelector('.edit-save-btn');
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
    }

    const result = await PlanAPI.updateTask(taskId, { content, priority });

    if (result.success) {
      // 更新本地数据
      const taskIndex = currentTasks.findIndex(t => t._id === taskId);
      if (taskIndex !== -1) {
        currentTasks[taskIndex].content = content;
        currentTasks[taskIndex].priority = priority;
      }
      renderTasks();
      closeEditTask();
      PlanAuth.showToast('任务已更新', 'success');
    } else {
      PlanAuth.showToast(result.error?.message || '更新失败', 'error');
      // 恢复按钮
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> 保存';
      }
    }
  }

  /**
   * 显示历史记录
   */
  async function showHistory() {
    // 创建历史记录模态框
    const modal = document.createElement('div');
    modal.className = 'plan-modal history-modal';
    modal.innerHTML = `
      <div class="plan-modal-overlay" onclick="PlanApp.closeHistory()"></div>
      <div class="plan-modal-content history-modal-content">
        <div class="plan-modal-header">
          <h3><i class="fas fa-history"></i> 历史记录</h3>
          <button class="plan-modal-close" onclick="PlanApp.closeHistory()">&times;</button>
        </div>
        <div class="plan-modal-body">
          <div class="history-loading">
            <i class="fas fa-spinner fa-spin"></i> 加载中...
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // 加载历史数据
    const result = await PlanAPI.getPlans({ limit: 30 });
    const modalBody = modal.querySelector('.plan-modal-body');

    if (result.success) {
      const plans = result.data.plans || [];
      if (plans.length === 0) {
        modalBody.innerHTML = `
          <div class="history-empty">
            <i class="fas fa-inbox"></i>
            <p>暂无历史记录</p>
          </div>
        `;
      } else {
        modalBody.innerHTML = `
          <div class="history-list">
            ${plans.map(plan => renderHistoryItem(plan)).join('')}
          </div>
        `;
      }
    } else {
      modalBody.innerHTML = `
        <div class="history-error">
          <i class="fas fa-exclamation-circle"></i>
          <p>加载失败: ${result.error?.message || '未知错误'}</p>
        </div>
      `;
    }
  }

  /**
   * 渲染历史记录项
   */
  function renderHistoryItem(plan) {
    const date = new Date(plan.date);
    const dateStr = date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });

    const total = plan.stats_total || 0;
    const completed = plan.stats_completed || 0;
    const failed = plan.stats_failed || 0;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 判断状态
    let statusClass = 'normal';
    let statusIcon = 'fa-circle';
    if (rate === 100) {
      statusClass = 'perfect';
      statusIcon = 'fa-check-circle';
    } else if (rate >= 80) {
      statusClass = 'good';
      statusIcon = 'fa-smile';
    } else if (rate >= 50) {
      statusClass = 'normal';
      statusIcon = 'fa-meh';
    } else if (total > 0) {
      statusClass = 'poor';
      statusIcon = 'fa-frown';
    }

    // 判断是否是今天
    const today = new Date().toISOString().split('T')[0];
    const isToday = plan.date === today;

    return `
      <div class="history-item ${statusClass} ${isToday ? 'today' : ''}" onclick="PlanApp.viewPlanDetail('${plan.id}')">
        <div class="history-date">
          <span class="history-day">${date.getDate()}</span>
          <span class="history-month">${date.toLocaleDateString('zh-CN', { month: 'short' })}</span>
          ${isToday ? '<span class="history-today-badge">今天</span>' : ''}
        </div>
        <div class="history-info">
          <div class="history-title">${plan.title || dateStr}</div>
          <div class="history-stats">
            <span class="history-stat">
              <i class="fas fa-tasks"></i> ${total} 任务
            </span>
            <span class="history-stat completed">
              <i class="fas fa-check"></i> ${completed} 完成
            </span>
            ${failed > 0 ? `
              <span class="history-stat failed">
              <i class="fas fa-times"></i> ${failed} 失败
              </span>
            ` : ''}
          </div>
        </div>
        <div class="history-progress">
          <div class="history-progress-ring" style="--progress: ${rate}">
            <svg viewBox="0 0 36 36">
              <path class="history-progress-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="history-progress-fill"
                stroke-dasharray="${rate}, 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span class="history-progress-text">${rate}%</span>
          </div>
          <i class="fas ${statusIcon} history-status-icon"></i>
        </div>
      </div>
    `;
  }

  /**
   * 关闭历史记录
   */
  function closeHistory() {
    const modal = document.querySelector('.history-modal');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * 查看计划详情
   */
  async function viewPlanDetail(planId) {
    // 关闭历史列表
    closeHistory();

    // 创建详情模态框
    const modal = document.createElement('div');
    modal.className = 'plan-modal detail-modal';
    modal.innerHTML = `
      <div class="plan-modal-overlay" onclick="PlanApp.closeDetail()"></div>
      <div class="plan-modal-content detail-modal-content">
        <div class="plan-modal-header">
          <h3><i class="fas fa-calendar-day"></i> 计划详情</h3>
          <button class="plan-modal-close" onclick="PlanApp.closeDetail()">&times;</button>
        </div>
        <div class="plan-modal-body">
          <div class="history-loading">
            <i class="fas fa-spinner fa-spin"></i> 加载中...
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // 加载计划详情
    const result = await PlanAPI.getPlan(planId);
    const modalBody = modal.querySelector('.plan-modal-body');

    if (result.success) {
      const plan = result.data.plan;
      const tasks = result.data.tasks || [];
      modalBody.innerHTML = renderPlanDetail(plan, tasks);
    } else {
      modalBody.innerHTML = `
        <div class="history-error">
          <i class="fas fa-exclamation-circle"></i>
          <p>加载失败: ${result.error?.message || '未知错误'}</p>
        </div>
      `;
    }
  }

  /**
   * 渲染计划详情
   */
  function renderPlanDetail(plan, tasks) {
    const date = new Date(plan.date);
    const dateStr = date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const failed = tasks.filter(t => t.status === 'failed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `
      <div class="detail-header">
        <div class="detail-date">${dateStr}</div>
        <div class="detail-summary">
          <div class="detail-stat">
            <span class="detail-stat-value">${total}</span>
            <span class="detail-stat-label">总任务</span>
          </div>
          <div class="detail-stat completed">
            <span class="detail-stat-value">${completed}</span>
            <span class="detail-stat-label">已完成</span>
          </div>
          <div class="detail-stat failed">
            <span class="detail-stat-value">${failed}</span>
            <span class="detail-stat-label">已失败</span>
          </div>
          <div class="detail-stat rate">
            <span class="detail-stat-value">${rate}%</span>
            <span class="detail-stat-label">完成率</span>
          </div>
        </div>
      </div>
      <div class="detail-tasks">
        <h4><i class="fas fa-list"></i> 任务列表</h4>
        ${tasks.length === 0 ? '<p class="detail-empty">该计划没有任务</p>' : ''}
        ${tasks.map(task => {
          const status = STATUS_CONFIG[task.status];
          const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG[3];
          return `
            <div class="detail-task-item ${task.status}">
              <div class="detail-task-status" style="color: ${status.color}">
                <i class="fas ${status.icon}"></i>
              </div>
              <div class="detail-task-content">
                <span class="detail-task-text">${escapeHtml(task.content)}</span>
                <span class="detail-task-priority" style="background: ${priority.color}">P${task.priority}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="detail-actions">
        <button class="detail-back-btn" onclick="PlanApp.closeDetail(); PlanApp.showHistory();">
          <i class="fas fa-arrow-left"></i> 返回列表
        </button>
      </div>
    `;
  }

  /**
   * 关闭详情模态框
   */
  function closeDetail() {
    const modal = document.querySelector('.detail-modal');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * 处理登录
   */
  function handleLogin(event) {
    renderApp();
    loadTodayPlan();
  }

  /**
   * 处理登出
   */
  function handleLogout() {
    currentPlan = null;
    currentTasks = [];
    renderApp();
  }

  /**
   * 登出
   */
  function logout() {
    PlanAPI.logout();
  }

  /**
   * HTML 转义
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 公开 API
  return {
    init,
    loadTodayPlan,
    createTodayPlan,
    showAddTaskForm,
    hideAddTaskForm,
    addTask,
    toggleTask,
    startTask,
    deleteTask,
    showEditTask,
    closeEditTask,
    saveEditTask,
    showHistory,
    closeHistory,
    viewPlanDetail,
    closeDetail,
    logout
  };
})();

// 导出到全局
window.PlanApp = PlanApp;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否在计划页面
  if (document.querySelector('.plan-app-container')) {
    PlanApp.init();
  }
});
