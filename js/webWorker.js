/**
 * Web Worker Module
 * Handles background processing for IP address operations
 */

// 不再使用import，因为ipConverters.js已经将这些函数添加到了window对象上
// import { isValidIp, isValidMask, convertIpMaskToCidrFormat } from './ipConverters.js';

/**
 * Initialize web worker for background processing
 */
function initWebWorker() {
    // Terminate existing worker if any
    if (window.ipWorker) {
        window.ipWorker.terminate();
        window.ipWorker = null;
    }
    
    // Create a blob URL for the worker script - Version 2.0 with netmask filtering
    const workerCode = `
        // Worker script - Version 2.0 with netmask filtering
        self.onmessage = function(e) {
            const { action, data } = e.data;
            
            switch (action) {
                case 'extractIps':
                    const { text, ipv4Only } = data;
                    // Send debug info back to main thread
                    self.postMessage({ 
                        action: 'debug', 
                        data: 'WebWorker: Starting IP extraction with v2.0 netmask filtering' 
                    });
                    const extractedIps = extractIpsWorker(text, ipv4Only);
                    self.postMessage({ 
                        action: 'extractIpsResult', 
                        data: extractedIps 
                    });
                    break;
                    
                case 'validateIps':
                    const { ips } = data;
                    const validationResults = bulkValidateIps(ips);
                    self.postMessage({ 
                        action: 'validateIpsResult', 
                        data: validationResults 
                    });
                    break;
                    
                case 'convertToCidr':
                    try {
                        const { ips, netmasks } = data;
                        const results = [];
                        
                        for (let i = 0; i < ips.length; i++) {
                            const ip = ips[i];
                            const mask = netmasks[i] || '255.255.255.255';
                            
                            // 计算CIDR前缀
                            let prefix = 0;
                            const octets = mask.split('.');
                            for (let j = 0; j < octets.length; j++) {
                                const octet = parseInt(octets[j], 10);
                                for (let k = 7; k >= 0; k--) {
                                    if (octet & (1 << k)) {
                                        prefix++;
                                    } else {
                                        break;
                                    }
                                }
                            }
                            
                            results.push(ip + '/' + prefix);
                        }
                        
                        self.postMessage({
                            action: 'convertToCidrResult',
                            data: results
                        });
                    } catch (error) {
                        self.postMessage({
                            action: 'error',
                            data: error.message
                        });
                    }
                    break;
                    
                default:
                    self.postMessage({
                        action: 'error',
                        data: 'Unknown action: ' + action
                    });
            }
        };
        
        // CIDR to IP range
        function cidrToRange(cidr) {
            const [ip, prefix] = cidr.split('/');
            const prefixSize = parseInt(prefix, 10);
            
            // 验证是否为IPv4
            if (ip.includes(':')) {
                return { start: ip, end: ip, prefixSize }; // IPv6不计算范围
            }
            
            // 将IP转换为数字
            const ipInt = ipToInt(ip);
            
            // 计算网络和广播地址
            const maskBits = -1 << (32 - prefixSize);
            const netStart = ipInt & maskBits;
            const netEnd = netStart | ~maskBits;
            
            return {
                start: intToIp(netStart),
                end: intToIp(netEnd),
                prefixSize
            };
        }
        
        // IP to integer
        function ipToInt(ip) {
            return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
        }
        
        // Integer to IP
        function intToIp(ipInt) {
            return [
                (ipInt >>> 24) & 255,
                (ipInt >>> 16) & 255,
                (ipInt >>> 8) & 255,
                ipInt & 255
            ].join('.');
        }
        
        // IP validation function
        function validateIpAddress(ip) {
            // IPv4验证
            const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            
            // IPv6验证 (简化版)
            const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
            
            return ipv4Regex.test(ip) ? 'ipv4' : (ipv6Regex.test(ip) ? 'ipv6' : null);
        }
        
        // CIDR validation
        function validateCidr(cidr) {
            if (!cidr.includes('/')) return null;
            
            const [ip, prefix] = cidr.split('/');
            const prefixNum = parseInt(prefix, 10);
            
            const ipType = validateIpAddress(ip);
            if (!ipType) return null;
            
            // 验证前缀长度
            if (isNaN(prefixNum)) return null;
            
            if (ipType === 'ipv4' && (prefixNum < 0 || prefixNum > 32)) return null;
            if (ipType === 'ipv6' && (prefixNum < 0 || prefixNum > 128)) return null;
            
            return ipType;
        }
        
        // Extract IP addresses - Worker version
        function extractIpsWorker(text, ipv4Only = false) {
            if (!text) return [];
            
            // 移除注释、特殊字符等
            text = text.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '') // 多行注释
                     .replace(/\\/\\/.*$/gm, '')    // 单行注释
                     .replace(/[""'']/g, '');      // 引号
            
            const results = new Set();
            
            // 匹配CIDR - 使用更严格的边界匹配
            const cidrRegex = ipv4Only 
                ? /\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/([0-9]|[12][0-9]|3[0-2])\\b/g
                : /\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/([0-9]|[12][0-9]|3[0-2])\\b|\\b([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\/([0-9]|[1-9][0-9]|1[01][0-9]|12[0-8])\\b/g;
            
            let match;
            while ((match = cidrRegex.exec(text)) !== null) {
                const cidr = match[0];
                results.add(cidr);
                // Send debug info
                self.postMessage({ 
                    action: 'debug', 
                    data: 'WebWorker: Found CIDR: ' + cidr 
                });
            }
            
            // 匹配普通IP地址 - 使用更严格的边界匹配，避免匹配CIDR格式
            const ipRegex = ipv4Only
                ? /\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b(?!\\/)/g
                : /\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b(?!\\/)|\\b([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\b(?!\\/)/g;
            
            while ((match = ipRegex.exec(text)) !== null) {
                const ip = match[0];
                
                // Send debug info for tracking
                self.postMessage({ 
                    action: 'debug', 
                    data: 'WebWorker: Found IP candidate: ' + ip 
                });
                
                // 排除已添加的CIDR
                if (Array.from(results).some(cidr => cidr.startsWith(ip + '/'))) {
                    self.postMessage({ 
                        action: 'debug', 
                        data: 'WebWorker: Skipping IP (already in CIDR): ' + ip 
                    });
                    continue;
                }
                
                // 检查是否是子网掩码 - 使用与jsonExtractor.js相同的逻辑
                if (isNetmaskLikeAddressWorker(ip)) {
                    self.postMessage({ 
                        action: 'debug', 
                        data: 'WebWorker: Skipping IP (is netmask): ' + ip 
                    });
                    continue;
                }
                
                // 添加/32后缀给单独的IPv4地址
                if (ip.includes('.') && !ip.includes(':')) {
                    const finalResult = ip + '/32';
                    results.add(finalResult);
                    self.postMessage({ 
                        action: 'debug', 
                        data: 'WebWorker: Added IP with /32: ' + finalResult 
                    });
                } else {
                    results.add(ip);
                    self.postMessage({ 
                        action: 'debug', 
                        data: 'WebWorker: Added IP: ' + ip 
                    });
                }
            }
            
            return Array.from(results);
        }
        
        // Worker版本的子网掩码检查函数 - 修复版本
        function isNetmaskLikeAddressWorker(ip) {
            // Send debug info back to main thread for problematic IPs
            if (ip.startsWith('255.')) {
                self.postMessage({ 
                    action: 'debug', 
                    data: 'WebWorker: Checking if IP is netmask: ' + ip 
                });
            }
            // 预定义的常见掩码映射
            const maskToCidrMap = {
                "255.255.255.255": 32, "255.255.255.254": 31, "255.255.255.252": 30, "255.255.255.248": 29,
                "255.255.255.240": 28, "255.255.255.224": 27, "255.255.255.192": 26, "255.255.255.128": 25,
                "255.255.255.0": 24, "255.255.254.0": 23, "255.255.252.0": 22, "255.255.248.0": 21,
                "255.255.240.0": 20, "255.255.224.0": 19, "255.255.192.0": 18, "255.255.128.0": 17,
                "255.255.0.0": 16, "255.254.0.0": 15, "255.252.0.0": 14, "255.248.0.0": 13,
                "255.240.0.0": 12, "255.224.0.0": 11, "255.192.0.0": 10, "255.128.0.0": 9,
                "255.0.0.0": 8, "254.0.0.0": 7, "252.0.0.0": 6, "248.0.0.0": 5,
                "240.0.0.0": 4, "224.0.0.0": 3, "192.0.0.0": 2, "128.0.0.0": 1, "0.0.0.0": 0
            };
            
            // 检查是否在预定义的掩码映射表中
            if (ip in maskToCidrMap) {
                return true;
            }
            
            // 验证IP格式
            if (!ip || !/^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/.test(ip)) {
                return false;
            }
            
            // 将IP地址转换为32位二进制字符串
            const parts = ip.split('.').map(part => parseInt(part, 10));
            
            // 检查每个部分是否在有效范围内
            if (parts.some(part => part < 0 || part > 255)) {
                return false;
            }
            
            // 转换为二进制字符串
            let binaryMask = '';
            for (const part of parts) {
                binaryMask += part.toString(2).padStart(8, '0');
            }
            
            // 检查是否符合子网掩码的模式：连续的1后面跟连续的0
            const maskPattern = /^1*0*$/;
            const isValidMaskPattern = maskPattern.test(binaryMask);
            
            if (!isValidMaskPattern) {
                return false;
            }
            
            // 额外检查：如果二进制全是0或全是1，也认为是掩码
            if (binaryMask === '00000000000000000000000000000000' || // 0.0.0.0
                binaryMask === '11111111111111111111111111111111') { // 255.255.255.255
                return true;
            }
            
            // 检查是否至少有一个1（排除全0的情况，但0.0.0.0是特殊的有效掩码）
            const hasOnes = binaryMask.includes('1');
            
            // 如果有1且符合掩码模式，就是有效掩码
            const result = hasOnes || binaryMask === '00000000000000000000000000000000';
            
            // Send debug result back to main thread for problematic IPs
            if (ip.startsWith('255.')) {
                self.postMessage({ 
                    action: 'debug', 
                    data: 'WebWorker: IP ' + ip + ' is netmask: ' + result + ', binary: ' + binaryMask 
                });
            }
            
            return result;
        }
        
        // Batch validate IP addresses
        function bulkValidateIps(ips) {
            if (!Array.isArray(ips)) return [];
            
            return ips.map(ip => {
                if (ip.includes('/')) {
                    // CIDR格式
                    return {
                        original: ip,
                        valid: validateCidr(ip) !== null,
                        type: validateCidr(ip)
                    };
                } else {
                    // 普通IP
                    const type = validateIpAddress(ip);
                    return {
                        original: ip,
                        valid: type !== null,
                        type: type
                    };
                }
            });
        }
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    // Create the worker
    window.ipWorker = new Worker(workerUrl);
    
    // Set up message handler
    window.ipWorker.onmessage = function(e) {
        const { action, data, error } = e.data;
        
        switch (action) {
            case 'extractIpsResult':
                // Apply post-processing options before resolving
                if (window.extractIpsResolve) {
                    let result = data;
                    
                    // Get current options
                    const removeDuplicates = document.getElementById('removeDuplicates') ? document.getElementById('removeDuplicates').checked : true;
                    const aggregateSubnets = typeof window.isAggregateSubnetsEnabled === 'function'
                        ? window.isAggregateSubnetsEnabled()
                        : (document.getElementById('aggregateSubnets') ? document.getElementById('aggregateSubnets').checked : false);
                    
                    // Apply post-processing options
                    if (removeDuplicates) {
                        result = [...new Set(result)];
                    }
                    
                    if (aggregateSubnets && result.length > 0) {
                        console.log('WebWorker fallback: Aggregation enabled, original count:', result.length);
                        result = window.aggregateIpRanges(result);
                        console.log('WebWorker fallback: Aggregated count:', result.length);
                    } else {
                        console.log('WebWorker fallback: Aggregation skipped - aggregateSubnets:', aggregateSubnets, ', length:', result.length);
                    }
                    
                    // Update statistics
                    if (window.updateResultsStats) {
                        window.updateResultsStats(result.length);
                    }
                    
                    window.extractIpsResolve(result);
                    window.extractIpsResolve = null;
                }
                break;
                
            case 'validateIpsResult':
                // Resolve the pending promise with the validation result
                if (window.validateIpsResolve) {
                    window.validateIpsResolve(data);
                    window.validateIpsResolve = null;
                }
                break;
                
            case 'convertToCidrResult':
                // Resolve the pending promise with the CIDR conversion result
                if (window.convertToCidrResolve) {
                    window.convertToCidrResolve(data);
                    window.convertToCidrResolve = null;
                }
                break;
                
            case 'debug':
                console.log('WebWorker Debug:', data);
                break;
                
            case 'error':
                console.error('Worker error:', error || data);
                // Notify all callbacks of the error
                ['extractIpsResolve', 'validateIpsResolve', 'convertToCidrResolve'].forEach(key => {
                    if (window[key]) {
                        window[key]([]);
                        window[key] = null;
                    }
                });
                break;
        }
        
        // Hide loading indicator if all operations are complete
        if (!window.extractIpsResolve && !window.validateIpsResolve && !window.convertToCidrResolve) {
            hideLoading();
        }
    };
    
    // Handle worker errors
    window.ipWorker.onerror = function(error) {
        console.error('Worker error:', error);
        
        // Notify all callbacks of the error
        ['extractIpsResolve', 'validateIpsResolve', 'convertToCidrResolve'].forEach(key => {
            if (window[key]) {
                window[key]([]);
                window[key] = null;
            }
        });
        
        hideLoading();
    };
    
    return true;
}

/**
 * Terminate the web worker
 */
function terminateWorker() {
    if (window.ipWorker) {
        window.ipWorker.terminate();
        window.ipWorker = null;
    }
}

/**
 * Extract IP addresses using web worker
 * @param {string} text - Text to extract IPs from
 * @param {boolean} ipv4Only - Whether to extract IPv4 addresses only
 * @returns {Promise<string[]>} - Promise resolving to array of extracted IP addresses
 */
function extractIpsWithWorker(text, ipv4Only = false) {
    return new Promise((resolve) => {
        if (!initWebWorker()) {
            // If worker initialization fails, use main thread processing with full options
            const removeDuplicates = document.getElementById('removeDuplicates') ? document.getElementById('removeDuplicates').checked : true;
            const aggregateSubnets = typeof window.isAggregateSubnetsEnabled === 'function'
                ? window.isAggregateSubnetsEnabled()
                : (document.getElementById('aggregateSubnets') ? document.getElementById('aggregateSubnets').checked : false);
            
            let result = findAllIpAddresses(text, ipv4Only);
            
            // Apply post-processing options
            if (removeDuplicates) {
                result = [...new Set(result)];
            }
            
            if (aggregateSubnets && result.length > 0) {
                result = window.aggregateIpRanges(result);
            }
            
            // Update statistics
            if (window.updateResultsStats) {
                window.updateResultsStats(result.length);
            }
            
            resolve(result);
            return;
        }
        
        // Show loading indicator
        showLoading();
        
        // Store callback
        window.extractIpsResolve = resolve;
        
        // Send message to worker
        window.ipWorker.postMessage({
            action: 'extractIps',
            data: { text, ipv4Only }
        });
    });
}

/**
 * Validate IP addresses using web worker
 * @param {string[]} ips - Array of IP addresses to validate
 * @returns {Promise<Object>} - Promise resolving to validation result
 */
function validateIpsWithWorker(ips) {
    return new Promise((resolve) => {
        if (!Array.isArray(ips) || ips.length === 0) {
            resolve([]);
            return;
        }
        
        if (!initWebWorker()) {
            // If worker initialization fails, use synchronous validation
            const results = ips.map(ip => ({
                original: ip,
                valid: isValidIpOrCidr(ip),
                type: ip.includes(':') ? 'ipv6' : 'ipv4'
            }));
            resolve(results);
            return;
        }
        
        // Show loading indicator
        showLoading();
        
        // Store callback
        window.validateIpsResolve = resolve;
        
        // Send message to worker
        window.ipWorker.postMessage({
            action: 'validateIps',
            data: { ips }
        });
    });
}

/**
 * Convert IP and netmask to CIDR using web worker
 * @param {string[]} ips - Array of IP addresses
 * @param {string[]} netmasks - Array of netmasks
 * @returns {Promise<string[]>} - Promise resolving to array of CIDR notations
 */
function convertToCidrWithWorker(ips, netmasks) {
    return new Promise((resolve) => {
        if (!Array.isArray(ips) || ips.length === 0) {
            resolve([]);
            return;
        }
        
        if (!initWebWorker()) {
            // If worker initialization fails, use synchronous conversion
            const results = [];
            for (let i = 0; i < ips.length; i++) {
                const ip = ips[i];
                const mask = netmasks[i] || '255.255.255.255';
                
                // Calculate CIDR prefix
                let prefix = 0;
                const octets = mask.split('.');
                for (let j = 0; j < octets.length; j++) {
                    const octet = parseInt(octets[j], 10);
                    for (let k = 7; k >= 0; k--) {
                        if (octet & (1 << k)) {
                            prefix++;
                        } else {
                            break;
                        }
                    }
                }
                
                results.push(ip + '/' + prefix);
            }
            resolve(results);
            return;
        }
        
        // Show loading indicator
        showLoading();
        
        // Store callback
        window.convertToCidrResolve = resolve;
        
        // Send message to worker
        window.ipWorker.postMessage({
            action: 'convertToCidr',
            data: { ips, netmasks }
        });
    });
}

/**
 * Helper function to check if an IP or CIDR is valid
 */
function isValidIpOrCidr(input) {
    if (!input || typeof input !== 'string') {
        return false;
    }
    
    if (input.includes('/')) {
        const [ip, cidr] = input.split('/');
        const cidrNum = parseInt(cidr, 10);
        return isValidIp(ip) && !isNaN(cidrNum) && cidrNum >= 0 && cidrNum <= (input.includes(':') ? 128 : 32);
    } else {
        return isValidIp(input);
    }
}

/**
 * Find all IP addresses in text
 * @param {string} data - Text to search for IP addresses
 * @param {boolean} ipv4Only - Whether to extract IPv4 addresses only
 * @returns {string[]} - Array of found IP addresses
 */
function findAllIpAddresses(data, ipv4Only = false) {
    if (!data || typeof data !== 'string') {
        return [];
    }
    
    const results = [];
    
    // IPv4 CIDR pattern: matches patterns like 192.168.1.0/24
    const ipv4CidrPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\/\d{1,2}\b/g;
    
    // IPv4 pattern: matches patterns like 192.168.1.1
    const ipv4Pattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    
    // Extract IPv4 CIDR blocks
    const ipv4CidrMatches = data.match(ipv4CidrPattern) || [];
    
    // Filter valid IPv4 CIDR blocks
    for (const match of ipv4CidrMatches) {
        const [ip, cidr] = match.split('/');
        const cidrNum = parseInt(cidr, 10);
        
        // Validate IP part
        if (isValidIp(ip) && cidrNum >= 0 && cidrNum <= 32) {
            results.push(match);
        }
    }
    
    // Extract IPv4 addresses
    const ipv4Matches = data.match(ipv4Pattern) || [];
    
    // Filter valid IPv4 addresses
    for (const match of ipv4Matches) {
        // Skip if already included as part of a CIDR block
        if (ipv4CidrMatches.some(cidr => cidr.startsWith(match + '/'))) {
            continue;
        }
        
        if (isValidIp(match)) {
            results.push(match);
        }
    }
    
    // If not IPv4 only, also extract IPv6 addresses
    if (!ipv4Only) {
        // IPv6 CIDR pattern: matches patterns like 2001:db8::/32
        const ipv6CidrPattern = /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\/\d{1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,7}:\/\d{1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}\/\d{1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}\/\d{1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}\/\d{1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}\/\d{1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}\/\d{1,3}\b|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}\/\d{1,3}\b|:(?::[0-9a-fA-F]{1,4}){1,7}\/\d{1,3}\b|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}\/\d{1,3}\b|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\/\d{1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\/\d{1,3}\b/g;
        
        // IPv6 pattern: matches IPv6 addresses
        const ipv6Pattern = /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|(?:[0-9a-fA-F]{1,4}:){1,7}:\b|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}\b|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}\b|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}\b|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}\b|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}\b|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}\b|:(?::[0-9a-fA-F]{1,4}){1,7}\b|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}\b|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\b|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\b/g;
        
        // Extract IPv6 CIDR blocks
        const ipv6CidrMatches = data.match(ipv6CidrPattern) || [];
        results.push(...ipv6CidrMatches);
        
        // Extract IPv6 addresses
        const ipv6Matches = data.match(ipv6Pattern) || [];
        
        // Filter out IPv6 addresses that are already part of CIDR blocks
        for (const match of ipv6Matches) {
            if (!ipv6CidrMatches.some(cidr => cidr.startsWith(match + '/'))) {
                results.push(match);
            }
        }
    }
    
    return results;
}

// 将所有函数添加到window对象上
window.initWebWorker = initWebWorker;
window.terminateWorker = terminateWorker;
window.extractIpsWithWorker = extractIpsWithWorker;
window.validateIpsWithWorker = validateIpsWithWorker;
window.convertToCidrWithWorker = convertToCidrWithWorker;
window.isValidIpOrCidr = isValidIpOrCidr;
window.findAllIpAddresses = findAllIpAddresses;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('webWorker');
}
