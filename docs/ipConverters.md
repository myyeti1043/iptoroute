# ipConverters.js Documentation

## Overview

The `ipConverters.js` module contains functions for IP address conversion and validation. It provides core utilities for working with IP addresses in various formats.

## Key Functions

### `convertCidrToIpMask(line)`
Converts CIDR notation to IP with netmask format.

**Parameters:**
- `line` (string): CIDR notation (e.g., 192.168.1.0/24)

**Returns:**
- (string): IP with netmask (e.g., 192.168.1.0 255.255.255.0)

### `convertIpMaskToCidr(line)`
Converts IP with netmask to CIDR notation.

**Parameters:**
- `line` (string): IP with netmask (e.g., 192.168.1.0 255.255.255.0)

**Returns:**
- (string): CIDR notation (e.g., 192.168.1.0/24)

### `convertIpMaskToCidrFormat(ip, mask)`
Converts IP and mask to CIDR format with manual calculation if needed.

**Parameters:**
- `ip` (string): IP address
- `mask` (string): Netmask

**Returns:**
- (string): CIDR notation

### `extractIp(line)`
Extracts IP from a line of text.

**Parameters:**
- `line` (string): Line of text that may contain an IP address

**Returns:**
- (string|null): Extracted IP or null if not found

### `isValidIp(ip)`
Checks if a string is a valid IP address (IPv4 or IPv6).

**Parameters:**
- `ip` (string): IP address to validate

**Returns:**
- (boolean): True if valid IP

### `isValidMask(mask)`
Validates if a string is a valid netmask.

**Parameters:**
- `mask` (string): Netmask to validate

**Returns:**
- (boolean): True if valid netmask

### `compareIPs(a, b)`
Compares two IP addresses for sorting.

**Parameters:**
- `a` (string): First IP address
- `b` (string): Second IP address

**Returns:**
- (number): Comparison result

### `validateIpAddresses(ipAddresses)`
Validates a list of IP addresses.

**Parameters:**
- `ipAddresses` (array): Array of IP addresses to validate

**Returns:**
- (object): Validation result with valid flag and message

### `getNetworkAddress(ip, mask)`
Calculates the network address.

**Parameters:**
- `ip` (string): IP address
- `mask` (string): Subnet mask

**Returns:**
- (string): Network address

## Constants

### `cidrToMaskMap`
Mapping of CIDR values to netmask strings.

### `maskToCidrMap`
Mapping of netmask strings to CIDR values.