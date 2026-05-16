# IPToRoute GEO 优化指南

> 参考 [Tw93 的 GEO 实践分享](https://x.com/HiTw93/status/2050189572999618982) 整理，针对 IPToRoute 项目的具体优化建议。
>
> **核心原则**：让 AI 更好地发现、理解和引用你的内容，而不是生产垃圾内容或刷排名。

---

## 目录

- [高优先级：立即见效](#高优先级立即见效)
  - [1. 优化 robots.txt](#1-优化-robotstxt)
  - [2. 添加 llms.txt](#2-添加-llmstxt)
  - [3. 添加 Markdown 版本标记](#3-添加-markdown-版本标记)
  - [4. 确保搜索引擎已收录](#4-确保搜索引擎已收录)
- [中优先级：提升 AI 引用质量](#中优先级提升-ai-引用质量)
  - [5. 为每个核心功能创建独立说明页](#5-为每个核心功能创建独立说明页)
  - [6. 优化 README 的 AI 可引用结构](#6-优化-readme-的-ai-可引用结构)
  - [7. URL 结构与 SPA 路由](#7-url-结构与-spa-路由)
  - [8. 添加 FAQ 结构化数据](#8-添加-faq-结构化数据)
- [低优先级：锦上添花](#低优先级锦上添花)
  - [9. 提交 llms.txt 到聚合平台](#9-提交-llmstxt-到聚合平台)
  - [10. 与其他项目互相引用](#10-与其他项目互相引用)
- [最小可行改动清单](#最小可行改动清单)
- [参考](#参考)

---

## 高优先级：立即见效

### 1. 优化 robots.txt

**现状**：当前 `robots.txt` 对所有爬虫一视同仁放行，没有区分训练爬虫和搜索爬虫。

**问题**：训练爬虫（如 GPTBot）会抓取内容用于模型训练，但不保证归因；搜索爬虫（如 OAI-SearchBot）才是让 AI 搜索引用你的关键。

**操作**：替换为分类放行策略。

**文件路径**：`robots.txt`

```txt
# =====================================================
# IPToRoute - robots.txt
# 策略：允许搜索/检索爬虫、用户触发爬虫
#       屏蔽训练爬虫、未声明爬虫
# =====================================================

# --- Search & retrieval crawlers: ALLOW ---
# 这些爬虫实时抓取内容回答用户问题，是 AI 搜索引用的来源
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# --- User-triggered crawlers: ALLOW ---
# 用户主动贴 URL 时触发，让 AI 能总结你的页面
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Perplexity-User
Allow: /

# --- Training crawlers: BLOCK ---
# 这些爬虫拿内容训练模型，屏蔽可防止内容被无归因使用
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: anthropic-ai
Disallow: /

# --- Opt-out tokens ---
User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

# --- Undeclared crawlers: BLOCK ---
# 不表明身份、不一定遵守规则的爬虫
User-agent: Bytespider
Disallow: /

User-agent: ImagesiftBot
Disallow: /

# --- General fallback ---
# 未列出的其他爬虫允许访问（兼容传统搜索引擎）
User-agent: *
Allow: /

# Sitemap
Sitemap: https://iptoroute.com/sitemap.xml
```

**验证方式**：部署后可用以下工具检查：
- [Google Search Console](https://search.google.com/search-console) - robots.txt 测试工具
- [Bing Webmaster Tools](https://www.bing.com/webmasters) - 站点扫描

---

### 2. 添加 llms.txt

**现状**：没有为 AI 提供专门的站点概览文件。

**为什么重要**：`llms.txt` 是一个新兴标准，类似 `robots.txt` 但专门给 AI 看。AI 爬虫在检索内容时会优先读取这个文件来理解你的站点。BuiltWith 追踪到已有 84 万+ 网站部署。

**操作**：在站点根目录创建 `llms.txt`。

**文件路径**：`llms.txt`（部署到 `https://iptoroute.com/llms.txt`）

```markdown
# IPToRoute

> Free online tool for IP address processing and router configuration generation. Built with vanilla JavaScript, zero dependencies, no backend required.

## Links

- [Live Tool](https://iptoroute.com)
- [GitHub Repository](https://github.com/myyeti1043/iptoroute)
- [Documentation](https://iptoroute.com/docs)
- [Contributing Guide](https://github.com/myyeti1043/iptoroute/blob/main/CONTRIBUTING.md)

## About

IPToRoute is a lightweight, pure-frontend web tool that helps network administrators and developers process IP addresses and generate router configurations.

### What It Does

- **IP Extraction**: Parse IPv4/IPv6 addresses and CIDR ranges from any text, JSON, or mixed content (logs, cloud provider exports, config files)
- **Router Config Generation**: Generate vendor-specific configuration commands for MikroTik RouterOS, Cisco IOS, Huawei VRP, Juniper JunOS, and Fortinet FortiOS
- **Format Conversion**: Bidirectional conversion between CIDR notation and IP + netmask
- **IP Aggregation**: Automatically merge overlapping and adjacent IP ranges for optimized configurations
- **FQDN Support**: Compatible platforms support domain names alongside IP addresses

### Key Differentiators

- **Zero dependencies**: Pure vanilla JavaScript, no build step, no npm packages
- **Offline capable**: Works entirely in the browser, no backend or API calls for core functionality
- **Multi-language**: Full English and Chinese (Simplified) localization
- **Privacy-first**: No data leaves your browser; processing happens client-side
- **Export options**: Copy to clipboard or download as text files

## Technical Details

- **Tech Stack**: Vanilla JavaScript, CSS3, HTML5
- **License**: MIT
- **Languages**: English, Chinese
- **Deployment**: Static site (GitHub Pages / any static host)
- **Repository**: https://github.com/myyeti1043/iptoroute
```

**进阶**：如果后续有精力，可以补充 `llms-full.txt`（30-60KB 的更详细版本）和每个核心功能的独立知识页面。

---

### 3. 添加 Markdown 版本标记

**现状**：`index.html` 没有声明 Markdown 版本的可选链接。

**为什么重要**：Claude Code、Cursor 等 AI 工具在获取文档时会发送 `Accept: text/markdown` header。在 `<head>` 中声明 Markdown 版本可以让这些工具直接读取结构化更好的 Markdown 内容。

**操作**：在 `index.html` 的 `<head>` 中添加一行。

**文件路径**：`index.html`

```html
<!-- 在现有 meta/link 标签附近添加 -->
<link rel="alternate" type="text/markdown" href="https://raw.githubusercontent.com/myyeti1043/iptoroute/main/README.md" />
```

**完整位置示例**：

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Free online tool to convert IP addresses...">
    <!-- ... 其他 meta ... -->
    
    <!-- Markdown alternate for AI tools -->
    <link rel="alternate" type="text/markdown" href="https://raw.githubusercontent.com/myyeti1043/iptoroute/main/README.md" />
    
    <title>IPToRoute | IP Address & Router Configuration Tool...</title>
    <!-- ... -->
</head>
```

---

### 4. 确保搜索引擎已收录

**现状**：已有 `sitemap.xml`，但不确定是否已提交到搜索引擎。

**为什么重要**：AI 搜索底层依赖搜索引擎索引。ChatGPT 搜索走 Bing，Google AI Overview 走 Google 索引，Perplexity 也依赖搜索 API。如果页面没被收录，AI 根本看不到你的内容。

**操作清单**：

| 平台 | 操作 | 链接 |
|------|------|------|
| Google Search Console | 验证域名，提交 sitemap，检查索引状态 | [search.google.com](https://search.google.com/search-console) |
| Bing Webmaster Tools | 注册账号，提交 sitemap，开启 AI Performance 面板 | [bing.com/webmasters](https://www.bing.com/webmasters) |
| IndexNow | 设置 API key，内容更新时主动通知 Bing | 通过 Bing Webmaster Tools 设置 |

**IndexNow 接入概要**：
1. 在 Bing Webmaster Tools 获取 API key
2. 在站点根目录放置 `API_KEY.txt` 文件
3. 内容更新时向 `https://www.bing.com/indexnow` 发送 POST 请求：
   ```json
   {
     "host": "iptoroute.com",
     "key": "YOUR_API_KEY",
     "urlList": [
       "https://iptoroute.com/",
       "https://iptoroute.com/docs"
     ]
   }
   ```

> 如果项目后续迁移到 Next.js、Astro 等框架，很多静态站点生成器有 IndexNow 插件可直接使用。

---

## 中优先级：提升 AI 引用质量

### 5. 为每个核心功能创建独立说明页

**现状**：`docs/` 目录有模块级技术文档（如 `app.md`、`ipConverters.md`），但缺少**面向用户的、自包含的功能说明页**。

**为什么重要**：Ahrefs 研究发现，被 AI 引用页面的标题和用户查询的语义相似度更高。独立的、标题明确的功能页比混在一个大文档里更容易被 AI 引用。

**建议新增的文档**：

| 文件 | 内容 | 目标查询 |
|------|------|---------|
| `docs/mikrotik-router-config.md` | MikroTik RouterOS 配置生成教程 | "generate mikrotik address list" |
| `docs/cisco-router-config.md` | Cisco IOS 静态路由配置生成 | "cisco static route generator" |
| `docs/fortinet-address-group.md` | Fortinet FortiOS 地址对象和组 | "fortinet address group config" |
| `docs/ip-extraction-guide.md` | IP 提取功能完整指南 | "extract IP addresses from text" |
| `docs/cidr-conversion-guide.md` | CIDR 转换详细说明 | "CIDR to subnet mask converter" |
| `docs/ip-aggregation.md` | IP 段聚合功能说明 | "aggregate IP ranges CIDR" |

**每篇文档的结构模板**：

```markdown
# [功能名称]

> 一句话摘要：这个页面是做什么的，解决什么问题。

## 概述

2-3 段说明：功能是什么、适用场景、解决什么痛点。

## 核心特性

- 特性 1：说明
- 特性 2：说明
- 特性 3：说明

## 使用步骤

1. 步骤一
2. 步骤二
3. 步骤三

## 示例

### 输入示例

```text
示例输入内容
```

### 输出示例

```text
示例输出内容
```

## 支持的参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| ... | ... | ... |

## 相关功能

- [链接到其他功能页]
```

---

### 6. 优化 README 的 AI 可引用结构

**现状**：README 是双语混排结构，信息密度高但缺少 AI 容易直接引用的"摘要块"。

**为什么重要**：AI 在回答用户问题时，会从 README 中提取关键信息。如果 README 开头就有结构化的摘要，AI 引用时更准确。

**建议修改**：在 README 顶部添加一个 AI 友好的摘要区块。

**文件路径**：`README.md`

```markdown
# IPToRoute

**IPToRoute** is a free, zero-dependency web tool that converts IP addresses between formats and generates router configurations for MikroTik, Cisco, Huawei, Juniper, and Fortinet. It runs entirely in the browser with no backend required.

**What it does**: Extract IPs from text/JSON, convert CIDR notation to subnet mask (and vice versa), generate vendor-specific router configs, aggregate overlapping IP ranges.
**Who it's for**: Network administrators, DevOps engineers, security analysts, and developers working with network infrastructure.
**Why use it**: No installation needed, works offline, supports 5 router vendors plus FQDN domain names, bilingual interface (English / Chinese).

---

[English](#english) | [中文](#中文)
```

**进阶**：可以考虑在 README 底部添加一个 `## Quick Reference` 区块，汇总所有关键命令和参数，方便 AI 直接提取：

```markdown
## Quick Reference

### Supported Router Vendors

- MikroTik RouterOS (Address List / Route modes)
- Cisco IOS (Static routes)
- Huawei VRP (Static routes)
- Juniper JunOS (Static routes)
- Fortinet FortiOS (Address objects / groups with FQDN)

### Supported Input Formats

- Plain text with mixed content
- JSON (nested arrays/objects)
- CIDR notation (e.g., `192.168.1.0/24`)
- IP + netmask (e.g., `192.168.1.0 255.255.255.0`)
- Domain names / FQDN (Fortinet mode)

### Supported Operations

- Router Config Generation
- IP Address Extraction (IPv4/IPv6, with deduplication and aggregation)
- CIDR to IP + Netmask Conversion
- IP + Netmask to CIDR Conversion
```

---

### 7. URL 结构与 SPA 路由

**现状**：`sitemap.xml` 包含 `/router-config`、`/bulk-extract`、`/cidr-to-ip`、`/ip-to-cidr` 等 URL，但项目根目录只有 `index.html`。这些路由很可能是纯前端 SPA 路由。

**问题**：搜索引擎爬虫可能无法渲染 JavaScript 来索引这些前端路由的内容。AI 搜索依赖的搜索引擎索引会遗漏这些页面。

**短期方案（不改动架构）**：

确保每个 sitemap 中的 URL 至少有一个对应的**静态资源**可被爬虫获取。几种选择：

1. **为每个路由生成独立 HTML**：如果部署在支持重定向的服务器（如 Nginx、Vercel、Cloudflare Pages），可以配置规则将所有路由指向 `index.html`，同时确保每个 URL 在首次加载时能返回正确的 HTML。

2. **用 Markdown 文档补充**：如果这些 SPA 路由没有对应的静态 HTML，至少确保每个功能都有独立的 Markdown 文档（如第 5 条建议），这样搜索引擎可以通过 `.md` 文件索引内容。

3. **更新 sitemap**：如果某些 URL 确实没有独立内容，考虑从 sitemap 中移除，只保留有实质内容的 URL。

**长期方案**：

如果项目后续演进，考虑迁移到支持静态生成的框架：

- **Astro**：零 JS 默认，每个路由生成独立 HTML，最适合内容型站点
- **Next.js (Static Export)**：`output: 'export'` 可以为每个路由生成静态 HTML
- **Vite + vite-plugin-ssr**：渐进式增加预渲染能力

---

### 8. 添加 FAQ 结构化数据

**现状**：已有 `SoftwareApplication` 和 `HowTo` 的 Schema.org JSON-LD，但缺少 FAQPage。

**为什么重要**：FAQPage 结构化数据让 Google 等搜索引擎能在搜索结果中展示问答片段，同时也为 AI 提供高质量的"问答对"内容，提升被引用的概率。

**操作**：在 `index.html` 中添加第二个 JSON-LD 脚本（与现有的 HowTo 数据并列）。

**文件路径**：`index.html`

```html
<!-- FAQ Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What router vendors does IPToRoute support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "IPToRoute supports five major router vendors: MikroTik RouterOS (address lists and routes), Cisco IOS (static routes), Huawei VRP (static routes), Juniper JunOS (static routes), and Fortinet FortiOS (address objects and groups with FQDN support)."
      }
    },
    {
      "@type": "Question",
      "name": "Can IPToRoute extract IP addresses from JSON data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, IPToRoute can extract IPv4 and IPv6 addresses as well as CIDR ranges from JSON files, plain text, network logs, and mixed content. It handles nested JSON structures automatically."
      }
    },
    {
      "@type": "Question",
      "name": "Is IPToRoute free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, IPToRoute is completely free and open source under the MIT License. It runs entirely in your browser with no backend required, so no data leaves your device."
      }
    },
    {
      "@type": "Question",
      "name": "Does IPToRoute support CIDR to subnet mask conversion?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, IPToRoute supports bidirectional conversion between CIDR notation (e.g., 192.168.1.0/24) and IP + netmask format (e.g., 192.168.1.0 255.255.255.0), including batch processing."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use IPToRoute offline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, since IPToRoute is a pure frontend application with no backend dependencies, you can download the repository and open index.html locally in any modern browser to use it offline."
      }
    },
    {
      "@type": "Question",
      "name": "Does IPToRoute support domain names (FQDN)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Fortinet FortiOS mode supports domain names and FQDN alongside IP addresses. Other router vendors that support FQDN in their configuration syntax can also utilize this feature."
      }
    }
  ]
}
</script>
```

**建议放置位置**：在现有的 `HowTo` JSON-LD 脚本之后， closing `</head>` 之前。

---

## 低优先级：锦上添花

### 9. 提交 llms.txt 到聚合平台

创建 `llms.txt` 后，可以主动提交到以下平台增加曝光：

- [llmstxt.site](https://llmstxt.site) - llms.txt 聚合目录
- [llms-txt-hub](https://github.com/answerdotai/llms-txt) - GitHub 仓库，可提 PR 加入
- [directory.llmstxt.cloud](https://directory.llmstxt.cloud) - 另一聚合目录（如有）

提交时通常只需要提供：
- 站点名称：IPToRoute
- llms.txt URL：`https://iptoroute.com/llms.txt`
- 站点描述：Free IP address processing and router configuration tool
- GitHub 链接（如要求）

---

### 10. 与其他项目互相引用

如果你维护多个开源项目或个人站点，可以在各自的 `llms.txt` 中互相引用，形成 AI 发现的网状结构：

```markdown
## Related Projects

- [Your Other Project](https://other-project.com) - Brief description
- [Your Personal Blog](https://yourblog.com) - Brief description
```

这样无论 AI 从哪个入口进来，都能顺着链接发现你的其他内容。

---

## 最小可行改动清单

如果只想花最少时间获得最大 GEO 收益，**只做这 3 件事**（总计约 30 分钟）：

| # | 改动 | 文件 | 预计时间 | 收益 |
|---|------|------|---------|------|
| 1 | 替换 robots.txt | `robots.txt` | 5 分钟 | 控制 AI 爬虫行为，防止训练滥用 |
| 2 | 创建 llms.txt | `llms.txt` | 15 分钟 | 给 AI 结构化入口，提升理解准确度 |
| 3 | 添加 Markdown alternate | `index.html` | 1 分钟 | AI 工具优先读取 Markdown 版本 |
| 4 | 提交到搜索引擎 | Google/Bing Webmaster | 10 分钟 | 确保 AI 搜索底层索引覆盖 |

这四项改动都不涉及代码重构，也不影响现有功能，但能让 AI 搜索更好地发现、理解和引用你的项目。

> 正如原文所说：**"值得花一个小时整一整，但不值得花一周"** ——产品本身才是核心竞争力，GEO 只是放大器。

---

## 参考

- [Tw93 的 GEO 实践分享](https://x.com/HiTw93/status/2050189572999618982) - 本文的主要参考来源
- [llms.txt 标准提案](https://llmstxt.org/) - llms.txt 格式规范
- [BuiltWith llms.txt 追踪](https://trends.builtwith.com/llmstxt) - llms.txt 采用率数据
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [IndexNow 协议](https://www.indexnow.org/)
- [Schema.org FAQPage](https://schema.org/FAQPage) - FAQ 结构化数据规范
