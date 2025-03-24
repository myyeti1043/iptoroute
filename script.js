document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization');
    
    // 全局变量，用于跟踪模块加载状态
    window.modulesLoaded = {
        ipConverters: false,
        routerConverters: false,
        jsonExtractor: false,
        uiHelpers: false,
        historyManager: false,
        webWorker: false,
        analytics: false,
        translations: false,
        app: false
    };
    
    // 检查所有模块是否已加载
    function checkAllModulesLoaded() {
        for (const module in window.modulesLoaded) {
            if (!window.modulesLoaded[module]) {
                return false;
            }
        }
        console.log('All modules loaded successfully!');
        return true;
    }
    
    // 模块加载完成后的回调
    function onAllModulesLoaded() {
        if (typeof window.init === 'function') {
            console.log('Initializing application...');
            window.init();
        } else {
            console.error('App initialization function not found!');
        }
    }
    
    // 监听模块加载状态
    window.markModuleAsLoaded = function(moduleName) {
        console.log(`Module loaded: ${moduleName}`);
        window.modulesLoaded[moduleName] = true;
        if (checkAllModulesLoaded()) {
            onAllModulesLoaded();
        }
    }
    
    // 处理模块加载错误
    function handleModuleError(moduleName, error) {
        console.error(`Failed to load ${moduleName} module:`, error);
    }

    // 加载模块
    const scriptTags = [
        { src: './js/ipConverters.js', moduleName: 'ipConverters' },
        { src: './js/routerConverters.js', moduleName: 'routerConverters' },
        { src: './js/jsonExtractor.js', moduleName: 'jsonExtractor' },
        { src: './js/uiHelpers.js', moduleName: 'uiHelpers' },
        { src: './js/historyManager.js', moduleName: 'historyManager' },
        { src: './js/webWorker.js', moduleName: 'webWorker' },
        { src: './js/analytics.js', moduleName: 'analytics' },
        { src: './js/translations.js', moduleName: 'translations' },
        { src: './js/app.js', moduleName: 'app' }
    ];

    scriptTags.forEach((scriptTag) => {
        const script = document.createElement('script');
        script.src = scriptTag.src;
        script.onload = () => window.markModuleAsLoaded(scriptTag.moduleName);
        script.onerror = (error) => handleModuleError(scriptTag.moduleName, error);
        document.head.appendChild(script);
    });
});
