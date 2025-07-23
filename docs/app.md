# app.js Documentation

## Overview

The `app.js` file is the main application file that initializes all functionality and handles UI interactions for the IPToRoute tool.

## Key Functions

### `init()`
Initializes the application by setting up all UI components and event listeners.

### `setupTabNavigation()`
Sets up tab navigation functionality, allowing users to switch between different operation modes (Router Config, IP Extract, CIDR→IP, IP→CIDR).

### `setupInputHandlers()`
Sets up handlers for input-related actions such as clearing the input area and pasting from clipboard.

### `setupConvertButton()`
Sets up the convert button handler that triggers the processing of input data.

### `processInput()`
Main processing function that handles input based on the current mode and generates appropriate output.

### `setupCopyDownloadButtons()`
Sets up copy and download functionality for the output area.

### `setupRouterTypeHandlers()`
Handles router type selection and shows/hides router-specific options.

### `updateLanguage()`
Updates the UI language based on user selection.

## Global Variables

- `currentMode` - Tracks the current operation mode
- `currentLang` - Tracks the current language
- `inputArea` - Reference to the input textarea
- `outputArea` - Reference to the output textarea

## Event Listeners

- `DOMContentLoaded` - Initializes the application when the DOM is loaded
- `hashchange` - Handles URL hash changes for tab navigation