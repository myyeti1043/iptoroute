// 不再使用import，因为所有模块已经将函数添加到了window对象上
// Import from ipConverters.js
// import { 
//     convertCidrToIpMask, 
//     convertIpMaskToCidr, 
//     isValidIp, 
//     isValidMask,
//     compareIPs,
//     extractIp,
//     convertIpMaskToCidrFormat,
//     getNetworkAddress
// } from './ipConverters.js';

// // Import from routerConverters.js
// import {
//     convertCidrToCisco,
//     convertCidrToRouterOs,
//     convertCidrToHuawei,
//     convertCidrToJuniper,
//     convertCidrToFortinet,
//     extractIpFromCiscoRoute
// } from './routerConverters.js';

// // Import from jsonExtractor.js
// import {
//     extractIpPrefixesFromJson,
//     findAllIpAddresses
// } from './jsonExtractor.js';

// // Import from uiHelpers.js
// import {
//     updateOutputPlaceholder,
//     applyRouterSpecificOptions,
//     showLoading,
//     hideLoading,
//     setupResizer,
//     showNotification,
//     handleError,
//     getCurrentMode,
//     getCurrentLang,
//     updatePageTitle
// } from './uiHelpers.js';

// // Import from historyManager.js
// import {
//     addToRecentOperations,
//     loadRecentOperations,
//     refreshRecentOperations,
//     restoreOperation,
//     clearOperationHistory,
//     setupRecentOperations
// } from './historyManager.js';

// // Import from webWorker.js
// import {
//     initWebWorker,
//     extractIpsWithWorker,
//     validateIpsWithWorker
// } from './webWorker.js';

// // Import from analytics.js
// import {
//     initSEO,
//     trackEvent,
//     trackPageView
// } from './analytics.js';

// // Import translations
// import translations from './translations.js';

// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded in app.js');
    // Initialize common functionality across all pages
    
    // Use a small delay to ensure DOM is fully ready
    setTimeout(() => {
        setupLanguageSelection();
    }, 100);
    
    // Call original init function if on main app page
    if (document.getElementById('appTabs')) {
        console.log('appTabs found, initializing app from DOMContentLoaded event');
        init();
    }

    // 在文档加载完成时初始化Worker
    // 仅为大屏幕设备初始化Worker
    if (window.innerWidth >= 768) {
        try {
            initWebWorker();
        } catch (error) {
            console.error('Failed to initialize web worker:', error);
        }
    }

    // 初始化时检查一次
    checkAndSwitchTab();
    
    // 初始化时检查一次sessionStorage
    handleSessionStorageTab();

    // Initialize SEO features but don't load analytics in development
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
        initSEO();
    } else {
        console.log('Development mode: analytics disabled');
    }

    // 翻译页面标题
    updatePageTitle(currentLang);
});

// Setup theme toggle functionality
function setupThemeToggle() {
    console.log('Setting up theme toggle...');
    const themeToggle = document.getElementById('themeToggle');
    console.log('Found themeToggle element:', themeToggle);
    
    if (themeToggle) {
        // Get saved theme from localStorage or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        console.log('Default theme:', defaultTheme);
        
        // Apply the theme
        applyTheme(defaultTheme);
        
        // Add event listener for theme toggle - try multiple event types
        const clickHandler = function(e) {
            console.log('Theme toggle button clicked!', e);
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('Switching from', currentTheme, 'to', newTheme);
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        };
        
        // Try multiple ways to attach the event
        themeToggle.addEventListener('click', clickHandler);
        themeToggle.onclick = clickHandler;
        
        // Also try mousedown event
        themeToggle.addEventListener('mousedown', function(e) {
            console.log('Theme toggle mousedown detected');
        });
        
        console.log('Theme toggle event listener added successfully');
    } else {
        console.error('themeToggle element not found!');
    }
}

// Helper function to apply theme
function applyTheme(theme) {
    console.log('Applying theme:', theme);
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        console.log('Added dark-theme class to body');
    } else {
        document.body.classList.remove('dark-theme');
        console.log('Removed dark-theme class from body');
    }
    console.log('Current body classes:', document.body.className);
}

// Setup language selection functionality
function setupLanguageSelection() {
    console.log('Setting up language selection...');
    // Get saved language preference from localStorage or use default
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        currentLang = savedLang;
    }
    
    // Update language buttons to reflect current language
    const langEnBtn = document.getElementById('langEn');
    const langZhBtn = document.getElementById('langZh');
    if (langEnBtn) langEnBtn.classList.toggle('active', currentLang === 'en');
    if (langZhBtn) langZhBtn.classList.toggle('active', currentLang === 'zh');
    
    // Apply initial translations
    console.log('Applying initial translations for language:', currentLang);
    updateLanguage(currentLang);
}

// Main initialization function for the application
function init() {
    console.log('Starting initialization...');
    
    // Set up event listeners and initialize UI components
    console.log('Setting up tab navigation...');
    setupTabNavigation();
    
    console.log('Setting up input handlers...');
    setupInputHandlers();
    
    console.log('Setting up convert button...');
    setupConvertButton();
    
    console.log('Setting up copy/download buttons...');
    setupCopyDownloadButtons();
    
    console.log('Setting up router type handlers...');
    setupRouterTypeHandlers();
    
    console.log('Setting up language buttons...');
    setupLanguageButtons();
    
    console.log('Setting up theme toggle...');
    setupThemeToggle();
    
    console.log('Setting up file upload...');
    setupFileUpload();
    
    console.log('Setting up recent operations...');
    setupRecentOperations();
    
    // Load recent operations from localStorage and refresh UI
    console.log('Loading recent operations...');
    const operations = loadRecentOperations();
    console.log('Refreshing recent operations UI...');
    refreshRecentOperations(operations);
    
    // Set up resizer functionality
    console.log('Setting up resizer...');
    setupResizer();
    
    // Handle URL hash changes for tab navigation
    console.log('Setting up hash change handler...');
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 页面加载时立即执行一次
    
    console.log('Initialization complete!');
    
    // Apply initial options visibility based on current mode
    const optionsTitle = document.getElementById('optionsTitle');
    const currentTab = getCurrentMode();
    
    // Hide entire options panel for cidr-to-ip and ip-to-cidr
    const optionsPanel = document.getElementById('optionsPanel');
    if (optionsPanel) {
        if (currentTab === 'cidr-to-ip' || currentTab === 'ip-to-cidr') {
            optionsPanel.style.display = 'none';
        } else {
            optionsPanel.style.display = 'block';
            
            // Hide options title for router-config and bulk-extract within the visible panel
            if (optionsTitle) {
                if (currentTab === 'router-config' || currentTab === 'bulk-extract') {
                    optionsTitle.style.display = 'none';
                } else {
                    optionsTitle.style.display = 'block';
                }
            }
        }
    }
    
    // Hide option groups for cidr-to-ip and ip-to-cidr
    const cidrToIpOptions = document.getElementById('optionsCidrToIp');
    const ipToCidrOptions = document.getElementById('optionsIpToCidr');
    
    if (cidrToIpOptions) cidrToIpOptions.style.display = 'none';
    if (ipToCidrOptions) ipToCidrOptions.style.display = 'none';
}

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabDescriptions = document.querySelectorAll('.tab-description');
    const optionsTitle = document.getElementById('optionsTitle');
    const optionGroups = {
        'router-config': document.getElementById('optionsRouter'),
        'bulk-extract': document.getElementById('optionsBulkExtract'),
        'cidr-to-ip': document.getElementById('optionsCidrToIp'),
        'ip-to-cidr': document.getElementById('optionsIpToCidr')
    };
    
    console.log('Setting up tab navigation, found buttons:', tabButtons.length);
    console.log('Found tab descriptions:', tabDescriptions.length);
    
    tabButtons.forEach(button => {
        console.log('Adding click listener to tab button:', button.getAttribute('data-tab'));
        button.addEventListener('click', () => {
            console.log('Tab button clicked:', button.getAttribute('data-tab'));
            const tab = button.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected tab description
            tabDescriptions.forEach(description => {
                const descriptionId = `${tab}-description`;
                if (description.id === descriptionId) {
                    description.style.display = 'block';
                    console.log(`Showing tab description: ${descriptionId}`);
                } else {
                    description.style.display = 'none';
                }
            });
            
            // Hide entire options panel for cidr-to-ip and ip-to-cidr
            const optionsPanel = document.getElementById('optionsPanel');
            if (optionsPanel) {
                if (tab === 'cidr-to-ip' || tab === 'ip-to-cidr') {
                    optionsPanel.style.display = 'none';
                } else {
                    optionsPanel.style.display = 'block';
                    
                    // Show/hide options title based on tab within the visible panel
                    if (optionsTitle) {
                        if (tab === 'router-config' || tab === 'bulk-extract') {
                            optionsTitle.style.display = 'none';
                        } else {
                            optionsTitle.style.display = 'block';
                        }
                    }
                }
            }
            
            // Show selected tab options
            for (const [optionTab, optionGroup] of Object.entries(optionGroups)) {
                if (optionGroup) {
                    if (optionTab === tab) {
                        // Hide options for cidr-to-ip and ip-to-cidr
                        if (optionTab === 'cidr-to-ip' || optionTab === 'ip-to-cidr') {
                            optionGroup.style.display = 'none';
                        } else {
                            optionGroup.style.display = 'block';
                        }
                        console.log(`Showing options for: ${optionTab}`);
                    } else {
                        optionGroup.style.display = 'none';
                    }
                }
            }
            
            // Update current mode
            currentMode = tab;
            console.log('Current mode updated to:', currentMode);
            
            // Hide/show results statistics based on tab
            const resultsStats = document.getElementById('resultsStats');
            if (resultsStats) {
                if (tab === 'bulk-extract') {
                    // Keep current display state for bulk-extract
                } else {
                    resultsStats.style.display = 'none';
                }
            }
            
            // Update output placeholder based on current mode
            updateOutputPlaceholder();
            
            // Apply router-specific options if in router-config mode
            if (tab === 'router-config') {
                applyRouterSpecificOptions();
            }
            
            // Update URL hash
            window.location.hash = tab;
            
            // Store the active tab in sessionStorage
            sessionStorage.setItem('activeTab', tab);
        });
    });
    
    // Set initial tab based on URL hash or sessionStorage
    const initialTab = window.location.hash.substring(1) || sessionStorage.getItem('activeTab') || 'router-config';
    console.log('Initial tab:', initialTab);
    
    // Activate the initial tab
    const initialTabButton = document.querySelector(`.tab-button[data-tab="${initialTab}"]`);
    if (initialTabButton) {
        initialTabButton.click();
    } else {
        // Fallback to first tab if the initial tab doesn't exist
        const firstTabButton = document.querySelector('.tab-button');
        if (firstTabButton) {
            firstTabButton.click();
        }
    }
}

// Setup input handlers
function setupInputHandlers() {
    // Clear input button
    const clearInputBtn = document.getElementById('clearBtn');
    if (clearInputBtn) {
        clearInputBtn.addEventListener('click', () => {
            inputArea.value = '';
            inputArea.focus();
        });
    }
    
    // Paste from clipboard button
    const pasteClipboardBtn = document.getElementById('pasteClipboardBtn');
    if (pasteClipboardBtn) {
        pasteClipboardBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                inputArea.value = text;
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
                alert(currentLang === 'en' ? 'Failed to read clipboard. Please paste manually.' : '无法读取剪贴板。请手动粘贴。');
            }
        });
    }
    
    // JSON source selection
    const jsonSource = document.getElementById('jsonSource');
    if (jsonSource) {
        jsonSource.addEventListener('change', () => {
            const selectedSource = jsonSource.value;
            
            // Hide/show custom JSON path input based on selection
            const customPathContainer = document.getElementById('customJsonPathContainer');
            if (customPathContainer) {
                customPathContainer.style.display = selectedSource === 'custom' ? 'block' : 'none';
            }
        });
    }
}

// Setup convert button
function setupConvertButton() {
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.addEventListener('click', async () => {
            const input = inputArea.value.trim();
            if (!input) {
                alert(currentLang === 'en' ? 'Please enter IP addresses.' : '请输入IP地址。');
                return;
            }
            
            showLoading();
            
            try {
                // Process the input based on current mode
                await processInput(input);
            } catch (error) {
                console.error('Error during conversion:', error);
                outputArea.value = currentLang === 'en' ? 'Error occurred during conversion.' : '转换过程中发生错误。';
                handleError(error, 'Convert button click handler');
            } finally {
                hideLoading();
            }
        });
    }
    
    // CIDR to IP button
    const convertCidrButton = document.getElementById('convert-cidr-button');
    if (convertCidrButton) {
        convertCidrButton.addEventListener('click', function() {
            const cidrInput = document.getElementById('cidr-input').value.trim();
            const routerType = document.getElementById('router-type').value;
            const outputElement = document.getElementById('router-output');
            
            if (!cidrInput) {
                alert('Please enter CIDR notation');
                return;
            }
            
            try {
                // Process based on router type
                let output = '';
                switch (routerType) {
                    case 'routeros':
                        output = convertToRouterOs(cidrInput);
                        break;
                    case 'cisco':
                        output = convertToCisco(cidrInput);
                        break;
                    default:
                        output = 'Unsupported router type';
                }
                
                outputElement.value = output;
            } catch (error) {
                console.error('Error converting CIDR:', error);
                outputElement.value = 'Error occurred during conversion.';
            }
        });
    }
}

// Process input based on current mode
async function processInput(input) {
    let results = [];
    let invalidLines = 0;
    
    console.log('Current mode:', currentMode);
    
    // Special handling for Fortinet with FQDN in router-config mode
    if (currentMode === 'router-config' && document.getElementById('routerType').value === 'fortinet') {
        try {
            // 按行处理输入
            const lines = input.split('\n').filter(line => {
                const trimmedLine = line.trim();
                // 忽略空行和以#开头的注释行
                return trimmedLine !== '' && !trimmedLine.startsWith('#');
            });
            
            // 使用extractIpsWithWorker提取有效的IP地址
            const extractedIPs = await extractIpsWithWorker(input, document.getElementById('ipv4Only').checked);
            
            // 验证提取的IP地址
            const validationResults = await validateIpsWithWorker(extractedIPs);
            
            // 过滤出有效的IP地址
            const validIps = extractedIPs.filter(ip => {
                const result = validationResults.find(r => r.original === ip);
                return result && result.valid;
            });
            
            // 如果没有有效的IP地址，显示提示信息
            if (validIps.length === 0) {
                outputArea.value = currentLang === 'en' 
                    ? 'No valid IP addresses found in the input.' 
                    : '在输入中未找到有效的IP地址。';
                return;
            }
            
            // 处理每个有效的IP地址
            for (const ip of validIps) {
                try {
                    const result = convertCidrToFortinet(ip);
                    if (result) {
                        results.push(result);
                    }
                } catch (e) {
                    console.error('Error processing IP:', ip, e);
                    invalidLines++;
                }
            }
            
            // 提取所有域名（简单的域名提取，可能需要更复杂的正则表达式）
            const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/gi;
            const domains = input.match(domainRegex) || [];
            
            // 过滤掉可能被错误识别为域名的IP地址
            const filteredDomains = domains.filter(domain => {
                // 不是IP地址格式
                if (domain.match(/^\d+\.\d+\.\d+\.\d+$/)) return false;
                
                // 检查是否是有效的域名
                const parts = domain.split('.');
                // 顶级域名不能是纯数字
                const tld = parts[parts.length - 1];
                if (/^\d+$/.test(tld)) return false;
                
                return true;
            });
            
            // 处理每个域名
            for (const domain of filteredDomains) {
                try {
                    const result = convertCidrToFortinet(domain);
                    if (result) {
                        results.push(result);
                    }
                } catch (e) {
                    console.error('Error processing domain:', domain, e);
                    invalidLines++;
                }
            }
        } catch (error) {
            console.error('Error in router config processing:', error);
            outputArea.value = 'Error occurred during processing: ' + error.message;
            return;
        }
    } 
    // Special handling for RouterOS address-list mode with mixed IP/domain support
    else if (currentMode === 'router-config' && 
             document.getElementById('routerType').value === 'routeros' &&
             document.querySelector('input[name="routeros-type"]:checked')?.value === 'address-list') {
        try {
            // 按行处理输入
            const lines = input.split('\n').filter(line => {
                const trimmedLine = line.trim();
                // 忽略空行和以#开头的注释行
                return trimmedLine !== '' && !trimmedLine.startsWith('#');
            });
            
            // 使用extractIpsWithWorker提取有效的IP地址
            const extractedIPs = await extractIpsWithWorker(input, document.getElementById('ipv4Only').checked);
            
            // 验证提取的IP地址
            const validationResults = await validateIpsWithWorker(extractedIPs);
            
            // 过滤出有效的IP地址
            const validIps = extractedIPs.filter(ip => {
                const result = validationResults.find(r => r.original === ip);
                return result && result.valid;
            });
            
            // 处理每个有效的IP地址
            for (const ip of validIps) {
                try {
                    const result = convertCidrToRouterOs(ip);
                    if (result) {
                        results.push(result);
                    }
                } catch (e) {
                    console.error('Error processing IP:', ip, e);
                    invalidLines++;
                }
            }
            
            // 提取所有域名（使用与Fortinet相同的域名提取逻辑）
            const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/gi;
            const domains = input.match(domainRegex) || [];
            
            // 过滤掉可能被错误识别为域名的IP地址
            const filteredDomains = domains.filter(domain => {
                // 不是IP地址格式
                if (domain.match(/^\d+\.\d+\.\d+\.\d+$/)) return false;
                
                // 检查是否是有效的域名
                const parts = domain.split('.');
                // 顶级域名不能是纯数字
                const tld = parts[parts.length - 1];
                if (/^\d+$/.test(tld)) return false;
                
                return true;
            });
            
            // 处理每个域名
            for (const domain of filteredDomains) {
                try {
                    const result = convertCidrToRouterOs(domain);
                    if (result) {
                        results.push(result);
                    }
                } catch (e) {
                    console.error('Error processing domain:', domain, e);
                    invalidLines++;
                }
            }
            
            // 如果没有有效的IP地址或域名，显示提示信息
            if (results.length === 0) {
                outputArea.value = currentLang === 'en' 
                    ? 'No valid IP addresses or domain names found in the input.' 
                    : '在输入中未找到有效的IP地址或域名。';
                return;
            }
        } catch (error) {
            console.error('Error in RouterOS address-list processing:', error);
            outputArea.value = 'Error occurred during processing: ' + error.message;
            return;
        }
    } else {
        // 对于其他模式，使用标准处理
        
        // 对于批量提取模式，尝试提取所有IP地址
        if (currentMode === 'bulk-extract') {
            try {
                // 首先尝试作为JSON解析
                const jsonData = JSON.parse(input);
                const extractedIPs = extractIpPrefixesFromJson(jsonData);
                
                if (extractedIPs.length > 0) {
                    results = extractedIPs;
                } else {
                    // 如果没有从JSON中提取到IP，尝试从文本中提取
                    results = await extractIpsWithWorker(input, document.getElementById('ipv4Only').checked);
                }
            } catch (e) {
                // 不是有效的JSON，尝试从文本中提取
                console.log('Not valid JSON, extracting from text:', e);
                results = await extractIpsWithWorker(input, document.getElementById('ipv4Only').checked);
            }
            
            // Note: Post-processing (removeDuplicates, aggregateSubnets) is already handled 
            // in extractIpPrefixesFromJson and extractIpsWithWorker functions
        } else {
            // 对于其他模式，按行处理输入
            const lines = input.split('\n').filter(line => {
                const trimmedLine = line.trim();
                // 忽略空行和以#开头的注释行
                return trimmedLine !== '' && !trimmedLine.startsWith('#');
            });
            const extractedIPs = [];
            
            // 处理每一行输入
            for (const line of lines) {
                // 检查是否是Cisco格式的路由命令
                if (line.trim().startsWith('ip route ')) {
                    const routeInfo = extractIpFromCiscoRoute(line.trim());
                    if (routeInfo) {
                        // 将IP和掩码转换为CIDR格式
                        try {
                            const cidr = convertIpMaskToCidrFormat(routeInfo.ip, routeInfo.mask);
                            extractedIPs.push(cidr);
                        } catch (error) {
                            console.warn('Error converting Cisco route to CIDR:', error);
                        }
                    }
                } else if (line.includes('/')) {
                    // 处理CIDR格式 (例如 192.168.1.0/24)
                    const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
                    if (match) {
                        const ip = match[1];
                        const cidr = parseInt(match[2]);
                        
                        // 验证IP和CIDR
                        if (isValidIp(ip) && cidr >= 0 && cidr <= 32) {
                            extractedIPs.push(line); // 保留完整的CIDR表示法
                        }
                    }
                } else if (line.includes(' ')) {
                    // 处理IP掩码格式（如192.168.1.0 255.255.255.0）
                    const parts = line.trim().split(/\s+/);
                    if (parts.length === 2 && isValidIp(parts[0]) && isValidMask(parts[1])) {
                        extractedIPs.push(line); // 保留IP和掩码格式
                    } else {
                        // 使用正则表达式检查是否包含有效的IPv4地址
                        const ipv4Pattern = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/;
                        const match = line.match(ipv4Pattern);
                        
                        if (match) {
                            const ip = match[1];
                            if (isValidIp(ip)) {
                                extractedIPs.push(ip);
                            }
                        }
                    }
                } else {
                    // 处理单个IP地址
                    if (isValidIp(line)) {
                        extractedIPs.push(line);
                    }
                }
            }
            
            // 如果没有提取到任何IP地址，尝试使用extractIpsWithWorker
            if (extractedIPs.length === 0) {
                const autoExtractedIPs = await extractIpsWithWorker(input, document.getElementById('ipv4Only').checked);
                extractedIPs.push(...autoExtractedIPs);
            }
            
            // 如果没有有效的IP地址，显示提示信息
            if (extractedIPs.length === 0) {
                outputArea.value = currentLang === 'en' 
                    ? 'No valid IP addresses found in the input.' 
                    : '在输入中未找到有效的IP地址。';
                return;
            }
            
            // 处理每个有效的IP地址
            for (const ip of extractedIPs) {
                try {
                    let result;
                    switch (currentMode) {
                        case 'bulk-extract':
                            result = ip;
                            break;
                        case 'router-config':
                            const routerType = document.getElementById('routerType').value;
                            switch (routerType) {
                                case 'routeros':
                                    result = convertCidrToRouterOs(ip);
                                    break;
                                case 'cisco':
                                    result = convertCidrToCisco(ip);
                                    break;
                                case 'huawei':
                                    result = convertCidrToHuawei(ip);
                                    break;
                                case 'juniper':
                                    result = convertCidrToJuniper(ip);
                                    break;
                                case 'fortinet':
                                    result = convertCidrToFortinet(ip);
                                    break;
                                default:
                                    result = ip;
                            }
                            break;
                        case 'cidr-to-ip':
                            result = convertCidrToIpMask(ip);
                            break;
                        case 'ip-to-cidr':
                            // 检查输入是否已经是CIDR格式
                            if (ip.includes('/')) {
                                result = ip; // 已经是CIDR格式，无需转换
                            } else {
                                // 检查输入是否包含IP和子网掩码
                                const parts = ip.trim().split(/\s+/);
                                if (parts.length === 2) {
                                    // 输入格式为 "IP 子网掩码"
                                    result = convertIpMaskToCidr(ip);
                                } else {
                                    // 单个IP地址，默认使用/32
                                    result = `${ip}/32`;
                                }
                            }
                            break;
                        default:
                            result = ip;
                    }
                    results.push(result);
                } catch (e) {
                    console.error('Error processing IP:', ip, e);
                    invalidLines++;
                }
            }
        }
    }

    // 对于router-config、cidr-to-ip和ip-to-cidr模式，确保结果中没有重复项
    if (currentMode === 'router-config' || currentMode === 'cidr-to-ip' || currentMode === 'ip-to-cidr') {
        results = [...new Set(results)];
    }

    // Sort results if option is checked and it exists
    const sortOutput = document.getElementById('sortOutput');
    if (sortOutput && sortOutput.checked && results.length > 0) {
        try {
            results.sort(compareIPs);
        } catch (error) {
            console.warn('Error during sorting:', error);
            // 如果排序失败，继续处理不排序的结果
        }
    }
    
    // Display results
    outputArea.value = results.join('\n');
    
    // Add to recent operations
    addToRecentOperations(input);
}

// Setup copy and download buttons
function setupCopyDownloadButtons() {
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            outputArea.select();
            try {
                document.execCommand('copy');
                
                // Show success message
                const successMsg = currentLang === 'en' ? 'Copied to clipboard!' : '已复制到剪贴板！';
                showNotification(successMsg, 'success');
            } catch (err) {
                console.error('Failed to copy: ', err);
                
                // Show error message
                const errorMsg = currentLang === 'en' ? 'Failed to copy. Please try again.' : '复制失败。请重试。';
                showNotification(errorMsg, 'error');
            }
        });
    }
    
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const output = outputArea.value;
            if (!output) {
                alert(currentLang === 'en' ? 'No content to download.' : '没有内容可下载。');
                return;
            }
            
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'iptoroute_output.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

// Setup router type handlers
function setupRouterTypeHandlers() {
    const routerType = document.getElementById('routerType');
    if (routerType) {
        routerType.addEventListener('change', () => {
            // 隐藏所有路由器特定选项
            const routerSpecificOptions = document.querySelectorAll('.router-specific-options');
            routerSpecificOptions.forEach(option => {
                option.style.display = 'none';
            });
            
            // 显示当前选中的路由器选项
            const selectedRouterType = routerType.value;
            const selectedOptions = document.getElementById(`${selectedRouterType}Options`);
            if (selectedOptions) {
                selectedOptions.style.display = 'block';
                console.log(`Showing options for router type: ${selectedRouterType}`);
            }
            
            // 切换输入示例
            const routerExampleBasic = document.getElementById('router-example-basic');
            const routerExampleFortinet = document.getElementById('router-example-fortinet');
            
            if (selectedRouterType === 'fortinet') {
                if (routerExampleBasic) routerExampleBasic.style.display = 'none';
                if (routerExampleFortinet) routerExampleFortinet.style.display = 'block';
            } else {
                if (routerExampleBasic) routerExampleBasic.style.display = 'block';
                if (routerExampleFortinet) routerExampleFortinet.style.display = 'none';
            }
            
            applyRouterSpecificOptions();
            updateOutputPlaceholder();
        });
    }
    
    // RouterOS type radio buttons
    const routerosTypeRadios = document.querySelectorAll('input[name="routeros-type"]');
    if (routerosTypeRadios && routerosTypeRadios.length > 0) {
        routerosTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const routerosAddressListOptions = document.getElementById('routerosAddressListOptions');
                const routerosRouteOptions = document.getElementById('routerosRouteOptions');
                
                if (this.value === 'address-list') {
                    routerosAddressListOptions.style.display = 'block';
                    routerosRouteOptions.style.display = 'none';
                } else {
                    routerosAddressListOptions.style.display = 'none';
                    routerosRouteOptions.style.display = 'block';
                }
                
                updateOutputPlaceholder();
            });
        });
    }
    
    // Fortinet type radio buttons
    const fortinetTypeRadios = document.querySelectorAll('input[name="fortinet-type"]');
    if (fortinetTypeRadios && fortinetTypeRadios.length > 0) {
        fortinetTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const addrGroupNameContainer = document.getElementById('addrGroupNameContainer');
                
                if (this.value === 'addrgrp') {
                    addrGroupNameContainer.style.display = 'block';
                } else {
                    addrGroupNameContainer.style.display = 'none';
                }
                
                updateOutputPlaceholder();
            });
        });
    }
}

// Setup language buttons
function setupLanguageButtons() {
    const langEnBtn = document.getElementById('langEn');
    const langZhBtn = document.getElementById('langZh');
    
    console.log('Setting up language buttons:', langEnBtn, langZhBtn);
    
    if (langEnBtn) {
        console.log('Adding click listener to English button');
        langEnBtn.addEventListener('click', () => {
            console.log('English button clicked');
            updateLanguage('en');
        });
    }
    
    if (langZhBtn) {
        console.log('Adding click listener to Chinese button');
        langZhBtn.addEventListener('click', () => {
            console.log('Chinese button clicked');
            updateLanguage('zh');
        });
    }
}

// Update language function
function updateLanguage(lang) {
    currentLang = lang;
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.getAttribute('type') === 'placeholder') {
                element.placeholder = translations[lang][key];
            } else {
                // Always use textContent to ensure proper text replacement
                element.textContent = translations[lang][key];
            }
        } else {
            console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        }
    });
    
    // Update statistics display if visible
    const resultsStats = document.getElementById('resultsStats');
    if (resultsStats && resultsStats.style.display !== 'none') {
        // Refresh the statistics display to apply new language
        const statsCount = document.getElementById('statsCount');
        if (statsCount && window.updateResultsStats) {
            const currentCount = parseInt(statsCount.textContent) || 0;
            window.updateResultsStats(currentCount);
        }
    }
    
    // Update placeholders
    const inputArea = document.getElementById('inputArea');
    if (inputArea) {
        if (currentMode === 'bulk-extract') {
            inputArea.placeholder = translations[lang]['input-placeholder-bulk'];
        } else {
            inputArea.placeholder = translations[lang]['input-placeholder-default'];
        }
    }
    
    // Update output placeholder based on current mode and router type
    updateOutputPlaceholder();
    
    // Update language buttons
    const langEnBtn = document.getElementById('langEn');
    const langZhBtn = document.getElementById('langZh');
    if (langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');
    if (langZhBtn) langZhBtn.classList.toggle('active', lang === 'zh');
    
    // Update page title translation
    updatePageTitle(lang);
    
    // Add a small opacity transition to force redraw
    document.body.style.opacity = '0.99';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
}

// Setup file upload
function setupFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    
    if (fileInput && selectFileBtn) {
        selectFileBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    inputArea.value = e.target.result;
                };
                reader.readAsText(file);
            }
        });
    }
}

// Handle URL hash changes for tab navigation
function handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
        // 移除井号并提取目标标签
        const targetTab = hash.substring(1);
        
        // 找到并点击相应的标签按钮
        const tabButton = document.querySelector(`.tab-button[data-tab="${targetTab}"]`);
        if (tabButton && !tabButton.classList.contains('active')) {
            tabButton.click();
        }
    }
}

// 处理从sessionStorage中读取的初始标签信息
function handleSessionStorageTab() {
    const storedTab = sessionStorage.getItem('activeTab');
    if (storedTab && !window.location.hash) {
        const tabButton = document.querySelector(`.tab-button[data-tab="${storedTab}"]`);
        if (tabButton && !tabButton.classList.contains('active')) {
            tabButton.click();
        }
    }
}

// 检查当前URL中的锚点，并切换到相应的选项卡
function checkAndSwitchTab() {
    // 直接从URL获取hash
    const hash = window.location.hash;
    if (hash) {
        // 移除#号并获取目标标签名称
        const targetTab = hash.substring(1);
        
        // 直接处理已知的选项卡
        switch(targetTab) {
            case 'router-config':
            case 'bulk-extract':
            case 'cidr-to-ip':
            case 'ip-to-cidr':
                // 找到对应的标签按钮
                const tabButton = document.querySelector(`.tab-button[data-tab="${targetTab}"]`);
                if (tabButton && !tabButton.classList.contains('active')) {
                    // 模拟点击事件
                    tabButton.click();
                    // 滚动到页面顶部
                    window.scrollTo(0, 0);
                }
                break;
        }
    }
}

// 处理底部导航链接点击事件
function setupFooterNavigation() {
    const tabLinks = document.querySelectorAll('[data-tab-link]');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetTab = this.getAttribute('data-tab-link');
            
            // 由于链接已经有href=./#tab-name格式，不需要preventDefault
            // URL的变化会触发hashchange事件，所以不需要手动点击按钮
            
            // 但仍需要滚动到页面顶部
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        });
    });
}

// Global variables
let currentMode = 'router-config'; // Default mode
let currentLang = window.__initialLang || localStorage.getItem('preferredLanguage') || 'en'; // Default language
const inputArea = document.getElementById('inputArea');
const outputArea = document.getElementById('outputArea');

// 将函数添加到window对象上
window.init = init;
window.processInput = processInput;
window.getCurrentMode = getCurrentMode;
window.updateLanguage = updateLanguage;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('app');
    // 所有模块加载完成后，初始化应用程序
    window.initApp = init;
}
