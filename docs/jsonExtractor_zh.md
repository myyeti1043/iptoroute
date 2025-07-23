# jsonExtractor.js 文档

## 概述

`jsonExtractor.js` 模块处理从 JSON 数据和文本内容中提取 IP 地址。

## 主要函数

### `extractIpPrefixesFromJson(jsonData)`
从 JSON 数据中提取 IP 前缀，特别适用于处理云提供商的 IP 范围数据。

**参数:**
- `jsonData` (object): 解析的 JSON 数据

**返回值:**
- (array): 提取的 IP 前缀数组

### `findAllIpAddresses(text, ipv4Only)`
在文本内容中查找所有 IP 地址。

**参数:**
- `text` (string): 要搜索的文本内容
- `ipv4Only` (boolean): 如果为 true，则仅提取 IPv4 地址

**返回值:**
- (array): 找到的 IP 地址数组