# webWorker.js and worker.js Documentation

## Overview

The `webWorker.js` and `worker.js` modules implement web workers for heavy processing tasks, improving application performance by offloading work to background threads.

## webWorker.js Functions

### `initWebWorker()`
Initializes the web worker for background processing.

### `extractIpsWithWorker(text, ipv4Only)`
Extracts IP addresses using a web worker to prevent UI blocking.

**Parameters:**
- `text` (string): Text content to process
- `ipv4Only` (boolean): If true, only extract IPv4 addresses

**Returns:**
- (Promise): Promise that resolves with extracted IP addresses

### `validateIpsWithWorker(ipAddresses)`
Validates IP addresses using a web worker.

**Parameters:**
- `ipAddresses` (array): Array of IP addresses to validate

**Returns:**
- (Promise): Promise that resolves with validation results

## worker.js

The `worker.js` file contains the actual web worker implementation that runs in a separate thread. It includes functions for IP extraction and validation that can be executed without blocking the main UI thread.