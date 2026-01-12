/**
 * 计划清单认证模块
 * 处理登录/注册 UI 和认证逻辑
 */

const PlanAuth = (function() {
  let authModal = null;
  let currentTab = 'login';

  /**
   * 初始化认证模块
   */
  function init() {
    // 检查 URL 中的 token（GitHub OAuth 回调）
    checkOAuthCallback();

    // 创建认证模态框
    createAuthModal();

    // 监听登出事件
    window.addEventListener('plan:logout', handleLogout);

    // 如果已登录，获取最新用户信息
    if (PlanAPI.isLoggedIn()) {
      PlanAPI.getMe().then(result => {
        if (result.success) {
          window.dispatchEvent(new CustomEvent('plan:login', { detail: result.data.user }));
        }
      });
    }
  }

  /**
   * 检查 OAuth 回调
   */
  function checkOAuthCallback() {
    // 检查 URL hash 中的 token
    const hash = window.location.hash;
    if (hash.startsWith('#token=')) {
      const token = hash.substring(7);
      PlanAPI.setToken(token);

      // 清除 URL 中的 token
      history.replaceState(null, '', window.location.pathname);

      // 获取用户信息
      PlanAPI.getMe().then(result => {
        if (result.success) {
          showToast('登录成功！', 'success');
          window.dispatchEvent(new CustomEvent('plan:login', { detail: result.data.user }));
        }
      });
    }

    // 检查错误
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      showToast('登录失败: ' + error, 'error');
      // 清除 URL 参数
      history.replaceState(null, '', window.location.pathname);
    }
  }

  /**
   * 创建认证模态框
   */
  function createAuthModal() {
    const modalHtml = `
      <div class="plan-modal" id="auth-modal" style="display: none;">
        <div class="plan-modal-overlay"></div>
        <div class="plan-modal-content">
          <div class="plan-modal-header">
            <h3 id="auth-modal-title">登录</h3>
            <button class="plan-modal-close" onclick="PlanAuth.hideModal()">&times;</button>
          </div>
          <div class="plan-modal-body">
            <!-- Tab 切换 -->
            <div class="auth-tabs">
              <button class="auth-tab active" data-tab="login" onclick="PlanAuth.switchTab('login')">登录</button>
              <button class="auth-tab" data-tab="register" onclick="PlanAuth.switchTab('register')">注册</button>
            </div>

            <!-- OAuth 按钮 -->
            <div class="oauth-buttons">
              <button class="oauth-btn github" onclick="PlanAuth.loginWithGithub()">
                <i class="fab fa-github"></i> GitHub 登录
              </button>
            </div>

            <div class="auth-divider">
              <span>或使用邮箱</span>
            </div>

            <!-- 登录表单 -->
            <form id="login-form" class="auth-form" onsubmit="return PlanAuth.handleLogin(event)">
              <div class="form-group">
                <input type="email" id="login-email" placeholder="邮箱" required>
              </div>
              <div class="form-group">
                <input type="password" id="login-password" placeholder="密码" required>
              </div>
              <button type="submit" class="auth-submit-btn">
                <span class="btn-text">登录</span>
                <span class="btn-loading" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i>
                </span>
              </button>
            </form>

            <!-- 注册表单 -->
            <form id="register-form" class="auth-form" style="display: none;" onsubmit="return PlanAuth.handleRegister(event)">
              <div class="form-group">
                <input type="text" id="register-username" placeholder="用户名">
              </div>
              <div class="form-group">
                <input type="email" id="register-email" placeholder="邮箱" required>
              </div>
              <div class="form-group">
                <input type="password" id="register-password" placeholder="密码 (至少6位)" required minlength="6">
              </div>
              <button type="submit" class="auth-submit-btn">
                <span class="btn-text">注册</span>
                <span class="btn-loading" style="display: none;">
                  <i class="fas fa-spinner fa-spin"></i>
                </span>
              </button>
            </form>

            <!-- 错误提示 -->
            <div id="auth-error" class="auth-error" style="display: none;"></div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    authModal = document.getElementById('auth-modal');

    // 点击遮罩关闭
    authModal.querySelector('.plan-modal-overlay').addEventListener('click', hideModal);
  }

  /**
   * 显示模态框
   */
  function showModal(tab = 'login') {
    if (!authModal) return;
    switchTab(tab);
    authModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  /**
   * 隐藏模态框
   */
  function hideModal() {
    if (!authModal) return;
    authModal.style.display = 'none';
    document.body.style.overflow = '';
    clearError();
  }

  /**
   * 切换 Tab
   */
  function switchTab(tab) {
    currentTab = tab;

    // 更新 Tab 按钮状态
    document.querySelectorAll('.auth-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // 更新标题
    document.getElementById('auth-modal-title').textContent = tab === 'login' ? '登录' : '注册';

    // 显示/隐藏表单
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';

    clearError();
  }

  /**
   * 处理登录
   */
  async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = event.target.querySelector('.auth-submit-btn');

    setLoading(btn, true);
    clearError();

    const result = await PlanAPI.login(email, password);

    setLoading(btn, false);

    if (result.success) {
      hideModal();
      showToast('登录成功！', 'success');
      window.dispatchEvent(new CustomEvent('plan:login', { detail: result.data.user }));
    } else {
      showError(result.error?.message || '登录失败');
    }

    return false;
  }

  /**
   * 处理注册
   */
  async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const btn = event.target.querySelector('.auth-submit-btn');

    setLoading(btn, true);
    clearError();

    const result = await PlanAPI.register(email, password, username);

    setLoading(btn, false);

    if (result.success) {
      hideModal();
      showToast('注册成功！', 'success');
      window.dispatchEvent(new CustomEvent('plan:login', { detail: result.data.user }));
    } else {
      showError(result.error?.message || '注册失败');
    }

    return false;
  }

  /**
   * GitHub 登录
   */
  function loginWithGithub() {
    PlanAPI.loginWithGithub();
  }

  /**
   * 处理登出
   */
  function handleLogout() {
    showToast('已退出登录', 'info');
  }

  /**
   * 设置按钮加载状态
   */
  function setLoading(btn, loading) {
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-loading');
    btn.disabled = loading;
    text.style.display = loading ? 'none' : 'inline';
    spinner.style.display = loading ? 'inline' : 'none';
  }

  /**
   * 显示错误
   */
  function showError(message) {
    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  /**
   * 清除错误
   */
  function clearError() {
    const errorEl = document.getElementById('auth-error');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  }

  /**
   * 显示 Toast 提示
   */
  function showToast(message, type = 'info') {
    // 移除已有的 toast
    const existingToast = document.querySelector('.plan-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle'
    };

    const toast = document.createElement('div');
    toast.className = `plan-toast plan-toast-${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type]}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // 显示动画
    setTimeout(() => toast.classList.add('show'), 10);

    // 自动隐藏
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // 公开 API
  return {
    init,
    showModal,
    hideModal,
    switchTab,
    handleLogin,
    handleRegister,
    loginWithGithub,
    showToast
  };
})();

// 导出到全局
window.PlanAuth = PlanAuth;
