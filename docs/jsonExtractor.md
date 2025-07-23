# jsonExtractor.js Documentation

## Overview

The `jsonExtractor.js` module handles extraction of IP addresses from JSON data and text content.

## Key Functions

### `extractIpPrefixesFromJson(jsonData)`
Extracts IP prefixes from JSON data, particularly useful for processing cloud provider IP range data.

**Parameters:**
- `jsonData` (object): Parsed JSON data

**Returns:**
- (array): Array of extracted IP prefixes

### `findAllIpAddresses(text, ipv4Only)`
Finds all IP addresses in text content.

**Parameters:**
- `text` (string): Text content to search
- `ipv4Only` (boolean): If true, only extract IPv4 addresses

**Returns:**
- (array): Array of found IP addresses