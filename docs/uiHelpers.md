# uiHelpers.js Documentation

## Overview

The `uiHelpers.js` module provides UI helper functions for managing the user interface elements and interactions.

## Key Functions

### `updateOutputPlaceholder()`
Updates the output area placeholder based on current mode and router type.

### `applyRouterSpecificOptions()`
Shows or hides router-specific options based on the selected router type.

### `showLoading()`
Shows the loading indicator during processing.

### `hideLoading()`
Hides the loading indicator after processing is complete.

### `setupResizer()`
Sets up the resizer functionality for adjusting the input/output panel sizes.

### `showNotification(message, type)`
Displays a notification message to the user.

**Parameters:**
- `message` (string): Notification message
- `type` (string): Notification type (success, error, warning, info)

### `handleError(error, context)`
Handles errors gracefully and displays appropriate messages.

**Parameters:**
- `error` (Error): Error object
- `context` (string): Context where the error occurred

### `getCurrentMode()`
Gets the current operation mode.

**Returns:**
- (string): Current mode

### `getCurrentLang()`
Gets the current language.

**Returns:**
- (string): Current language

### `updatePageTitle(lang)`
Updates the page title based on the selected language.

**Parameters:**
- `lang` (string): Language code