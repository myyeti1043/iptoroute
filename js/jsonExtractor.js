/**
 * JSON Extractor Module
 * Contains functions for extracting IP addresses from JSON data
 */

// 不再使用import，因为ipConverters.js已经将这些函数添加到了window对象上
// import { isValidIp, isValidMask, convertIpMaskToCidr, maskToCidrMap } from './ipConverters.js';

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
    const aggregateSubnets = document.getElementById('aggregateSubnets') ? document.getElementById('aggregateSubnets').checked : false;
    
    console.log('Options - ipv4Only:', ipv4Only, 'removeDuplicates:', removeDuplicates, 'aggregateSubnets:', aggregateSubnets);
    
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
                const results = removeDuplicates ? [...new Set(directIps)] : directIps;
                updateResultsStats(results.length);
                return results;
            }
        }
        
        // Validate the found IP addresses
        console.time('Validating IP addresses');
        const validatedAddresses = validateIpAddresses(ipAddresses);
        console.timeEnd('Validating IP addresses');
        console.log('Valid IP addresses:', validatedAddresses.length);
        
        // Remove duplicates if option is selected
        let results = removeDuplicates ? [...new Set(validatedAddresses)] : validatedAddresses;
        
        // Aggregate subnets if option is selected
        if (aggregateSubnets && results.length > 0) {
            console.log('Aggregation enabled - starting aggregation process');
            console.time('Aggregating subnets');
            const originalCount = results.length;
            results = aggregateIpRanges(results);
            console.timeEnd('Aggregating subnets');
            console.log('Aggregated results: original =', originalCount, ', aggregated =', results.length);
        } else {
            console.log('Aggregation skipped - aggregateSubnets:', aggregateSubnets, ', results.length:', results.length);
        }
        
        console.log('Final results count:', results.length);
        
        // Update statistics display
        updateResultsStats(results.length);
        
        return results;
    } catch (e) {
        console.error('Error in IP extraction process:', e);
        // Even if there's an error, try to return any IPs we found
        const directSearch = findAllIpAddresses(typeof jsonData === 'string' ? jsonData : JSON.stringify(jsonData), ipv4Only);
        if (directSearch.length > 0) {
            console.log('Found IPs through direct search after error:', directSearch.length);
            updateResultsStats(directSearch.length);
            return directSearch;
        }
        updateResultsStats(0);
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
    // 修改正则表达式，避免匹配明显的子网掩码模式
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
                // 更严格的子网掩码检查逻辑
                const isSubnetMask = isNetmaskLikeAddress(ip);
                
                if (!isSubnetMask && !ipAddresses.includes(ip + '/32')) {
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
 * 检查IP地址是否看起来像子网掩码
 * @param {string} ip - IP地址字符串
 * @returns {boolean} - 如果看起来像子网掩码则返回true
 */
function isNetmaskLikeAddress(ip) {
    // 检查是否在预定义的掩码映射表中
    if (ip in window.maskToCidrMap) {
        return true;
    }
    
    // 验证IP格式
    if (!ip || !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
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
    // 有效的掩码例如：11111111111111111111111100000000 (/24)
    //                11111111111111110000000000000000 (/16)  
    //                11110000000000000000000000000000 (/4)
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
    const hasZeros = binaryMask.includes('0');
    
    // 如果只有1或只有0，且符合掩码模式，就是有效掩码
    return hasOnes || binaryMask === '00000000000000000000000000000000';
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
        if (window.isValidIp(ip) && window.isValidMask(mask)) {
            // 转换为CIDR格式
            const cidr = window.convertIpMaskToCidr(`${ip} ${mask}`);
            
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
        if (window.isValidIp(address)) {
            validAddresses.push(address);
        }
    }
    
    return validAddresses;
}

/**
 * Aggregate overlapping or adjacent IP ranges
 * @param {string[]} ipRanges - Array of IP ranges in CIDR notation
 * @returns {string[]} - Array of aggregated IP ranges
 */
function aggregateIpRanges(ipRanges) {
    console.log('Starting aggregation for', ipRanges.length, 'IP ranges');
    
    if (!ipRanges || ipRanges.length === 0) {
        return [];
    }
    
    // Separate IPv4 and IPv6 addresses
    const ipv4Ranges = [];
    const ipv6Ranges = [];
    
    for (const range of ipRanges) {
        if (range.includes(':')) {
            ipv6Ranges.push(range);
        } else {
            ipv4Ranges.push(range);
        }
    }
    
    // Aggregate IPv4 ranges
    const aggregatedIpv4 = aggregateIpv4Ranges(ipv4Ranges);
    
    // For IPv6, just remove duplicates for now (complex aggregation would require more sophisticated algorithm)
    const aggregatedIpv6 = [...new Set(ipv6Ranges)];
    
    const result = [...aggregatedIpv4, ...aggregatedIpv6];
    console.log('Aggregation completed:', ipRanges.length, '->', result.length);
    
    return result;
}

/**
 * Aggregate IPv4 ranges specifically
 * @param {string[]} ipv4Ranges - Array of IPv4 ranges in CIDR notation
 * @returns {string[]} - Array of aggregated IPv4 ranges
 */
function aggregateIpv4Ranges(ipv4Ranges) {
    if (!ipv4Ranges || ipv4Ranges.length === 0) {
        return [];
    }
    
    // Parse and sort IP ranges
    const parsedRanges = ipv4Ranges.map(range => {
        const [ip, cidr] = range.split('/');
        const cidrNum = parseInt(cidr, 10);
        const ipNum = ipToNumber(ip);
        const networkSize = Math.pow(2, 32 - cidrNum);
        const networkStart = ipNum & (0xFFFFFFFF << (32 - cidrNum));
        const networkEnd = networkStart + networkSize - 1;
        
        return {
            original: range,
            ip: ip,
            cidr: cidrNum,
            ipNum: ipNum,
            networkStart: networkStart,
            networkEnd: networkEnd,
            networkSize: networkSize
        };
    }).filter(range => range.ipNum !== null);
    
    // Sort by network start address
    parsedRanges.sort((a, b) => a.networkStart - b.networkStart);
    
    const aggregated = [];
    
    for (let i = 0; i < parsedRanges.length; i++) {
        let current = parsedRanges[i];
        
        // Look for ranges that can be merged with current
        for (let j = i + 1; j < parsedRanges.length; j++) {
            const next = parsedRanges[j];
            
            // Check if ranges overlap or are adjacent
            if (next.networkStart <= current.networkEnd + 1) {
                // Merge ranges by expanding current to include next
                current.networkEnd = Math.max(current.networkEnd, next.networkEnd);
                
                // Try to find the optimal CIDR that covers the merged range
                const mergedRange = findOptimalCidr(current.networkStart, current.networkEnd);
                if (mergedRange) {
                    current = mergedRange;
                }
                
                // Remove the merged range
                parsedRanges.splice(j, 1);
                j--; // Adjust index since we removed an element
            } else {
                break; // No more overlapping ranges (since array is sorted)
            }
        }
        
        aggregated.push(current);
    }
    
    // Convert back to CIDR notation
    return aggregated.map(range => {
        const ip = numberToIp(range.networkStart);
        return `${ip}/${range.cidr}`;
    });
}

/**
 * Find optimal CIDR notation for a range of IP addresses
 * @param {number} startIp - Start IP address as number
 * @param {number} endIp - End IP address as number
 * @returns {Object|null} - Object with optimal CIDR info or null
 */
function findOptimalCidr(startIp, endIp) {
    const rangeSize = endIp - startIp + 1;
    
    // Find the largest power of 2 that fits in the range
    let cidrBits = 32;
    let networkSize = 1;
    
    while (networkSize < rangeSize && cidrBits > 0) {
        cidrBits--;
        networkSize *= 2;
    }
    
    // Make sure the network start is aligned to the network size
    const mask = 0xFFFFFFFF << (32 - cidrBits);
    const alignedStart = startIp & mask;
    
    // Check if the aligned network covers the entire range
    if (alignedStart <= startIp && (alignedStart + networkSize - 1) >= endIp) {
        return {
            networkStart: alignedStart,
            networkEnd: alignedStart + networkSize - 1,
            cidr: cidrBits,
            networkSize: networkSize
        };
    }
    
    // If perfect alignment isn't possible, return the original range with appropriate CIDR
    cidrBits = 32 - Math.floor(Math.log2(rangeSize));
    return {
        networkStart: startIp,
        networkEnd: endIp,
        cidr: Math.max(0, cidrBits),
        networkSize: Math.pow(2, 32 - Math.max(0, cidrBits))
    };
}

/**
 * Convert IP address string to number
 * @param {string} ip - IP address string
 * @returns {number|null} - IP address as number or null if invalid
 */
function ipToNumber(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;
    
    let result = 0;
    for (let i = 0; i < 4; i++) {
        const part = parseInt(parts[i], 10);
        if (isNaN(part) || part < 0 || part > 255) return null;
        result = (result << 8) + part;
    }
    return result >>> 0; // Convert to unsigned 32-bit integer
}

/**
 * Convert number to IP address string
 * @param {number} num - IP address as number
 * @returns {string} - IP address string
 */
function numberToIp(num) {
    return [
        (num >>> 24) & 0xFF,
        (num >>> 16) & 0xFF,
        (num >>> 8) & 0xFF,
        num & 0xFF
    ].join('.');
}

/**
 * Update the results statistics display
 * @param {number} count - Number of processed entries
 */
function updateResultsStats(count) {
    const statsElement = document.getElementById('resultsStats');
    const statsCountElement = document.getElementById('statsCount');
    
    if (statsElement && statsCountElement) {
        statsCountElement.textContent = count;
        statsElement.style.display = count > 0 ? 'block' : 'none';
    }
}

// 将所有函数添加到window对象上
window.extractIpPrefixesFromJson = extractIpPrefixesFromJson;
window.findAllIpAddresses = findAllIpAddresses;
window.isNetmaskLikeAddress = isNetmaskLikeAddress;
window.extractIpFromCiscoRoute = extractIpFromCiscoRoute;
window.validateIpAddresses = validateIpAddresses;
window.aggregateIpRanges = aggregateIpRanges;
window.aggregateIpv4Ranges = aggregateIpv4Ranges;
window.findOptimalCidr = findOptimalCidr;
window.ipToNumber = ipToNumber;
window.numberToIp = numberToIp;
window.updateResultsStats = updateResultsStats;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('jsonExtractor');
}
