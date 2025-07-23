# webWorker.js 和 worker.js 文档

## 概述

`webWorker.js` 和 `worker.js` 模块实现了 Web Workers，用于繁重处理任务，通过将工作卸载到后台线程来提高应用性能。

## webWorker.js 函数

### `initWebWorker()`
初始化用于后台处理的 Web Worker。

### `extractIpsWithWorker(text, ipv4Only)`
使用 Web Worker 提取 IP 地址以防止 UI 阻塞。

**参数:**
- `text` (string): 要处理的文本内容
- `ipv4Only` (boolean): 如果为 true，则仅提取 IPv4 地址

**返回值:**
- (Promise): 解析为提取的 IP 地址的 Promise

### `validateIpsWithWorker(ipAddresses)`
使用 Web Worker 验证 IP 地址。

**参数:**
- `ipAddresses` (array): 要验证的 IP 地址数组

**返回值:**
- (Promise): 解析为验证结果的 Promise

## worker.js

`worker.js` 文件包含在单独线程中运行的实际 Web Worker 实现。它包括可以在不阻塞主 UI 线程的情况下执行的 IP 提取和验证函数。