# IPToRoute

A powerful and lightweight web tool for IP address processing and router configuration generation, built with vanilla JavaScript. No dependencies, no backend required.

[English](#english) | [中文](#中文)

## English

### 🚀 Features

#### 🔍 **IP Address Extraction**
- Extract IPv4/IPv6 addresses and CIDR ranges from any text or JSON format
- **Smart Processing Options**:
  - IPv4 only extraction (skip IPv6 addresses)
  - Remove duplicate IP addresses automatically
  - **NEW**: Aggregate overlapping and adjacent IP ranges for optimized configurations
- Support for mixed content parsing (network logs, cloud provider JSON, configuration files)
- Real-time processing statistics with entry count

#### ⚙️ **Router Configuration Generation**
- **Multi-vendor Support**:
  - **MikroTik RouterOS** (Address List and Route modes with auto-extraction)
  - **Cisco IOS** (Static routes with customizable next-hop)
  - **Huawei VRP** (Static routes)
  - **Juniper JunOS** (Static routes)
  - **Fortinet FortiOS** (Address objects and groups with FQDN support)
- **Advanced Features**:
  - Domain name (FQDN) support for compatible platforms
  - Automatic IP extraction from mixed text for RouterOS and Fortinet
  - Customizable parameters (gateway, list names, route names)
  - IP address sorting and organization

#### 🔄 **Format Conversion Tools**
- **CIDR ↔ IP+Netmask** bidirectional conversion
- Batch processing with real-time validation
- Support for all standard subnet masks and CIDR notations

#### 🎨 **User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Multi-language Support**: Full English and Chinese localization
- **Theme Support**: Light and dark mode with system preference detection
- **Operation History**: Automatic saving with one-click restoration of previous operations
- **Easy Export**: Copy to clipboard or download as text files
- **Real-time Feedback**: Processing statistics and validation messages

### 📖 Usage Guide

#### 🎯 **Quick Start**
1. Visit the website or open `index.html` locally
2. Choose one of four operation modes:
   - **Router Config**: Generate router configuration commands
   - **IPs Extract**: Extract IP addresses from text/JSON with processing options
   - **CIDR → IP**: Convert CIDR notation to IP+Netmask format
   - **IP → CIDR**: Convert IP+Netmask to CIDR notation

#### 💡 **Pro Tips**
- Use **IP Range Aggregation** in IPs Extract mode to optimize large IP lists
- Enable **IPv4 Only** when working with legacy systems
- Check **Remove Duplicates** to clean up messy input data
- Use the **Operation History** to quickly restore previous configurations

### 🛠️ Development

This is a pure frontend project with zero dependencies:

```bash
git clone https://github.com/myyeti1043/iptoroute.git
cd iptoroute
# Open index.html in any modern browser
```

**Tech Stack**: Vanilla JavaScript, CSS3, HTML5

## 中文

### 🚀 功能特点

#### 🔍 **IP地址提取**
- 从任意文本或JSON格式中提取IPv4/IPv6地址和CIDR范围
- **智能处理选项**：
  - 仅提取IPv4地址（跳过IPv6地址）
  - 自动去除重复IP地址
  - **新功能**: 聚合重叠和相邻的IP地址段，优化配置
- 支持混合内容解析（网络日志、云服务商JSON、配置文件）
- 实时处理统计和条目计数

#### ⚙️ **路由器配置生成**
- **多厂商支持**：
  - **MikroTik RouterOS**（地址列表和路由模式，支持自动提取）
  - **Cisco IOS**（静态路由，可定制下一跳）
  - **华为 VRP**（静态路由）
  - **Juniper JunOS**（静态路由）
  - **Fortinet FortiOS**（地址对象和组，支持FQDN）
- **高级功能**：
  - 兼容平台支持域名（FQDN）
  - RouterOS和Fortinet模式支持从混合文本自动提取IP
  - 可定制参数（网关、列表名称、路由名称）
  - IP地址排序和组织

#### 🔄 **格式转换工具**
- **CIDR ↔ IP+子网掩码** 双向转换
- 批量处理和实时验证
- 支持所有标准子网掩码和CIDR表示法

#### 🎨 **用户体验**
- **响应式设计**：在桌面、平板和移动设备上无缝工作
- **多语言支持**：完整的中英文本地化
- **主题支持**：明暗模式，支持系统偏好检测
- **操作历史**：自动保存，一键恢复之前的操作
- **便捷导出**：复制到剪贴板或下载为文本文件
- **实时反馈**：处理统计和验证消息

### 📖 使用指南

#### 🎯 **快速开始**
1. 访问网站或本地打开`index.html`
2. 选择四种操作模式之一：
   - **路由配置**：生成路由器配置命令
   - **IP提取**：从文本/JSON提取IP地址，含处理选项
   - **CIDR → IP**：将CIDR表示法转换为IP+子网掩码格式
   - **IP → CIDR**：将IP+子网掩码转换为CIDR表示法

#### 💡 **专业提示**
- 在IP提取模式中使用**IP地址段聚合**来优化大型IP列表
- 处理旧系统时启用**仅IPv4**选项
- 勾选**去除重复**来清理混乱的输入数据
- 使用**操作历史**快速恢复之前的配置

### 🛠️ 开发

这是一个零依赖的纯前端项目：

```bash
git clone https://github.com/myyeti1043/iptoroute.git
cd iptoroute
# 在任意现代浏览器中打开 index.html
```

**技术栈**：原生JavaScript、CSS3、HTML5

## License

[MIT License](LICENSE)
