/**
 * Translations Module
 * Contains all translations for the application
 */

// Define translations for all UI elements
const translations = {
    // English translations
    en: {
        // Page title and description
        'page-title': 'IPToRoute - IP Address Conversion & Router Configuration Generator',
        'page-description': 'A lightweight web tool for IP address conversion and router configuration generation',
        
        // Main tabs
        'tab-bulk-extract': 'IP Extraction',
        'tab-router-config': 'Router Config',
        'tab-cidr-to-ip': 'CIDR → IP+Mask',
        'tab-ip-to-cidr': 'IP+Mask → CIDR',
        
        // Common UI elements
        'input-label': 'Input',
        'output-label': 'Output',
        'convert-button': 'Convert',
        'clear-button': 'Clear',
        'copy-button': 'Copy',
        'history-button': 'History',
        'settings-button': 'Settings',
        'theme-toggle': 'Dark Mode',
        'language-toggle': 'English',
        
        // Input placeholders
        'input-placeholder-bulk': 'Enter text containing IP addresses or CIDR blocks...',
        'input-placeholder-router': 'Enter IP addresses or CIDR blocks, one per line...',
        'input-placeholder-cidr': 'Enter CIDR notation, one per line (e.g., 192.168.1.0/24)...',
        'input-placeholder-ip': 'Enter IP with netmask, one per line (e.g., 192.168.1.0 255.255.255.0)...',
        
        // Output placeholders
        'output-placeholder-default': 'Results will appear here...',
        'output-placeholder-bulk': 'Extracted IP addresses will appear here...',
        'output-placeholder-routeros-addresslist': 'RouterOS address-list commands will appear here...',
        'output-placeholder-routeros-route': 'RouterOS route commands will appear here...',
        'output-placeholder-cisco': 'Cisco IOS route commands will appear here...',
        'output-placeholder-huawei': 'Huawei VRP route commands will appear here...',
        'output-placeholder-juniper': 'Juniper JunOS route commands will appear here...',
        'output-placeholder-fortinet': 'Fortinet FortiOS address objects will appear here...',
        'output-placeholder-cidr-ip': 'IP addresses with netmasks will appear here...',
        'output-placeholder-ip-cidr': 'CIDR notation will appear here...',
        
        // Bulk extraction options
        'ipv4-only-label': 'IPv4 Only',
        'remove-duplicates-label': 'Remove Duplicates',
        
        // Router configuration options
        'router-type-label': 'Router Type',
        'router-type-routeros': 'MikroTik RouterOS',
        'router-type-cisco': 'Cisco IOS',
        'router-type-huawei': 'Huawei VRP',
        'router-type-juniper': 'Juniper JunOS',
        'router-type-fortinet': 'Fortinet FortiOS',
        
        // RouterOS specific options
        'routeros-type-label': 'Configuration Type',
        'routeros-type-addresslist': 'Address List',
        'routeros-type-route': 'Static Route',
        'list-name-label': 'List Name',
        'gateway-label': 'Gateway',
        
        // Cisco, Huawei, Juniper specific options
        'next-hop-label': 'Next Hop',
        'route-name-label': 'Route Name',
        
        // Fortinet specific options
        'fortinet-type-label': 'Configuration Type',
        'fortinet-type-address': 'Address Only',
        'fortinet-type-group': 'Address Group',
        'group-name-label': 'Group Name',
        
        // JSON extraction options
        'json-source-label': 'JSON Source',
        'json-source-auto': 'Auto-detect',
        'json-source-aws': 'AWS IP Ranges',
        'json-source-azure': 'Azure IP Ranges',
        'json-source-gcp': 'GCP IP Ranges',
        'json-source-custom': 'Custom Path',
        'custom-path-label': 'Custom JSON Path',
        
        // History panel
        'history-title': 'Recent Operations',
        'clear-history-button': 'Clear History',
        'no-history': 'No recent operations',
        'restore-button': 'Restore',
        
        // Settings panel
        'settings-title': 'Settings',
        'theme-section': 'Theme',
        'theme-light': 'Light',
        'theme-dark': 'Dark',
        'theme-system': 'System',
        'language-section': 'Language',
        'language-en': 'English',
        'language-zh': '中文 (Chinese)',
        
        // Footer
        'footer-copyright': ' 2023 IPToRoute. All rights reserved.',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Service',
        'footer-cookies': 'Cookie Policy',
        'footer-contact': 'Contact Us',
        
        // Notifications
        'copy-success': 'Copied to clipboard!',
        'copy-error': 'Failed to copy to clipboard',
        'conversion-success': 'Conversion successful!',
        'conversion-error': 'Conversion failed',
        'extraction-success': 'Extraction successful!',
        'extraction-error': 'Extraction failed',
        'no-ip-found': 'No IP addresses found',
        'invalid-input': 'Invalid input format',
        'history-cleared': 'History cleared',
        
        // Tooltips
        'tooltip-copy': 'Copy to clipboard',
        'tooltip-clear': 'Clear input and output',
        'tooltip-convert': 'Convert input',
        'tooltip-history': 'View recent operations',
        'tooltip-settings': 'Open settings',
        'tooltip-theme': 'Toggle dark mode',
        'tooltip-language': 'Switch language'
    },
    
    // Chinese translations
    zh: {
        // Page title and description
        'page-title': 'IPToRoute - IP地址转换和路由器配置生成器',
        'page-description': '一个轻量级的IP地址转换和路由器配置生成工具',
        
        // Main tabs
        'tab-bulk-extract': 'IP提取',
        'tab-router-config': '路由器配置',
        'tab-cidr-to-ip': 'CIDR → IP+掩码',
        'tab-ip-to-cidr': 'IP+掩码 → CIDR',
        
        // Common UI elements
        'input-label': '输入',
        'output-label': '输出',
        'convert-button': '转换',
        'clear-button': '清除',
        'copy-button': '复制',
        'history-button': '历史',
        'settings-button': '设置',
        'theme-toggle': '暗黑模式',
        'language-toggle': '中文',
        
        // Input placeholders
        'input-placeholder-bulk': '输入包含IP地址或CIDR块的文本...',
        'input-placeholder-router': '输入IP地址或CIDR块，每行一个...',
        'input-placeholder-cidr': '输入CIDR表示法，每行一个（例如，192.168.1.0/24）...',
        'input-placeholder-ip': '输入IP和子网掩码，每行一个（例如，192.168.1.0 255.255.255.0）...',
        
        // Output placeholders
        'output-placeholder-default': '结果将显示在这里...',
        'output-placeholder-bulk': '提取的IP地址将显示在这里...',
        'output-placeholder-routeros-addresslist': 'RouterOS地址列表命令将显示在这里...',
        'output-placeholder-routeros-route': 'RouterOS路由命令将显示在这里...',
        'output-placeholder-cisco': 'Cisco IOS路由命令将显示在这里...',
        'output-placeholder-huawei': '华为VRP路由命令将显示在这里...',
        'output-placeholder-juniper': 'Juniper JunOS路由命令将显示在这里...',
        'output-placeholder-fortinet': 'Fortinet FortiOS地址对象将显示在这里...',
        'output-placeholder-cidr-ip': 'IP地址和子网掩码将显示在这里...',
        'output-placeholder-ip-cidr': 'CIDR表示法将显示在这里...',
        
        // Bulk extraction options
        'ipv4-only-label': '仅IPv4',
        'remove-duplicates-label': '去除重复',
        
        // Router configuration options
        'router-type-label': '路由器类型',
        'router-type-routeros': 'MikroTik RouterOS',
        'router-type-cisco': 'Cisco IOS',
        'router-type-huawei': '华为 VRP',
        'router-type-juniper': 'Juniper JunOS',
        'router-type-fortinet': 'Fortinet FortiOS',
        
        // RouterOS specific options
        'routeros-type-label': '配置类型',
        'routeros-type-addresslist': '地址列表',
        'routeros-type-route': '静态路由',
        'list-name-label': '列表名称',
        'gateway-label': '网关',
        
        // Cisco, Huawei, Juniper specific options
        'next-hop-label': '下一跳',
        'route-name-label': '路由名称',
        
        // Fortinet specific options
        'fortinet-type-label': '配置类型',
        'fortinet-type-address': '仅地址',
        'fortinet-type-group': '地址组',
        'group-name-label': '组名称',
        
        // JSON extraction options
        'json-source-label': 'JSON来源',
        'json-source-auto': '自动检测',
        'json-source-aws': 'AWS IP范围',
        'json-source-azure': 'Azure IP范围',
        'json-source-gcp': 'GCP IP范围',
        'json-source-custom': '自定义路径',
        'custom-path-label': '自定义JSON路径',
        
        // History panel
        'history-title': '最近操作',
        'clear-history-button': '清除历史',
        'no-history': '没有最近操作',
        'restore-button': '恢复',
        
        // Settings panel
        'settings-title': '设置',
        'theme-section': '主题',
        'theme-light': '浅色',
        'theme-dark': '深色',
        'theme-system': '系统',
        'language-section': '语言',
        'language-en': 'English (英文)',
        'language-zh': '中文',
        
        // Footer
        'footer-copyright': ' 2023 IPToRoute. 保留所有权利。',
        'footer-privacy': '隐私政策',
        'footer-terms': '服务条款',
        'footer-cookies': 'Cookie政策',
        'footer-contact': '联系我们',
        
        // Notifications
        'copy-success': '已复制到剪贴板！',
        'copy-error': '复制到剪贴板失败',
        'conversion-success': '转换成功！',
        'conversion-error': '转换失败',
        'extraction-success': '提取成功！',
        'extraction-error': '提取失败',
        'no-ip-found': '未找到IP地址',
        'invalid-input': '无效的输入格式',
        'history-cleared': '历史已清除',
        
        // Tooltips
        'tooltip-copy': '复制到剪贴板',
        'tooltip-clear': '清除输入和输出',
        'tooltip-convert': '转换输入',
        'tooltip-history': '查看最近操作',
        'tooltip-settings': '打开设置',
        'tooltip-theme': '切换暗黑模式',
        'tooltip-language': '切换语言'
    }
};

// Mapping of netmask to CIDR
const maskToCidrMap = {
    "255.255.255.255": 32,
    "255.255.255.254": 31,
    "255.255.255.252": 30,
    "255.255.255.248": 29,
    "255.255.255.240": 28,
    "255.255.255.224": 27,
    "255.255.255.192": 26,
    "255.255.255.128": 25,
    "255.255.255.0": 24,
    "255.255.254.0": 23,
    "255.255.252.0": 22,
    "255.255.248.0": 21,
    "255.255.240.0": 20,
    "255.255.224.0": 19,
    "255.255.192.0": 18,
    "255.255.128.0": 17,
    "255.255.0.0": 16,
    "255.254.0.0": 15,
    "255.252.0.0": 14,
    "255.248.0.0": 13,
    "255.240.0.0": 12,
    "255.224.0.0": 11,
    "255.192.0.0": 10,
    "255.128.0.0": 9,
    "255.0.0.0": 8,
    "254.0.0.0": 7,
    "252.0.0.0": 6,
    "248.0.0.0": 5,
    "240.0.0.0": 4,
    "224.0.0.0": 3,
    "192.0.0.0": 2,
    "128.0.0.0": 1,
    "0.0.0.0": 0
};

// Export translations for use in other modules
export default translations;
export { maskToCidrMap };
