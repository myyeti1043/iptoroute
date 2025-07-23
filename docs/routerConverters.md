# routerConverters.js Documentation

## Overview

The `routerConverters.js` module contains functions for converting IP addresses to router-specific configurations for various networking platforms.

## Key Functions

### `convertCidrToCisco(line)`
Converts CIDR notation to Cisco IOS format.

**Parameters:**
- `line` (string): CIDR notation (e.g., 192.168.1.0/24) or IP address

**Returns:**
- (string|null): Cisco IOS configuration or null if invalid

### `convertCidrToRouterOs(line)`
Converts CIDR notation to MikroTik RouterOS format.

**Parameters:**
- `line` (string): CIDR notation (e.g., 192.168.1.0/24) or IP address

**Returns:**
- (string|null): MikroTik RouterOS configuration or null if invalid

### `convertCidrToHuawei(line)`
Converts CIDR notation to Huawei VRP format.

**Parameters:**
- `line` (string): CIDR notation (e.g., 192.168.1.0/24) or IP address

**Returns:**
- (string|null): Huawei VRP configuration or null if invalid

### `convertCidrToJuniper(line)`
Converts CIDR notation to Juniper JunOS format.

**Parameters:**
- `line` (string): CIDR notation (e.g., 192.168.1.0/24) or IP address

**Returns:**
- (string|null): Juniper JunOS configuration or null if invalid

### `convertCidrToFortinet(line)`
Converts CIDR notation or FQDN to Fortinet FortiOS format.

**Parameters:**
- `line` (string): CIDR notation (e.g., 192.168.1.0/24), IP address, or FQDN

**Returns:**
- (string|null): Fortinet FortiOS configuration or null if invalid

### `extractIpFromCiscoRoute(route)`
Extracts IP and netmask from Cisco route command.

**Parameters:**
- `route` (string): Cisco route command

**Returns:**
- (object|null): Extracted IP and mask, or null if invalid