# 刷题助手

基于 React + Vite + Tailwind CSS 的刷题 Web 应用，支持随机刷题、错题本、模拟考试和成绩记录。

## 功能

- **随机刷题**：从题库随机抽题练习，答错自动记录到错题本
- **错题本**：查看和复习答错的题目，支持从错题本移除
- **模拟考试**：50 单选 + 40 多选 + 10 判断，共 100 道题，2 小时倒计时
- **成绩记录**：登录后自动保存模拟考试成绩，可查看历史记录
- **用户系统**：注册、登录（本地存储，用于演示）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器访问 http://localhost:5173

## 手机扫码访问（Cloudflare Tunnel）

1. 安装 cloudflared：`winget install --id Cloudflare.cloudflared`
2. 终端 1：`npm run dev`（启动开发服务器）
3. 终端 2：`npm run tunnel`（启动公网隧道）
4. 终端会显示 `https://xxx.trycloudflare.com`，用该地址生成二维码
5. 手机扫码即可访问

## 使用说明

1. 首次访问会自动加载示例题库（50 单选 + 40 多选 + 10 判断）
2. 模拟考试和成绩记录需要先注册/登录
3. 随机刷题和错题本：未登录可刷题，登录后答错题目会记录到错题本
4. 当前使用 LocalStorage 存储，密码未加密，仅适合本地/演示使用

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7

## 项目结构

```
src/
├── components/     # 布局、题目卡片、受保护路由
├── contexts/       # 认证上下文
├── data/           # 示例题库
├── pages/          # 各页面
├── types/          # 类型定义
└── utils/          # 存储、抽题、判分工具
```

## 部署

```bash
npm run build
```

将 `dist` 目录部署到任意静态托管服务（如 Vercel、Netlify）。
