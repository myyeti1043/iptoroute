# ipConverters.js 文档

## 概述

`ipConverters.js` 模块包含用于 IP 地址转换和验证的函数。它提供了处理各种格式 IP 地址的核心工具。

## 主要函数

### `convertCidrToIpMask(line)`
将 CIDR 表示法转换为 IP 和子网掩码格式。

**参数:**
- `line` (string): CIDR 表示法 (例如, 192.168.1.0/24)

**返回值:**
- (string): IP 和子网掩码 (例如, 192.168.1.0 255.255.255.0)

### `convertIpMaskToCidr(line)`
将 IP 和子网掩码转换为 CIDR 表示法。

**参数:**
- `line` (string): IP 和子网掩码 (例如, 192.168.1.0 255.255.255.0)

**返回值:**
- (string): CIDR 表示法 (例如, 192.168.1.0/24)

### `convertIpMaskToCidrFormat(ip, mask)`
将 IP 和掩码转换为 CIDR 格式，必要时进行手动计算。

**参数:**
- `ip` (string): IP 地址
- `mask` (string): 子网掩码

**返回值:**
- (string): CIDR 表示法

### `extractIp(line)`
从文本行中提取 IP。

**参数:**
- `line` (string): 可能包含 IP 地址的文本行

**返回值:**
- (string|null): 提取的 IP 或未找到时返回 null

### `isValidIp(ip)`
检查字符串是否为有效的 IP 地址 (IPv4 或 IPv6)。

**参数:**
- `ip` (string): 要验证的 IP 地址

**返回值:**
- (boolean): 如果是有效 IP 则为 true

### `isValidMask(mask)`
验证字符串是否为有效的子网掩码。

**参数:**
- `mask` (string): 要验证的子网掩码

**返回值:**
- (boolean): 如果是有效子网掩码则为 true

### `compareIPs(a, b)`
比较两个 IP 地址以进行排序。

**参数:**
- `a` (string): 第一个 IP 地址
- `b` (string): 第二个 IP 地址

**返回值:**
- (number): 比较结果

### `validateIpAddresses(ipAddresses)`
验证 IP 地址列表。

**参数:**
- `ipAddresses` (array): 要验证的 IP 地址数组

**返回值:**
- (object): 验证结果，包含有效标志和消息

### `getNetworkAddress(ip, mask)`
计算网络地址。

**参数:**
- `ip` (string): IP 地址
- `mask` (string): 子网掩码

**返回值:**
- (string): 网络地址

## 常量

### `cidrToMaskMap`
CIDR 值到子网掩码字符串的映射。

### `maskToCidrMap`
子网掩码字符串到 CIDR 值的映射。