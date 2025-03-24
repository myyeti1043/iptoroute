/**
 * Analytics Module
 * Handles SEO and analytics functionality for the application
 */

/**
 * Initialize SEO features and analytics
 * Only called in production environment
 */
function initSEO() {
    // Set up meta tags dynamically
    setupMetaTags();
    
    // Initialize analytics if not in development mode
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
        loadGoogleAnalytics();
        setupAnalytics();
    } else {
        console.log('Development mode - analytics disabled');
    }
    
    // Set up structured data
    setupStructuredData();
    
    // Monitor performance (even in development)
    monitorPerformance();
    
    console.log('SEO and analytics initialized');
}

/**
 * Set up meta tags for better SEO
 */
function setupMetaTags() {
    // Update meta description based on current language
    const currentLang = localStorage.getItem('language') || 'en';
    const description = currentLang === 'en' 
        ? 'IP address conversion tool for network engineers - Extract IPs, generate router configs, convert between CIDR and netmask formats'
        : 'IP地址转换工具，适用于网络工程师 - 提取IP地址，生成路由器配置，在CIDR和子网掩码格式之间转换';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', description);
    } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
    }
    
    // Set canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = window.location.href.split('#')[0]; // Remove hash
        document.head.appendChild(link);
    }
    
    // Update page title based on current mode
    const currentMode = getCurrentMode();
    if (currentMode) {
        document.title = `IPToRoute - ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1).replace(/-/g, ' ')} | Network Tools`;
    }
}

/**
 * Get current mode from URL or default
 * @returns {string} Current mode
 */
function getCurrentMode() {
    const hash = window.location.hash.substring(1);
    return hash || 'router-config';
}

/**
 * Set up structured data for better search engine understanding
 */
function setupStructuredData() {
    // Create structured data for the tool
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "IP To Route",
        "applicationCategory": "NetworkingApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "A free tool for network engineers to convert IP addresses and generate router configurations"
    };
    
    // Add structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    // Add breadcrumb structured data
    addBreadcrumbStructuredData();
}

/**
 * Add breadcrumb structured data
 */
function addBreadcrumbStructuredData() {
    const currentMode = getCurrentMode();
    
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://iptoroute.com/"
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": currentMode.charAt(0).toUpperCase() + currentMode.slice(1).replace(/-/g, ' '),
            "item": `https://iptoroute.com/${currentMode}`
        }]
    };
    
    // Add breadcrumb structured data
    const scriptElement = document.createElement('script');
    scriptElement.type = 'application/ld+json';
    scriptElement.text = JSON.stringify(breadcrumbData);
    document.head.appendChild(scriptElement);
}

/**
 * Load Google Analytics
 */
function loadGoogleAnalytics() {
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // Replace with your Google Analytics 4 measurement ID
    
    // Create and add GA script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // Replace with your Google Analytics 4 measurement ID
    document.head.appendChild(gaScript);
}

/**
 * Monitor website performance
 */
function monitorPerformance() {
    // Monitor and report performance metrics
    if (window.performance && 'getEntriesByType' in performance) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navEntry = performance.getEntriesByType('navigation')[0];
                const paintEntries = performance.getEntriesByType('paint');
                
                // Log performance metrics
                console.log('Navigation type:', navEntry.type);
                console.log('DOMContentLoaded time:', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart, 'ms');
                console.log('Page load time:', navEntry.loadEventEnd - navEntry.startTime, 'ms');
                
                // First paint and first contentful paint
                paintEntries.forEach(entry => {
                    console.log(`${entry.name}:`, entry.startTime, 'ms');
                });
                
                // Send performance data to analytics if load time is concerning
                if (navEntry.loadEventEnd - navEntry.startTime > 3000) {
                    // Alert for slow page loads - can be replaced with proper reporting
                    trackEvent('performance_issue', {
                        'event_category': 'performance',
                        'event_label': 'slow_page_load',
                        'value': Math.round(navEntry.loadEventEnd - navEntry.startTime)
                    });
                }
            }, 0);
        });
    }
}

/**
 * Set up analytics tracking
 * Only loads in production environment
 */
function setupAnalytics() {
    // Only proceed if not in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        return;
    }
    
    // Simple page view tracking
    trackPageView();
    
    // Track conversion events
    setupConversionTracking();
    
    // Track user interactions
    trackUserInteractions();
}

/**
 * Track user interactions for analytics
 */
function trackUserInteractions() {
    // Track tab changes
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            trackEvent('tab_change', {
                'event_category': 'engagement',
                'event_label': tabName
            });
        });
    });
    
    // Track conversions
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.addEventListener('click', () => {
            trackEvent('conversion', {
                'event_category': 'engagement',
                'event_label': getCurrentMode()
            });
        });
    }
}

/**
 * Track page view
 */
function trackPageView() {
    // Only proceed if not in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        return;
    }
    
    try {
        // Track page view with Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'page_view', {
                'page_title': document.title,
                'page_location': window.location.href,
                'page_path': window.location.pathname
            });
        }
        
        // Additional custom tracking
        const pageData = {
            type: 'pageview',
            page: window.location.pathname,
            referrer: document.referrer,
            language: navigator.language,
            screenWidth: window.innerWidth,
            timestamp: new Date().toISOString()
        };
        
        // Use sendBeacon for non-blocking tracking if available
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics', JSON.stringify(pageData));
        }
    } catch (error) {
        console.error('Error tracking page view:', error);
    }
}

/**
 * Set up tracking for conversion events
 */
function setupConversionTracking() {
    // Track button clicks
    const trackButtons = ['convertBtn', 'copyBtn', 'downloadBtn'];
    
    trackButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                trackEvent('button_click', { button: buttonId });
            });
        }
    });
    
    // Track tab changes
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            trackEvent('tab_change', { tab });
        });
    });
}

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {Object} eventData - Additional data for the event
 */
function trackEvent(eventName, eventData = {}) {
    // Only proceed if not in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        return;
    }
    
    try {
        // Track with Google Analytics if available
        if (typeof gtag === 'function') {
            gtag('event', eventName, eventData);
        }
        
        // Additional custom tracking
        const data = {
            type: 'event',
            event: eventName,
            data: eventData,
            page: window.location.pathname,
            timestamp: new Date().toISOString()
        };
        
        // Use sendBeacon for non-blocking tracking
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics', JSON.stringify(data));
        }
    } catch (error) {
        console.error('Error tracking event:', error);
    }
}

/**
 * Log errors to analytics
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
function logErrorToAnalytics(error, context) {
    // 检查是否在生产环境并且分析工具已加载
    if (window.location.hostname !== 'localhost' && 
        !window.location.hostname.includes('127.0.0.1')) {
        
        // 使用Google Analytics记录错误
        if (typeof gtag === 'function') {
            gtag('event', 'error', {
                'event_category': 'JavaScript',
                'event_label': context || 'Unknown context',
                'value': error.message || 'No error message',
                'non_interaction': true
            });
        }
        
        // 使用自定义分析记录错误
        const errorData = {
            type: 'error',
            errorMessage: error.message || 'No error message',
            errorStack: error.stack || 'No stack trace',
            context: context || 'Unknown context',
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
        
        // 使用sendBeacon非阻塞发送
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/error-log', JSON.stringify(errorData));
        }
    }
    
    // 在开发环境中记录到控制台
    console.error(`Error in ${context || 'Unknown context'}:`, error);
}

// Export functions for use in other modules
export {
    initSEO,
    trackEvent,
    trackPageView,
    logErrorToAnalytics,
    monitorPerformance,
    loadGoogleAnalytics
};
