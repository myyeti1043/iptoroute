/**
 * UI Helpers Module
 * Contains functions for UI manipulation and user experience
 */

// 不再使用import，因为translations.js将会把translations对象添加到window上
// import translations from './translations.js';

/**
 * Update output placeholder based on current mode and router type
 */
function updateOutputPlaceholder() {
    const outputArea = document.getElementById('outputArea');
    if (!outputArea) return;
    
    const currentMode = getCurrentMode();
    const currentLang = getCurrentLang();
    
    if (currentMode === 'bulk-extract') {
        outputArea.placeholder = window.translations[currentLang]['output-placeholder-bulk'];
    } else if (currentMode === 'router-config') {
        const routerType = document.getElementById('routerType')?.value;
        if (routerType) {
            switch (routerType) {
                case 'routeros':
                    // Check if address-list or route is selected
                    const routerosType = document.querySelector('input[name="routeros-type"]:checked')?.value;
                    if (routerosType === 'route') {
                        outputArea.placeholder = window.translations[currentLang]['output-placeholder-routeros-route'];
                    } else {
                        outputArea.placeholder = window.translations[currentLang]['output-placeholder-routeros-addresslist'];
                    }
                    break;
                case 'cisco':
                    outputArea.placeholder = window.translations[currentLang]['output-placeholder-cisco'];
                    break;
                case 'huawei':
                    outputArea.placeholder = window.translations[currentLang]['output-placeholder-huawei'];
                    break;
                case 'juniper':
                    outputArea.placeholder = window.translations[currentLang]['output-placeholder-juniper'];
                    break;
                case 'fortinet':
                    outputArea.placeholder = window.translations[currentLang]['output-placeholder-fortinet'];
                    break;
                default:
                    outputArea.placeholder = window.translations[currentLang]['output-placeholder-default'];
            }
        }
    } else if (currentMode === 'cidr-to-ip') {
        outputArea.placeholder = window.translations[currentLang]['output-placeholder-cidr-ip'];
    } else if (currentMode === 'ip-to-cidr') {
        outputArea.placeholder = window.translations[currentLang]['output-placeholder-ip-cidr'];
    } else {
        outputArea.placeholder = window.translations[currentLang]['output-placeholder-default'];
    }
}

/**
 * Apply router-specific options based on selected router type
 * @param {Object} options - Router-specific options to apply
 */
function applyRouterSpecificOptions(options) {
    // 如果没有传入选项，则使用当前UI状态
    if (!options) {
        const routerType = document.getElementById('routerType')?.value;
        if (!routerType) return;
        
        options = { routerType };
        
        // 根据路由器类型获取特定选项
        switch (routerType) {
            case 'routeros':
                const routerosType = document.querySelector('input[name="routeros-type"]:checked')?.value;
                const routerosGateway = document.getElementById('routerosGateway')?.value;
                const listName = document.getElementById('listName')?.value;
                
                options.routerosType = routerosType;
                options.routerosGateway = routerosGateway;
                options.listName = listName;
                break;
                
            case 'cisco':
                const nextHopIp = document.getElementById('nextHopIp')?.value;
                const routeName = document.getElementById('routeName')?.value;
                
                options.nextHopIp = nextHopIp;
                options.routeName = routeName;
                break;
                
            case 'huawei':
                const huaweiNextHop = document.getElementById('huaweiNextHop')?.value;
                
                options.huaweiNextHop = huaweiNextHop;
                break;
                
            case 'juniper':
                const juniperNextHop = document.getElementById('juniperNextHop')?.value;
                
                options.juniperNextHop = juniperNextHop;
                break;
                
            case 'fortinet':
                const fortinetType = document.querySelector('input[name="fortinet-type"]:checked')?.value;
                const addrGroupName = document.getElementById('addrGroupName')?.value;
                
                options.fortinetType = fortinetType;
                options.addrGroupName = addrGroupName;
                break;
        }
    }
    
    if (!options.routerType) return;
    
    // 首先隐藏所有路由器特定选项容器
    const optionContainers = document.querySelectorAll('.router-specific-options');
    optionContainers.forEach(container => {
        container.style.display = 'none';
    });
    
    // 显示选中路由器类型的选项容器
    const selectedContainer = document.getElementById(`${options.routerType}Options`);
    if (selectedContainer) {
        selectedContainer.style.display = 'block';
    }
    
    switch (options.routerType) {
        case 'routeros':
            // 应用 RouterOS 选项
            if (options.routerosType) {
                const routerosTypeRadio = document.querySelector(`input[name="routeros-type"][value="${options.routerosType}"]`);
                if (routerosTypeRadio) {
                    routerosTypeRadio.checked = true;
                    // 触发 change 事件
                    routerosTypeRadio.dispatchEvent(new Event('change'));
                }
            }
            
            // 设置 RouterOS 网关
            if (options.routerosGateway !== undefined) {
                const gateway = document.getElementById('routerosGateway');
                if (gateway) gateway.value = options.routerosGateway;
            }
            
            // 设置列表名称
            if (options.listName !== undefined) {
                const listName = document.getElementById('listName');
                if (listName) listName.value = options.listName;
            }
            
            // RouterOS 特殊处理
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
            // 应用 Cisco 选项
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
            // 应用 Huawei 选项
            if (options.huaweiNextHop !== undefined) {
                const nextHop = document.getElementById('huaweiNextHop');
                if (nextHop) nextHop.value = options.huaweiNextHop;
            }
            break;
            
        case 'juniper':
            // 应用 Juniper 选项
            if (options.juniperNextHop !== undefined) {
                const nextHop = document.getElementById('juniperNextHop');
                if (nextHop) nextHop.value = options.juniperNextHop;
            }
            break;
            
        case 'fortinet':
            // 应用 Fortinet 选项
            if (options.fortinetType) {
                const fortinetTypeRadio = document.querySelector(`input[name="fortinet-type"][value="${options.fortinetType}"]`);
                if (fortinetTypeRadio) {
                    fortinetTypeRadio.checked = true;
                    // 触发 change 事件
                    fortinetTypeRadio.dispatchEvent(new Event('change'));
                }
            }
            
            if (options.addrGroupName !== undefined) {
                const groupName = document.getElementById('addrGroupName');
                if (groupName) groupName.value = options.addrGroupName;
            }
            
            // Fortinet 特殊处理
            const fortinetType = document.querySelector('input[name="fortinet-type"]:checked')?.value;
            const addrGroupNameContainer = document.getElementById('addrGroupNameContainer');
            
            if (fortinetType === 'addrgrp') {
                if (addrGroupNameContainer) addrGroupNameContainer.style.display = 'block';
            } else {
                if (addrGroupNameContainer) addrGroupNameContainer.style.display = 'none';
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
    return localStorage.getItem('preferredLanguage') || 'en';
}

/**
 * Determine whether IP range aggregation is enabled based on current mode
 * @returns {boolean}
 */
function isAggregateSubnetsEnabled() {
    const routerCheckbox = document.getElementById('aggregateRouterSubnets');
    const bulkCheckbox = document.getElementById('aggregateSubnets');
    
    // 优先使用当前模式，如果不可用则回退到DOM状态
    const mode = typeof currentMode !== 'undefined' ? currentMode : getCurrentMode();
    
    if (mode === 'router-config' && routerCheckbox) {
        return routerCheckbox.checked;
    }
    
    return bulkCheckbox ? bulkCheckbox.checked : false;
}

/**
 * Show loading indicator
 */
function showLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

/**
 * Setup resizer functionality for both vertical and horizontal resizers
 */
function setupResizer() {
    // Setup horizontal resizer
    const horizontalResizer = document.getElementById('horizontalResizer');
    if (horizontalResizer) {
        setupHorizontalResizer(horizontalResizer);
    }
    
    // Setup vertical resizers for textareas (existing functionality)
    const resizers = document.querySelectorAll('.resizer:not(#horizontalResizer)');
    resizers.forEach(resizer => {
        const parent = resizer.parentElement;
        const textarea = parent.querySelector('textarea');
        
        if (!textarea) return;
        
        let y = 0;
        let initialHeight = 0;
        
        const initResize = e => {
            y = e.clientY;
            initialHeight = parseInt(window.getComputedStyle(textarea).height, 10);
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
        };
        
        const resize = e => {
            const dy = e.clientY - y;
            textarea.style.height = `${initialHeight + dy}px`;
        };
        
        const stopResize = () => {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        };
        
        resizer.addEventListener('mousedown', initResize);
    });
}

/**
 * Setup horizontal resizer functionality
 */
function setupHorizontalResizer(resizer) {
    const mainContent = document.querySelector('.main-content');
    const inputSection = document.querySelector('.input-section');
    const outputSection = document.querySelector('.output-section');
    
    if (!mainContent || !inputSection || !outputSection) {
        console.warn('Required elements not found for horizontal resizer');
        return;
    }
    
    let x = 0;
    let inputSectionWidth = 0;
    let outputSectionWidth = 0;
    let totalWidth = 0;
    
    const initResize = e => {
        x = e.clientX;
        const mainContentRect = mainContent.getBoundingClientRect();
        const inputSectionRect = inputSection.getBoundingClientRect();
        const outputSectionRect = outputSection.getBoundingClientRect();
        
        inputSectionWidth = inputSectionRect.width;
        outputSectionWidth = outputSectionRect.width;
        totalWidth = mainContentRect.width - resizer.offsetWidth;
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        resizer.classList.add('active');
        e.preventDefault();
    };
    
    const resize = e => {
        const dx = e.clientX - x;
        const newInputWidth = inputSectionWidth + dx;
        const newOutputWidth = outputSectionWidth - dx;
        
        // 设置最小和最大宽度限制（30% - 70%）
        const minWidth = totalWidth * 0.3;
        const maxWidth = totalWidth * 0.7;
        
        if (newInputWidth >= minWidth && newInputWidth <= maxWidth) {
            // 使用flex-basis而不是完整的flex属性，保持原有的padding和其他样式
            inputSection.style.flexBasis = `${newInputWidth}px`;
            inputSection.style.flexGrow = '0';
            inputSection.style.flexShrink = '0';
            
            outputSection.style.flexBasis = `${newOutputWidth}px`;
            outputSection.style.flexGrow = '0';
            outputSection.style.flexShrink = '0';
        }
    };
    
    const stopResize = () => {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        resizer.classList.remove('active');
    };
    
    resizer.addEventListener('mousedown', initResize);
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
    const pageTitle = window.translations[lang]['page-title'];
    
    // Set the document title
    document.title = pageTitle;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', window.translations[lang]['page-description']);
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', pageTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', window.translations[lang]['page-description']);
    }
    
    // Update Twitter meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', pageTitle);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', window.translations[lang]['page-description']);
    }
}

// 将所有函数添加到window对象上
window.updateOutputPlaceholder = updateOutputPlaceholder;
window.applyRouterSpecificOptions = applyRouterSpecificOptions;
window.showNotification = showNotification;
window.handleError = handleError;
window.logErrorToAnalytics = logErrorToAnalytics;
window.getCurrentMode = getCurrentMode;
window.getCurrentLang = getCurrentLang;
window.isAggregateSubnetsEnabled = isAggregateSubnetsEnabled;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.setupResizer = setupResizer;
window.setupHorizontalResizer = setupHorizontalResizer;
window.generatePageTitle = generatePageTitle;
window.updatePageTitle = updatePageTitle;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('uiHelpers');
}
