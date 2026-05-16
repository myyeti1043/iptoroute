# IPToRoute

**IPToRoute** is a free, zero-dependency web tool that converts IP addresses between formats and generates router configurations for MikroTik, Cisco, Huawei, Juniper, and Fortinet. It runs entirely in the browser with no backend required.

**What it does**: Extract IPs from text/JSON, convert CIDR notation to subnet mask (and vice versa), generate vendor-specific router configs, aggregate overlapping IP ranges.
**Who it's for**: Network administrators, DevOps engineers, security analysts, and developers working with network infrastructure.
**Why use it**: No installation needed, works offline, supports 5 router vendors plus FQDN domain names, bilingual interface (English / Chinese).

[English](#english) | [中文](#中文)

---

## English

### Table of Contents

- [Features](#features)
- [Use Cases](#use-cases)
- [Supported Input Formats](#supported-input-formats)
- [Quick Start](#quick-start)
- [Pro Tips](#pro-tips)
- [Development](#development)

### Features

#### IP Address Extraction

Extract IPv4/IPv6 addresses and CIDR ranges from any source:

- **Plain text** — Paste network logs, config files, or arbitrary text with IPs scattered throughout
- **JSON** — Nested arrays and objects are automatically traversed (e.g., AWS IP ranges JSON, cloud provider exports)
- **Mixed content** — No need to clean up input; the tool finds valid IPs automatically

Processing options:
- **IPv4 Only** — Skip IPv6 addresses when working with legacy systems
- **Remove Duplicates** — Automatically deduplicate extracted IPs
- **Aggregate Ranges** — Merge overlapping and adjacent IP ranges into minimal CIDR sets (e.g., `192.168.1.0/24` + `192.168.2.0/24` → `192.168.0.0/23`)
- **Real-time statistics** — See entry count and processing results instantly

#### Router Configuration Generation

Generate vendor-specific configuration commands from CIDR, IP+mask, or even mixed text.

| Vendor | Modes | Special Features |
|--------|-------|-----------------|
| **MikroTik RouterOS** | Route / Address List | Address-list mode auto-extracts IPs and domain names from mixed text |
| **Cisco IOS** | Static routes | Custom next-hop IP and route name; reverse-parses existing `ip route` commands |
| **Huawei VRP** | Static routes | Custom next-hop IP |
| **Juniper JunOS** | Static routes | Custom next-hop IP |
| **Fortinet FortiOS** | Address / Address Group | Full FQDN domain name support; auto-extracts IPs and domains from mixed text; single `addrgrp` with `set member` |

All router modes support:
- **IP aggregation** — Merge overlapping ranges before generating configs
- **Sorting** — Output in ascending IP order
- **Batch processing** — One-click conversion for hundreds of entries

#### Format Conversion

- **CIDR → IP + Netmask** — Convert `192.168.1.0/24` to `192.168.1.0 255.255.255.0`
- **IP + Netmask → CIDR** — Convert `192.168.1.0 255.255.255.0` to `192.168.1.0/24`
- Batch processing with validation for every line

#### User Experience

- **Zero installation** — Open `index.html` in any modern browser, works offline
- **Responsive design** — Desktop, tablet, and mobile
- **Multi-language** — Full English and Chinese (Simplified) localization
- **Light / Dark theme** — With system preference detection
- **Operation history** — Auto-saves to localStorage, one-click restore
- **Export** — Copy to clipboard or download as `.txt`
- **File upload** — Drag and drop or select files to load
- **Web Worker processing** — Background processing for large inputs (desktop)

### Use Cases

**Cloud provider IP lists** — Paste AWS/Azure/GCP IP range JSON, extract all CIDRs, and generate MikroTik address-list or Fortinet address objects in seconds.

**Network migration** — Have a list of IPs in various formats? Paste everything at once, the tool handles CIDR, IP+mask, Cisco routes, and even random text with IPs mixed in.

**Firewall rules** — Need to block a list of IPs on Fortinet? Paste the list, enable "Address Group" mode, and get a complete `config firewall address` + `config firewall addrgrp` script with deduplication.

**CIDR optimization** — Clean up messy IP lists by aggregating overlapping ranges before pushing to routers.

**Domain-based filtering** — Fortinet and RouterOS address-list modes support FQDN domains (e.g., `example.com`), automatically generating `type fqdn` entries.

### Supported Input Formats

All modes accept multiple formats in a single input. Mix and match freely.

| Format | Example | Supported Modes |
|--------|---------|-----------------|
| CIDR | `192.168.1.0/24` | All |
| IP + Netmask | `192.168.1.0 255.255.255.0` | All |
| Cisco route | `ip route 192.168.1.0 255.255.255.0 10.0.0.1 name CN` | All |
| Single IP | `8.8.8.8` (treated as /32) | All |
| Domain / FQDN | `example.com` | Fortinet, RouterOS address-list |
| Mixed text | Logs, configs with IPs scattered | IPs Extract, Fortinet, RouterOS address-list |
| JSON | Nested `{"prefixes": [{"ip_prefix": "..."}]}` | IPs Extract |

### Quick Start

1. Visit [iptoroute.com](https://iptoroute.com) or open `index.html` locally
2. Choose a mode:
   - **Router Config** — Select vendor, paste IPs/domains, configure options, click Convert
   - **IPs Extract** — Paste any text or JSON, check processing options, click Convert
   - **CIDR → IP** — Paste CIDR notations, get IP+mask output
   - **IP → CIDR** — Paste IP+mask pairs, get CIDR notation
3. Copy or download the results

### Pro Tips

- **Paste messy data** — In IPs Extract mode, paste entire log files or JSON exports. The tool ignores irrelevant text automatically.
- **Aggregate before routing** — Enable "Aggregate IP ranges" in Router Config mode to minimize route table size.
- **Fortinet address groups** — Use "Add to Address Group" mode to generate a single `addrgrp` with all members, instead of one group entry per IP.
- **RouterOS auto-extract** — In address-list mode, paste mixed text (e.g., `servers at 10.0.0.0/24 and example.com`) and get clean `/ip firewall address-list add` commands.
- **Reverse Cisco routes** — Paste existing `ip route ...` commands to extract and reformat them.
- **Restore previous work** — Check the left sidebar "Recent Operations" panel to restore any past conversion with one click.
- **Work offline** — Download the repo and open `index.html` directly. No server needed.

### Development

Pure frontend, zero dependencies:

```bash
git clone https://github.com/myyeti1043/iptoroute.git
cd iptoroute
# Open index.html in any modern browser
```

**Tech Stack**: Vanilla JavaScript, CSS3, HTML5

---

## 中文

### 目录

- [功能特点](#功能特点)
- [适用场景](#适用场景)
- [支持的输入格式](#支持的输入格式)
- [快速开始](#快速开始)
- [专业提示](#专业提示)
- [开发](#开发)

### 功能特点

#### IP地址提取

从任意来源提取 IPv4/IPv6 地址和 CIDR 范围：

- **纯文本** — 粘贴网络日志、配置文件或任意包含 IP 的文本
- **JSON** — 自动遍历嵌套数组和对象（如 AWS IP 范围 JSON、云服务商导出数据）
- **混合内容** — 无需清理输入，工具自动识别有效 IP

处理选项：
- **仅IPv4** — 处理旧系统时跳过 IPv6 地址
- **去除重复** — 自动去除重复的 IP
- **聚合地址段** — 将重叠和相邻的 IP 范围合并为最小 CIDR 集合（如 `192.168.1.0/24` + `192.168.2.0/24` → `192.168.0.0/23`）
- **实时统计** — 即时查看条目数量和处理结果

#### 路由器配置生成

从 CIDR、IP+掩码甚至混合文本生成各厂商专用配置命令。

| 厂商 | 模式 | 特色功能 |
|------|------|---------|
| **MikroTik RouterOS** | 路由 / 地址列表 | 地址列表模式支持从混合文本自动提取 IP 和域名 |
| **Cisco IOS** | 静态路由 | 自定义下一跳 IP 和路由名称；反向解析已有 `ip route` 命令 |
| **华为 VRP** | 静态路由 | 自定义下一跳 IP |
| **Juniper JunOS** | 静态路由 | 自定义下一跳 IP |
| **Fortinet FortiOS** | 地址 / 地址组 | 完整 FQDN 域名支持；从混合文本自动提取 IP 和域名；单条 `addrgrp` 使用 `set member` |

所有路由模式均支持：
- **IP聚合** — 生成配置前合并重叠范围
- **排序** — 按 IP 升序输出
- **批量处理** — 一键转换数百条条目

#### 格式转换

- **CIDR → IP + 子网掩码** — `192.168.1.0/24` 转换为 `192.168.1.0 255.255.255.0`
- **IP + 子网掩码 → CIDR** — `192.168.1.0 255.255.255.0` 转换为 `192.168.1.0/24`
- 每行实时验证的批量处理

#### 用户体验

- **零安装** — 在任意现代浏览器打开 `index.html`，支持离线使用
- **响应式设计** — 桌面、平板、手机均适用
- **多语言** — 完整的中英文本地化
- **明暗主题** — 支持系统偏好检测
- **操作历史** — 自动保存到 localStorage，一键恢复
- **导出** — 复制到剪贴板或下载为 `.txt`
- **文件上传** — 支持拖放或选择文件加载
- **Web Worker 处理** — 大输入量的后台处理（桌面端）

### 适用场景

**云服务商 IP 列表** — 粘贴 AWS/Azure/GCP IP 范围 JSON，提取所有 CIDR，几秒钟内生成 MikroTik 地址列表或 Fortinet 地址对象。

**网络迁移** — 有各种格式的 IP 列表？一次性全部粘贴，工具自动处理 CIDR、IP+掩码、Cisco 路由命令，甚至混在文本中的 IP。

**防火墙规则** — 需要在 Fortinet 上封禁一批 IP？粘贴列表，启用"地址组"模式，获得完整的 `config firewall address` + `config firewall addrgrp` 脚本，并自动去重。

**CIDR 优化** — 推送到路由器前，聚合重叠的 IP 范围来清理杂乱的列表。

**基于域名的过滤** — Fortinet 和 RouterOS 地址列表模式支持 FQDN 域名（如 `example.com`），自动生成 `type fqdn` 条目。

### 支持的输入格式

所有模式都支持在一次输入中混合多种格式，自由组合。

| 格式 | 示例 | 支持的模式 |
|--------|---------|-----------------|
| CIDR | `192.168.1.0/24` | 全部 |
| IP + 子网掩码 | `192.168.1.0 255.255.255.0` | 全部 |
| Cisco 路由 | `ip route 192.168.1.0 255.255.255.0 10.0.0.1 name CN` | 全部 |
| 单个 IP | `8.8.8.8`（视为 /32） | 全部 |
| 域名 / FQDN | `example.com` | Fortinet、RouterOS 地址列表 |
| 混合文本 | 日志、配置文件中散落的 IP | IP提取、Fortinet、RouterOS 地址列表 |
| JSON | 嵌套 `{"prefixes": [{"ip_prefix": "..."}]}` | IP提取 |

### 快速开始

1. 访问 [iptoroute.com](https://iptoroute.com) 或本地打开 `index.html`
2. 选择模式：
   - **路由配置** — 选择厂商，粘贴 IP/域名，配置选项，点击转换
   - **IP提取** — 粘贴任意文本或 JSON，选择处理选项，点击转换
   - **CIDR → IP** — 粘贴 CIDR 表示法，获得 IP+掩码 输出
   - **IP → CIDR** — 粘贴 IP+掩码 对，获得 CIDR 表示法
3. 复制或下载结果

### 专业提示

- **粘贴杂乱数据** — 在 IP 提取模式中，直接粘贴整个日志文件或 JSON 导出。工具会自动忽略无关文本。
- **路由前先聚合** — 在路由配置模式中启用"聚合 IP 范围"以最小化路由表大小。
- **Fortinet 地址组** — 使用"添加到地址组"模式生成单条 `addrgrp` 包含所有成员，而不是每个 IP 一条组条目。
- **RouterOS 自动提取** — 在地址列表模式下，粘贴混合文本（如 `servers at 10.0.0.0/24 and example.com`），获得干净的 `/ip firewall address-list add` 命令。
- **反向解析 Cisco 路由** — 粘贴已有的 `ip route ...` 命令来提取并重新格式化。
- **恢复之前的工作** — 查看左侧边栏"最近操作"面板，一键恢复任意历史转换。
- **离线使用** — 下载仓库后直接打开 `index.html`，无需服务器。

### 开发

纯前端，零依赖：

```bash
git clone https://github.com/myyeti1043/iptoroute.git
cd iptoroute
# 在任意现代浏览器中打开 index.html
```

**技术栈**：原生 JavaScript、CSS3、HTML5

---

## Quick Reference

### Supported Router Vendors

| Vendor | Config Type | Customizable Parameters |
|--------|-------------|------------------------|
| **MikroTik RouterOS** | Route / Address List | Gateway (Route), List Name (Address List) |
| **Cisco IOS** | Static routes | Next Hop IP, Route Name |
| **Huawei VRP** | Static routes | Next Hop IP |
| **Juniper JunOS** | Static routes | Next Hop IP |
| **Fortinet FortiOS** | Address / Address Group | Address Group Name |

### Supported Input Formats

- CIDR notation: `192.168.1.0/24`
- IP + netmask: `192.168.1.0 255.255.255.0`
- Cisco route command: `ip route 192.168.1.0 255.255.255.0 10.0.0.1 name CN`
- Single IP: `8.8.8.8`
- Domain / FQDN: `example.com` (Fortinet, RouterOS address-list)
- Mixed text with scattered IPs
- JSON with nested IP fields

### Supported Operations

| Mode | Description | Output Example |
|------|-------------|----------------|
| **Router Config** | Generate vendor-specific configuration commands | `/ip route add dst-address=192.168.1.0/24 gateway=10.0.0.1` |
| **IPs Extract** | Extract and process IP addresses from any source | Clean deduplicated/aggregated IP list |
| **CIDR → IP** | Convert CIDR to IP + netmask | `192.168.1.0 255.255.255.0` |
| **IP → CIDR** | Convert IP + netmask to CIDR | `192.168.1.0/24` |

### Processing Options

| Option | Modes | Description |
|--------|-------|-------------|
| **IPv4 Only** | IPs Extract, Router Config | Skip IPv6 addresses |
| **Remove Duplicates** | IPs Extract | Auto-deduplicate results |
| **Aggregate Ranges** | IPs Extract, Router Config | Merge overlapping/adjacent ranges |
| **Sort Output** | Router Config | Sort results in ascending order |

## License

[MIT License](LICENSE)
