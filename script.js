document.addEventListener('DOMContentLoaded', function() {
    // Language translations
    const translations = {
        en: {
            'title': 'IP Address Conversion & Router Configuration Generator',
            'title-main': 'IPToRoute',
            'tab-bulk': 'IPs Extract',
            'tab-router': 'Router Cfg',
            'tab-cidr-ip': 'CIDR → IP',
            'tab-ip-cidr': 'IP → CIDR',
            'input-title': 'Input',
            'input-paste': 'Paste Text',
            'input-upload': 'Upload File',
            'select-file': 'Select File',
            'options-title': 'Options',
            'bulk-extract-title': 'Bulk Extraction Options',
            'ipv4-only': 'Extract IPv4 only (skip IPv6)',
            'remove-duplicates': 'Remove duplicate IP addresses',
            'bulk-info': '',
            'router-type': 'Router Type:',
            'router-routeros': 'MikroTik',
            'router-cisco': 'Cisco',
            'router-huawei': 'Huawei',
            'router-juniper': 'Juniper',
            'router-fortinet': 'Fortinet',
            'next-hop': 'Next Hop IP:',
            'route-name': 'Route Name:',
            'list-name': 'List Name:',
            'address-list': 'Address List',
            'route': 'Route',
            'gateway': 'Gateway:',
            'sort-output': 'Sort IP addresses',
            'convert': 'Convert',
            'output-title': 'Output',
            'copy': 'Copy to Clipboard',
            'download': 'Download as TXT',
            'footer': 'IPToRoute © 2024',
            'theme-tooltip': 'Switch between light and dark mode',
            'recent-operations': 'Recent Operations',
            'clear-input': 'Clear',
            'paste-clipboard': 'Paste from Clipboard',
            'initial-summary': 'Your results will appear here after conversion',
            'bulk-guidance': 'Paste any text containing IP addresses and the tool will automatically find and extract them for you.',
            'router-guidance': 'The tool supports automatic IP address extraction from any text. Select your router type and configure additional options before converting.',
            'cidr-ip-guidance': 'Enter one CIDR subnet per line to convert to IP with netmask format.',
            'ip-cidr-guidance': 'Enter IP and netmask separated by space, one per line.',
            'validation-error': 'Please check your input format.',
            'no-content': 'No content to download.',
            'copy-success': 'Copied to clipboard!',
            'copy-error': 'Failed to copy. Please try again.',
            'processing': 'Processing...',
            'error-occurred': 'An error occurred during conversion.',
            'invalid-json': 'Invalid text format:',
            'no-ip-found': 'No valid IP prefixes found in the text.',
            'error-processing': 'Error processing text:',
            'example-input': 'Input Example:',
            'example-output': 'Output Example:',
            'example-output-cisco': 'Output Example (Cisco):',
            'example-output-fortinet': 'Output Example (Fortinet):',
            'bulk-extract-desc': 'Extract IP addresses and CIDR ranges from any text or JSON. Useful for processing logs, configs, or cloud provider IP lists.',
            'router-config-desc': 'Convert CIDR notation or domain names (FQDN) to router configuration commands for different router brands.',
            'cidr-to-ip-desc': 'Convert CIDR notation (e.g., 192.168.1.0/24) to IP address with netmask format.',
            'ip-to-cidr-desc': 'Convert IP address with netmask format to CIDR notation.',
            'example-input-bulk': '{"prefixes": [{"ip_prefix": "192.168.1.0/24"}, {"ip_prefix": "10.0.0.0/16"}]}',
            'example-output-bulk': '192.168.1.0/24\n10.0.0.0/16',
            'example-input-router': '192.168.1.0/24\n10.0.0.0/16',
            'example-output-routeros': '/ip firewall address-list add address=192.168.1.0/24 list=CN\n/ip firewall address-list add address=10.0.0.0/16 list=CN',
            'example-output-cisco-content': 'ip route 192.168.1.0 255.255.255.0 192.168.0.1 name CN\nip route 10.0.0.0 255.255.0.0 192.168.0.1 name CN',
            'example-output-fortinet-content': 'config firewall address\n    edit "192_168_1_0_24"\n        set subnet 192.168.1.0 255.255.255.0\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "192_168_1_0_24"\n    next\nend',
            'example-output-huawei-content': 'ip route-static 192.168.1.0 255.255.255.0 192.168.1.1\nip route-static 10.0.0.0 255.255.0.0 192.168.1.1',
            'example-output-juniper-content': 'set routing-options static route 192.168.1.0/24 next-hop 192.168.1.1\nset routing-options static route 10.0.0.0/16 next-hop 192.168.1.1',
            'example-input-cidr': '192.168.1.0/24\n10.0.0.0/16',
            'example-output-cidr': '192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
            'example-input-ip': '192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
            'example-output-ip': '192.168.1.0/24\n10.0.0.0/16',
            'input-placeholder-bulk': 'Paste text or JSON containing IP addresses here...',
            'input-placeholder-default': 'Enter your IP addresses or domain names here (one per line)...',
            'output-placeholder-default': 'Output will appear here after conversion...',
            'output-placeholder-routeros': 'Example output:\n/ip firewall address-list add address=192.168.1.0/24 list=CN\n/ip firewall address-list add address=10.0.0.0/16 list=CN',
            'output-placeholder-cisco': 'Example output:\nip route 192.168.1.0 255.255.255.0 192.168.0.1 name CN\nip route 10.0.0.0 255.255.0.0 192.168.0.1 name CN',
            'output-placeholder-fortinet': 'Example output:\nconfig firewall address\n    edit "192_168_1_0_24"\n        set subnet 192.168.1.0 255.255.255.0\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "192_168_1_0_24"\n    next\nend\n\n# FQDN Example:\nconfig firewall address\n    edit "example.com"\n        set type fqdn\n        set fqdn "example.com"\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "example.com"\n    next\nend\n\n# Auto-extraction works with mixed content:\n# "Our servers are at 192.168.1.0/24 and example.com"',
            'output-placeholder-huawei': 'Example output:\nip route-static 192.168.1.0 255.255.255.0 192.168.1.1\nip route-static 10.0.0.0 255.255.0.0 192.168.1.1',
            'output-placeholder-juniper': 'Example output:\nset routing-options static route 192.168.1.0/24 next-hop 192.168.1.1\nset routing-options static route 10.0.0.0/16 next-hop 192.168.1.1',
            'output-placeholder-cidr-ip': 'Example output:\n192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
            'output-placeholder-ip-cidr': 'Example output:\n192.168.1.0/24\n10.0.0.0/16',
            'output-placeholder-bulk': 'Example output:\n192.168.1.0/24\n10.0.0.0/16',
            'input-placeholder-nexthop': 'e.g., 192.168.1.1',
            'input-placeholder-routename': 'e.g., CN',
            'input-placeholder-listname': 'e.g., CN',
            'addr-group-name': 'Address Group Name:',
            'address-only': 'IP Address or Domain Only',
            'address-group': 'Add to Address Group',
            'fortinet-auto-extract': '💡 Fortinet mode supports automatic extraction of IP addresses and domain names from any text.',
            'clear-history': 'Clear History',
            'output-placeholder-routeros-addresslist': 'Example output:\n/ip firewall address-list add address=192.168.1.0/24 list=CN\n/ip firewall address-list add address=10.0.0.0/16 list=CN',
            'output-placeholder-routeros-route': 'Example output:\n/ip route add dst-address=192.168.1.0/24 gateway=192.168.1.1\n/ip route add dst-address=10.0.0.0/16 gateway=192.168.1.1',
            // 添加以下新的翻译项，用于首页未翻译的元素
            'navigation': 'Navigation',
            'legal': 'Legal',
            'contact': 'Contact',
            'all-rights-reserved': 'All rights reserved',
            'footer-description': 'Free networking tools for IT professionals, network engineers, and system administrators.',
            'ip-address-extraction-tool': 'IP Address Extraction Tool',
            'network-router-configuration-generator': 'Network Router Configuration Generator',
            'cidr-to-ip-address-subnet-mask-converter': 'CIDR to IP Address and Subnet Mask Converter',
            'ip-address-subnet-mask-to-cidr-converter': 'IP Address and Subnet Mask to CIDR Converter',
            'input-example-basic': '# Or plain text with IPs',
            'input-example-fortinet-mixed': '# Also works with mixed text containing IPs and domains:',
            'validation-feedback': 'Validation Feedback'
        },
        zh: {
            'title': 'IP地址转换与路由配置生成工具',
            'title-main': 'IPToRoute',
            'tab-bulk': 'IP提取',
            'tab-router': '路由配置',
            'tab-cidr-ip': 'CIDR 转 IP',
            'tab-ip-cidr': 'IP 转 CIDR',
            'input-title': '输入',
            'input-paste': '粘贴文本',
            'input-upload': '上传文件',
            'select-file': '选择文件',
            'options-title': '选项',
            'bulk-extract-title': '批量提取选项',
            'ipv4-only': '仅提取IPv4（跳过IPv6）',
            'remove-duplicates': '删除重复的IP地址',
            'bulk-info': '',
            'router-type': '路由器类型:',
            'router-routeros': 'MikroTik',
            'router-cisco': 'Cisco',
            'router-huawei': 'Huawei',
            'router-juniper': 'Juniper',
            'router-fortinet': 'Fortinet',
            'next-hop': '路由下一跳IP:',
            'route-name': '路由名称:',
            'list-name': '列表名称:',
            'address-list': '防火墙地址列表',
            'route': '路由',
            'gateway': '网关:',
            'sort-output': '排序IP地址',
            'convert': '转换',
            'output-title': '输出',
            'copy': '复制到剪贴板',
            'download': '下载为TXT',
            'footer': 'IPToRoute © 2024',
            'theme-tooltip': '切换明暗主题',
            'recent-operations': '最近操作',
            'clear-input': '清除',
            'paste-clipboard': '从剪贴板粘贴',
            'initial-summary': '转换后的结果将显示在这里',
            'bulk-guidance': '粘贴包含IP地址的任意文本，工具将自动查找并提取所有IP地址。',
            'router-guidance': '支持从任意文本中自动提取IP地址，选择路由器类型并配置相关选项后开始转换。',
            'cidr-ip-guidance': '每行输入一个CIDR子网以转换为IP和子网掩码格式。',
            'ip-cidr-guidance': '每行输入一个IP地址和子网掩码（用空格分隔）。',
            'validation-error': '请检查输入格式。',
            'no-content': '没有可下载的内容。',
            'copy-success': '已复制到剪贴板！',
            'copy-error': '复制失败，请重试。',
            'processing': '处理中...',
            'error-occurred': '转换过程中发生错误。',
            'invalid-json': '无效的文本格式：',
            'no-ip-found': '在文本中未找到有效的IP前缀。',
            'error-processing': '处理文本时出错：',
            'example-input': '输入示例：',
            'example-output': '输出示例：',
            'example-output-cisco': '输出示例（思科）：',
            'example-output-fortinet': '输出示例（Fortinet）：',
            'bulk-extract-desc': '从任意文本或JSON中提取IP地址和CIDR范围。适用于处理日志、配置文件或云服务提供商的IP列表。',
            'router-config-desc': '将CIDR表示法或域名（FQDN）转换为不同品牌路由器的配置命令。',
            'cidr-to-ip-desc': '将CIDR表示法（如192.168.1.0/24）转换为IP地址和子网掩码格式。',
            'ip-to-cidr-desc': '将IP地址和子网掩码格式转换为CIDR表示法。',
            'example-input-bulk': '{"prefixes": [{"ip_prefix": "192.168.1.0/24"}, {"ip_prefix": "10.0.0.0/16"}]}',
            'example-output-bulk': '192.168.1.0/24\n10.0.0.0/16',
            'example-input-router': '192.168.1.0/24\n10.0.0.0/16',
            'example-output-routeros': '/ip firewall address-list add address=192.168.1.0/24 list=CN\n/ip firewall address-list add address=10.0.0.0/16 list=CN',
            'example-output-cisco-content': 'ip route 192.168.1.0 255.255.255.0 192.168.0.1 name CN\nip route 10.0.0.0 255.255.0.0 192.168.0.1 name CN',
            'example-output-fortinet-content': 'config firewall address\n    edit "192_168_1_0_24"\n        set subnet 192.168.1.0 255.255.255.0\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "192_168_1_0_24"\n    next\nend',
            'example-output-huawei-content': 'ip route-static 192.168.1.0 255.255.255.0 192.168.1.1\nip route-static 10.0.0.0 255.255.0.0 192.168.1.1',
            'example-output-juniper-content': 'set routing-options static route 192.168.1.0/24 next-hop 192.168.1.1\nset routing-options static route 10.0.0.0/16 next-hop 192.168.1.1',
            'example-input-cidr': '192.168.1.0/24\n10.0.0.0/16',
            'example-output-cidr': '192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
            'example-input-ip': '192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
            'example-output-ip': '192.168.1.0/24\n10.0.0.0/16',
            'input-placeholder-bulk': '在此粘贴包含IP地址的文本或JSON...',
            'input-placeholder-default': '在此输入您的IP地址或域名（每行一个）...',
            'output-placeholder-default': '转换后的结果将显示在这里...',
            'output-placeholder-routeros': '输出示例：\n/ip firewall address-list add address=192.168.1.0/24 list=CN\n/ip firewall address-list add address=10.0.0.0/16 list=CN',
            'output-placeholder-cisco': '输出示例：\nip route 192.168.1.0 255.255.255.0 192.168.0.1 name CN\nip route 10.0.0.0 255.255.0.0 192.168.0.1 name CN',
            'output-placeholder-fortinet': '输出示例：\nconfig firewall address\n    edit "192_168_1_0_24"\n        set subnet 192.168.1.0 255.255.255.0\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "192_168_1_0_24"\n    next\nend\n\n# FQDN示例：\nconfig firewall address\n    edit "example.com"\n        set type fqdn\n        set fqdn "example.com"\n    next\nend\nconfig firewall addrgrp\n    edit IP_Group\n        append member "example.com"\n    next\nend\n\n# 自动提取功能适用于混合内容：\n# "我们的服务器位于 192.168.1.0/24 和 example.com"',
            'output-placeholder-huawei': '输出示例：\nip route-static 192.168.1.0 255.255.255.0 192.168.1.1\nip route-static 10.0.0.0 255.255.0.0 192.168.1.1',
            'output-placeholder-juniper': '输出示例：\nset routing-options static route 192.168.1.0/24 next-hop 192.168.1.1\nset routing-options static route 10.0.0.0/16 next-hop 192.168.1.1',
            'output-placeholder-cidr-ip': '输出示例：\n192.168.1.0 255.255.255.0\n10.0.0.0 255.255.0.0',
            'output-placeholder-ip-cidr': '输出示例：\n192.168.1.0/24\n10.0.0.0/16',
            'output-placeholder-bulk': '输出示例：\n192.168.1.0/24\n10.0.0.0/16',
            'input-placeholder-nexthop': '例如：192.168.1.1',
            'input-placeholder-routename': '例如：CN',
            'input-placeholder-listname': '例如：CN',
            'addr-group-name': '地址组名称:',
            'address-only': '仅IP地址或域名',
            'address-group': '将域名或IP地址加入组',
            'fortinet-auto-extract': '💡 Fortinet模式支持从任意文本中自动提取IP地址和域名。',
            'clear-history': '清除历史',
            'output-placeholder-routeros-addresslist': '输出示例：\n/ip firewall address-list add address=192.168.1.0/24 list=CN\n/ip firewall address-list add address=10.0.0.0/16 list=CN',
            'output-placeholder-routeros-route': '输出示例：\n/ip route add dst-address=192.168.1.0/24 gateway=192.168.1.1\n/ip route add dst-address=10.0.0.0/16 gateway=192.168.1.1',
            // 添加以下新的翻译项，用于首页未翻译的元素
            'navigation': '导航',
            'legal': '法律条款',
            'contact': '联系我们',
            'all-rights-reserved': '版权所有',
            'footer-description': '为IT专业人员、网络工程师和系统管理员提供的免费网络工具。',
            'ip-address-extraction-tool': 'IP地址提取工具',
            'network-router-configuration-generator': '网络路由器配置生成器',
            'cidr-to-ip-address-subnet-mask-converter': 'CIDR转IP地址和子网掩码转换器',
            'ip-address-subnet-mask-to-cidr-converter': 'IP地址和子网掩码转CIDR转换器',
            'input-example-basic': '# 或纯文本IP地址',
            'input-example-fortinet-mixed': '# 也可以处理包含IP和域名的混合文本：',
            'validation-feedback': '验证反馈',
            'contact-title': '联系我们',
            'get-in-touch': '联系方式',
            'contact-intro': '对我们的工具有疑问、反馈或需要帮助？我们很乐意听取您的意见。填写下面的表单，我们将尽快回复您。',
            'email-title': '📧 电子邮件',
            'github-title': '💻 GitHub',
            'general-inquiries': '一般查询：',
            'tech-support': '技术支持：',
            'bug-reports': '如需报告错误或请求新功能，请访问我们的GitHub仓库。',
            'contact-form-title': '联系表单',
            'name-label': '姓名',
            'email-label': '电子邮件',
            'subject-label': '主题',
            'message-label': '消息',
            'send-message': '发送消息',
            'sending-message': '发送中...',
            'thank-you-message': '感谢您的留言，我们将尽快回复！',
            'faq-title': '常见问题',
            'faq-free': '这些工具免费使用吗？',
            'faq-free-answer': '是的，所有IPToRoute工具都完全免费，可用于个人和商业用途。',
            'faq-secure': '我的数据安全吗？',
            'faq-secure-answer': 'IPToRoute是一个客户端应用程序。所有处理都在您的浏览器中进行，您的IP地址和网络配置不会传输到我们的服务器。',
            'faq-offline': '我可以离线使用IPToRoute吗？',
            'faq-offline-answer': '目前，IPToRoute需要互联网连接才能加载。但是，一旦加载完成，核心工具无需进一步的互联网访问即可运行。',
            'faq-bug': '如何报告错误？',
            'faq-bug-answer': '您可以通过我们的GitHub Issues页面或使用本页面的联系表单报告错误。',
            
            // 联系表单选项
            'general-inquiry': '一般咨询',
            'tech-support-option': '技术支持',
            'feedback': '反馈意见',
            'feature-request': '功能请求',
            'bug-report': '错误报告',
            
            // 页脚和通用元素
            'footer-description': '为IT专业人员、网络工程师和系统管理员提供的免费网络工具。',
            'navigation': '导航',
            'legal': '法律条款',
            'contact': '联系我们',
            'all-rights-reserved': '版权所有',
            'theme-tooltip': '切换明暗模式',
            
            // 隐私政策页面
            'privacy-title': '隐私政策',
            'last-updated': '最后更新：2024年3月18日',
            'privacy-intro': '欢迎访问IPToRoute。我们尊重您的隐私并致力于保护您的个人数据。本隐私政策将告知您我们如何处理您访问我们网站时的个人数据，并告诉您有关您的隐私权利。',
            'introduction': '介绍',
            'data-we-collect': '我们收集的数据',
            'client-side-app': 'IPToRoute是一个客户端应用程序。您输入的IP地址和网络配置完全在您的浏览器中处理，不会传输到我们的服务器。我们不存储您的IP地址或配置。',
            'however-collect': '但是，我们确实收集以下信息：',
            'usage-data': '使用数据',
            'usage-data-desc': '匿名分析，帮助我们了解用户如何与我们的工具交互',
            'cookies': 'Cookies',
            'cookies-desc': '存储在您设备上的小型文本文件，用于记住您的偏好设置',
            'analytics': '分析',
            'analytics-desc': '我们使用Google Analytics收集关于用户如何与我们的网站交互的匿名数据。这有助于我们改进服务和用户体验。收集的信息包括：',
            'pages-visited': '访问的页面',
            'time-spent': '在网站上花费的时间',
            'browser-info': '浏览器和设备信息',
            'referring-sites': '引荐网站',
            'analytics-cookies': 'Google Analytics使用cookies收集此信息。您可以使用<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics退出浏览器插件</a>来选择退出Google Analytics。',
            'how-we-use': '我们如何使用您的数据',
            'use-collected-data': '我们使用收集的数据来：',
            'improve-website': '改进我们的网站和服务',
            'understand-users': '了解用户如何与我们的工具交互',
            'remember-prefs': '记住您的偏好设置',
            'data-security': '数据安全',
            'security-important': '您数据的安全对我们很重要。由于IPToRoute在客户端处理数据，您的敏感网络信息永远不会离开您的浏览器。我们对我们确实收集的有限数据实施适当的安全措施。',
            'your-rights': '您的权利',
            'rights-description': '根据您所在的地区，您可能对您的个人数据拥有某些权利，包括：',
            'right-access': '访问您数据的权利',
            'right-correct': '更正不准确数据的权利',
            'right-erasure': '删除您数据的权利',
            'right-restrict': '限制处理的权利',
            'right-portability': '数据可携带性权利',
            'right-object': '反对处理的权利',
            'exercise-rights': '要行使这些权利中的任何一项，请使用我们的<a href="../contact/">联系表单</a>联系我们。',
            'changes-policy': '本政策的变更',
            'update-policy': '我们可能会不时更新我们的隐私政策。我们将通过在此页面上发布新的隐私政策并更新"最后更新"日期来通知您任何变更。',
            'contact-us': '联系我们',
            'questions-contact': '如果您对本隐私政策有任何疑问，请通过我们的<a href="../contact/">联系页面</a>联系我们。',
            
            // 服务条款页面
            'terms-title': '服务条款',
            'terms-intro': '欢迎访问IPToRoute。通过访问或使用我们的网站，您同意受这些服务条款的约束。如果您不同意这些条款的任何部分，您可能不会访问该服务。',
            'use-license': '使用许可',
            'license-desc': '允许临时使用本网站仅供个人、非商业性的短暂浏览。这是一种许可授权，而非所有权转让，根据此许可，您不得：',
            'no-modify': '修改或复制材料',
            'no-commercial': '将材料用于任何商业目的或公开展示',
            'no-reverse': '尝试对IPToRoute网站上包含的任何软件进行逆向工程',
            'no-remove-notice': '从材料中删除任何版权或其他专有标记',
            'no-transfer': '将材料转让给他人或在任何其他服务器上"镜像"材料',
            'license-terminate': '如果您违反任何这些限制，此许可将自动终止，并可能随时被IPToRoute终止。',
            'disclaimer': '免责声明',
            'disclaimer-desc': 'IPToRoute网站上的材料按"原样"提供。IPToRoute不作任何明示或暗示的保证，并在此免除和否认所有其他保证，包括但不限于对适销性、特定用途适用性或不侵犯知识产权或其他权利侵犯的暗示保证或条件。',
            'disclaimer-further': '此外，IPToRoute不保证或作出任何关于其网站上材料的准确性、可能结果或可靠性的陈述，或其他与这些材料或链接到本网站的任何网站有关的陈述。',
            'limitations': '限制',
            'limitations-desc': '在任何情况下，IPToRoute或其供应商均不对任何损害（包括但不限于数据丢失或利润损失，或由于业务中断）承担责任，这些损害是由于使用或无法使用IPToRoute网站上的材料而产生的，即使IPToRoute或IPToRoute授权代表已口头或书面通知可能发生此类损害。',
            'limitations-jurisdictions': '由于某些司法管辖区不允许对暗示保证的限制，或对间接或附带损害的责任限制，这些限制可能不适用于您。',
            'accuracy': '材料的准确性',
            'accuracy-desc': 'IPToRoute网站上出现的材料可能包括技术、排版或摄影错误。IPToRoute不保证其网站上的任何材料是准确、完整或最新的。IPToRoute可能随时更改其网站上包含的材料，恕不另行通知。但是，IPToRoute不承诺更新材料。',
            'links': '链接',
            'links-desc': 'IPToRoute尚未审核链接到其网站的所有网站，并且不对任何此类链接网站的内容负责。任何链接的包含并不意味着IPToRoute对该网站的认可。使用任何此类链接网站的风险由用户自行承担。',
            'modifications': '修改',
            'modifications-desc': 'IPToRoute可能随时修改其网站的服务条款，恕不另行通知。使用本网站即表示您同意受当时有效的服务条款版本的约束。',
            'governing-law': '适用法律',
            'governing-law-desc': '这些条款和条件受法律管辖并按照法律解释，您不可撤销地服从该地点法院的专属管辖权。',
            
            // Cookie政策页面
            'cookie-title': 'Cookie政策',
            'cookie-intro': '本Cookie政策解释了IPToRoute如何使用cookies和类似技术在您访问我们的网站时识别您。它解释了这些技术是什么以及我们为什么使用它们，以及您控制我们使用它们的权利。',
            'what-are-cookies': '什么是Cookies？',
            'cookies-def-1': 'Cookies是在您访问网站时放置在您的计算机或移动设备上的小型数据文件。网站所有者广泛使用cookies使其网站工作，或更有效地工作，以及提供报告信息。',
            'cookies-def-2': '由网站所有者（在本例中为IPToRoute）设置的cookies被称为"第一方cookies"。由网站所有者以外的parties设置的cookies被称为"第三方cookies"。第三方cookies使第三方功能或功能可以在网站上或通过网站提供（例如，广告、交互式内容和分析）。',
            'why-use-cookies': '我们为什么使用Cookies？',
            'cookie-reasons': '我们使用第一方和第三方cookies的原因有几个。一些cookies是出于技术原因需要的，以便我们的网站能够运行，我们将其称为"必要"或"绝对必要"的cookies。其他cookies使我们能够跟踪和针对用户的兴趣，以增强网站上的体验。例如，IPToRoute跟踪访问的页面和链接，以了解您如何使用和偏好我们的网站，并据此调整我们的服务。',
            'cookie-third-party': '第三方通过我们的网站提供cookies，用于分析、个性化和广告目的。这在下面有更详细的描述。',
            'types-of-cookies': '我们使用的Cookies类型',
            'essential-cookies': '必要Cookies',
            'essential-desc': '这些cookies对于通过我们的网站提供服务和使用其某些功能（如访问安全区域）是绝对必要的。由于这些cookies对于提供网站是绝对必要的，因此在不影响我们网站如何运作的情况下，您不能拒绝它们。',
            'performance-cookies': '性能和功能Cookies',
            'performance-desc': '这些cookies用于增强我们网站的性能和功能。它们帮助我们记住偏好，例如您选择的语言或您所在的region。它们可能由我们设置，也可能由我们添加到页面的第三方提供商设置。如果您不允许这些cookies，那么部分或全部服务可能无法正常运行。',
            'analytics-cookies': '分析和定制Cookies',
            'analytics-desc': '这些cookies收集的信息用于帮助我们了解我们的网站如何被使用或我们的营销活动如何有效，或帮助我们为您定制我们的网站。我们使用由Google Analytics提供的cookies直接从终端用户浏览器收集有限数据，以使我们能够更好地了解您对我们网站的使用。',
            'control-cookies': '如何控制Cookies？',
            'control-desc-1': '您有权决定是否接受或拒绝cookies。您可以设置或修改您的Web浏览器控制来接受或拒绝cookies。如果您选择拒绝cookies，您仍然可以使用我们的网站，但您对网站某些功能和区域的访问可能会受到限制。',
            'control-desc-2': '大多数Web浏览器允许通过浏览器设置对大多数cookies进行某种程度的控制。要了解更多关于cookies的信息，包括如何查看设置了哪些cookies以及如何管理和删除它们，请访问<a href="https://www.allaboutcookies.org" target="_blank" rel="noopener">www.allaboutcookies.org</a>。',
            'browser-settings': '有关如何在不同Web浏览器上管理cookies的更多信息，请访问浏览器开发商的网站。',
            'specific-analytics': '我们使用的特定分析服务',
            'google-analytics': 'Google Analytics',
            'analytics-info-1': 'IPToRoute使用Google Analytics，这是由Google, Inc.提供的Web分析服务。Google Analytics使用cookies帮助网站分析用户如何使用网站。cookie生成的关于您使用网站的信息将传输到美国的Google服务器并存储在那里。',
            'analytics-info-2': 'Google将代表IPToRoute使用这些信息，目的是评估您对网站的使用，编制关于网站活动的报告，并向IPToRoute提供与网站活动和互联网使用相关的其他服务。',
            'analytics-optout': '您可以通过在浏览器上禁用cookies或使用<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics退出浏览器插件</a>来防止Google Analytics在您返回访问本网站时识别您。',
            'policy-changes': '本Cookie政策的变更',
            'changes-desc': '我们可能会不时更新本Cookie政策，以反映我们使用的cookies变化或出于其他运营、法律或监管原因。因此，请定期重新访问本Cookie政策，以了解我们使用cookies和相关技术的情况。',
            'last-updated-info': '本Cookie政策顶部的日期表示其最后一次更新。',

            // 页脚导航链接翻译
            'home': '首页',
            'router-configuration': '路由配置',
            'ip-extraction': 'IP提取',
            'cidr-converter': 'CIDR转换器',
            'ip-to-cidr': 'IP到CIDR',
            'sitemap': '网站地图',
            'privacy-policy': '隐私政策',
            'terms-of-service': '服务条款',
            'cookie-policy': 'Cookie政策',
            'contact-us': '联系我们',
            'github': 'GitHub'
        }
    };

    // Mapping of CIDR to netmask
    const cidrToMaskMap = {
        32: "255.255.255.255",
        31: "255.255.255.254",
        30: "255.255.255.252",
        29: "255.255.255.248",
        28: "255.255.255.240",
        27: "255.255.255.224",
        26: "255.255.255.192",
        25: "255.255.255.128",
        24: "255.255.255.0",
        23: "255.255.254.0",
        22: "255.255.252.0",
        21: "255.255.248.0",
        20: "255.255.240.0",
        19: "255.255.224.0",
        18: "255.255.192.0",
        17: "255.255.128.0",
        16: "255.255.0.0",
        15: "255.254.0.0",
        14: "255.252.0.0",
        13: "255.248.0.0",
        12: "255.240.0.0",
        11: "255.224.0.0",
        10: "255.192.0.0",
        9: "255.128.0.0",
        8: "255.0.0.0",
        7: "254.0.0.0",
        6: "252.0.0.0",
        5: "248.0.0.0",
        4: "240.0.0.0",
        3: "224.0.0.0",
        2: "192.0.0.0",
        1: "128.0.0.0",
        0: "0.0.0.0"
    };

    // Create reverse mapping
    const maskToCidrMap = {};
    for (const [cidr, mask] of Object.entries(cidrToMaskMap)) {
        maskToCidrMap[mask] = parseInt(cidr);
    }

    // Get DOM elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const inputArea = document.getElementById('inputArea');
    const outputArea = document.getElementById('outputArea');
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultsSummary = document.getElementById('resultsSummary');
    const sortOutput = document.getElementById('sortOutput');
    
    // Router-specific option panels
    const routerosTypeRadios = document.querySelectorAll('input[name="routeros-type"]');
    const routerosRouteOptions = document.getElementById('routerosRouteOptions');
    const jsonSource = document.getElementById('jsonSource');
    const customJsonOptions = document.getElementById('customJsonOptions');
    const jsonPathInput = document.getElementById('jsonPathInput');
    const ipv4Only = document.getElementById('ipv4Only');
    const filterRegion = document.getElementById('filterRegion');

    // Language selector elements
    const langEnBtn = document.getElementById('langEn');
    const langZhBtn = document.getElementById('langZh');
    
    // Current active conversion mode
    let currentMode = 'router-config';
    // Current language
    let currentLang = 'en';
    
    // Storage for tab-specific content
    const tabContent = {
        'cidr-to-ip': { input: '', output: '', results: '' },
        'ip-to-cidr': { input: '', output: '', results: '' },
        'router-config': { input: '', output: '', results: '' },
        'bulk-extract': { input: '', output: '', results: '' }
    };

    // Function to update UI text based on selected language
    function updateLanguage(lang) {
        currentLang = lang;
        
        // Save language preference to localStorage
        localStorage.setItem('preferredLanguage', lang);
        
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update placeholders
        if (currentMode === 'bulk-extract') {
            inputArea.placeholder = translations[lang]['input-placeholder-bulk'];
        } else {
            inputArea.placeholder = translations[lang]['input-placeholder-default'];
        }
        
        // Update output placeholder based on current mode and router type
        updateOutputPlaceholder();
        
        // Update language buttons
        langEnBtn.classList.toggle('active', lang === 'en');
        langZhBtn.classList.toggle('active', lang === 'zh');
    }
    
    // Function to update output placeholder based on current mode and router type
    function updateOutputPlaceholder() {
        if (!outputArea) return;
        
        if (currentMode === 'router-config') {
            const routerType = document.getElementById('routerType').value;
            
            if (routerType === 'routeros') {
                // Check which RouterOS type is selected
                const routerosType = document.querySelector('input[name="routeros-type"]:checked').value;
                
                if (routerosType === 'address-list') {
                    outputArea.placeholder = translations[currentLang]['output-placeholder-routeros-addresslist'];
                } else {
                    outputArea.placeholder = translations[currentLang]['output-placeholder-routeros-route'];
                }
            } else if (routerType === 'cisco') {
                outputArea.placeholder = translations[currentLang]['output-placeholder-cisco'];
            } else if (routerType === 'huawei') {
                outputArea.placeholder = translations[currentLang]['output-placeholder-huawei'];
            } else if (routerType === 'juniper') {
                outputArea.placeholder = translations[currentLang]['output-placeholder-juniper'];
            } else if (routerType === 'fortinet') {
                outputArea.placeholder = translations[currentLang]['output-placeholder-fortinet'];
            } else {
                outputArea.placeholder = translations[currentLang]['output-placeholder-default'];
            }
        } else if (currentMode === 'cidr-to-ip') {
            outputArea.placeholder = translations[currentLang]['output-placeholder-cidr-ip'];
        } else if (currentMode === 'ip-to-cidr') {
            outputArea.placeholder = translations[currentLang]['output-placeholder-ip-cidr'];
        } else if (currentMode === 'bulk-extract') {
            outputArea.placeholder = translations[currentLang]['output-placeholder-bulk'];
        } else {
            outputArea.placeholder = translations[currentLang]['output-placeholder-default'];
        }
    }
    
    // Language button click handlers
    langEnBtn.addEventListener('click', () => {
        updateLanguage('en');
    });
    
    langZhBtn.addEventListener('click', () => {
        updateLanguage('zh');
    });

    // Tab button click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Save current content before switching tabs
            tabContent[currentMode].input = inputArea.value;
            tabContent[currentMode].output = outputArea.value;
            tabContent[currentMode].results = resultsSummary.textContent;
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Set current mode
            const newMode = button.getAttribute('data-tab');
            currentMode = newMode;
            
            // Show/hide appropriate option panels
            const optionsBulkExtract = document.getElementById('optionsBulkExtract');
            const optionsRouter = document.getElementById('optionsRouter');
            const optionsCidrToIp = document.getElementById('optionsCidrToIp');
            const optionsIpToCidr = document.getElementById('optionsIpToCidr');
            
            // Show/hide tab descriptions
            document.querySelectorAll('.tab-description').forEach(desc => {
                desc.style.display = 'none';
            });
            const currentTabDescription = document.getElementById(`${currentMode}-description`);
            if (currentTabDescription) {
                currentTabDescription.style.display = 'block';
            }
            
            if (optionsBulkExtract) {
                optionsBulkExtract.style.display = (currentMode === 'bulk-extract') ? 'block' : 'none';
            }
            
            if (optionsRouter) {
                optionsRouter.style.display = (currentMode === 'router-config') ? 'block' : 'none';
            }
            
            if (optionsCidrToIp) {
                optionsCidrToIp.style.display = (currentMode === 'cidr-to-ip') ? 'block' : 'none';
            }
            
            if (optionsIpToCidr) {
                optionsIpToCidr.style.display = (currentMode === 'ip-to-cidr') ? 'block' : 'none';
            }
            
            // Hide/show options title based on the current mode
            const optionsTitle = document.querySelector('.options-title');
            if (optionsTitle) {
                optionsTitle.style.display = (currentMode === 'router-config' || currentMode === 'cidr-to-ip' || currentMode === 'ip-to-cidr' || currentMode === 'bulk-extract') ? 'none' : 'block';
            }
            
            // Hide/show entire options panel for CIDR to IP and IP to CIDR
            const optionsPanel = document.querySelector('.options-panel');
            if (optionsPanel) {
                if (currentMode === 'cidr-to-ip' || currentMode === 'ip-to-cidr') {
                    optionsPanel.style.display = 'none';
                } else {
                    optionsPanel.style.display = 'block';
                }
            }
            
            // Update input placeholder based on mode
            if (currentMode === 'bulk-extract') {
                inputArea.placeholder = translations[currentLang]['input-placeholder-bulk'];
            } else {
                inputArea.placeholder = translations[currentLang]['input-placeholder-default'];
            }
            
            // Update output placeholder based on mode
            updateOutputPlaceholder();
            
            // Restore content for the selected tab
            inputArea.value = tabContent[currentMode].input;
            outputArea.value = tabContent[currentMode].output;
            resultsSummary.textContent = tabContent[currentMode].results;
            
            console.log('Tab changed to:', currentMode);
        });
    });

    // RouterOS type change handler
    routerosTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            routerosRouteOptions.style.display = 
                (radio.value === 'route') ? 'block' : 'none';
        });
    });

    // JSON source change handler
    if (jsonSource) {
        jsonSource.addEventListener('change', () => {
            const selectedSource = jsonSource.value;
            
            // Hide/show custom JSON path input based on selection
            if (customJsonOptions) {
                customJsonOptions.style.display = (selectedSource === 'custom') ? 'block' : 'none';
            }
            
            // Set predefined JSON paths for known sources
            if (jsonPathInput) {
                if (selectedSource === 'aws') {
                    jsonPathInput.value = 'prefixes[*].ip_prefix';
                } else if (selectedSource === 'azure') {
                    jsonPathInput.value = 'values[*].properties.addressPrefixes[*]';
                } else if (selectedSource === 'o365') {
                    jsonPathInput.value = '[*].ips[*]';
                } else if (selectedSource === 'gcp') {
                    jsonPathInput.value = 'prefixes[*].ipv4Prefix';
                }
            }
        });
    }

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Set initial theme from localStorage or system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // Clear button functionality
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            inputArea.value = '';
            outputArea.value = '';
            resultsSummary.textContent = '';
        });
    }

    // Paste from clipboard functionality
    const pasteFromClipboardBtn = document.getElementById('pasteFromClipboardBtn');
    if (pasteFromClipboardBtn) {
        pasteFromClipboardBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                inputArea.value = text;
            } catch (err) {
                alert(currentLang === 'en' ? 
                    'Failed to read from clipboard. Please paste manually.' : 
                    '从剪贴板读取失败。请手动粘贴。');
            }
        });
    }

    // Recent operations functionality
    const recentOperations = document.getElementById('recentOperations');
    const MAX_RECENT_OPERATIONS = 20;

    function addToRecentOperations(input) {
        if (!recentOperations) return;

        // Create operation object with complete state
        const operation = {
            mode: currentMode,
            input: input,
            output: outputArea.value,
            timestamp: new Date().toISOString(),
            options: {}
        };

        // Save mode-specific options
        if (currentMode === 'router-config') {
            operation.options = {
                routerType: document.getElementById('routerType').value,
                sortOutput: sortOutput.checked
            };
            
            // Save router-specific options
            switch (operation.options.routerType) {
                case 'routeros':
                    operation.options.routerosType = document.querySelector('input[name="routeros-type"]:checked').value;
                    if (operation.options.routerosType === 'route') {
                        operation.options.routerosGateway = document.getElementById('routerosGateway').value;
                    }
                    operation.options.listName = document.getElementById('listName').value;
                    break;
                case 'cisco':
                    operation.options.nextHopIp = document.getElementById('nextHopIp').value;
                    operation.options.routeName = document.getElementById('routeName').value;
                    break;
                case 'huawei':
                    operation.options.huaweiNextHop = document.getElementById('huaweiNextHop').value;
                    break;
                case 'juniper':
                    operation.options.juniperNextHop = document.getElementById('juniperNextHop').value;
                    break;
                case 'fortinet':
                    operation.options.fortinetType = document.querySelector('input[name="fortinet-type"]:checked').value;
                    operation.options.addrGroupName = document.getElementById('addrGroupName').value;
                    break;
            }
        } else if (currentMode === 'bulk-extract') {
            operation.options = {
                ipv4Only: document.getElementById('ipv4Only').checked,
                removeDuplicates: document.getElementById('removeDuplicates').checked
            };
        }

        const operationItem = document.createElement('li');
        const timestamp = new Date(operation.timestamp).toLocaleString();
        operationItem.innerHTML = `
            <div class="operation-info">
                <span class="operation-mode">${translations[currentLang][`tab-${operation.mode}`]}</span>
                <span class="operation-time">${timestamp}</span>
            </div>
            <div class="operation-preview">${input.slice(0, 50)}${input.length > 50 ? '...' : ''}</div>
        `;
        
        operationItem.addEventListener('click', () => {
            restoreOperation(operation);
        });

        // Add to beginning of list
        recentOperations.insertBefore(operationItem, recentOperations.firstChild);

        // Remove oldest if exceeding max
        while (recentOperations.children.length > MAX_RECENT_OPERATIONS) {
            recentOperations.removeChild(recentOperations.lastChild);
        }

        // Save to localStorage
        const savedOperations = JSON.parse(localStorage.getItem('recentOperations') || '[]');
        savedOperations.unshift(operation);
        while (savedOperations.length > MAX_RECENT_OPERATIONS) {
            savedOperations.pop();
        }
        localStorage.setItem('recentOperations', JSON.stringify(savedOperations));
    }

    function restoreOperation(operation) {
        // Switch to the correct tab if needed
        if (currentMode !== operation.mode) {
            const tabButton = document.querySelector(`[data-tab="${operation.mode}"]`);
            if (tabButton) {
                tabButton.click();
            }
        }

        // Restore input and output
        inputArea.value = operation.input;
        outputArea.value = operation.output;

        // Restore mode-specific options
        if (operation.mode === 'router-config' && operation.options) {
            // Set router type
            const routerType = document.getElementById('routerType');
            if (routerType) {
                routerType.value = operation.options.routerType;
                routerType.dispatchEvent(new Event('change'));
            }

            // Restore sort option
            if (sortOutput) {
                sortOutput.checked = operation.options.sortOutput;
            }

            // Restore router-specific options
            switch (operation.options.routerType) {
                case 'routeros':
                    const routerosTypeRadio = document.querySelector(`input[name="routeros-type"][value="${operation.options.routerosType}"]`);
                    if (routerosTypeRadio) {
                        routerosTypeRadio.checked = true;
                        routerosTypeRadio.dispatchEvent(new Event('change'));
                    }
                    if (operation.options.routerosType === 'route' && operation.options.routerosGateway) {
                        document.getElementById('routerosGateway').value = operation.options.routerosGateway;
                    }
                    if (operation.options.listName) {
                        document.getElementById('listName').value = operation.options.listName;
                    }
                    break;
                case 'cisco':
                    if (operation.options.nextHopIp) {
                        document.getElementById('nextHopIp').value = operation.options.nextHopIp;
                    }
                    if (operation.options.routeName) {
                        document.getElementById('routeName').value = operation.options.routeName;
                    }
                    break;
                case 'huawei':
                    if (operation.options.huaweiNextHop) {
                        document.getElementById('huaweiNextHop').value = operation.options.huaweiNextHop;
                    }
                    break;
                case 'juniper':
                    if (operation.options.juniperNextHop) {
                        document.getElementById('juniperNextHop').value = operation.options.juniperNextHop;
                    }
                    break;
                case 'fortinet':
                    const fortinetTypeRadio = document.querySelector(`input[name="fortinet-type"][value="${operation.options.fortinetType}"]`);
                    if (fortinetTypeRadio) {
                        fortinetTypeRadio.checked = true;
                        fortinetTypeRadio.dispatchEvent(new Event('change'));
                    }
                    if (operation.options.addrGroupName) {
                        document.getElementById('addrGroupName').value = operation.options.addrGroupName;
                    }
                    break;
            }
        } else if (operation.mode === 'bulk-extract' && operation.options) {
            if (document.getElementById('ipv4Only')) {
                document.getElementById('ipv4Only').checked = operation.options.ipv4Only;
            }
            if (document.getElementById('removeDuplicates')) {
                document.getElementById('removeDuplicates').checked = operation.options.removeDuplicates;
            }
        }
    }

    // Load recent operations from localStorage
    function loadRecentOperations() {
        try {
            const savedOperations = JSON.parse(localStorage.getItem('recentOperations') || '[]');
            savedOperations.forEach(operation => {
                const operationItem = document.createElement('li');
                const timestamp = new Date(operation.timestamp).toLocaleString();
                operationItem.innerHTML = `
                    <div class="operation-info">
                        <span class="operation-time">${timestamp}</span>
                    </div>
                    <div class="operation-preview">${operation.input.slice(0, 50)}${operation.input.length > 50 ? '...' : ''}</div>
                `;
                
                operationItem.addEventListener('click', () => {
                    restoreOperation(operation);
                });
                recentOperations.appendChild(operationItem);
            });
        } catch (e) {
            console.error('Failed to load recent operations:', e);
        }
    }

    // Clear history button functionality
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            // Confirm before clearing
            if (confirm(currentLang === 'en' ? 
                'Are you sure you want to clear all operation history?' : 
                '确定要清除所有操作历史吗？')) {
                
                // Clear localStorage
                localStorage.removeItem('recentOperations');
                
                // Clear UI
                if (recentOperations) {
                    recentOperations.innerHTML = '';
                }
                
                // Show confirmation
                alert(currentLang === 'en' ? 
                    'Operation history cleared successfully.' : 
                    '操作历史已成功清除。');
            }
        });
    }

    // Loading indicator management
    const loadingIndicator = document.querySelector('.loading-indicator');
    
    function showLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }
    
    function hideLoading() {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    // Modify the convert button click handler to use loading indicator
    convertBtn.addEventListener('click', async () => {
        const input = inputArea.value.trim();
        if (!input) {
            alert(currentLang === 'en' ? 'Please enter IP addresses.' : '请输入IP地址。');
            return;
        }

        showLoading();
        try {
        let results = [];
        let validLines = 0;
        let invalidLines = 0;

        console.log('Current mode:', currentMode);
        
            // Special handling for Fortinet with FQDN in router-config mode
            if (currentMode === 'router-config' && document.getElementById('routerType').value === 'fortinet') {
                // 首先尝试自动提取IP地址和域名
                let extractedItems = [];
                
                // 提取所有IP地址
                const ipAddresses = findAllIpAddresses(input, false);
                const validIPs = validateIpAddresses(ipAddresses);
                
                // 提取所有域名 - 使用更严格的域名正则表达式
                // 域名必须至少有两部分，顶级域名至少2个字符，且不能全是数字
                const fqdnPattern = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?\b/g;
                const domains = input.match(fqdnPattern) || [];
                
                // 过滤掉IP地址格式的字符串和无效域名
                const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
                const validDomains = domains.filter(domain => {
                    // 排除IP地址格式
                    if (ipPattern.test(domain)) return false;
                    
                    // 排除纯数字和单位的组合（如 1.018, 0.517, 104.66ms）
                    const parts = domain.split('.');
                    // 检查最后一部分是否为有效的顶级域名（不能是数字或包含单位）
                    const tld = parts[parts.length - 1];
                    if (/^\d+$/.test(tld) || /\d+[a-z]+$/.test(tld)) return false;
                    
                    // 检查域名的每一部分
                    for (const part of parts) {
                        // 域名部分不能是纯数字
                        if (/^\d+$/.test(part)) return false;
                    }
                    
                    return true;
                });
                
                // 合并IP地址和域名
                extractedItems = [...validIPs, ...validDomains];
                
                // 如果没有提取到任何内容，则按行处理
                if (extractedItems.length === 0) {
                    // 按行处理输入
                    const lines = input.split('\n').filter(line => line.trim() !== '');
                    
                    for (const line of lines) {
                        try {
                            const trimmedLine = line.trim();
                            // 使用更严格的域名正则表达式
                            const fqdnPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
                            
                            // 检查是否为有效域名
                            let isFqdn = false;
                            if (fqdnPattern.test(trimmedLine) && !trimmedLine.match(/^(\d+\.\d+\.\d+\.\d+)$/)) {
                                // 进一步验证域名的各个部分
                                const parts = trimmedLine.split('.');
                                // 检查顶级域名
                                const tld = parts[parts.length - 1];
                                if (!/^\d+$/.test(tld) && !/\d+[a-z]+$/.test(tld)) {
                                    // 检查域名的每一部分
                                    let allPartsValid = true;
                                    for (const part of parts) {
                                        // 域名部分不能是纯数字
                                        if (/^\d+$/.test(part)) {
                                            allPartsValid = false;
                                            break;
                                        }
                                    }
                                    isFqdn = allPartsValid;
                                }
                            }
                            
                            if (isFqdn) {
                                // 是域名，直接处理
                                const result = convertCidrToFortinet(trimmedLine);
                                if (result) {
                                    results.push(result);
                                    validLines++;
                                } else {
                                    invalidLines++;
                                }
                            } else {
                                // 尝试作为IP/CIDR处理
                                const result = convertCidrToFortinet(trimmedLine);
                                if (result) {
                                    results.push(result);
                                    validLines++;
                                } else {
                                    invalidLines++;
                                }
                            }
                        } catch (e) {
                            console.error('Error processing line:', line, e);
                            invalidLines++;
                        }
                    }
                } else {
                    // 处理提取到的IP地址和域名
                    console.log('Extracted items:', extractedItems);
                    
                    // 去重
                    extractedItems = [...new Set(extractedItems)];
                    
                    for (const item of extractedItems) {
                        try {
                            const result = convertCidrToFortinet(item);
                            if (result) {
                                results.push(result);
                                validLines++;
                } else {
                                invalidLines++;
                }
            } catch (e) {
                            console.error('Error processing item:', item, e);
                            invalidLines++;
                        }
                    }
                }
                
                // 添加到最近操作
                addToRecentOperations(input);
                
                // 更新输出区域和结果摘要
                outputArea.value = results.join('\n\n');
                resultsSummary.textContent = `${validLines} items processed, ${invalidLines} invalid items skipped.`;
                hideLoading();
                return;
            }
            
            // For other modes, continue with the existing logic
            // Extract IP addresses from any text for all modes
            let ipAddresses = [];
            
            // First try to extract IP addresses from the input
            console.log('Extracting IP addresses from input...');
            ipAddresses = findAllIpAddresses(input, document.getElementById('ipv4Only')?.checked || false);
            console.log('Found IP addresses:', ipAddresses.length);
            
            // If bulk-extract mode and no IPs found yet, try to parse as JSON
            if (currentMode === 'bulk-extract' && ipAddresses.length === 0) {
                try {
                    // Try to parse as JSON
                    const jsonData = JSON.parse(input);
                    console.log('JSON parsing successful, extracting from structured data');
                    ipAddresses = findAllIpAddresses(jsonData, document.getElementById('ipv4Only')?.checked || false);
                } catch (jsonError) {
                    console.log('Not valid JSON, using text extraction only');
                }
            }
            
            // Validate the extracted IP addresses
            const validatedAddresses = validateIpAddresses(ipAddresses);
            console.log('Valid IP addresses:', validatedAddresses.length);
            
            // Remove duplicates if option is checked
            const removeDuplicates = document.getElementById('removeDuplicates')?.checked || true;
            const extractedIPs = removeDuplicates ? [...new Set(validatedAddresses)] : validatedAddresses;
            
            if (extractedIPs.length === 0) {
                alert(currentLang === 'en' ? 'No valid IP addresses found in the input.' : '在输入中未找到有效的IP地址。');
                hideLoading();
                    return;
                }
            
            // Process the extracted IPs based on the current mode
            for (const ip of extractedIPs) {
                try {
                    let result;
                    switch (currentMode) {
                        case 'bulk-extract':
                            // For bulk extract, just use the IP as is
                            result = ip;
                            break;
                        case 'cidr-to-ip':
                            // Convert CIDR to IP+Netmask
                            result = convertCidrToIpMask(ip);
                            break;
                        case 'ip-to-cidr':
                            // For IP to CIDR, we need to check if it's already in CIDR format
                            if (ip.includes('/')) {
                                result = ip; // Already in CIDR format
                            } else {
                                // Try to convert from IP+Netmask format
                                const parts = ip.split(' ');
                                if (parts.length === 2) {
                                    result = convertIpMaskToCidr(`${parts[0]} ${parts[1]}`);
                                }
                            }
                            break;
                        case 'router-config':
                            // For router config, convert CIDR to router commands
                            const routerType = document.getElementById('routerType').value;
                            
                            // Special handling for Fortinet with FQDN
                            if (routerType === 'fortinet') {
                                // Check if the line might be an FQDN
                                const fqdnPattern = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
                                if (fqdnPattern.test(ip) && !ip.match(/^(\d+\.\d+\.\d+\.\d+)$/)) {
                                    // It's an FQDN, process directly
                                    result = convertCidrToFortinet(ip);
                                } else {
                                    // It's an IP/CIDR, process normally
                                    result = convertCidrToFortinet(ip);
                                }
                            } else if (routerType === 'routeros') {
                                result = convertCidrToRouterOs(ip);
                            } else if (routerType === 'cisco') {
                                result = convertCidrToCisco(ip);
                            } else if (routerType === 'huawei') {
                                result = convertCidrToHuawei(ip);
                            } else if (routerType === 'juniper') {
                                result = convertCidrToJuniper(ip);
                            }
                            break;
                    }

                    if (result) {
                        results.push(result);
                        validLines++;
                    } else {
                        invalidLines++;
                    }
                } catch (e) {
                    console.error('Error processing IP:', ip, e);
                    invalidLines++;
            }
        }

            // Sort results if option is checked and it exists
            if (sortOutput && sortOutput.checked) {
            results.sort(compareIPs);
        }

            // Add to recent operations
            addToRecentOperations(input);

        // Update output area and results summary
        outputArea.value = results.join('\n');
        resultsSummary.textContent = `${validLines} lines processed, ${invalidLines} invalid lines skipped.`;
        } catch (error) {
            console.error('Conversion error:', error);
            alert(currentLang === 'en' ? 
                'An error occurred during conversion.' : 
                '转换过程中发生错误。');
        } finally {
            hideLoading();
        }
    });

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        outputArea.select();
        document.execCommand('copy');
        alert(currentLang === 'en' ? 'Copied to clipboard!' : '已复制到剪贴板！');
    });

    // Download button click handler
    downloadBtn.addEventListener('click', () => {
        const text = outputArea.value;
        if (!text) {
            alert(currentLang === 'en' ? 'No content to download.' : '没有内容可下载。');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Set filename based on conversion mode
        let filename = 'converted-ips.txt';
        if (currentMode === 'router-config') {
            const routerType = document.getElementById('routerType').value;
            if (routerType === 'routeros') {
                const routerosType = document.querySelector('input[name="routeros-type"]:checked').value;
                filename = `routeros-${routerosType}.txt`;
            } else if (routerType === 'cisco') {
                filename = 'cisco-routes.txt';
            } else if (routerType === 'huawei') {
                filename = 'huawei-routes.txt';
            } else if (routerType === 'juniper') {
                filename = 'juniper-routes.txt';
            } else if (routerType === 'fortinet') {
                filename = 'fortinet-config.txt';
            }
        } else if (currentMode === 'bulk-extract') {
            filename = 'extracted-cidr-prefixes.txt';
        }
        
        a.download = filename;
        a.click();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Conversion functions
    function convertCidrToIpMask(line) {
        // Match IP/CIDR pattern
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        const ip = match[1];
        const cidr = parseInt(match[2]);

        // Validate IP and CIDR
        if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

        const mask = cidrToMaskMap[cidr];
        return `${ip} ${mask}`;
    }

    function convertIpMaskToCidr(line) {
        // Match IP Mask pattern (supports multiple spaces)
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)$/);
        if (!match) return null;

        const ip = match[1];
        const mask = match[2];

        // Validate IP and mask
        if (!isValidIp(ip) || !isValidMask(mask)) return null;
        
        // 检查IP是否是常见的子网掩码值，如果是则拒绝转换
        if (ip in maskToCidrMap) return null;

        const cidr = maskToCidrMap[mask];
        if (cidr === undefined) return null;

        return `${ip}/${cidr}`;
    }

    function convertCidrToCisco(line) {
        // Match IP/CIDR pattern
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        const ip = match[1];
        const cidr = parseInt(match[2]);

        // Validate IP and CIDR
        if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

        const mask = cidrToMaskMap[cidr];
        const nextHop = document.getElementById('nextHopIp').value.trim() || 'Null0';
        const routeName = document.getElementById('routeName').value.trim() || 'CN';

        return `ip route ${ip} ${mask} ${nextHop} name ${routeName}`;
    }

    function convertCidrToRouterOs(line) {
        // Match IP/CIDR pattern
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        const ip = match[1];
        const cidr = parseInt(match[2]);

        // Validate IP and CIDR
        if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

        // Get the list name from the input field
        const listName = document.getElementById('listName').value || 'CN';
        
        // Get the gateway from the input field
        const gateway = document.getElementById('routerosGateway').value || '192.168.1.1';
        
        // Check which type is selected
        const routerosType = document.querySelector('input[name="routeros-type"]:checked').value;

        if (routerosType === 'address-list') {
            // Generate address-list command
            return `/ip firewall address-list add address=${ip}/${cidr} list=${listName}`;
        } else if (routerosType === 'route') {
            // Generate route command
            return `/ip route add dst-address=${ip}/${cidr} gateway=${gateway}`;
        }
        
        // Default to address-list if something goes wrong
        return `/ip firewall address-list add address=${ip}/${cidr} list=${listName}`;
    }

    function convertCidrToHuawei(line) {
        // Match IP/CIDR pattern
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        const ip = match[1];
        const cidr = parseInt(match[2]);

        // Validate IP and CIDR
        if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

        const nextHop = document.getElementById('huaweiNextHop').value.trim() || 'Null0';
        if (!isValidIp(nextHop) && nextHop !== 'Null0') return null;

        const mask = cidrToMaskMap[cidr];
        return `ip route-static ${ip} ${mask} ${nextHop}`;
    }

    function convertCidrToJuniper(line) {
        // Match IP/CIDR pattern
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        const ip = match[1];
        const cidr = parseInt(match[2]);

        // Validate IP and CIDR
        if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

        const nextHop = document.getElementById('juniperNextHop').value.trim() || 'reject';
        if (!isValidIp(nextHop) && nextHop !== 'reject') return null;

        // 为Juniper路由器使用不同的命令格式，取决于是否使用IP地址或reject作为下一跳
        if (nextHop === 'reject') {
            return `set routing-options static route ${ip}/${cidr} reject`;
        } else {
        return `set routing-options static route ${ip}/${cidr} next-hop ${nextHop}`;
        }
    }

    function convertCidrToFortinet(line) {
        // 检查输入是否为域名 (FQDN)
        // 使用更严格的域名正则表达式
        const fqdnPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
        
        // 检查是否为有效域名
        let isFqdn = false;
        if (fqdnPattern.test(line) && !line.match(/^(\d+\.\d+\.\d+\.\d+)$/)) {
            // 进一步验证域名的各个部分
            const parts = line.split('.');
            // 检查顶级域名
            const tld = parts[parts.length - 1];
            if (!/^\d+$/.test(tld) && !/\d+[a-z]+$/.test(tld)) {
                // 检查域名的每一部分
                let allPartsValid = true;
                for (const part of parts) {
                    // 域名部分不能是纯数字
                    if (/^\d+$/.test(part)) {
                        allPartsValid = false;
                        break;
                    }
                }
                isFqdn = allPartsValid;
            }
        }
        
        let addrName, addrConfig;
        
        if (isFqdn) {
            // Handle FQDN
            addrName = line.replace(/\./g, '_');
            addrConfig = `config firewall address
    edit "${line}"
        set type fqdn
        set fqdn "${line}"
    next
end`;
        } else {
            // Handle IP/CIDR
            const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
            if (!match) return null;

            const ip = match[1];
            const cidr = parseInt(match[2]);

            // Validate IP and CIDR
            if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

            // Get the address name by replacing dots with underscores
            addrName = `${ip.replace(/\./g, '_')}_${cidr}`;
            
            addrConfig = `config firewall address
    edit "${addrName}"
        set subnet ${ip} ${cidrToMaskMap[cidr]}
    next
end`;
        }
        
        // Get the fortinet type (address or addrgrp)
        const fortinetType = document.querySelector('input[name="fortinet-type"]:checked').value;
        const addrGroupName = document.getElementById('addrGroupName').value.trim() || 'IP_Group';
        
        // Create the configuration based on the type
        if (fortinetType === 'address') {
            return addrConfig;
        } else {
            return `${addrConfig}
config firewall addrgrp
    edit ${addrGroupName}
        append member "${isFqdn ? line : addrName}"
    next
end`;
        }
    }

    // Helper functions
    function isValidIp(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;

        for (const part of parts) {
            const num = parseInt(part);
            if (isNaN(num) || num < 0 || num > 255) return false;
        }

        return true;
    }

    // Validate mask
    function isValidMask(mask) {
        // Check if it's a predefined mask
        if (mask in maskToCidrMap) {
            return true;
        }
        
        // If not a predefined mask, check if it's a valid IP format
        if (!isValidIp(mask)) {
            return false;
        }
        
        // Check if it's a valid subnet mask (continuous 1s followed by continuous 0s)
        const parts = mask.split('.').map(part => parseInt(part, 10));
        let binary = '';
        
        for (const part of parts) {
            binary += part.toString(2).padStart(8, '0');
        }
        
        return /^1*0*$/.test(binary);
    }

    function compareIPs(a, b) {
        // Extract IPs from lines
        const ipA = extractIp(a);
        const ipB = extractIp(b);
        
        if (!ipA || !ipB) return 0;

        const partsA = ipA.split('.').map(Number);
        const partsB = ipB.split('.').map(Number);
        
        for (let i = 0; i < 4; i++) {
            if (partsA[i] < partsB[i]) return -1;
            if (partsA[i] > partsB[i]) return 1;
        }
        
        return 0;
    }

    function extractIp(line) {
        // Extract IP from various formats
        const ipMatch = line.match(/(\d+\.\d+\.\d+\.\d+)/);
        return ipMatch ? ipMatch[1] : null;
    }

    // Function to extract IP prefixes from JSON content
    function extractIpPrefixesFromJson(jsonData) {
        console.log('extractIpPrefixesFromJson called');
        
        // Check if input is potentially too large
        if (jsonData.length > 1000000) { // 1MB threshold
            console.log('Large text detected:', jsonData.length, 'bytes');
            if (!confirm(currentLang === 'en' ? 
                'The input text is very large (over 1MB). Processing may take time and could cause browser slowdown. Continue?' : 
                '输入文本非常大（超过1MB）。处理可能需要时间并可能导致浏览器变慢。是否继续？')) {
                return [];
            }
        }
        
        // Parse JSON data if possible
        let data;
        try {
            data = JSON.parse(jsonData);
            console.log('JSON parsed successfully');
        } catch (e) {
            console.log('Not valid JSON, treating as plain text');
            data = jsonData; // Treat as plain text
        }
        
        // Get configuration options
        const ipv4Only = document.getElementById('ipv4Only') ? document.getElementById('ipv4Only').checked : false;
        const removeDuplicates = document.getElementById('removeDuplicates') ? document.getElementById('removeDuplicates').checked : true;
        
        console.log('Options - ipv4Only:', ipv4Only, 'removeDuplicates:', removeDuplicates);
        
        try {
            // Recursively scan the text for IP addresses/CIDR blocks
            console.time('Finding IP addresses');
            const ipAddresses = findAllIpAddresses(data, ipv4Only);
            console.timeEnd('Finding IP addresses');
            console.log('Found IP addresses:', ipAddresses.length, 'sample:', ipAddresses.slice(0, 5));
            
            if (ipAddresses.length === 0) {
                // Try a direct search in the text itself as a fallback
                console.log('No IPs found in structured parsing, trying direct string search');
                const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
                const directIps = findAllIpAddresses(stringifiedData, ipv4Only);
                console.log('Direct string search found:', directIps.length, 'IPs');
                if (directIps.length > 0) {
                    return removeDuplicates ? [...new Set(directIps)] : directIps;
                }
            }
            
            // Validate the found IP addresses
            console.time('Validating IP addresses');
            const validatedAddresses = validateIpAddresses(ipAddresses);
            console.timeEnd('Validating IP addresses');
            console.log('Valid IP addresses:', validatedAddresses.length);
            
            // Remove duplicates if option is selected
            const results = removeDuplicates ? [...new Set(validatedAddresses)] : validatedAddresses;
            console.log('Final results count:', results.length);
            
            return results;
        } catch (e) {
            console.error('Error in IP extraction process:', e);
            // Even if there's an error, try to return any IPs we found
            const directSearch = findAllIpAddresses(jsonData, ipv4Only);
            if (directSearch.length > 0) {
                console.log('Found IPs through direct search after error:', directSearch.length);
                return directSearch;
            }
            return [];
        }
    }

    // Recursively find all IP addresses/CIDR blocks in any text
    function findAllIpAddresses(data, ipv4Only = false) {
        // 首先检查是否是Cisco路由命令
        if (typeof data === 'string' && data.trim().startsWith('ip route')) {
            const result = extractIpFromCiscoRoute(data);
            if (result) {
                return [result.cidr];
            }
        }
        
        // Regular expressions for IP addresses in CIDR notation
        const ipv4RegexCidr = /\b(?:\d{1,3}\.){3}\d{1,3}\/\d{1,2}\b/g;
        
        // For standalone IP addresses (without CIDR notation)
        const ipv4RegexSimple = /\b(?:\d{1,3}\.){3}\d{1,3}\b(?!\/)/g;
        
        // Simplified IPv6 regex patterns to improve performance
        const ipv6RegexCidr = /\b(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}\/\d{1,3}\b/g;
        const ipv6RegexSimple = /\b(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}\b(?!\/)/g;
        
        const ipAddresses = [];
        
        // Prevent stack overflow with large nested objects
        try {
            // If data is a string, search for IP addresses directly
            if (typeof data === 'string') {
                // Extract IPv4 addresses
                const ipv4WithCidr = data.match(ipv4RegexCidr) || [];
                const ipv4WithoutCidr = data.match(ipv4RegexSimple) || [];
                
                // Add IPv4 addresses to the results
                ipAddresses.push(...ipv4WithCidr);
                
                // Add /32 to standalone IPv4 addresses, but skip common subnet mask values
                ipv4WithoutCidr.forEach(ip => {
                    // 检查是否是常见的子网掩码值
                    if (!(ip in maskToCidrMap) && !ipAddresses.includes(ip + '/32')) {
                        ipAddresses.push(ip + '/32');
                    }
                });
                
                // Extract IPv6 addresses if not IPv4 only
                if (!ipv4Only) {
                    const ipv6WithCidr = data.match(ipv6RegexCidr) || [];
                    const ipv6WithoutCidr = data.match(ipv6RegexSimple) || [];
                    
                    // Add IPv6 addresses to the results
                    ipAddresses.push(...ipv6WithCidr);
                    
                    // Add /128 to standalone IPv6 addresses
                    ipv6WithoutCidr.forEach(ip => {
                        if (!ipAddresses.includes(ip + '/128')) {
                            ipAddresses.push(ip + '/128');
                        }
                    });
                }
                
                return ipAddresses;
            }
            
            // Process arrays recursively
            if (Array.isArray(data)) {
                for (const item of data) {
                    const foundIps = findAllIpAddresses(item, ipv4Only);
                    ipAddresses.push(...foundIps);
                }
                return ipAddresses;
            }
            
            // Process objects recursively
            if (data && typeof data === 'object') {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        // Process the keys (they could contain IPs)
                        const keysIps = findAllIpAddresses(key, ipv4Only);
                        ipAddresses.push(...keysIps);
                        
                        // Process the values
                        const valuesIps = findAllIpAddresses(data[key], ipv4Only);
                        ipAddresses.push(...valuesIps);
                    }
                }
                return ipAddresses;
            }
        } catch (e) {
            console.error('Error in findAllIpAddresses:', e);
        }
        
        return ipAddresses;
    }

    // 从Cisco路由命令中提取IP和掩码
    function extractIpFromCiscoRoute(route) {
        // 使用更精确的正则表达式匹配Cisco路由命令格式
        // 格式: ip route <ip> <mask> <next-hop> [options]
        const routeMatch = route.match(/ip route\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)\s+([^\s]+)/);
        
        if (routeMatch && routeMatch.length >= 4) {
            const ip = routeMatch[1];
            const mask = routeMatch[2];
            const nextHop = routeMatch[3];
            
            // 验证IP和掩码
            if (isValidIp(ip) && isValidMask(mask)) {
                // 转换为CIDR格式
                const cidr = convertIpMaskToCidr(ip, mask);
                
                // 如果转换失败（可能是因为IP是子网掩码值），则返回null
                if (!cidr) return null;
                
                return {
                    ip: ip,
                    mask: mask,
                    cidr: cidr,
                    nextHop: nextHop
                };
            }
        }
        
        return null;
    }

    // 将IP和掩码转换为CIDR格式
    function convertIpMaskToCidr(ip, mask) {
        const cidr = maskToCidrMap[mask];
        if (cidr !== undefined) {
            return `${ip}/${cidr}`;
        }
        return `${ip}/32`; // 默认返回/32
    }

    // 验证掩码是否有效
    function isValidMask(mask) {
        return mask in maskToCidrMap;
    }

    // Make sure IP addresses are valid
    function validateIpAddresses(ipAddresses) {
        return ipAddresses.filter(ip => {
            try {
                // Extract IP and CIDR parts
                const parts = ip.split('/');
                if (parts.length !== 2) return false;
                
                const [ipPart, cidrPart] = parts;
                const cidr = parseInt(cidrPart);
                
                // 检查是否是常见的子网掩码值
                if (ipPart in maskToCidrMap) return false;
                
                // Basic validation for IPv4
                if (ip.includes('.')) {
                    // Check CIDR range
                    if (cidr < 0 || cidr > 32) return false;
                    
                    // Validate IP format
                    const octets = ipPart.split('.');
                    if (octets.length !== 4) return false;
                    
                    // Check each octet is valid (0-255)
                    for (const octet of octets) {
                        const num = parseInt(octet);
                        if (isNaN(num) || num < 0 || num > 255) return false;
                    }
                    
                    return true;
                } 
                // Basic validation for IPv6
                else if (ip.includes(':')) {
                    // Check CIDR range
                    if (cidr < 0 || cidr > 128) return false;
                    
                    // Very basic IPv6 format check (full validation is complex)
                    const segments = ipPart.split(':');
                    if (segments.length < 2 || segments.length > 8) return false;
                    
                    return true;
                }
                
                return false;
            } catch (e) {
                console.error('IP validation error for', ip, ':', e);
                return false;
            }
        });
    }

    // Router type change handler
    const routerType = document.getElementById('routerType');
    if (routerType) {
        routerType.addEventListener('change', () => {
            const selectedType = routerType.value;
            
            // Hide all router-specific options first
            document.querySelectorAll('.router-specific-options').forEach(el => {
                el.style.display = 'none';
            });
            
            // Show the selected router options
            const selectedOptions = document.getElementById(`${selectedType}Options`);
            if (selectedOptions) {
                selectedOptions.style.display = 'block';
            }
            
            // Update example display based on router type
            const basicExample = document.getElementById('router-example-basic');
            const fortinetExample = document.getElementById('router-example-fortinet');
            
            if (basicExample && fortinetExample) {
                if (selectedType === 'fortinet') {
                    basicExample.style.display = 'none';
                    fortinetExample.style.display = 'block';
                } else {
                    basicExample.style.display = 'block';
                    fortinetExample.style.display = 'none';
                }
            }
            
            // Update output placeholder based on selected router type
            if (currentMode === 'router-config') {
                updateOutputPlaceholder();
            }
            
            // Hide options title in router-config mode
            if (currentMode === 'router-config') {
                const optionsTitle = document.querySelector('.options-title');
                if (optionsTitle) {
                    optionsTitle.style.display = 'none';
                }
            }
        });
    }

    // Initialize language on page load
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    updateLanguage(savedLanguage);
    
    // Show the initial tab description
    document.querySelectorAll('.tab-description').forEach(desc => {
        desc.style.display = 'none';
    });
    const initialTabDescription = document.getElementById(`${currentMode}-description`);
    if (initialTabDescription) {
        initialTabDescription.style.display = 'block';
    }
    
    // Initialize output placeholder
    updateOutputPlaceholder();

    // Initialize theme
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
    }
    
    // Initialize the UI
    loadRecentOperations();
    
    // Hide options title in router-config, cidr-to-ip, and ip-to-cidr modes
    if (currentMode === 'router-config' || currentMode === 'cidr-to-ip' || currentMode === 'ip-to-cidr' || currentMode === 'bulk-extract') {
        const optionsTitle = document.querySelector('.options-title');
        if (optionsTitle) {
            optionsTitle.style.display = 'none';
        }
        
        // For CIDR to IP and IP to CIDR, hide the entire options panel
        if (currentMode === 'cidr-to-ip' || currentMode === 'ip-to-cidr') {
            const optionsPanel = document.querySelector('.options-panel');
            if (optionsPanel) {
                optionsPanel.style.display = 'none';
            }
        }
    }
    
    // Add event listener for Fortinet radio buttons
    const fortinetTypeRadios = document.querySelectorAll('input[name="fortinet-type"]');
    if (fortinetTypeRadios.length > 0) {
        fortinetTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const addrGroupNameContainer = document.getElementById('addrGroupNameContainer');
                if (addrGroupNameContainer) {
                    addrGroupNameContainer.style.display = this.value === 'addrgrp' ? 'block' : 'none';
                }
            });
        });
        
        // Initialize the display based on the default selection
        const selectedFortinetType = document.querySelector('input[name="fortinet-type"]:checked');
        if (selectedFortinetType) {
            const addrGroupNameContainer = document.getElementById('addrGroupNameContainer');
            if (addrGroupNameContainer) {
                addrGroupNameContainer.style.display = selectedFortinetType.value === 'addrgrp' ? 'block' : 'none';
            }
        }
    }
    
    // Add event listener for RouterOS radio buttons
    // Use the existing routerosTypeRadios variable declared earlier
    if (routerosTypeRadios && routerosTypeRadios.length > 0) {
        routerosTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const routerosAddressListOptions = document.getElementById('routerosAddressListOptions');
                
                if (routerosRouteOptions && routerosAddressListOptions) {
                    if (this.value === 'route') {
                        routerosRouteOptions.style.display = 'block';
                        routerosAddressListOptions.style.display = 'none';
                    } else if (this.value === 'address-list') {
                        routerosRouteOptions.style.display = 'none';
                        routerosAddressListOptions.style.display = 'block';
                    }
                }
            });
        });
        
        // Initialize the display based on the default selection
        const selectedRouterosType = document.querySelector('input[name="routeros-type"]:checked');
        if (selectedRouterosType) {
            const routerosAddressListOptions = document.getElementById('routerosAddressListOptions');
            
            if (routerosRouteOptions && routerosAddressListOptions) {
                if (selectedRouterosType.value === 'route') {
                    routerosRouteOptions.style.display = 'block';
                    routerosAddressListOptions.style.display = 'none';
                } else if (selectedRouterosType.value === 'address-list') {
                    routerosRouteOptions.style.display = 'none';
                    routerosAddressListOptions.style.display = 'block';
                }
            }
        }
    }
    
    // Initialize example display based on initial router type
    const initialRouterType = document.getElementById('routerType');
    if (initialRouterType) {
        const selectedType = initialRouterType.value;
        const basicExample = document.getElementById('router-example-basic');
        const fortinetExample = document.getElementById('router-example-fortinet');
        
        if (basicExample && fortinetExample) {
            if (selectedType === 'fortinet') {
                basicExample.style.display = 'none';
                fortinetExample.style.display = 'block';
            } else {
                basicExample.style.display = 'block';
                fortinetExample.style.display = 'none';
            }
        }
    }
    
    // Initialize horizontal resizer
    console.log('Initializing resizer...');
    setupResizer();
    console.log('Resizer initialization complete');
    
    // Test resizer functionality after a short delay
    setTimeout(function() {
        console.log('Testing resizer functionality...');
        const resizer = document.getElementById('horizontalResizer');
        if (resizer) {
            // Simulate a click on the resizer
            console.log('Simulating resizer interaction');
            
            // Log current dimensions
            const conversionPanel = document.querySelector('.conversion-panel');
            const inputSection = document.querySelector('.input-section');
            const outputSection = document.querySelector('.output-section');
            
            console.log('Current dimensions:', {
                conversionPanel: conversionPanel.getBoundingClientRect(),
                inputSection: inputSection.getBoundingClientRect(),
                outputSection: outputSection.getBoundingClientRect(),
                resizer: resizer.getBoundingClientRect()
            });
        }
    }, 1000);

    // 设置转换按钮点击事件
    document.getElementById('convert-cidr-button').addEventListener('click', function() {
        const cidrInput = document.getElementById('cidr-input').value.trim();
        const routerType = document.getElementById('router-type').value;
        const outputElement = document.getElementById('router-output');
        
        if (!cidrInput) {
            outputElement.value = '';
            return;
        }
        
        // 处理Fortinet路由器类型的特殊情况，支持混合输入IP/CIDR和FQDN
        if (routerType === 'fortinet') {
            const lines = cidrInput.split('\n');
            let result = '';
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // 检查是否为域名
                if (line.includes('.') && !line.match(/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/)) {
                    result += convertFqdnToFortinet(line) + '\n';
                } else {
                    result += convertCidrToFortinet(line) + '\n';
                }
            }
            
            outputElement.value = result.trim();
            return;
        }
        
        // 处理其他路由器类型
        let result = '';
        
        switch(routerType) {
            case 'routeros':
                result = convertCidrToRouteros(cidrInput);
                break;
            case 'cisco':
                result = convertCidrToCisco(cidrInput);
                break;
            case 'fortinet':
                result = convertCidrToFortinet(cidrInput);
                break;
            case 'huawei':
                result = convertCidrToHuawei(cidrInput);
                break;
            default:
                result = 'Unsupported router type';
        }
        
        outputElement.value = result;
    });
    
    // SEO Performance Monitoring & Analytics
    
    // Load Google Analytics
    function loadGoogleAnalytics() {
        // Replace UA-XXXXX-Y with your actual Google Analytics tracking ID
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
    
    // Performance monitoring
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
                        gtag('event', 'performance_issue', {
                            'event_category': 'performance',
                            'event_label': 'slow_page_load',
                            'value': Math.round(navEntry.loadEventEnd - navEntry.startTime)
                        });
                    }
                }, 0);
            });
        }
    }

    // Add structured data for breadcrumbs to improve search appearance
    function addStructuredData() {
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
    
    // Track user interactions for analytics
    function trackUserInteractions() {
        // Track tab changes
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                if (window.gtag) {
                    gtag('event', 'tab_change', {
                        'event_category': 'engagement',
                        'event_label': tabName
                    });
                }
            });
        });
        
        // Track conversions
        convertBtn.addEventListener('click', () => {
            if (window.gtag) {
                gtag('event', 'conversion', {
                    'event_category': 'engagement',
                    'event_label': currentMode
                });
            }
        });
    }
    
    // Initialize SEO and analytics functions
    function initSEO() {
        loadGoogleAnalytics();
        monitorPerformance();
        addStructuredData();
        trackUserInteractions();
        
        // Add page metadata based on current mode
        document.title = `IPToRoute - ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1).replace(/-/g, ' ')} | Network Tools`;
    }
    
    // Initialize SEO features but don't load analytics in development
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
        initSEO();
    } else {
        console.log('Development mode - analytics disabled');
        monitorPerformance(); // Still monitor performance in development
    }

    // Function to translate page elements
    function translatePage(lang) {
        // 定义常用页面元素的翻译
        const pageTranslations = {
            en: {
                'contact-title': 'Contact Us',
                'get-in-touch': 'Get in Touch',
                'contact-intro': 'Have questions, feedback, or need assistance with our tools? We\'d love to hear from you. Fill out the form below, and we\'ll get back to you as soon as possible.',
                'email-title': '📧 Email',
                'github-title': '💻 GitHub',
                'general-inquiries': 'For general inquiries:',
                'tech-support': 'For technical support:',
                'bug-reports': 'For bug reports or feature requests, visit our GitHub repository.',
                'contact-form-title': 'Contact Form',
                'name-label': 'Name',
                'email-label': 'Email',
                'subject-label': 'Subject',
                'message-label': 'Message',
                'send-message': 'Send Message',
                'sending-message': 'Sending message...',
                'thank-you-message': 'Thank you for your message. We will get back to you soon!',
                'faq-title': 'Frequently Asked Questions',
                'faq-free': 'Are the tools free to use?',
                'faq-free-answer': 'Yes, all IPToRoute tools are completely free for both personal and commercial use.',
                'faq-secure': 'Is my data secure?',
                'faq-secure-answer': 'IPToRoute is a client-side application. All processing happens in your browser, and your IP addresses and network configurations are not transmitted to our servers.',
                'faq-offline': 'Can I use IPToRoute offline?',
                'faq-offline-answer': 'Currently, IPToRoute requires an internet connection to load. However, once loaded, the core tools will function without further internet access.',
                'faq-bug': 'How do I report a bug?',
                'faq-bug-answer': 'You can report bugs through our GitHub Issues page or by using the contact form on this page.',
                
                // Privacy Policy Page
                'privacy-title': 'Privacy Policy',
                'last-updated': 'Last updated: March 18, 2024',
                'privacy-intro': 'Welcome to IPToRoute. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you visit our website and tell you about your privacy rights.',
                
                // Terms of Service Page
                'terms-title': 'Terms of Service',
                
                // Cookie Policy Page
                'cookie-title': 'Cookie Policy'
            },
            zh: {
                'contact-title': '联系我们',
                'get-in-touch': '联系方式',
                'contact-intro': '对我们的工具有疑问、反馈或需要帮助？我们很乐意听取您的意见。填写下面的表单，我们将尽快回复您。',
                'email-title': '📧 电子邮件',
                'github-title': '💻 GitHub',
                'general-inquiries': '一般查询：',
                'tech-support': '技术支持：',
                'bug-reports': '如需报告错误或请求新功能，请访问我们的GitHub仓库。',
                'contact-form-title': '联系表单',
                'name-label': '姓名',
                'email-label': '电子邮件',
                'subject-label': '主题',
                'message-label': '消息',
                'send-message': '发送消息',
                'sending-message': '发送中...',
                'thank-you-message': '感谢您的留言，我们将尽快回复！',
                'faq-title': '常见问题',
                'faq-free': '这些工具免费使用吗？',
                'faq-free-answer': '是的，所有IPToRoute工具都完全免费，可用于个人和商业用途。',
                'faq-secure': '我的数据安全吗？',
                'faq-secure-answer': 'IPToRoute是一个客户端应用程序。所有处理都在您的浏览器中进行，您的IP地址和网络配置不会传输到我们的服务器。',
                'faq-offline': '我可以离线使用IPToRoute吗？',
                'faq-offline-answer': '目前，IPToRoute需要互联网连接才能加载。但是，一旦加载完成，核心工具无需进一步的互联网访问即可运行。',
                'faq-bug': '如何报告错误？',
                'faq-bug-answer': '您可以通过我们的GitHub Issues页面或使用本页面的联系表单报告错误。',
                
                // Privacy Policy Page
                'privacy-title': '隐私政策',
                'last-updated': '最后更新：2024年3月18日',
                'privacy-intro': '欢迎访问IPToRoute。我们尊重您的隐私并致力于保护您的个人数据。本隐私政策将告知您我们如何处理您访问我们网站时的个人数据，并告诉您有关您的隐私权利。',
                
                // Terms of Service Page
                'terms-title': '服务条款',
                
                // Cookie Policy Page
                'cookie-title': 'Cookie政策'
            }
        };

        // 合并translations和pageTranslations
        if (typeof translations !== 'undefined') {
            // 将translations中的项合并到pageTranslations中
            for (const lang in translations) {
                if (!pageTranslations[lang]) {
                    pageTranslations[lang] = {};
                }
                for (const key in translations[lang]) {
                    pageTranslations[lang][key] = translations[lang][key];
                }
            }
        }

        // 遍历所有具有data-translate属性的元素
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (pageTranslations[lang] && pageTranslations[lang][key]) {
                element.textContent = pageTranslations[lang][key];
            }
        });

        // 翻译页面标题
        const pageType = document.querySelector('h1')?.textContent || '';
        if (pageType.includes('Privacy Policy') || pageType.includes('隐私政策')) {
            document.title = lang === 'zh' ? '隐私政策 | IPToRoute - IP地址与路由器配置工具' : 'Privacy Policy | IPToRoute - IP Address & Router Configuration Tool';
        } else if (pageType.includes('Terms of Service') || pageType.includes('服务条款')) {
            document.title = lang === 'zh' ? '服务条款 | IPToRoute - IP地址与路由器配置工具' : 'Terms of Service | IPToRoute - IP Address & Router Configuration Tool';
        } else if (pageType.includes('Cookie Policy') || pageType.includes('Cookie政策')) {
            document.title = lang === 'zh' ? 'Cookie政策 | IPToRoute - IP地址与路由器配置工具' : 'Cookie Policy | IPToRoute - IP Address & Router Configuration Tool';
        } else if (pageType.includes('Contact Us') || pageType.includes('联系我们')) {
            document.title = lang === 'zh' ? '联系我们 | IPToRoute - IP地址与路由器配置工具' : 'Contact Us | IPToRoute - IP Address & Router Configuration Tool';
        }

        // 特殊处理：对于有data-lang属性的元素
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (pageTranslations[lang] && pageTranslations[lang][key]) {
                if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                    element.placeholder = pageTranslations[lang][key];
                } else {
                    element.textContent = pageTranslations[lang][key];
                }
            }
        });
    }

    // Function to handle theme toggle across all pages
    function setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Apply saved theme on page load
        body.classList.toggle('dark-mode', currentTheme === 'dark');
        
        // Add event listener to toggle button
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                body.classList.toggle('dark-mode');
                const newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    // Function to handle language selection across all pages
    function setupLanguageSelection() {
        const langEn = document.getElementById('langEn');
        const langZh = document.getElementById('langZh');
        const savedLang = localStorage.getItem('language') || 'en';
        
        // Apply saved language on page load
        if (savedLang === 'zh') {
            document.documentElement.lang = 'zh';
            if (langEn) langEn.classList.remove('active');
            if (langZh) langZh.classList.add('active');
            translatePage('zh');
        } else {
            document.documentElement.lang = 'en';
            if (langEn) langEn.classList.add('active');
            if (langZh) langZh.classList.remove('active');
        }
        
        // Add event listeners to language buttons
        if (langEn) {
            langEn.addEventListener('click', () => {
                document.documentElement.lang = 'en';
                langEn.classList.add('active');
                langZh.classList.remove('active');
                localStorage.setItem('language', 'en');
                translatePage('en');
            });
        }
        
        if (langZh) {
            langZh.addEventListener('click', () => {
                document.documentElement.lang = 'zh';
                langZh.classList.add('active');
                langEn.classList.remove('active');
                localStorage.setItem('language', 'zh');
                translatePage('zh');
            });
        }
    }

    // Initialize common functionality across all pages
    document.addEventListener('DOMContentLoaded', () => {
        setupThemeToggle();
        setupLanguageSelection();
        
        // Call original init function if on main app page
        if (document.getElementById('appTabs')) {
            init();
        }
    });

    // 更新页面标题结构
    const titleElement = document.querySelector('h1');
    if (titleElement && titleElement.querySelector('a') && titleElement.querySelector('span.subtitle')) {
        const aElem = titleElement.querySelector('a');
        if (aElem.textContent.trim() === 'IPToRoute') {
            aElem.setAttribute('data-lang', 'title-main');
        }
    }

    // 处理URL中的锚点
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
    
    // 页面加载时和hash变化时处理
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 页面加载时立即执行一次
    
    // 处理底部导航链接点击事件
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
    
    // 初始化时检查一次
    checkAndSwitchTab();
    
    // 监听hash变化
    window.addEventListener('hashchange', checkAndSwitchTab);
    
    // 处理底部导航链接点击，添加自定义处理逻辑
    document.querySelectorAll('footer a[href^="./#"], footer a[href^="../#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const hash = href.includes('#') ? href.split('#')[1] : '';
            
            if (hash) {
                // 设置URL hash
                window.location.hash = hash;
                
                // 确保页面滚动到顶部
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                // 如果没有hash，直接导航到href
                window.location.href = href;
            }
        });
    });

    // 处理从sessionStorage中读取的初始标签信息
    function handleSessionStorageTab() {
        const activeTab = sessionStorage.getItem('activeTab');
        if (activeTab) {
            // 清除sessionStorage中的信息，避免后续刷新也使用它
            sessionStorage.removeItem('activeTab');
            
            // 找到对应的标签按钮
            const tabButton = document.querySelector(`.tab-button[data-tab="${activeTab}"]`);
            if (tabButton && !tabButton.classList.contains('active')) {
                // 模拟点击事件
                tabButton.click();
            }
        }
    }
    
    // 初始化时检查一次sessionStorage
    handleSessionStorageTab();
    
    // 检查当前URL中的锚点...
    
    // ... rest of the code ...
});

// Resizer functionality
function setupResizer() {
    console.log('Setting up resizer...');
    const resizer = document.getElementById('horizontalResizer');
    const conversionPanel = document.querySelector('.conversion-panel');
    const inputSection = document.querySelector('.input-section');
    const outputSection = document.querySelector('.output-section');
    
    if (!resizer || !conversionPanel || !inputSection || !outputSection) {
        console.error('Resizer elements not found:', {
            resizer: !!resizer,
            conversionPanel: !!conversionPanel,
            inputSection: !!inputSection,
            outputSection: !!outputSection
        });
        return;
    }
    
    console.log('Resizer elements found:', {
        resizer: resizer,
        conversionPanel: conversionPanel,
        inputSection: inputSection,
        outputSection: outputSection
    });
    
    // Check initial styles
    console.log('Initial styles:', {
        resizerStyle: window.getComputedStyle(resizer),
        inputSectionStyle: window.getComputedStyle(inputSection),
        outputSectionStyle: window.getComputedStyle(outputSection)
    });
    
    // Load saved width percentages from localStorage
    const savedInputWidth = localStorage.getItem('inputSectionWidth');
    const savedOutputWidth = localStorage.getItem('outputSectionWidth');
    
    if (savedInputWidth && savedOutputWidth && window.innerWidth >= 768) {
        console.log('Applying saved widths:', savedInputWidth, savedOutputWidth);
        inputSection.style.flex = `0 0 ${savedInputWidth}`;
        outputSection.style.flex = `0 0 ${savedOutputWidth}`;
    } else if (window.innerWidth >= 768) {
        // Set default initial widths if no saved values
        console.log('Setting default initial widths');
        const defaultInputWidth = 50;
        const defaultOutputWidth = 50 - (resizer.offsetWidth / conversionPanel.offsetWidth) * 100;
        
        inputSection.style.flex = `0 0 ${defaultInputWidth}%`;
        outputSection.style.flex = `0 0 ${defaultOutputWidth}%`;
        
        localStorage.setItem('inputSectionWidth', `${defaultInputWidth}%`);
        localStorage.setItem('outputSectionWidth', `${defaultOutputWidth}%`);
    }
    
    // Check styles after setting widths
    console.log('Styles after setting widths:', {
        resizerStyle: window.getComputedStyle(resizer),
        inputSectionStyle: window.getComputedStyle(inputSection),
        outputSectionStyle: window.getComputedStyle(outputSection)
    });
    
    let isResizing = false;
    
    // Mouse events for desktop
    resizer.addEventListener('mousedown', function(e) {
        console.log('Resizer mousedown');
        if (window.innerWidth < 768) return; // Prevent on mobile
        isResizing = true;
        resizer.classList.add('active');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Prevent text selection during resize
        
        // Prevent default drag behavior
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        
        console.log('Resizing in progress...');
        
        const containerRect = conversionPanel.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const resizerWidth = resizer.offsetWidth;
        
        // Calculate position relative to container
        const posX = e.clientX - containerRect.left;
        console.log('Mouse position:', posX, 'Container width:', containerWidth);
        
        // Ensure minimum width for both sides
        const minWidth = 200; // Minimum width in pixels
        
        if (posX < minWidth || posX > containerWidth - minWidth - resizerWidth) {
            console.log('Position out of bounds, skipping');
            return;
        }
        
        // Set percentage-based widths for both sections
        const inputWidth = (posX / containerWidth) * 100;
        const outputWidth = 100 - inputWidth - (resizerWidth / containerWidth) * 100;
        
        console.log('Setting widths - input:', inputWidth + '%', 'output:', outputWidth + '%');
        
        inputSection.style.flex = `0 0 ${inputWidth}%`;
        outputSection.style.flex = `0 0 ${outputWidth}%`;
        
        // Save widths to localStorage
        localStorage.setItem('inputSectionWidth', `${inputWidth}%`);
        localStorage.setItem('outputSectionWidth', `${outputWidth}%`);
    });
    
    document.addEventListener('mouseup', function() {
        if (!isResizing) return;
        
        isResizing = false;
        resizer.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    });
    
    // Touch events for mobile/tablet
    resizer.addEventListener('touchstart', function(e) {
        if (window.innerWidth < 768) return;
        isResizing = true;
        resizer.classList.add('active');
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isResizing) return;
        
        const touch = e.touches[0];
        const containerRect = conversionPanel.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const resizerWidth = resizer.offsetWidth;
        
        const posX = touch.clientX - containerRect.left;
        const minWidth = 200;
        
        if (posX < minWidth || posX > containerWidth - minWidth - resizerWidth) return;
        
        const inputWidth = (posX / containerWidth) * 100;
        const outputWidth = 100 - inputWidth - (resizerWidth / containerWidth) * 100;
        
        inputSection.style.flex = `0 0 ${inputWidth}%`;
        outputSection.style.flex = `0 0 ${outputWidth}%`;
        
        localStorage.setItem('inputSectionWidth', `${inputWidth}%`);
        localStorage.setItem('outputSectionWidth', `${outputWidth}%`);
    });
    
    document.addEventListener('touchend', function() {
        if (!isResizing) return;
        
        isResizing = false;
        resizer.classList.remove('active');
        document.body.style.userSelect = '';
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            // Reset styles on mobile
            inputSection.style.flex = '';
            outputSection.style.flex = '';
        } else if (savedInputWidth && savedOutputWidth) {
            // Restore saved widths on desktop
            inputSection.style.flex = `0 0 ${savedInputWidth}`;
            outputSection.style.flex = `0 0 ${savedOutputWidth}`;
        }
    });
}

function convertFqdnToFortinet(fqdn) {
    const objectName = fqdn.replace(/\./g, '_');
    return `config firewall address
    edit "${fqdn}"
        set type fqdn
        set fqdn "${fqdn}"
    next
end

config firewall addrgrp
    edit "group_${objectName}"
        set member "${fqdn}"
    next
end`;
}

// 更新输出占位符文本
document.getElementById('output-placeholder-fortinet').innerHTML = `# Fortinet 配置示例
config firewall address
    edit "192.168.1.0_24"
        set subnet 192.168.1.0 255.255.255.0
    next
end

config firewall addrgrp
    edit "group_192.168.1.0_24"
        set member "192.168.1.0_24"
    next
end

# FQDN 示例
config firewall address
    edit "example.com"
        set type fqdn
        set fqdn "example.com"
    next
end

config firewall addrgrp
    edit "group_example_com"
        set member "example.com"
    next
end`;

