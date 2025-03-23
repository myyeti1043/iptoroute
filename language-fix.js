// This is a fix for the language switching issue in the navigation bar
// Replace the updateLanguage function in your script.js with this one:

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
    
    // Update page title translation
    updatePageTitle(lang);
}

// Make sure your translations object includes these entries:
// In the 'en' section:
/*
'navigation': 'Navigation',
'home': 'Home',
'router-configuration': 'Router Configuration',
'ip-extraction': 'IP Extraction',
'cidr-converter': 'CIDR Converter',
'ip-to-cidr': 'IP to CIDR',
'sitemap': 'Sitemap',
'legal': 'Legal',
'privacy-policy': 'Privacy Policy',
'terms-of-service': 'Terms of Service',
'cookie-policy': 'Cookie Policy',
'contact': 'Contact',
'contact-us': 'Contact Us',
'github': 'GitHub',
'all-rights-reserved': 'All rights reserved',
'footer-description': 'Free networking tools for IT professionals, network engineers, and system administrators.'
*/

// In the 'zh' section:
/*
'navigation': '导航',
'home': '首页',
'router-configuration': '路由配置',
'ip-extraction': 'IP提取',
'cidr-converter': 'CIDR转换器',
'ip-to-cidr': 'IP到CIDR',
'sitemap': '网站地图',
'legal': '法律条款',
'privacy-policy': '隐私政策',
'terms-of-service': '服务条款',
'cookie-policy': 'Cookie政策',
'contact': '联系我们',
'contact-us': '联系我们',
'github': 'GitHub',
'all-rights-reserved': '版权所有',
'footer-description': '为IT专业人员、网络工程师和系统管理员提供的免费网络工具。'
*/
