# historyManager.js 文档

## 概述

`historyManager.js` 模块管理操作历史，允许用户查看和恢复先前的操作。

## 主要函数

### `addToRecentOperations(input)`
将操作添加到最近操作历史记录中。

**参数:**
- `input` (string): 操作的输入数据

### `loadRecentOperations()`
从 localStorage 加载最近操作。

### `refreshRecentOperations()`
刷新 UI 中的最近操作显示。

### `restoreOperation(index)`
按索引恢复先前的操作。

**参数:**
- `index` (number): 要恢复的操作索引

### `clearOperationHistory()`
清除操作历史。

### `setupRecentOperations()`
设置最近操作的 UI 组件和事件监听器。