# historyManager.js Documentation

## Overview

The `historyManager.js` module manages operation history, allowing users to view and restore previous operations.

## Key Functions

### `addToRecentOperations(input)`
Adds an operation to the recent operations history.

**Parameters:**
- `input` (string): Input data for the operation

### `loadRecentOperations()`
Loads recent operations from localStorage.

### `refreshRecentOperations()`
Refreshes the recent operations display in the UI.

### `restoreOperation(index)`
Restores a previous operation by index.

**Parameters:**
- `index` (number): Index of the operation to restore

### `clearOperationHistory()`
Clears the operation history.

### `setupRecentOperations()`
Sets up the recent operations UI components and event listeners.