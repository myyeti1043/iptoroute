# analytics.js Documentation

## Overview

The `analytics.js` module handles analytics and SEO features for the IPToRoute application.

## Key Functions

### `initSEO()`
Initializes SEO features including structured data and meta tags.

### `trackEvent(category, action, label)`
Tracks user events for analytics.

**Parameters:**
- `category` (string): Event category
- `action` (string): Event action
- `label` (string): Event label

### `trackPageView()`
Tracks page views for analytics.

## Implementation Details

This module is designed to work with Google Analytics but can be adapted for other analytics platforms. It includes features for:

1. Structured data for rich search results
2. Event tracking for user interactions
3. Page view tracking
4. Development mode detection (disables analytics in development)

## Privacy Considerations

The analytics implementation respects user privacy and only collects anonymous usage data. It does not track personal information or sensitive data.