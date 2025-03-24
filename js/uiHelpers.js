/**
 * UI Helpers Module
 * Contains functions for UI manipulation and user experience
 */

// Import translations
import translations from './translations.js';

/**
 * Update output placeholder based on current mode and router type
 */
function updateOutputPlaceholder() {
    const outputArea = document.getElementById('outputArea');
    if (!outputArea) return;
    
    const currentMode = getCurrentMode();
    const currentLang = getCurrentLang();
    
    if (currentMode === 'bulk-extract') {
        outputArea.placeholder = translations[currentLang]['output-placeholder-bulk'];
    } else if (currentMode === 'router-config') {
        const routerType = document.getElementById('routerType')?.value;
        if (routerType) {
            switch (routerType) {
                case 'routeros':
                    // Check if address-list or route is selected
                    const routerosType = document.querySelector('input[name="routeros-type"]:checked')?.value;
                    if (routerosType === 'route') {
                        outputArea.placeholder = translations[currentLang]['output-placeholder-routeros-route'];
                    } else {
                        outputArea.placeholder = translations[currentLang]['output-placeholder-routeros-addresslist'];
                    }
                    break;
                case 'cisco':
                    outputArea.placeholder = translations[currentLang]['output-placeholder-cisco'];
                    break;
                case 'huawei':
                    outputArea.placeholder = translations[currentLang]['output-placeholder-huawei'];
                    break;
                case 'juniper':
                    outputArea.placeholder = translations[currentLang]['output-placeholder-juniper'];
                    break;
                case 'fortinet':
                    outputArea.placeholder = translations[currentLang]['output-placeholder-fortinet'];
                    break;
                default:
                    outputArea.placeholder = translations[currentLang]['output-placeholder-default'];
            }
        }
    } else if (currentMode === 'cidr-to-ip') {
        outputArea.placeholder = translations[currentLang]['output-placeholder-cidr-ip'];
    } else if (currentMode === 'ip-to-cidr') {
        outputArea.placeholder = translations[currentLang]['output-placeholder-ip-cidr'];
    } else {
        outputArea.placeholder = translations[currentLang]['output-placeholder-default'];
    }
}

/**
 * Apply router-specific options based on selected router type
 * @param {Object} options - Router-specific options to apply
 */
function applyRouterSpecificOptions(options) {
    if (!options || !options.routerType) return;
    
    // First hide all router-specific option containers
    const optionContainers = document.querySelectorAll('.router-specific-options');
    optionContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // Show the appropriate container for the selected router type
    const selectedContainer = document.getElementById(`${options.routerType}Options`);
    if (selectedContainer) {
        selectedContainer.style.display = 'block';
    }
    
    switch (options.routerType) {
        case 'routeros':
            // Apply RouterOS options
            if (options.routerosType) {
                const routerosTypeRadio = document.querySelector(`input[name="routeros-type"][value="${options.routerosType}"]`);
                if (routerosTypeRadio) {
                    routerosTypeRadio.checked = true;
                    // Trigger change event
                    routerosTypeRadio.dispatchEvent(new Event('change'));
                }
            }
            
            // Set RouterOS gateway
            if (options.routerosGateway !== undefined) {
                const gateway = document.getElementById('routerosGateway');
                if (gateway) gateway.value = options.routerosGateway;
            }
            
            // Set list name
            if (options.listName !== undefined) {
                const listName = document.getElementById('listName');
                if (listName) listName.value = options.listName;
            }
            
            // Special handling for RouterOS
            const routerosType = document.querySelector('input[name="routeros-type"]:checked')?.value;
            const routerosAddressListOptions = document.getElementById('routerosAddressListOptions');
            const routerosRouteOptions = document.getElementById('routerosRouteOptions');
            
            if (routerosType === 'route') {
                if (routerosAddressListOptions) routerosAddressListOptions.style.display = 'none';
                if (routerosRouteOptions) routerosRouteOptions.style.display = 'block';
            } else {
                if (routerosAddressListOptions) routerosAddressListOptions.style.display = 'block';
                if (routerosRouteOptions) routerosRouteOptions.style.display = 'none';
            }
            break;
            
        case 'cisco':
            // Apply Cisco options
            if (options.nextHopIp !== undefined) {
                const nextHop = document.getElementById('nextHopIp');
                if (nextHop) nextHop.value = options.nextHopIp;
            }
            
            if (options.routeName !== undefined) {
                const routeName = document.getElementById('routeName');
                if (routeName) routeName.value = options.routeName;
            }
            break;
            
        case 'huawei':
            // Apply Huawei options
            if (options.huaweiNextHop !== undefined) {
                const nextHop = document.getElementById('huaweiNextHop');
                if (nextHop) nextHop.value = options.huaweiNextHop;
            }
            break;
            
        case 'juniper':
            // Apply Juniper options
            if (options.juniperNextHop !== undefined) {
                const nextHop = document.getElementById('juniperNextHop');
                if (nextHop) nextHop.value = options.juniperNextHop;
            }
            break;
            
        case 'fortinet':
            // Apply Fortinet options
            if (options.fortinetType) {
                const fortinetTypeRadio = document.querySelector(`input[name="fortinet-type"][value="${options.fortinetType}"]`);
                if (fortinetTypeRadio) {
                    fortinetTypeRadio.checked = true;
                    // Trigger change event
                    fortinetTypeRadio.dispatchEvent(new Event('change'));
                }
            }
            
            if (options.addrGroupName !== undefined) {
                const groupName = document.getElementById('addrGroupName');
                if (groupName) groupName.value = options.addrGroupName;
            }
            
            // Special handling for Fortinet
            const fortinetType = document.querySelector('input[name="fortinet-type"]:checked')?.value;
            const fortinetAddressGroupOptions = document.getElementById('fortinetAddressGroupOptions');
            
            if (fortinetType === 'address-group') {
                if (fortinetAddressGroupOptions) fortinetAddressGroupOptions.style.display = 'block';
            } else {
                if (fortinetAddressGroupOptions) fortinetAddressGroupOptions.style.display = 'none';
            }
            break;
    }
}

/**
 * Show notification to the user
 * @param {string} message - Message to display
 * @param {string} type - Notification type (info, success, error)
 */
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (!notification || !notificationMessage) return;
    
    // Set message and style
    notificationMessage.textContent = message;
    notification.className = 'notification-container';
    notification.classList.add(`notification-${type}`);
    
    // Show notification
    notification.style.display = 'block';
    
    // Auto-hide notification
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

/**
 * Handle errors and display appropriate messages
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 */
function handleError(error, context = '') {
    console.error(`Error ${context ? 'while ' + context : ''}:`, error);
    
    // Log to analytics if available
    logErrorToAnalytics(error, context);
    
    // Show user-friendly notification
    const lang = getCurrentLang();
    const errorMessage = lang === 'en' 
        ? `An error occurred${context ? ' while ' + context : ''}.` 
        : `发生错误${context ? '，在' + context + '过程中' : ''}。`;
    
    showNotification(errorMessage, 'error');
}

/**
 * Log error to analytics system (if available)
 * @param {Error} error - Error object
 * @param {string} context - Context where the error occurred
 */
function logErrorToAnalytics(error, context) {
    // Check if in production environment and analytics tool is loaded
    if (window.location.hostname !== 'localhost' && 
        !window.location.hostname.includes('127.0.0.1') && 
        typeof gtag === 'function') {
        
        gtag('event', 'error', {
            'event_category': 'JavaScript',
            'event_label': context || 'Unknown context',
            'value': error.message || 'No error message',
            'non_interaction': true
        });
    }
}

/**
 * Get current mode (tab) of the application
 * @returns {string} - Current mode
 */
function getCurrentMode() {
    const activeTab = document.querySelector('.tab-button.active');
    return activeTab ? activeTab.getAttribute('data-tab') : 'bulk-extract';
}

/**
 * Get current language
 * @returns {string} - Current language code ('en' or 'zh')
 */
function getCurrentLang() {
    return localStorage.getItem('language') || 'en';
}

/**
 * Generate a consistent page title based on page type and language
 * @param {string} pageType - Type of the page (e.g., 'Privacy Policy')
 * @param {string} lang - Current language ('en' or 'zh')
 * @return {string} - Formatted page title
 */
function generatePageTitle(pageType, lang) {
    const baseTitle = lang === 'en' ? 'IPToRoute' : 'IPToRoute';
    
    // Page type translations
    const pageTypeTrans = {
        en: {
            'privacy': 'Privacy Policy',
            'terms': 'Terms of Service',
            'cookies': 'Cookie Policy',
            'contact': 'Contact Us',
            'about': 'About Us',
            'help': 'Help & Documentation'
        },
        zh: {
            'privacy': '隐私政策',
            'terms': '服务条款',
            'cookies': 'Cookie政策',
            'contact': '联系我们',
            'about': '关于我们',
            'help': '帮助与文档'
        }
    };
    
    const translatedType = pageTypeTrans[lang][pageType] || pageType;
    
    return `${baseTitle} - ${translatedType}`;
}

/**
 * Update page title translation
 * @param {string} lang - Current language ('en' or 'zh')
 */
function updatePageTitle(lang) {
    // Get the page title from translations
    const pageTitle = translations[lang]['page-title'];
    
    // Set the document title
    document.title = pageTitle;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', translations[lang]['page-description']);
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', pageTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', translations[lang]['page-description']);
    }
    
    // Update Twitter meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', pageTitle);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', translations[lang]['page-description']);
    }
}

// Export functions for use in other modules
export {
    updateOutputPlaceholder,
    applyRouterSpecificOptions,
    showLoading,
    hideLoading,
    setupResizer,
    showNotification,
    handleError,
    logErrorToAnalytics,
    getCurrentMode,
    getCurrentLang,
    generatePageTitle,
    updatePageTitle
};
