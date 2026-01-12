# 每日计划清单系统 - 功能实现文档

## 功能概述

为 Hexo Butterfly 博客实现的生产级每日计划清单系统，具备用户认证、数据隔离、任务管理、自动过期等功能。

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    用户浏览器 (Hexo 博客)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ plan-api.js │  │plan-auth.js │  │ plan-app.js │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Vercel Serverless Functions                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ /auth/*  │  │ /plans/* │  │ /tasks/* │  │ /cron/*  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Supabase Client
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (PostgreSQL)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  users   │  │  plans   │  │  tasks   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈

- **后端**: Vercel Serverless Functions (Node.js)
- **数据库**: Supabase (PostgreSQL)
- **认证**: JWT + GitHub OAuth
- **前端**: 原生 JavaScript，集成到 Hexo 博客

## 实现的功能

### 1. 用户认证系统

#### 1.1 邮箱注册/登录
- 邮箱格式验证
- 密码强度要求 (至少6位)
- bcrypt 密码加密
- JWT Token 生成 (7天有效期)

#### 1.2 GitHub OAuth 登录
- OAuth 2.0 授权流程
- 自动创建/关联用户
- Token 通过 URL hash 传递给前端

#### 1.3 认证中间件
- Bearer Token 验证
- 自动刷新用户信息
- 401 自动登出

### 2. 计划管理

#### 2.1 计划 CRUD
- 创建每日计划 (每天只能有一个)
- 查看计划列表 (支持分页、日期筛选)
- 更新计划标题
- 删除计划 (级联删除任务)

#### 2.2 今日计划
- 自动获取当天计划
- 包含所有关联任务
- 计算完成进度

### 3. 任务管理

#### 3.1 任务 CRUD
- 创建任务 (关联到计划)
- 设置优先级 (1-5)
- 更新任务内容
- 删除任务

#### 3.2 任务状态流转
```
pending (待开始)
    │
    ├──→ in_progress (进行中)
    │         │
    │         ├──→ completed (已完成)
    │         │
    │         └──→ failed (已失败)
    │
    └──→ completed (直接完成)
```

#### 3.3 状态统计
- 实时更新计划的任务统计
- 计算完成率
- 更新用户连续天数

### 4. 自动过期机制

#### 4.1 Vercel Cron 定时任务
- 每日 00:00 (北京时间) 执行
- 检查所有过期未完成任务
- 批量标记为 failed

#### 4.2 过期处理逻辑
- 更新任务状态
- 更新计划统计
- 重置用户连续天数

### 5. 前端界面

#### 5.1 游客页面
- 功能介绍
- 登录/注册入口
- GitHub 快捷登录

#### 5.2 用户主页
- 日期显示卡片
- 快捷操作按钮
- 今日统计面板
- 任务列表

#### 5.3 任务交互
- 添加任务表单
- 复选框切换完成状态
- 开始任务按钮
- 删除任务按钮
- 进度条显示

#### 5.4 认证模态框
- Tab 切换登录/注册
- GitHub OAuth 按钮
- 邮箱表单
- 错误提示
- 加载状态

## 文件结构

### 后端 (plan-api/)

```
plan-api/
├── api/
│   ├── auth/
│   │   ├── register.js      # 邮箱注册
│   │   ├── login.js         # 邮箱登录
│   │   ├── me.js            # 获取当前用户
│   │   └── github/
│   │       ├── index.js     # GitHub OAuth 跳转
│   │       └── callback.js  # GitHub OAuth 回调
│   ├── plans/
│   │   ├── index.js         # 计划列表/创建
│   │   ├── [id].js          # 计划详情/更新/删除
│   │   └── today.js         # 今日计划
│   ├── tasks/
│   │   ├── index.js         # 任务列表/创建
│   │   └── [id].js          # 任务详情/更新/删除
│   └── cron/
│       └── expire-tasks.js  # 过期任务处理
├── lib/
│   ├── db.js                # Supabase 数据库连接
│   ├── auth.js              # JWT/密码工具
│   └── utils.js             # 通用工具函数
├── package.json
├── vercel.json
├── .env.example
└── README.md
```

### 前端 (cyforkk/source/)

```
source/
├── js/
│   ├── plan-api.js          # API 请求封装
│   ├── plan-auth.js         # 认证逻辑和 UI
│   └── plan-app.js          # 主应用逻辑
├── css/
│   └── plan-app.css         # 应用样式
└── plan/
    └── index.md             # 计划页面
```

## 数据库设计 (Supabase PostgreSQL)

### users 表

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100),
  password_hash VARCHAR(255),
  avatar TEXT,
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  stats_total_plans INTEGER DEFAULT 0,
  stats_completed_plans INTEGER DEFAULT 0,
  stats_current_streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### plans 表

```sql
CREATE TABLE plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  stats_total INTEGER DEFAULT 0,
  stats_pending INTEGER DEFAULT 0,
  stats_in_progress INTEGER DEFAULT 0,
  stats_completed INTEGER DEFAULT 0,
  stats_failed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

### tasks 表

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  priority INTEGER DEFAULT 3,
  status VARCHAR(20) DEFAULT 'pending',
  deadline TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider, provider_id);
CREATE INDEX idx_plans_user_date ON plans(user_id, date);
CREATE INDEX idx_tasks_plan ON tasks(plan_id);
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_status_deadline ON tasks(status, deadline);
```

## API 接口

### 认证 API
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 邮箱注册 |
| POST | `/api/auth/login` | 邮箱登录 |
| GET | `/api/auth/me` | 获取当前用户 |
| GET | `/api/auth/github` | GitHub OAuth 跳转 |
| GET | `/api/auth/github/callback` | GitHub OAuth 回调 |

### 计划 API
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/plans` | 获取计划列表 |
| POST | `/api/plans` | 创建计划 |
| GET | `/api/plans/today` | 获取今日计划 |
| GET | `/api/plans/:id` | 获取计划详情 |
| PUT | `/api/plans/:id` | 更新计划 |
| DELETE | `/api/plans/:id` | 删除计划 |

### 任务 API
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/tasks` | 获取任务列表 |
| POST | `/api/tasks` | 创建任务 |
| GET | `/api/tasks/:id` | 获取任务详情 |
| PUT | `/api/tasks/:id` | 更新任务 |
| DELETE | `/api/tasks/:id` | 删除任务 |

---

## 遇到的 Bug 和解决方案

### Bug 1: MongoDB 依赖导致 500 错误

**问题描述**:
部署到 Vercel 后，所有 API 返回 500 错误。

**原因**:
`lib/utils.js` 文件中还在引用 MongoDB 的 `ObjectId`：
```javascript
const { ObjectId } = require('mongodb');
```
但 `package.json` 中已经移除了 `mongodb` 依赖（改用 Supabase）。

**解决方案**:
1. 删除 MongoDB 引用
2. 新增 UUID 验证函数替代 ObjectId 验证：
```javascript
function isValidUUID(id) {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
```

---

### Bug 2: GitHub OAuth 路径引用错误

**问题描述**:
点击 GitHub 登录按钮后返回 500 错误。

**原因**:
`api/auth/github/index.js` 文件中的 require 路径错误：
```javascript
// 错误 - 只有两层
const { handleCors } = require('../../lib/utils');

// 正确 - 需要三层目录
const { handleCors } = require('../../../lib/utils');
```

**解决方案**:
修正 require 路径为 `../../../lib/utils`。

---

### Bug 3: GitHub OAuth redirect_uri 不匹配

**问题描述**:
GitHub 授权页面显示 "The redirect_uri is not associated with this application"。

**原因**:
1. 用户在 GitHub Apps 而不是 OAuth Apps 中创建了应用
2. API 使用 `VERCEL_URL` 环境变量，返回的是带部署 ID 的 URL（如 `plan-api-xxx-xxx.vercel.app`），与 GitHub 配置的回调地址不匹配

**解决方案**:
1. 在 GitHub OAuth Apps 中创建应用（不是 GitHub Apps）
2. 修改 API 使用固定的 URL：
```javascript
const API_URL = process.env.API_URL || 'https://plan-api.vercel.app';
```

---

### Bug 4: 登录后显示旧的计划数据

**问题描述**:
GitHub 登录成功后，页面显示的是旧的静态计划数据（来自 `plans.yml`），而不是新的动态应用界面。

**原因**:
Butterfly 主题有自己的计划功能，会读取 `source/_data/plans.yml` 文件并渲染静态内容。

**解决方案**:
重命名或删除旧的数据文件：
```bash
mv source/_data/plans.yml source/_data/plans.yml.bak
```

---

### Bug 5: PWA 缓存导致旧文件被加载

**问题描述**:
部署新版本后，浏览器仍然加载旧的 `plan.js` 文件，Console 显示 `PlanAPI is not defined`。

**原因**:
博客启用了 PWA (Service Worker)，旧的 JavaScript 文件被缓存。

**解决方案**:
清除 Service Worker 和缓存：
1. 打开开发者工具 (F12)
2. Application → Service Workers → Unregister
3. Application → Storage → Clear site data
4. 刷新页面

或在 Console 中执行：
```javascript
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
location.reload();
```

---

### Bug 6: vercel.json 配置冲突

**问题描述**:
Vercel 部署失败，错误信息：
```
If `rewrites`, `redirects`, `headers`, `cleanUrls` or `trailingSlash` are used, then `routes` cannot be present.
```

**原因**:
`vercel.json` 中同时使用了 `routes` 和 `headers` 配置，这两者不能共存。

**解决方案**:
简化 `vercel.json`，只保留必要的配置：
```json
{
  "version": 2,
  "crons": [
    {
      "path": "/api/cron/expire-tasks",
      "schedule": "0 16 * * *"
    }
  ]
}
```

---

### Bug 7: Vercel 找不到 GitHub 仓库

**问题描述**:
在 Vercel 导入项目时，列表中找不到 `plan-api` 仓库。

**原因**:
Vercel GitHub App 没有访问该仓库的权限。

**解决方案**:
1. 进入 GitHub Settings → Integrations → Applications
2. 找到 Vercel，点击 Configure
3. 在 Repository access 中添加 `plan-api` 仓库
4. 返回 Vercel 刷新页面

---

## 部署配置

### Vercel 环境变量
| 变量名 | 说明 |
|--------|------|
| `SUPABASE_URL` | Supabase 项目 URL |
| `SUPABASE_SERVICE_KEY` | Supabase service_role key |
| `JWT_SECRET` | JWT 签名密钥 |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret |
| `FRONTEND_URL` | 前端地址 (https://cyforkk.top) |

### GitHub OAuth 配置
- **Application name**: 每日计划
- **Homepage URL**: https://cyforkk.top
- **Authorization callback URL**: https://plan-api.vercel.app/api/auth/github/callback

**注意**: 必须在 OAuth Apps 中创建，不是 GitHub Apps！

---

## 部署检查清单

- [x] Supabase 项目已创建
- [x] 数据库表已创建 (users, plans, tasks)
- [x] 数据库索引已创建
- [x] GitHub OAuth App 已创建 (在 OAuth Apps 中)
- [x] Vercel 项目已创建
- [x] 环境变量已配置:
  - [x] SUPABASE_URL
  - [x] SUPABASE_SERVICE_KEY
  - [x] JWT_SECRET
  - [x] GITHUB_CLIENT_ID
  - [x] GITHUB_CLIENT_SECRET
  - [x] FRONTEND_URL
- [x] 前端 API 地址已更新 (plan-api.js)
- [x] 旧的 plans.yml 已移除
- [x] 博客已重新部署
- [ ] 清除浏览器 PWA 缓存

---

## 已实现的新功能

### 历史记录功能 (2026-01-12)

#### 功能描述
用户可以查看过去的计划历史记录，包括每日计划的完成情况、任务统计等。

#### 实现内容

1. **历史记录列表**
   - 显示最近 30 天的计划记录
   - 每条记录显示日期、任务数量、完成数、失败数
   - 圆环进度条显示完成率
   - 根据完成率显示不同状态图标和颜色：
     - 100%: 绿色 (perfect)
     - 80%+: 浅绿色 (good)
     - 50%+: 橙色 (normal)
     - <50%: 红色 (poor)
   - 今日计划有特殊标记

2. **计划详情查看**
   - 点击历史记录项可查看详情
   - 显示日期、总任务数、已完成、已失败、完成率
   - 显示该计划下所有任务列表
   - 任务显示状态图标、内容、优先级

#### 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `source/js/plan-app.js` | 添加 `showHistory()`, `renderHistoryItem()`, `closeHistory()`, `viewPlanDetail()`, `renderPlanDetail()`, `closeDetail()` 函数 |
| `source/css/plan-app.css` | 添加历史记录模态框样式、计划详情模态框样式、进度环样式、响应式适配 |

#### 使用的 API

- `GET /api/plans?limit=30` - 获取计划列表
- `GET /api/plans/:id` - 获取计划详情（包含任务列表）

---

## 后续优化方向

1. 添加模板功能，支持从模板创建计划
2. 添加统计页面，展示完成率趋势
3. 添加任务提醒功能
4. 支持任务拖拽排序
5. 添加数据导出功能
6. 优化 PWA 缓存策略，避免旧文件缓存问题
7. 历史记录分页加载
8. 历史记录日期筛选
