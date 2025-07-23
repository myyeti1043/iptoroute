# uiHelpers.js 文档

## 概述

`uiHelpers.js` 模块提供 UI 辅助函数，用于管理用户界面元素和交互。

## 主要函数

### `updateOutputPlaceholder()`
根据当前模式和路由器类型更新输出区域占位符。

### `applyRouterSpecificOptions()`
根据选择的路由器类型显示或隐藏路由器特定选项。

### `showLoading()`
在处理过程中显示加载指示器。

### `hideLoading()`
处理完成后隐藏加载指示器。

### `setupResizer()`
设置调整输入/输出面板大小的调整器功能。

### `showNotification(message, type)`
向用户显示通知消息。

**参数:**
- `message` (string): 通知消息
- `type` (string): 通知类型 (success, error, warning, info)

### `handleError(error, context)`
优雅地处理错误并显示适当的消息。

**参数:**
- `error` (Error): 错误对象
- `context` (string): 发生错误的上下文

### `getCurrentMode()`
获取当前操作模式。

**返回值:**
- (string): 当前模式

### `getCurrentLang()`
获取当前语言。

**返回值:**
- (string): 当前语言

### `updatePageTitle(lang)`
根据选择的语言更新页面标题。

**参数:**
- `lang` (string): 语言代码