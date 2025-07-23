# IPToRoute Developer Documentation

This documentation is for developers who want to contribute to or understand the IPToRoute project.

## Project Overview

IPToRoute is a lightweight web tool for IP address conversion and router configuration generation, built with vanilla JavaScript. It provides various networking utilities for IT professionals and network engineers.

## Project Structure

```
iptoroute/
├── index.html          # Main HTML page
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript file
├── js/                 # JavaScript modules
│   ├── app.js          # Main application logic
│   ├── ipConverters.js # IP conversion functions
│   ├── routerConverters.js # Router configuration generation
│   ├── jsonExtractor.js # JSON parsing utilities
│   ├── uiHelpers.js    # UI helper functions
│   ├── historyManager.js # Operation history management
│   ├── webWorker.js    # Web worker implementation
│   ├── worker.js       # Web worker script
│   ├── translations.js # UI translations
│   └── analytics.js    # Analytics implementation
├── docs/               # Developer documentation (this folder)
├── tests/              # Test files
├── contact/            # Contact page
├── privacy-policy/     # Privacy policy page
├── terms-of-service/   # Terms of service page
├── cookie-policy/      # Cookie policy page
├── robots.txt          # Robots.txt file
├── sitemap.xml         # Sitemap
├── LICENSE             # License file
├── README.md           # Project README
├── CONTRIBUTING.md     # Contribution guidelines
└── .env                # Environment variables
```

## Technologies Used

- Vanilla JavaScript (ES6+)
- HTML5
- CSS3
- Web Workers for heavy processing
- LocalStorage for data persistence
- No external dependencies

## Core Modules

### 1. app.js
Main application file that initializes all functionality and handles UI interactions.

Key functions:
- `init()` - Initializes the application
- `setupTabNavigation()` - Sets up tab navigation
- `setupInputHandlers()` - Sets up input field handlers
- `setupConvertButton()` - Sets up convert button handler
- `processInput()` - Main processing function
- `setupCopyDownloadButtons()` - Sets up copy/download functionality
- `setupRouterTypeHandlers()` - Handles router type selection
- `updateLanguage()` - Updates UI language

### 2. ipConverters.js
Contains functions for IP address conversion and validation.

Key functions:
- `convertCidrToIpMask()` - Converts CIDR to IP+netmask format
- `convertIpMaskToCidr()` - Converts IP+netmask to CIDR format
- `isValidIp()` - Validates IP addresses
- `isValidMask()` - Validates subnet masks
- `compareIPs()` - Compares IP addresses for sorting

### 3. routerConverters.js
Contains functions for generating router-specific configurations.

Key functions:
- `convertCidrToCisco()` - Generates Cisco IOS configuration
- `convertCidrToRouterOs()` - Generates MikroTik RouterOS configuration
- `convertCidrToHuawei()` - Generates Huawei VRP configuration
- `convertCidrToJuniper()` - Generates Juniper JunOS configuration
- `convertCidrToFortinet()` - Generates Fortinet FortiOS configuration

### 4. jsonExtractor.js
Handles extraction of IP addresses from JSON data.

Key functions:
- `extractIpPrefixesFromJson()` - Extracts IP prefixes from JSON
- `findAllIpAddresses()` - Finds all IP addresses in text

### 5. uiHelpers.js
Provides UI helper functions.

Key functions:
- `updateOutputPlaceholder()` - Updates output area placeholder
- `applyRouterSpecificOptions()` - Shows/hides router-specific options
- `showLoading()` / `hideLoading()` - Shows/hides loading indicators
- `showNotification()` - Displays notifications
- `handleError()` - Handles errors gracefully

### 6. historyManager.js
Manages operation history.

Key functions:
- `addToRecentOperations()` - Adds operation to history
- `loadRecentOperations()` - Loads history from localStorage
- `restoreOperation()` - Restores a previous operation
- `clearOperationHistory()` - Clears operation history

### 7. webWorker.js / worker.js
Implements web workers for heavy processing tasks.

Key functions:
- `initWebWorker()` - Initializes web worker
- `extractIpsWithWorker()` - Extracts IPs using web worker
- `validateIpsWithWorker()` - Validates IPs using web worker

### 8. translations.js
Contains UI translations for English and Chinese.

Structure:
- `translations.en` - English translations
- `translations.zh` - Chinese translations

### 9. analytics.js
Handles analytics and SEO features.

Key functions:
- `initSEO()` - Initializes SEO features
- `trackEvent()` - Tracks user events
- `trackPageView()` - Tracks page views

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/myyeti1043/iptoroute.git
   ```

2. Navigate to the project directory:
   ```bash
   cd iptoroute
   ```

3. Open `index.html` in your browser to run locally.

## Coding Standards

- Use consistent indentation (2 spaces)
- Follow camelCase naming for variables and functions
- Use descriptive variable and function names
- Comment complex logic
- Keep functions small and focused
- Use ES6 features where appropriate

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed contribution guidelines.

## Testing

Tests are located in the `tests/` directory. Open `tests/test-runner.html` in your browser to run tests.

## Deployment

This is a static site that can be deployed to any web hosting service that serves static files.

## License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.