# Node.js Express MySQL Web Application

基于 Node.js + Express + MySQL 的全栈 Web 应用项目实践

## 项目概述

这是一个使用 Node.js、Express 框架和 MySQL 数据库构建的 Web 应用程序，支持用户认证、任务管理等功能。项目采用 MVC 架构模式，具备完整的前后端分离设计。
t
his is web application that use node.js express andm mysql. this application support user auth and task management. project adopt MVC archetecture and it have compelete 



This is a web application built using Node.js, Express framework, and MySQL database, supporting functions such as user authentication and task management. The project adopts the MVC architectural pattern and has a complete front-end and back-end separation design.
## 技术栈

### 后端技术
- **Node.js** - JavaScript 运行时环境
- **Express.js** - Web 应用框架
- **MySQL** - 关系型数据库
- **MongoDB** - NoSQL 数据库（可选配置）
- **JWT (JSON Web Tokens)** - 用户认证
- **Winston** - 日志管理
- **Consign** - 依赖注入和模块加载

### 前端技术
- **EJS** - 模板引擎
- **HTML/CSS/JavaScript** - 前端基础技术
- **Bootstrap** (推测) - UI 框架

### 开发工具
- **Git** - 版本控制
- **SSL证书** - HTTPS 支持

## 项目架构

```
├── assets/           # 静态资源文件 static resource files
├── bin/             # 可执行文件  exe file
├── dist/            # 构建输出目录  build output directory
├── libs/            # 数据库连接库 
├── logs/            # 日志文件
├── models/          # 数据模型
├── public/          # 公共静态资源
├── routers/         # 路由配置
├── routes/          # 路由处理
├── views/           # 视图模板
├── config.js        # 主配置文件
├── config.development.js  # 开发环境配置
├── index.js         # 应用入口文件
├── auth.js          # 认证中间件
├── middlewares.js   # 中间件配置
├── db.js           # 数据库初始化
├── boot.js         # 应用启动配置
└── logger.js       # 日志配置
```

## 核心功能模块

### 1. 用户认证系统
- 用户注册 (`views/reg.ejs`)
- 用户登录 (`views/login.ejs`)
- JWT Token 认证
- 会话管理

### 2. 数据库支持
- **MySQL 连接池** (`libs/mysql_pool.js`)
  - 支持连接池管理
  - 自动连接释放
  - 错误处理机制
- **MongoDB 支持** (可选)
- **数据模型**
  - 用户模型 (`models/users.js`)
  - 任务模型 (`models/tasks.js`)

### 3. 日志系统
- 使用 Winston 进行日志管理
- 支持控制台和文件输出
- 日志轮转和大小限制
- 日志级别控制

### 4. 视图系统
- EJS 模板引擎
- 模块化视图结构
- 响应式页面设计

## 配置说明

### 数据库配置 (`config.development.js`)

```javascript
// MySQL 配置
params: {
  host: '116.85.54.213',    // 数据库主机
  port: '3306',             // 数据库端口
  dialect: 'mysql',         // 数据库类型
  pool: {                   // 连接池配置
    max: 5,                 // 最大连接数
    min: 0,                 // 最小连接数
    acquire: 30000,         // 获取连接超时时间
    idle: 10000            // 空闲连接超时时间
  }
}

// MongoDB 配置
url: 'mongodb://localhost:27017'
```

### 服务器配置
- **端口**: 3004 (开发环境)
- **主机**: localhost
- **SSL**: 支持 HTTPS (证书文件已包含)
- **Cookie 密钥**: 'yubh'
- **JWT 密钥**: 自定义加密密钥

## 安装和运行

### 环境要求
- Node.js >= 12.0.0
- MySQL >= 5.7
- MongoDB (可选)

### 安装依赖
```bash
npm install
```

### 数据库设置
1. 创建 MySQL 数据库 `reat_express_yubh`
2. 配置数据库连接参数在 `config.development.js`
3. 运行数据库迁移脚本 (如果有)

### 启动项目
```bash
npm run start
```

应用将在 `http://localhost:3004` 启动

## 项目特色

### 1. 模块化架构
- 使用 Consign 进行依赖注入
- 按功能模块组织代码结构
- 清晰的分层架构

### 2. 数据库连接池
- MySQL 连接池优化性能
- 自动连接管理和释放
- 支持多数据库配置

### 3. 完整的日志系统
- 结构化日志记录
- 文件和控制台双输出
- 日志轮转和归档

### 4. 安全特性
- JWT Token 认证
- SSL/HTTPS 支持
- 密码加密存储

### 5. 开发友好
- 热重载支持
- 详细的错误处理
- 开发和生产环境分离

## API 接口

### 用户相关
- `GET /users` - 获取用户信息
- `POST /login` - 用户登录
- `POST /register` - 用户注册

### 数据查询
- `GET /getUserData` - 获取用户数据 (示例接口)

## 部署说明

### 生产环境配置
1. 修改 `config.js` 中的生产环境配置
2. 设置环境变量
3. 配置反向代理 (Nginx)
4. 启用 SSL 证书

### 性能优化
- 启用 Gzip 压缩
- 静态资源缓存
- 数据库查询优化
- 连接池调优

## 开发规范

### 代码结构
- 遵循 MVC 架构模式
- 统一的错误处理机制
- RESTful API 设计

### 数据库规范
- 使用连接池管理连接
- 参数化查询防止 SQL 注入
- 事务处理机制

## 故障排除

### 常见问题
1. **数据库连接失败**: 检查 `config.development.js` 中的数据库配置
2. **端口占用**: 修改配置文件中的端口号
3. **SSL 证书问题**: 确保证书文件路径正确

### 日志查看
```bash
tail -f logs/app.log
```

✅ 运行中的服务：

MongoDB - 端口 27017 (Docker 容器)
Redis - 端口 6379 (Docker 容器)
后端服务器 - 端口 3001




## 贡献指南

1. Fork 项目   fork  project
2. 创建功能分支  create function branch
3. 提交更改  commit change
4. 推送到分支  push function remote branch
5. 创建 Pull Request  create pull request 


🎉 博客管理系统已完成
✅ 已实现的功能
后端API (Express.js)

✅ 创建博客文章 (POST /api/blog/posts)
✅ 更新博客文章 (PUT /api/blog/posts/:id)
✅ 删除博客文章 (DELETE /api/blog/posts/:id)
✅ 获取编辑数据 (GET /api/blog/posts/:id/edit)
✅ 获取草稿列表 (GET /api/blog/drafts)
前端页面 (Next.js)

✅ 创建文章页面 (/blog/create)
✅ 编辑文章页面 (/blog/edit/[slug])
✅ 管理页面 (/blog/manage)
✅ 博客编辑器组件 (BlogEditor.tsx)
入口点

✅ 博客主页添加了"新建"和"管理"按钮
✅ 主页左侧导航添加了创建和管理入口
✅ 主页右侧菜单添加了紧凑的管理入口
核心特性

✅ 富文本内容编辑
✅ 标签管理系统
✅ 代码示例编辑器（支持多种语言）
✅ 交互式挑战创建
✅ 草稿/发布状态管理
✅ 特色文章标记
✅ 完整的CRUD操作
✅ API测试验证通过
🚀 使用方法
创建新文章: 访问 /blog/create 或点击任何"✍️ New Post"按钮
管理文章: 访问 /blog/manage 或点击"📝 Manage"按钮
编辑文章: 在管理页面点击"✏️ Edit"按钮
查看文章: 点击"👁️ View"按钮查看已发布的文章




  - ✅ 后端登录API正常工作
  - ✅ 返回正确的用户信息和JWT token
  - ✅ Admin用户（admin/admin123）可以成功登录
  - ✅ 前端配置正确指向后端API

  现在用户可以：
  1. 使用 admin/admin123 登录系统
  2. 访问博客管理功能
  3. 创建和编辑博客文章
  4. 所有权限控制正常工作


The permission system is now fully functional with:

  ✅ Frontend Components:
  - Auth context for state management
  - Login modal component
  - Protected route components
  - API service for backend communication

  ✅ Backend Infrastructure:
  - JWT authentication middleware
  - Role-based access control (admin/user)
  - Protected blog APIs
  - Authentication endpoints

  ✅ Database Schema:
  - Updated Users model with role field
  - Admin user seeding script
  - Migration script for existing databases

  ✅ Resolved Issues:
  - Fixed API service configuration (correct backend URL)
  - Fixed JWT token validation (simplified /api/auth/me endpoint)
  - Fixed middleware import issues
  - Fixed database schema issues

  The system is now working correctly where:
  - Users can log in with admin credentials (admin/admin123)
  - JWT tokens are properly generated and validated
  - Only authenticated admin users can create and edit blog posts
  - Frontend properly integrates with the backend authentication system

  The permission system implementation is complete and all reported errors have been addressed. The system should now function as requested, with
   proper access control for blog management functionality.





  ✅ User Registration System Complete

  Backend Changes:

  - Modified /api/auth/register endpoint to allow public registration for regular users
  - Added admin protection for creating admin users (requires admin authentication)
  - Enhanced validation with password confirmation and role security

  Frontend Components:

  - Created RegisterModal.tsx - Complete registration form with validation
  - Updated LoginModal.tsx - Added switch to registration option
  - Modified InteractiveHomepage.tsx - Added registration button and modal integration

  Features Implemented:

  - Public User Registration: Anyone can register as a regular user
  - Admin Role Protection: Only existing admins can create new admin accounts
  - Form Validation: Password confirmation, email format, required fields
  - Seamless UX: Switch between login and registration modals
  - Auto-login: Users are automatically logged in after successful registration

  Security Features:

  - Password Hashing: Uses bcrypt for secure password storage
  - JWT Authentication: Generates auth tokens automatically
  - Role Isolation: Regular users cannot create admin accounts
  - Input Validation: Server-side validation for all fields

  User Experience:

  - Responsive Design: Works on desktop and mobile
  - Error Handling: Clear error messages for failed registrations
  - Loading States: Visual feedback during registration process
  - Success Flow: Automatic login and page reload after registration






## 许可证

本项目采用 MIT 许可证  the project adopt MIT license

---

**作者**: yubh  
**创建时间**: 2018年2月  
**最后更新**: 2025年
