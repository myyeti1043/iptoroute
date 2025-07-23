# routerConverters.js 文档

## 概述

`routerConverters.js` 模块包含将 IP 地址转换为各种网络平台特定配置的函数。

## 主要函数

### `convertCidrToCisco(line)`
将 CIDR 表示法转换为 Cisco IOS 格式。

**参数:**
- `line` (string): CIDR 表示法 (例如, 192.168.1.0/24) 或 IP 地址

**返回值:**
- (string|null): Cisco IOS 配置或无效时返回 null

### `convertCidrToRouterOs(line)`
将 CIDR 表示法转换为 MikroTik RouterOS 格式。

**参数:**
- `line` (string): CIDR 表示法 (例如, 192.168.1.0/24) 或 IP 地址

**返回值:**
- (string|null): MikroTik RouterOS 配置或无效时返回 null

### `convertCidrToHuawei(line)`
将 CIDR 表示法转换为 Huawei VRP 格式。

**参数:**
- `line` (string): CIDR 表示法 (例如, 192.168.1.0/24) 或 IP 地址

**返回值:**
- (string|null): Huawei VRP 配置或无效时返回 null

### `convertCidrToJuniper(line)`
将 CIDR 表示法转换为 Juniper JunOS 格式。

**参数:**
- `line` (string): CIDR 表示法 (例如, 192.168.1.0/24) 或 IP 地址

**返回值:**
- (string|null): Juniper JunOS 配置或无效时返回 null

### `convertCidrToFortinet(line)`
将 CIDR 表示法或 FQDN 转换为 Fortinet FortiOS 格式。

**参数:**
- `line` (string): CIDR 表示法 (例如, 192.168.1.0/24)、IP 地址或 FQDN

**返回值:**
- (string|null): Fortinet FortiOS 配置或无效时返回 null

### `extractIpFromCiscoRoute(route)`
从 Cisco 路由命令中提取 IP 和子网掩码。

**参数:**
- `route` (string): Cisco 路由命令

**返回值:**
- (object|null): 提取的 IP 和掩码，或无效时返回 null