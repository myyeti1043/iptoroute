# IPToRoute 开发者文档

本文档面向希望为 IPToRoute 项目做出贡献或了解其结构的开发者。

## 项目概述

IPToRoute 是一个使用原生 JavaScript 构建的轻量级网络工具，用于 IP 地址转换和路由器配置生成。它为 IT 专业人员和网络工程师提供了各种网络实用程序。

## 项目结构

```
iptoroute/
├── index.html          # 主 HTML 页面
├── styles.css          # 主样式表
├── script.js           # 主 JavaScript 文件
├── js/                 # JavaScript 模块
│   ├── app.js          # 主应用逻辑
│   ├── ipConverters.js # IP 转换函数
│   ├── routerConverters.js # 路由器配置生成
│   ├── jsonExtractor.js # JSON 解析工具
│   ├── uiHelpers.js    # UI 辅助函数
│   ├── historyManager.js # 操作历史管理
│   ├── webWorker.js    # Web Worker 实现
│   ├── worker.js       # Web Worker 脚本
│   ├── translations.js # UI 翻译
│   └── analytics.js    # 分析实现
├── docs/               # 开发者文档（此文件夹）
├── tests/              # 测试文件
├── contact/            # 联系页面
├── privacy-policy/     # 隐私政策页面
├── terms-of-service/   # 服务条款页面
├── cookie-policy/      # Cookie 政策页面
├── robots.txt          # Robots.txt 文件
├── sitemap.xml         # 网站地图
├── LICENSE             # 许可证文件
├── README.md           # 项目 README
├── CONTRIBUTING.md     # 贡献指南
└── .env                # 环境变量
```

## 使用的技术

- 原生 JavaScript (ES6+)
- HTML5
- CSS3
- Web Workers 用于繁重处理
- LocalStorage 用于数据持久化
- 无外部依赖

## 核心模块

### 1. app.js
主应用文件，初始化所有功能并处理 UI 交互。

主要函数：
- `init()` - 初始化应用
- `setupTabNavigation()` - 设置标签导航
- `setupInputHandlers()` - 设置输入字段处理器
- `setupConvertButton()` - 设置转换按钮处理器
- `processInput()` - 主处理函数
- `setupCopyDownloadButtons()` - 设置复制/下载功能
- `setupRouterTypeHandlers()` - 处理路由器类型选择
- `updateLanguage()` - 更新 UI 语言

### 2. ipConverters.js
包含 IP 地址转换和验证的函数。

主要函数：
- `convertCidrToIpMask()` - 将 CIDR 转换为 IP+子网掩码格式
- `convertIpMaskToCidr()` - 将 IP+子网掩码转换为 CIDR 格式
- `isValidIp()` - 验证 IP 地址
- `isValidMask()` - 验证子网掩码
- `compareIPs()` - 比较 IP 地址以进行排序

### 3. routerConverters.js
包含生成路由器特定配置的函数。

主要函数：
- `convertCidrToCisco()` - 生成 Cisco IOS 配置
- `convertCidrToRouterOs()` - 生成 MikroTik RouterOS 配置
- `convertCidrToHuawei()` - 生成 Huawei VRP 配置
- `convertCidrToJuniper()` - 生成 Juniper JunOS 配置
- `convertCidrToFortinet()` - 生成 Fortinet FortiOS 配置

### 4. jsonExtractor.js
处理从 JSON 数据中提取 IP 地址。

主要函数：
- `extractIpPrefixesFromJson()` - 从 JSON 中提取 IP 前缀
- `findAllIpAddresses()` - 在文本中查找所有 IP 地址

### 5. uiHelpers.js
提供 UI 辅助函数。

主要函数：
- `updateOutputPlaceholder()` - 更新输出区域占位符
- `applyRouterSpecificOptions()` - 显示/隐藏路由器特定选项
- `showLoading()` / `hideLoading()` - 显示/隐藏加载指示器
- `showNotification()` - 显示通知
- `handleError()` - 优雅地处理错误

### 6. historyManager.js
管理操作历史。

主要函数：
- `addToRecentOperations()` - 将操作添加到历史记录
- `loadRecentOperations()` - 从 localStorage 加载历史记录
- `restoreOperation()` - 恢复先前的操作
- `clearOperationHistory()` - 清除操作历史

### 7. webWorker.js / worker.js
实现 Web Workers 用于繁重处理任务。

主要函数：
- `initWebWorker()` - 初始化 Web Worker
- `extractIpsWithWorker()` - 使用 Web Worker 提取 IP
- `validateIpsWithWorker()` - 使用 Web Worker 验证 IP

### 8. translations.js
包含英文和中文的 UI 翻译。

结构：
- `translations.en` - 英文翻译
- `translations.zh` - 中文翻译

### 9. analytics.js
处理分析和 SEO 功能。

主要函数：
- `initSEO()` - 初始化 SEO 功能
- `trackEvent()` - 跟踪用户事件
- `trackPageView()` - 跟踪页面浏览量

## 开发设置

1. 克隆仓库：
   ```bash
   git clone https://github.com/myyeti1043/iptoroute.git
   ```

2. 导航到项目目录：
   ```bash
   cd iptoroute
   ```

3. 在浏览器中打开 `index.html` 以本地运行。

## 编码规范

- 使用一致的缩进（2个空格）
- 使用驼峰命名法命名变量和函数
- 使用描述性的变量和函数名称
- 为复杂逻辑添加注释
- 保持函数小而专注
- 在适当的地方使用 ES6 特性

## 贡献

请参阅 [CONTRIBUTING.md](../CONTRIBUTING.md) 获取详细的贡献指南。

## 测试

测试文件位于 `tests/` 目录中。在浏览器中打开 `tests/test-runner.html` 运行测试。

## 部署

这是一个静态站点，可以部署到任何提供静态文件服务的网络托管服务。

## 许可证

该项目基于 MIT 许可证授权。详情请见 [LICENSE](../LICENSE)。