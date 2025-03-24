// Import from ipConverters.js
import { 
    convertCidrToIpMask, 
    convertIpMaskToCidr, 
    isValidIp, 
    isValidMask,
    compareIPs,
    extractIp
} from './ipConverters.js';

// Import from routerConverters.js
import {
    convertCidrToCisco,
    convertCidrToRouterOs,
    convertCidrToHuawei,
    convertCidrToJuniper,
    convertCidrToFortinet,
    convertFqdnToFortinet,
    extractIpFromCiscoRoute
} from './routerConverters.js';

// Import from jsonExtractor.js
import {
    extractIpPrefixesFromJson,
    findAllIpAddressesInJson,
    findAllIpAddresses
} from './jsonExtractor.js';

// Import from uiHelpers.js
import {
    updateOutputPlaceholder,
    applyRouterSpecificOptions,
    showLoading,
    hideLoading,
    setupResizer,
    showNotification,
    handleError,
    getCurrentMode,
    getCurrentLang,
    updatePageTitle
} from './uiHelpers.js';

// Import from historyManager.js
import {
    addToRecentOperations,
    loadRecentOperations,
    refreshRecentOperations,
    restoreOperation,
    clearOperationHistory
} from './historyManager.js';

// Import from webWorker.js
import {
    initWebWorker,
    extractIpsWithWorker,
    validateIpsWithWorker
} from './webWorker.js';

// Import from analytics.js
import {
    initSEO,
    trackEvent,
    trackPageView
} from './analytics.js';

// Import translations
import translations from './translations.js';

// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functionality across all pages
    setupThemeToggle();
    setupLanguageSelection();
    
    // Call original init function if on main app page
    if (document.getElementById('appTabs')) {
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

// Main initialization function for the application
function init() {
    // Set up event listeners and initialize UI components
    setupTabNavigation();
    setupInputHandlers();
    setupConvertButton();
    setupCopyDownloadButtons();
    setupRouterTypeHandlers();
    setupLanguageButtons();
    setupFileUpload();
    
    // Load recent operations from localStorage
    loadRecentOperations();
    
    // Set up resizer functionality
    setupResizer();
    
    // Handle URL hash changes for tab navigation
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 页面加载时立即执行一次
}

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                if (content.getAttribute('data-tab') === tab) {
                    content.classList.add('active');
                    // Update current mode
                    currentMode = tab;
                    // Update output placeholder based on current mode
                    updateOutputPlaceholder();
                    // Apply router-specific options if in router-config mode
                    if (tab === 'router-config') {
                        applyRouterSpecificOptions();
                    }
                } else {
                    content.classList.remove('active');
                }
            });
            
            // Update URL hash
            window.location.hash = tab;
            
            // Store the active tab in sessionStorage
            sessionStorage.setItem('activeTab', tab);
        });
    });
}

// Setup input handlers
function setupInputHandlers() {
    // Clear input button
    const clearInputBtn = document.getElementById('clearInputBtn');
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
        // 首先尝试自动提取IP地址和域名
        let extractedItems = [];
        
        // 提取所有IP地址
        const ipAddresses = await extractIpsWithWorker(input, document.getElementById('ipv4Only').checked);
        
        // 提取所有域名（简单的域名提取，可能需要更复杂的正则表达式）
        const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/gi;
        const domains = input.match(domainRegex) || [];
        
        // 过滤掉可能被错误识别为域名的IP地址
        const filteredDomains = domains.filter(domain => !domain.match(/^\d+\.\d+\.\d+\.\d+$/));
        
        // 合并IP地址和域名
        extractedItems = [...ipAddresses, ...filteredDomains];
        
        // 如果找到了IP地址或域名，处理它们
        if (extractedItems.length > 0) {
            for (const item of extractedItems) {
                try {
                    // 检查是IP还是域名
                    if (isValidIp(item) || item.includes('/')) {
                        // 这是一个IP地址或CIDR
                        results.push(convertCidrToFortinet(item));
                    } else {
                        // 这是一个域名
                        results.push(convertFqdnToFortinet(item));
                    }
                } catch (e) {
                    console.error('Error processing item:', item, e);
                    invalidLines++;
                }
            }
        } else {
            // 按行处理输入
            const lines = input.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
                try {
                    if (isValidIp(line) || line.includes('/')) {
                        // 这是一个IP地址或CIDR
                        results.push(convertCidrToFortinet(line));
                    } else if (line.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)) {
                        // 这是一个域名
                        results.push(convertFqdnToFortinet(line));
                    } else {
                        invalidLines++;
                    }
                } catch (e) {
                    console.error('Error processing line:', line, e);
                    invalidLines++;
                }
            }
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
            
            // 如果选择了移除重复项
            const removeDuplicates = document.getElementById('removeDuplicates');
            if (removeDuplicates && removeDuplicates.checked) {
                results = [...new Set(results)];
            }
        } else {
            // 对于其他模式，按行处理输入
            const lines = input.split('\n').filter(line => line.trim() !== '');
            const extractedIPs = [];
            
            // 首先尝试提取IP地址
            for (const line of lines) {
                const extractedIP = extractIp(line);
                if (extractedIP) {
                    extractedIPs.push(extractedIP);
                } else {
                    extractedIPs.push(line);
                }
            }
            
            // 验证提取的IP地址
            const validationResult = await validateIpsWithWorker(extractedIPs);
            
            if (!validationResult.valid) {
                outputArea.value = currentLang === 'en' ? 'Validation error: ' + validationResult.message : '验证错误：' + validationResult.message;
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
                            result = convertIpMaskToCidr(ip);
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

    // Sort results if option is checked and it exists
    const sortOutput = document.getElementById('sortOutput');
    if (sortOutput && sortOutput.checked) {
        results.sort(compareIPs);
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
            applyRouterSpecificOptions();
            updateOutputPlaceholder();
        });
    }
    
    // RouterOS type radio buttons
    const routerosTypeRadios = document.querySelectorAll('input[name="routerosType"]');
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
    const fortinetTypeRadios = document.querySelectorAll('input[name="fortinetType"]');
    if (fortinetTypeRadios && fortinetTypeRadios.length > 0) {
        fortinetTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const fortinetAddressGroupOptions = document.getElementById('fortinetAddressGroupOptions');
                
                if (this.value === 'address-group') {
                    fortinetAddressGroupOptions.style.display = 'block';
                } else {
                    fortinetAddressGroupOptions.style.display = 'none';
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
    
    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            updateLanguage('en');
        });
    }
    
    if (langZhBtn) {
        langZhBtn.addEventListener('click', () => {
            updateLanguage('zh');
        });
    }
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
let currentMode = 'bulk-extract'; // Default mode
let currentLang = localStorage.getItem('language') || 'en'; // Default language
const inputArea = document.getElementById('inputArea');
const outputArea = document.getElementById('outputArea');
