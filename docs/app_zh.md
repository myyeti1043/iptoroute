# app.js 文档

## 概述

`app.js` 文件是主应用文件，负责初始化所有功能并处理 IPToRoute 工具的 UI 交互。

## 主要函数

### `init()`
通过设置所有 UI 组件和事件监听器来初始化应用。

### `setupTabNavigation()`
设置标签导航功能，允许用户在不同的操作模式之间切换（路由配置、IP 提取、CIDR→IP、IP→CIDR）。

### `setupInputHandlers()`
设置与输入相关的操作处理器，如清空输入区域和从剪贴板粘贴。

### `setupConvertButton()`
设置转换按钮处理器，触发输入数据的处理。

### `processInput()`
主处理函数，根据当前模式处理输入并生成适当的输出。

### `setupCopyDownloadButtons()`
设置输出区域的复制和下载功能。

### `setupRouterTypeHandlers()`
处理路由器类型选择并显示/隐藏路由器特定选项。

### `updateLanguage()`
根据用户选择更新 UI 语言。

## 全局变量

- `currentMode` - 跟踪当前操作模式
- `currentLang` - 跟踪当前语言
- `inputArea` - 输入文本区域的引用
- `outputArea` - 输出文本区域的引用

## 事件监听器

- `DOMContentLoaded` - DOM 加载时初始化应用
- `hashchange` - 处理标签导航的 URL 哈希变化