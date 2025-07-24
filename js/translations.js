const translations = {
    'en': {
        // Tab names
        'tab-router-config': 'Router Configuration Generator',
        'tab-bulk-extract': 'IP Address Extraction Tool',
        'tab-cidr-to-ip': 'CIDR to IP+Netmask Converter',
        'tab-ip-to-cidr': 'IP+Netmask to CIDR Converter',
        'tab-router': 'Router Cfg',
        'tab-bulk': 'IPs Extract',
        'tab-cidr-ip': 'CIDR → IP',
        'tab-ip-cidr': 'IP → CIDR',
        'ip-address-extraction-tool': 'IP Address Extraction Tool',
        'network-router-configuration-generator': 'Network Router Configuration Generator',
        
        // Button labels
        'convert-button': 'Convert',
        'extract-button': 'Extract',
        'copy-button': 'Copy',
        'download-button': 'Download',
        'clear-button': 'Clear',
        
        // Mode labels
        'mode-router-config': 'Router Configuration',
        'mode-bulk-extract': 'IP Extraction',
        'mode-cidr-to-ip': 'CIDR to IP+Netmask',
        'mode-ip-to-cidr': 'IP+Netmask to CIDR',
        
        // Output placeholders
        'output-placeholder-default': 'Results will appear here after conversion',
        'output-placeholder-bulk': 'Example output:\n192.168.1.0/24\n10.0.0.0/16\n172.16.0.0/12\n2001:db8::/32',
        'output-placeholder-routeros-route': 'Example output:\n/ip route add dst-address=192.168.1.0/24 gateway=192.168.1.1\n/ip route add dst-address=10.0.0.0/16 gateway=192.168.1.1',
        'output-placeholder-routeros-addresslist': 'Example output:\n/ip firewall address-list add list=my-list address=192.168.1.0/24\n/ip firewall address-list add list=my-list address=10.0.0.0/16',
        'output-placeholder-cisco': 'Example output:\nip route 192.168.1.0 255.255.255.0 192.168.1.1\nip route 10.0.0.0 255.255.0.0 192.168.1.1',
        'output-placeholder-huawei': 'Example output:\nip route-static 192.168.1.0 255.255.255.0 192.168.1.1\nip route-static 10.0.0.0 255.255.0.0 192.168.1.1',
        'output-placeholder-juniper': 'Example output:\nset routing-options static route 192.168.1.0/24 next-hop 192.168.1.1\nset routing-options static route 10.0.0.0/16 next-hop 192.168.1.1',
        'output-placeholder-fortinet': 'Example output:\nconfig firewall address\n    edit "192_168_1_0_24"\n        set subnet 192.168.1.0 255.255.255.0\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "192_168_1_0_24"\n    next\nend\n\n# FQDN Example:\nconfig firewall address\n    edit "example.com"\n        set type fqdn\n        set fqdn "example.com"\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "example.com"\n    next\nend\n\n# Auto-extraction works with mixed content:\n# "Our servers are at 192.168.1.0/24 and example.com"',
        'output-placeholder-cidr-ip': 'Example output:\n192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
        'output-placeholder-ip-cidr': 'Example output:\n192.168.1.0/24\n10.0.0.0/16',
        
        // Input placeholders
        'input-placeholder-default': 'Enter your IP addresses or domain names here (one per line)...',
        'input-placeholder-bulk': 'Enter text containing IP addresses or paste JSON data here...',
        'input-placeholder-cidr-ip': 'Enter CIDR notation addresses here (one per line)...\nExample: 192.168.1.0/24',
        'input-placeholder-ip-cidr': 'Enter IP addresses with subnet masks here (one per line)...\nExample: 192.168.1.0 255.255.255.0',
        'input-example-fortinet-mixed': '# You can also paste text with mixed IPs and domains:',
        'input-example-basic': '# Or plain text with IPs',
        
        // RouterOS specific options
        'routeros-type-label': 'RouterOS Type',
        'routeros-type-route': 'Route',
        'routeros-type-addresslist': 'Address List',
        'gateway-label': 'Gateway',
        'list-name-label': 'List Name',
        
        // Cisco/Huawei specific options
        'next-hop-label': 'Next Hop',
        
        // Fortinet specific options
        'fortinet-type-label': 'Fortinet Type',
        'fortinet-type-address': 'Address Only',
        'fortinet-type-group': 'Address Group',
        'group-name-label': 'Group Name',
        'gateway': 'Gateway',
        'list-name': 'List Name',
        'next-hop': 'Next Hop',
        'address-only': 'Address Only',
        'address-group': 'Address Group',
        'addr-group-name': 'Address Group Name',
        'fortinet-auto-extract': 'Fortinet Auto Extract',
        'routeros-auto-extract': '💡 RouterOS address-list mode supports automatic extraction of IP addresses and domain names from any text.',
        'sort-output': 'Sort Output',
        'convert': 'Convert',
        'loading': 'Processing...',
        'output-title': 'Output',
        'initial-summary': 'Results will appear here after conversion',
        'copy': 'Copy to Clipboard',
        'download': 'Download as TXT',
        
        // JSON extraction options
        'json-source-label': 'JSON Source',
        'json-source-auto': 'Auto-detect',
        'json-source-aws': 'AWS IP Ranges',
        'json-source-azure': 'Azure IP Ranges',
        'json-source-gcp': 'GCP IP Ranges',
        'json-source-custom': 'Custom Path',
        'custom-path-label': 'Custom JSON Path',
        
        // Settings
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
        
        // Navigation links in footer
        'home': 'Home',
        'router-configuration': 'Router Configuration',
        'ip-extraction': 'IP Extraction',
        'cidr-converter': 'CIDR Converter',
        'ip-to-cidr': 'IP to CIDR',
        'sitemap': 'Sitemap',
        'github': 'GitHub',
        
        // Section titles in footer
        'navigation': 'Navigation',
        'legal': 'Legal',
        'contact': 'Contact',
        'site-name': 'IPToRoute',
        'footer-description': 'A free network tool for IT professionals, network engineers, and system administrators.',
        'all-rights-reserved': 'All rights reserved',
        
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
        'tooltip-language': 'Switch language',
        
        // Additional translations
        'title-main': 'IPToRoute',
        'title': 'IP Address & Router Configuration Tool',
        'theme-tooltip': 'Toggle Dark Mode',
        'recent-operations': 'Recent Operations',
        'clear-history': 'Clear History',
        'input-title': 'Input',
        'bulk-extract-desc': 'Extract IP addresses and CIDR ranges from any text or JSON data.',
        'example-input': 'Example Input:',
        'input-example-basic': 'Here are some IP addresses: 192.168.1.0/24, 10.0.0.0/16, and 172.16.0.0/12.\nIPv6 addresses like 2001:db8::/32 are also supported.',
        'input-example-fortinet-mixed': 'Our servers are at 192.168.1.0/24 and example.com\nThe backup servers use 10.0.0.0/16 and backup.example.org',
        'bulk-guidance': 'Paste any text containing IP addresses or CIDR ranges. The tool will automatically extract them.',
        'router-config-desc': 'Generate router configuration commands for IP addresses and CIDR ranges.',
        'router-guidance': 'Paste IP addresses or CIDR ranges to generate router configuration commands.',
        'cidr-to-ip-address-subnet-mask-converter': 'CIDR to IP+Netmask Converter',
        'cidr-to-ip-desc': 'Convert CIDR notation to IP address and subnet mask format.',
        'cidr-ip-guidance': 'Enter CIDR notation (e.g., 192.168.1.0/24) to convert to IP address and subnet mask.',
        'ip-address-subnet-mask-to-cidr-converter': 'IP+Netmask to CIDR Converter',
        'ip-to-cidr-desc': 'Convert IP address and subnet mask to CIDR notation.',
        'ip-cidr-guidance': 'Enter IP address and subnet mask (e.g., 192.168.1.0 255.255.255.0) to convert to CIDR notation.',
        'input-paste': 'Paste Input',
        'clear-input': 'Clear Input',
        'paste-clipboard': 'Paste from Clipboard',
        'options-title': 'Options',
        'ipv4-only': 'IPv4 Only',
        'remove-duplicates': 'Remove Duplicates',
        'aggregate-subnets': 'Aggregate IP address ranges',
        'processing-stats': 'Processed:',
        'processing-stats-entries': 'entries',
        'router-type': 'Router Type',
        'router-routeros': 'MikroTik RouterOS',
        'router-cisco': 'Cisco IOS',
        'router-huawei': 'Huawei VRP',
        'router-juniper': 'Juniper JunOS',
        'router-fortinet': 'Fortinet FortiOS',
        'route-name': 'Route Name',
        'route': 'Route',
        'address-list': 'Address List'
    },
    
    // Chinese translations
    'zh': {
        // Tab names
        'tab-router-config': '路由器配置生成器',
        'tab-bulk-extract': 'IP地址提取工具',
        'tab-cidr-to-ip': 'CIDR到IP+子网掩码转换器',
        'tab-ip-to-cidr': 'IP+子网掩码到CIDR转换器',
        'tab-router': '路由配置',
        'tab-bulk': 'IP提取',
        'tab-cidr-ip': 'CIDR→IP',
        'tab-ip-cidr': 'IP→CIDR',
        'ip-address-extraction-tool': 'IP地址提取工具',
        'network-router-configuration-generator': '网络路由器配置生成器',
        
        // Button labels
        'convert-button': '转换',
        'extract-button': '提取',
        'copy-button': '复制',
        'download-button': '下载',
        'clear-button': '清除',
        
        // Mode labels
        'mode-router-config': '路由器配置',
        'mode-bulk-extract': 'IP提取',
        'mode-cidr-to-ip': 'CIDR到IP+掩码',
        'mode-ip-to-cidr': 'IP+掩码到CIDR',
        
        // Output placeholders
        'output-placeholder-default': '转换后的结果将显示在这里',
        'output-placeholder-bulk': '示例输出：\n192.168.1.0/24\n10.0.0.0/16\n172.16.0.0/12\n2001:db8::/32',
        'output-placeholder-routeros-route': '示例输出：\n/ip route add dst-address=192.168.1.0/24 gateway=192.168.1.1\n/ip route add dst-address=10.0.0.0/16 gateway=192.168.1.1',
        'output-placeholder-routeros-addresslist': '示例输出：\n/ip firewall address-list add list=my-list address=192.168.1.0/24\n/ip firewall address-list add list=my-list address=10.0.0.0/16',
        'output-placeholder-cisco': '示例输出：\nip route 192.168.1.0 255.255.255.0 192.168.1.1\nip route 10.0.0.0 255.255.0.0 192.168.1.1',
        'output-placeholder-huawei': '示例输出：\nip route-static 192.168.1.0 255.255.255.0 192.168.1.1\nip route-static 10.0.0.0 255.255.0.0 192.168.1.1',
        'output-placeholder-juniper': '示例输出：\nset routing-options static route 192.168.1.0/24 next-hop 192.168.1.1\nset routing-options static route 10.0.0.0/16 next-hop 192.168.1.1',
        'output-placeholder-fortinet': '示例输出：\nconfig firewall address\n    edit "192_168_1_0_24"\n        set subnet 192.168.1.0 255.255.255.0\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "192_168_1_0_24"\n    next\nend\n\n# FQDN 示例：\nconfig firewall address\n    edit "example.com"\n        set type fqdn\n        set fqdn "example.com"\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "example.com"\n    next\nend\n\n# 自动提取适用于混合内容：\n# "我们的服务器位于192.168.1.0/24和example.com"',
        'output-placeholder-cidr-ip': '示例输出：\n192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
        'output-placeholder-ip-cidr': '示例输出：\n192.168.1.0/24\n10.0.0.0/16',
        
        // Input placeholders
        'input-placeholder-default': '在此处输入您的IP地址或域名（每行一个）...',
        'input-placeholder-bulk': '在此处输入包含IP地址的文本或粘贴JSON数据...',
        'input-placeholder-cidr-ip': '在此处输入CIDR表示法地址（每行一个）...\n示例：192.168.1.0/24',
        'input-placeholder-ip-cidr': '在此处输入IP地址和子网掩码（每行一个）...\n示例：192.168.1.0 255.255.255.0',
        'input-example-fortinet-mixed': '# 您也可以粘贴包含IP和域名的混合文本：',
        'input-example-basic': '# 或者纯文本IP',
        
        // RouterOS specific options
        'routeros-type-label': 'RouterOS类型',
        'routeros-type-route': '路由',
        'routeros-type-addresslist': '地址列表',
        'gateway-label': '网关',
        'list-name-label': '列表名称',
        
        // Cisco/Huawei specific options
        'next-hop-label': '下一跳',
        
        // Fortinet specific options
        'fortinet-type-label': 'Fortinet类型',
        'fortinet-type-address': '仅地址',
        'fortinet-type-group': '地址组',
        'group-name-label': '组名称',
        'gateway': '网关',
        'list-name': '列表名称',
        'next-hop': '下一跳',
        'address-only': '仅地址',
        'address-group': '地址组',
        'addr-group-name': '地址组名称',
        'fortinet-auto-extract': 'Fortinet自动提取',
        'routeros-auto-extract': '💡 RouterOS地址列表模式支持从任何文本中自动提取IP地址和域名。',
        'sort-output': '排序输出',
        'convert': '转换',
        'loading': '处理中...',
        'output-title': '输出',
        'initial-summary': '转换后的结果将显示在这里',
        'copy': '复制到剪贴板',
        'download': '下载为TXT',
        
        // JSON extraction options
        'json-source-label': 'JSON来源',
        'json-source-auto': '自动检测',
        'json-source-aws': 'AWS IP范围',
        'json-source-azure': 'Azure IP范围',
        'json-source-gcp': 'GCP IP范围',
        'json-source-custom': '自定义路径',
        'custom-path-label': '自定义JSON路径',
        
        // Settings
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
        
        // Navigation links in footer
        'home': '首页',
        'router-configuration': '路由器配置',
        'ip-extraction': 'IP提取',
        'cidr-converter': 'CIDR转换器',
        'ip-to-cidr': 'IP到CIDR',
        'sitemap': '网站地图',
        'github': 'GitHub',
        
        // Section titles in footer
        'navigation': '导航',
        'legal': '法律',
        'contact': '联系',
        'site-name': 'IPToRoute',
        'footer-description': '一个为IT专业人员、网络工程师和系统管理员提供的免费网络工具。',
        'all-rights-reserved': '保留所有权利',
        
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
        'tooltip-theme': '切换明暗模式',
        'tooltip-language': '切换语言',
        
        // Additional translations
        'title-main': 'IPToRoute',
        'title': 'IP地址转换与路由配置生成工具',
        'theme-tooltip': '切换明暗模式',
        'recent-operations': '最近操作',
        'clear-history': '清除历史',
        'input-title': '输入',
        'bulk-extract-desc': '从文本中提取IP地址和CIDR块',
        'example-input': '示例输入',
        'input-example-basic': '示例文本包含IP地址：\n服务器IP: 192.168.1.1\n子网: 10.0.0.0/24\n备用IP: 172.16.0.1',
        'input-example-fortinet-mixed': '我们的服务器位于192.168.1.0/24和example.com\n备用服务器使用10.0.0.0/16和backup.example.org',
        'bulk-guidance': '粘贴包含IP地址的文本，工具将自动提取所有IPv4和IPv6地址及CIDR块。',
        'router-config-desc': '为多个路由器平台生成配置命令',
        'router-guidance': '输入IP地址或CIDR块，每行一个，然后选择路由器类型和配置选项。',
        'cidr-to-ip-address-subnet-mask-converter': 'CIDR到IP+子网掩码转换器',
        'cidr-to-ip-desc': '将CIDR表示法转换为IP地址和子网掩码',
        'cidr-ip-guidance': '输入CIDR表示法（例如192.168.1.0/24），每行一个，然后点击转换按钮。',
        'ip-address-subnet-mask-to-cidr-converter': 'IP+子网掩码到CIDR转换器',
        'ip-to-cidr-desc': '将IP地址和子网掩码转换为CIDR表示法',
        'ip-cidr-guidance': '输入IP地址和子网掩码（例如192.168.1.0 255.255.255.0），每行一个，然后点击转换按钮。',
        'input-paste': '粘贴输入',
        'clear-input': '清除输入',
        'paste-clipboard': '从剪贴板粘贴',
        'options-title': '选项',
        'ipv4-only': '仅IPv4',
        'remove-duplicates': '去除重复',
        'aggregate-subnets': '聚合IP地址段',
        'processing-stats': '已处理：',
        'processing-stats-entries': '条记录',
        'router-type': '路由器类型',
        'router-routeros': 'MikroTik RouterOS',
        'router-cisco': 'Cisco IOS',
        'router-huawei': '华为 VRP',
        'router-juniper': 'Juniper JunOS',
        'router-fortinet': 'Fortinet FortiOS',
        'route-name': '路由名称',
        'route': '路由',
        'address-list': '地址列表'
    }
};

// 将translations对象添加到window对象上
window.translations = translations;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('translations');
}
