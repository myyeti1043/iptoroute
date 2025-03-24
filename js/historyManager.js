/**
 * History Manager Module
 * Handles saving, loading, and managing operation history
 */

// Maximum number of operations to store in history
const MAX_HISTORY_ITEMS = 20;

/**
 * Add a new operation to the recent operations history
 * @param {string} input - Input text of the operation
 */
function addToRecentOperations(input) {
    if (!input || typeof input !== 'string' || input.trim() === '') {
        return;
    }
    
    try {
        // 确保输入不为空
        const trimmedInput = input.trim();
        if (trimmedInput === '') return;
        
        // Get current mode and router type
        const mode = window.getCurrentMode();
        const routerType = document.getElementById('routerType')?.value || '';
        
        // Create operation object with app version
        const operation = {
            mode: mode,
            input: trimmedInput,
            output: document.getElementById('outputArea')?.value || '',
            timestamp: new Date().toISOString(),
            options: {},
            appVersion: '1.1.0' // 添加版本号以支持未来兼容性
        };
        
        // 保存模式特定选项
        if (mode === 'router-config') {
            operation.options = {
                routerType: routerType,
                sortOutput: document.getElementById('sortOutput')?.checked || false
            };
            
            // 保存路由器特定选项
            switch (routerType) {
                case 'routeros':
                    const routerosType = document.querySelector('input[name="routeros-type"]:checked')?.value || 'route';
                    operation.options.routerosType = routerosType;
                    if (routerosType === 'route') {
                        operation.options.routerosGateway = document.getElementById('routerosGateway')?.value || '';
                    }
                    operation.options.listName = document.getElementById('listName')?.value || 'CN';
                    break;
                case 'cisco':
                    operation.options.nextHopIp = document.getElementById('nextHopIp')?.value || '';
                    operation.options.routeName = document.getElementById('routeName')?.value || 'CN';
                    break;
                case 'huawei':
                    operation.options.huaweiNextHop = document.getElementById('huaweiNextHop')?.value || '';
                    break;
                case 'juniper':
                    operation.options.juniperNextHop = document.getElementById('juniperNextHop')?.value || '';
                    break;
                case 'fortinet':
                    operation.options.fortinetType = document.querySelector('input[name="fortinet-type"]:checked')?.value || 'address';
                    operation.options.addrGroupName = document.getElementById('addrGroupName')?.value || 'IP_Group';
                    break;
            }
        } else if (mode === 'bulk-extract') {
            operation.options = {
                ipv4Only: document.getElementById('ipv4Only')?.checked || false,
                removeDuplicates: document.getElementById('removeDuplicates')?.checked || true
            };
        }
        
        // 从本地存储中获取现有操作
        let savedOperations = [];
        try {
            savedOperations = JSON.parse(localStorage.getItem('recentOperations') || '[]');
            // 验证数据结构
            if (!Array.isArray(savedOperations)) {
                console.warn('Stored operations is not an array, resetting');
                savedOperations = [];
            }
        } catch (e) {
            console.error('Failed to parse saved operations:', e);
            savedOperations = [];
        }
        
        // 防止重复记录同样的操作
        const isDuplicate = savedOperations.some(op => 
            op.mode === operation.mode && 
            op.input === operation.input && 
            Math.abs(new Date(op.timestamp) - new Date(operation.timestamp)) < 10000 // 10秒内的相同操作视为重复
        );
        
        if (!isDuplicate) {
            // 添加新操作到数组开头（最新的在前面）
            savedOperations.unshift(operation);
            
            // 限制历史记录长度，保留最新的20条
            if (savedOperations.length > MAX_HISTORY_ITEMS) {
                savedOperations = savedOperations.slice(0, MAX_HISTORY_ITEMS);
            }
            
            // 保存到本地存储
            try {
                localStorage.setItem('recentOperations', JSON.stringify(savedOperations));
                refreshRecentOperations(savedOperations);
            } catch (e) {
                // 处理本地存储限制或其他错误
                if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                    // 存储空间不足时，移除一些较旧的记录
                    savedOperations = savedOperations.slice(0, Math.max(5, Math.floor(savedOperations.length / 2)));
                    localStorage.setItem('recentOperations', JSON.stringify(savedOperations));
                    refreshRecentOperations(savedOperations);
                    
                    console.warn('Storage limit reached, reduced history length');
                } else {
                    console.error('Error saving operations history:', e);
                }
            }
        }
    } catch (e) {
        console.error('Error adding to recent operations:', e);
    }
}

/**
 * Load recent operations from localStorage
 * @returns {Array} - Array of operation objects
 */
function loadRecentOperations() {
    try {
        // 获取已保存的操作
        let savedOperations;
        try {
            savedOperations = JSON.parse(localStorage.getItem('recentOperations') || '[]');
        } catch (e) {
            console.error('Failed to parse saved operations:', e);
            savedOperations = [];
            // 重置存储以避免将来出现相同错误
            localStorage.setItem('recentOperations', '[]');
        }
        
        // 验证操作是数组
        if (!Array.isArray(savedOperations)) {
            console.warn('Operations is not an array:', savedOperations);
            savedOperations = [];
        }
        
        return savedOperations;
    } catch (e) {
        console.error('Error loading recent operations:', e);
        return [];
    }
}

/**
 * Refresh the recent operations UI
 * @param {Array} operations - Array of operation objects (optional)
 */
function refreshRecentOperations(operations = null) {
    const recentOperationsList = document.getElementById('recentOperationsList');
    if (!recentOperationsList) return;
    
    try {
        // 清空当前列表
        recentOperationsList.innerHTML = '';
        
        // 如果没有提供操作列表，从存储中获取
        if (!operations) {
            operations = loadRecentOperations();
        }
        
        // 验证操作是数组
        if (!Array.isArray(operations)) {
            console.warn('Operations is not an array:', operations);
            operations = [];
        }
        
        // If no operations, show a message
        if (operations.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-history';
            emptyMessage.textContent = window.getCurrentLang() === 'en' ? 
                'No recent operations' : 
                '没有最近的操作';
            recentOperationsList.appendChild(emptyMessage);
            return;
        }
        
        // 添加操作到UI
        operations.forEach(operation => {
            if (!operation || !operation.input) return;
            
            const operationItem = document.createElement('li');
            const timestamp = new Date(operation.timestamp).toLocaleString();
            
            // 设置模式显示文本
            let modeText = operation.mode || '';
            const translations = window.translations || {};
            const currentLang = window.getCurrentLang();
            if (translations[currentLang] && translations[currentLang][`tab-${modeText}`]) {
                modeText = translations[currentLang][`tab-${modeText}`];
            }
            
            // 设置操作项的HTML
            operationItem.innerHTML = `
                <div class="operation-info">
                    <div class="operation-mode">${modeText}</div>
                    <div class="operation-time">${timestamp}</div>
                </div>
                <div class="operation-preview">${operation.input.slice(0, 50)}${operation.input.length > 50 ? '...' : ''}</div>
            `;
            
            // 添加点击事件还原操作
            operationItem.addEventListener('click', () => {
                restoreOperation(operation);
            });
            
            // 添加到DOM
            recentOperationsList.appendChild(operationItem);
        });
    } catch (e) {
        console.error('Error refreshing recent operations:', e);
    }
}

/**
 * Restore a previous operation
 * @param {Object} operation - Operation object to restore
 */
function restoreOperation(operation) {
    if (!operation) return;
    
    try {
        // 切换到正确的模式
        if (operation.mode && operation.mode !== window.getCurrentMode()) {
            const tabButton = document.querySelector(`.tab-button[data-tab="${operation.mode}"]`);
            if (tabButton) {
                // 触发点击事件以切换标签
                tabButton.click();
            }
        }
        
        // 延迟执行以确保UI已更新
        setTimeout(() => {
            try {
                // 填充输入区域
                const inputArea = document.getElementById('inputArea');
                if (operation.input && inputArea) {
                    inputArea.value = operation.input;
                }
                
                // 应用保存的选项
                if (operation.options) {
                    // 通用选项
                    const sortOutput = document.getElementById('sortOutput');
                    if (sortOutput && operation.options.sortOutput !== undefined) {
                        sortOutput.checked = operation.options.sortOutput;
                    }
                    
                    // 根据模式应用特定选项
                    if (operation.mode === 'router-config') {
                        // 设置路由器类型
                        const routerTypeSelect = document.getElementById('routerType');
                        if (routerTypeSelect && operation.options.routerType) {
                            routerTypeSelect.value = operation.options.routerType;
                            // 手动触发change事件
                            const event = new Event('change');
                            routerTypeSelect.dispatchEvent(event);
                            
                            // 延迟应用路由器特定选项，确保相关UI已经更新
                            setTimeout(() => {
                                try {
                                    applyRouterSpecificOptions(operation.options);
                                } catch (e) {
                                    console.error('Error applying router specific options:', e);
                                }
                            }, 100);
                        }
                    } else if (operation.mode === 'bulk-extract') {
                        // 设置批量提取选项
                        const ipv4Only = document.getElementById('ipv4Only');
                        if (ipv4Only && operation.options.ipv4Only !== undefined) {
                            ipv4Only.checked = operation.options.ipv4Only;
                        }
                        
                        const removeDuplicates = document.getElementById('removeDuplicates');
                        if (removeDuplicates && operation.options.removeDuplicates !== undefined) {
                            removeDuplicates.checked = operation.options.removeDuplicates;
                        }
                    }
                }
                
                // 设置输出区域
                const outputArea = document.getElementById('outputArea');
                if (outputArea && operation.output) {
                    outputArea.value = operation.output;
                }
                
                // 显示通知
                const currentLang = window.getCurrentLang();
                const message = currentLang === 'en' 
                    ? 'Operation restored successfully'
                    : '操作已成功还原';
                if (window.showNotification) {
                    window.showNotification(message, 'success');
                } else {
                    alert(message);
                }
                
            } catch (e) {
                console.error('Error restoring operation details:', e);
            }
        }, 100);
    } catch (e) {
        console.error('Error restoring operation:', e);
    }
}

/**
 * 辅助函数：应用路由器特定选项
 * @param {Object} options - 路由器选项对象
 */
function applyRouterSpecificOptions(options) {
    if (!options || !options.routerType) return;
    
    switch (options.routerType) {
        case 'routeros':
            // 应用RouterOS选项
            if (options.routerosType) {
                const routerosTypeRadio = document.querySelector(`input[name="routeros-type"][value="${options.routerosType}"]`);
                if (routerosTypeRadio) {
                    routerosTypeRadio.checked = true;
                    // 触发变化事件
                    routerosTypeRadio.dispatchEvent(new Event('change'));
                }
            }
            
            // 设置RouterOS网关
            if (options.routerosGateway !== undefined) {
                const gateway = document.getElementById('routerosGateway');
                if (gateway) gateway.value = options.routerosGateway;
            }
            
            // 设置列表名称
            if (options.listName !== undefined) {
                const listName = document.getElementById('listName');
                if (listName) listName.value = options.listName;
            }
            break;
            
        case 'cisco':
            // 应用Cisco选项
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
            // 应用华为选项
            if (options.huaweiNextHop !== undefined) {
                const nextHop = document.getElementById('huaweiNextHop');
                if (nextHop) nextHop.value = options.huaweiNextHop;
            }
            break;
            
        case 'juniper':
            // 应用Juniper选项
            if (options.juniperNextHop !== undefined) {
                const nextHop = document.getElementById('juniperNextHop');
                if (nextHop) nextHop.value = options.juniperNextHop;
            }
            break;
            
        case 'fortinet':
            // 应用Fortinet选项
            if (options.fortinetType) {
                const fortinetTypeRadio = document.querySelector(`input[name="fortinet-type"][value="${options.fortinetType}"]`);
                if (fortinetTypeRadio) {
                    fortinetTypeRadio.checked = true;
                    // 触发变化事件
                    fortinetTypeRadio.dispatchEvent(new Event('change'));
                }
            }
            
            if (options.addrGroupName !== undefined) {
                const groupName = document.getElementById('addrGroupName');
                if (groupName) groupName.value = options.addrGroupName;
            }
            break;
    }
}

/**
 * Clear all operation history
 */
function clearOperationHistory() {
    try {
        // Clear localStorage
        localStorage.removeItem('recentOperations');
        
        // Refresh the UI
        refreshRecentOperations([]);
        
        // Show confirmation
        const currentLang = window.getCurrentLang();
        const message = currentLang === 'en' 
            ? 'Operation history cleared successfully.' 
            : '操作历史已成功清除。';
        if (window.showNotification) {
            window.showNotification(message, 'success');
        } else {
            alert(message);
        }
    } catch (e) {
        console.error('Error clearing operation history:', e);
    }
}

/**
 * Setup Recent Operations UI and event handlers
 */
function setupRecentOperations() {
    // Set up clear history button
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            clearOperationHistory();
        });
    }
}

// 将所有函数添加到window对象上
window.addToRecentOperations = addToRecentOperations;
window.loadRecentOperations = loadRecentOperations;
window.refreshRecentOperations = refreshRecentOperations;
window.restoreOperation = restoreOperation;
window.applyRouterSpecificOptions = applyRouterSpecificOptions;
window.clearOperationHistory = clearOperationHistory;
window.setupRecentOperations = setupRecentOperations;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('historyManager');
}
