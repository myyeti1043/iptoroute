/**
 * Web Worker Module
 * Handles background processing for IP address operations
 */

// Import necessary functions from ipConverters.js
import { isValidIp, isValidMask, convertIpMaskToCidrFormat } from './ipConverters.js';

/**
 * Initialize web worker for background processing
 */
function initWebWorker() {
    // Create a blob URL for the worker script
    const workerCode = `
        // Worker script
        self.onmessage = function(e) {
            const { action, data } = e.data;
            
            switch (action) {
                case 'extractIps':
                    const { text, ipv4Only } = data;
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
            
            // 匹配CIDR
            const cidrRegex = ipv4Only 
                ? /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/([0-9]|[12][0-9]|3[0-2])/g
                : /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/([0-9]|[12][0-9]|3[0-2])|([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\/([0-9]|[1-9][0-9]|1[01][0-9]|12[0-8])/g;
            
            let match;
            while ((match = cidrRegex.exec(text)) !== null) {
                results.add(match[0]);
            }
            
            // 匹配普通IP地址
            const ipRegex = ipv4Only
                ? /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g
                : /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}/g;
            
            while ((match = ipRegex.exec(text)) !== null) {
                // 排除已添加的CIDR
                if (!Array.from(results).some(cidr => cidr.startsWith(match[0] + '/'))) {
                    results.add(match[0]);
                }
            }
            
            return Array.from(results);
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
                // Resolve the pending promise with the result
                if (window.extractIpsResolve) {
                    window.extractIpsResolve(data);
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
            // If worker initialization fails, use main thread processing
            const result = findAllIpAddresses(text, ipv4Only);
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
 * Validate IP addresses
 * @param {string[]} ipAddresses - Array of IP addresses to validate
 * @returns {Object} - Validation result
 */
function validateIpAddresses(ipAddresses) {
    if (!Array.isArray(ipAddresses) || ipAddresses.length === 0) {
        return { valid: false, message: 'No IP addresses provided' };
    }
    
    const invalidIps = [];
    
    for (const ip of ipAddresses) {
        // Check if it's a CIDR notation
        if (ip.includes('/')) {
            const [ipPart, cidrPart] = ip.split('/');
            const cidr = parseInt(cidrPart, 10);
            
            if (!isValidIp(ipPart) || isNaN(cidr) || cidr < 0 || cidr > 32) {
                invalidIps.push(ip);
            }
        }
        // Check if it's an IP with netmask
        else if (ip.includes(' ')) {
            const [ipPart, maskPart] = ip.split(' ');
            
            if (!isValidIp(ipPart) || !isValidMask(maskPart)) {
                invalidIps.push(ip);
            }
        }
        // Check if it's just an IP
        else if (!isValidIp(ip)) {
            invalidIps.push(ip);
        }
    }
    
    if (invalidIps.length > 0) {
        return {
            valid: false,
            message: 'Invalid IP addresses found: ' + invalidIps.join(', ')
        };
    }
    
    return { valid: true };
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

/**
 * Helper function to check if an IP or CIDR is valid
 */
function isValidIpOrCidr(input) {
    if (input.includes('/')) {
        const [ip, cidr] = input.split('/');
        const cidrNum = parseInt(cidr, 10);
        return isValidIp(ip) && !isNaN(cidrNum) && cidrNum >= 0 && cidrNum <= (input.includes(':') ? 128 : 32);
    } else {
        return isValidIp(input);
    }
}

/**
 * Check if an IP address is valid
 * @param {string} ip - IP address to check
 * @returns {boolean} - Whether the IP is valid
 */
function isValidIp(ip) {
    if (!ip || typeof ip !== 'string') {
        return false;
    }
    
    // Check if it's an IPv6 address
    if (ip.includes(':')) {
        // Simple IPv6 validation
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$|^::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])$|^(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/;
        return ipv6Regex.test(ip);
    }
    
    // IPv4 validation
    const octets = ip.split('.');
    
    if (octets.length !== 4) {
        return false;
    }
    
    for (const octet of octets) {
        const num = parseInt(octet, 10);
        
        if (isNaN(num) || num < 0 || num > 255 || (octet.length > 1 && octet[0] === '0')) {
            return false;
        }
    }
    
    return true;
}

/**
 * Check if a netmask is valid
 * @param {string} mask - Netmask to check
 * @returns {boolean} - Whether the netmask is valid
 */
function isValidMask(mask) {
    if (!mask || typeof mask !== 'string') {
        return false;
    }
    
    const octets = mask.split('.');
    
    if (octets.length !== 4) {
        return false;
    }
    
    let binaryMask = '';
    
    for (const octet of octets) {
        const num = parseInt(octet, 10);
        
        if (isNaN(num) || num < 0 || num > 255) {
            return false;
        }
        
        // Convert to binary and pad to 8 bits
        let binary = num.toString(2);
        binary = '0'.repeat(8 - binary.length) + binary;
        binaryMask += binary;
    }
    
    // Check if the mask is contiguous (all 1s followed by all 0s)
    const oneCount = binaryMask.split('1').length - 1;
    const zeroCount = binaryMask.split('0').length - 1;
    
    if (oneCount + zeroCount !== 32) {
        return false;
    }
    
    // Check if the 1s are contiguous
    const firstZero = binaryMask.indexOf('0');
    const lastOne = binaryMask.lastIndexOf('1');
    
    if (firstZero < lastOne) {
        return false;
    }
    
    return true;
}

// Import UI helper functions
import { showLoading, hideLoading } from './uiHelpers.js';

// Export functions for use in other modules
export {
    initWebWorker,
    terminateWorker,
    extractIpsWithWorker,
    validateIpsWithWorker,
    convertToCidrWithWorker,
    validateIpAddresses,
    findAllIpAddresses
};
