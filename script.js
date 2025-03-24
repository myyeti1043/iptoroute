document.addEventListener('DOMContentLoaded', function() {
    // 导入所需模块
    import('./js/ipConverters.js')
        .then(ipConverters => {
            window.convertCidrToIpMask = ipConverters.convertCidrToIpMask;
            window.convertIpMaskToCidr = ipConverters.convertIpMaskToCidr;
            window.isValidIp = ipConverters.isValidIp;
            window.isValidMask = ipConverters.isValidMask;
            window.compareIPs = ipConverters.compareIPs;
            window.extractIp = ipConverters.extractIp;
            console.log('IP Converters module loaded');
        })
        .catch(err => console.error('Failed to load ipConverters module:', err));

    import('./js/routerConverters.js')
        .then(routerConverters => {
            window.convertCidrToCisco = routerConverters.convertCidrToCisco;
            window.convertCidrToRouterOs = routerConverters.convertCidrToRouterOs;
            window.convertCidrToHuawei = routerConverters.convertCidrToHuawei;
            window.convertCidrToJuniper = routerConverters.convertCidrToJuniper;
            window.convertCidrToFortinet = routerConverters.convertCidrToFortinet;
            window.convertFqdnToFortinet = routerConverters.convertFqdnToFortinet;
            window.extractIpFromCiscoRoute = routerConverters.extractIpFromCiscoRoute;
            console.log('Router Converters module loaded');
        })
        .catch(err => console.error('Failed to load routerConverters module:', err));

    import('./js/jsonExtractor.js')
        .then(jsonExtractor => {
            window.extractIpPrefixesFromJson = jsonExtractor.extractIpPrefixesFromJson;
            window.findAllIpAddresses = jsonExtractor.findAllIpAddresses;
            console.log('JSON Extractor module loaded');
        })
        .catch(err => console.error('Failed to load jsonExtractor module:', err));

    import('./js/uiHelpers.js')
        .then(uiHelpers => {
            window.updateOutputPlaceholder = uiHelpers.updateOutputPlaceholder;
            window.applyRouterSpecificOptions = uiHelpers.applyRouterSpecificOptions;
            window.showLoading = uiHelpers.showLoading;
            window.hideLoading = uiHelpers.hideLoading;
            window.setupResizer = uiHelpers.setupResizer;
            window.showNotification = uiHelpers.showNotification;
            window.handleError = uiHelpers.handleError;
            window.getCurrentMode = uiHelpers.getCurrentMode;
            window.getCurrentLang = uiHelpers.getCurrentLang;
            window.updatePageTitle = uiHelpers.updatePageTitle;
            console.log('UI Helpers module loaded');
        })
        .catch(err => console.error('Failed to load uiHelpers module:', err));

    import('./js/historyManager.js')
        .then(historyManager => {
            window.addToRecentOperations = historyManager.addToRecentOperations;
            window.loadRecentOperations = historyManager.loadRecentOperations;
            window.refreshRecentOperations = historyManager.refreshRecentOperations;
            window.restoreOperation = historyManager.restoreOperation;
            window.clearOperationHistory = historyManager.clearOperationHistory;
            console.log('History Manager module loaded');
        })
        .catch(err => console.error('Failed to load historyManager module:', err));

    import('./js/webWorker.js')
        .then(webWorker => {
            window.initWebWorker = webWorker.initWebWorker;
            window.extractIpsWithWorker = webWorker.extractIpsWithWorker;
            window.validateIpsWithWorker = webWorker.validateIpsWithWorker;
            window.terminateWorker = webWorker.terminateWorker;
            console.log('Web Worker module loaded');
        })
        .catch(err => console.error('Failed to load webWorker module:', err));

    import('./js/analytics.js')
        .then(analytics => {
            window.initSEO = analytics.initSEO;
            window.trackEvent = analytics.trackEvent;
            window.trackPageView = analytics.trackPageView;
            window.logErrorToAnalytics = analytics.logErrorToAnalytics;
            window.monitorPerformance = analytics.monitorPerformance;
            window.loadGoogleAnalytics = analytics.loadGoogleAnalytics;
            window.addStructuredData = analytics.addStructuredData;
            window.trackUserInteractions = analytics.trackUserInteractions;
            console.log('Analytics module loaded');
        })
        .catch(err => console.error('Failed to load analytics module:', err));

    import('./js/translations.js')
        .then(translationsModule => {
            // 保留translations对象，因为它在多处被使用
            if (!window.translations) {
                window.translations = translationsModule.default;
            }
            console.log('Translations module loaded');
        })
        .catch(err => console.error('Failed to load translations module:', err));

    // 初始化应用程序
    import('./js/app.js')
        .then(() => {
            console.log('Application initialized');
        })
        .catch(err => console.error('Failed to load app module:', err));
});
