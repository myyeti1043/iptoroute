/**
 * JSON Extractor Module
 * Contains functions for extracting IP addresses from JSON data
 */

import { isValidIp, isValidMask, convertIpMaskToCidr } from './ipConverters.js';
import { maskToCidrMap } from './translations.js';

/**
 * Extract IP prefixes from JSON content
 * @param {string|Object} jsonData - JSON string or parsed JSON data
 * @returns {string[]} - Array of extracted IP prefixes
 */
function extractIpPrefixesFromJson(jsonData) {
    console.log('extractIpPrefixesFromJson called');
    
    // Check if input is potentially too large
    if (typeof jsonData === 'string' && jsonData.length > 1000000) { // 1MB threshold
        console.log('Large text detected:', jsonData.length, 'bytes');
        const currentLang = document.documentElement.lang || 'en';
        if (!confirm(currentLang === 'en' ? 
            'The input text is very large (over 1MB). Processing may take time and could cause browser slowdown. Continue?' : 
            '输入文本非常大（超过1MB）。处理可能需要时间并可能导致浏览器变慢。是否继续？')) {
            return [];
        }
    }
    
    // Parse JSON data if it's a string
    let data = jsonData;
    if (typeof jsonData === 'string') {
        try {
            data = JSON.parse(jsonData);
            console.log('JSON parsed successfully');
        } catch (e) {
            console.log('Not valid JSON, treating as plain text');
            data = jsonData; // Treat as plain text
        }
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
        const directSearch = findAllIpAddresses(typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData), ipv4Only);
        if (directSearch.length > 0) {
            console.log('Found IPs through direct search after error:', directSearch.length);
            return directSearch;
        }
        return [];
    }
}

/**
 * Find all IP addresses and CIDR blocks in any text
 * @param {string} data - Text data to search for IP addresses
 * @param {boolean} ipv4Only - Whether to extract IPv4 addresses only
 * @returns {string[]} - Array of found IP addresses and CIDR blocks
 */
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

/**
 * 从Cisco路由命令中提取IP和掩码
 * @param {string} route - Cisco路由命令
 * @returns {Object|null} - 提取的IP信息或null
 */
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
            const cidr = convertIpMaskToCidr(`${ip} ${mask}`);
            
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

/**
 * Validate IP addresses
 * @param {string[]} ipAddresses - Array of IP addresses to validate
 * @returns {string[]} - Array of valid IP addresses
 */
function validateIpAddresses(ipAddresses) {
    const validAddresses = [];
    
    for (const address of ipAddresses) {
        if (isValidIp(address)) {
            validAddresses.push(address);
        }
    }
    
    return validAddresses;
}

// Export functions for use in other modules
export {
    extractIpPrefixesFromJson,
    findAllIpAddresses,
    validateIpAddresses
};
