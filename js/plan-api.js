/**
 * 计划清单 API 封装
 * 处理与后端 API 的所有通信
 */

const PlanAPI = (function() {
  // API 基础地址 - 部署后需要修改为实际地址
  const API_BASE = 'https://plan-api.vercel.app';

  // Token 存储键名
  const TOKEN_KEY = 'plan_token';
  const USER_KEY = 'plan_user';

  /**
   * 获取存储的 Token
   */
  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * 设置 Token
   */
  function setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  /**
   * 获取存储的用户信息
   */
  function getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * 设置用户信息
   */
  function setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }

  /**
   * 检查是否已登录
   */
  function isLoggedIn() {
    return !!getToken();
  }

  /**
   * 清除登录状态
   */
  function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * 发送 API 请求
   */
  async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const token = getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      // 如果 token 过期，清除登录状态
      if (response.status === 401) {
        clearAuth();
        window.dispatchEvent(new CustomEvent('plan:logout'));
      }

      return data;
    } catch (error) {
      console.error('API 请求错误:', error);
      return {
        success: false,
        error: { code: 'NETWORK_ERROR', message: '网络连接失败' }
      };
    }
  }

  // ==================== 认证 API ====================

  /**
   * 用户注册
   */
  async function register(email, password, username) {
    const result = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username })
    });

    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
    }

    return result;
  }

  /**
   * 用户登录
   */
  async function login(email, password) {
    const result = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (result.success) {
      setToken(result.data.token);
      setUser(result.data.user);
    }

    return result;
  }

  /**
   * GitHub 登录（跳转）
   */
  function loginWithGithub() {
    window.location.href = `${API_BASE}/api/auth/github`;
  }

  /**
   * 获取当前用户信息
   */
  async function getMe() {
    const result = await request('/api/auth/me');
    if (result.success) {
      setUser(result.data.user);
    }
    return result;
  }

  /**
   * 登出
   */
  function logout() {
    clearAuth();
    window.dispatchEvent(new CustomEvent('plan:logout'));
  }

  // ==================== 计划 API ====================

  /**
   * 获取计划列表
   */
  async function getPlans(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/api/plans${query ? '?' + query : ''}`);
  }

  /**
   * 获取今日计划
   */
  async function getTodayPlan() {
    return request('/api/plans/today');
  }

  /**
   * 获取计划详情
   */
  async function getPlan(id) {
    return request(`/api/plans/${id}`);
  }

  /**
   * 创建计划
   */
  async function createPlan(data) {
    return request('/api/plans', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * 更新计划
   */
  async function updatePlan(id, data) {
    return request(`/api/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * 删除计划
   */
  async function deletePlan(id) {
    return request(`/api/plans/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== 任务 API ====================

  /**
   * 获取任务列表
   */
  async function getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/api/tasks${query ? '?' + query : ''}`);
  }

  /**
   * 创建任务
   */
  async function createTask(data) {
    return request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * 更新任务
   */
  async function updateTask(id, data) {
    return request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * 删除任务
   */
  async function deleteTask(id) {
    return request(`/api/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * 更新任务状态
   */
  async function updateTaskStatus(id, status) {
    return updateTask(id, { status });
  }

  // ==================== 模板 API ====================

  /**
   * 获取模板列表
   */
  async function getTemplates() {
    return request('/api/templates');
  }

  /**
   * 创建模板
   */
  async function createTemplate(data) {
    return request('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * 使用模板创建计划
   */
  async function useTemplate(templateId, date) {
    return request(`/api/templates/${templateId}/use`, {
      method: 'POST',
      body: JSON.stringify({ date })
    });
  }

  // ==================== 统计 API ====================

  /**
   * 获取统计概览
   */
  async function getStatsOverview() {
    return request('/api/stats/overview');
  }

  // 公开 API
  return {
    // 配置
    API_BASE,

    // 认证状态
    getToken,
    setToken,
    getUser,
    setUser,
    isLoggedIn,
    clearAuth,

    // 认证
    register,
    login,
    loginWithGithub,
    getMe,
    logout,

    // 计划
    getPlans,
    getTodayPlan,
    getPlan,
    createPlan,
    updatePlan,
    deletePlan,

    // 任务
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,

    // 模板
    getTemplates,
    createTemplate,
    useTemplate,

    // 统计
    getStatsOverview
  };
})();

// 导出到全局
window.PlanAPI = PlanAPI;
