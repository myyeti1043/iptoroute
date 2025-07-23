# analytics.js 文档

## 概述

`analytics.js` 模块处理 IPToRoute 应用的分析和 SEO 功能。

## 主要函数

### `initSEO()`
初始化 SEO 功能，包括结构化数据和元标签。

### `trackEvent(category, action, label)`
跟踪用户事件以进行分析。

**参数:**
- `category` (string): 事件类别
- `action` (string): 事件操作
- `label` (string): 事件标签

### `trackPageView()`
跟踪页面浏览量以进行分析。

## 实现细节

此模块设计用于与 Google Analytics 配合使用，但可以适配其他分析平台。它包括以下功能：

1. 丰富搜索结果的结构化数据
2. 用户交互的事件跟踪
3. 页面浏览跟踪
4. 开发模式检测（在开发中禁用分析）

## 隐私考虑

分析实现尊重用户隐私，仅收集匿名使用数据。它不跟踪个人信息或敏感数据。