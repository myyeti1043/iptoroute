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
    const aggregateSubnets = typeof window.isAggregateSubnetsEnabled === 'function'
        ? window.isAggregateSubnetsEnabled()
        : (document.getElementById('aggregateSubnets') ? document.getElementById('aggregateSubnets').checked : false);
    
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

    const ipv4Ranges = [];
    const ipv6Ranges = [];

    for (const range of ipRanges) {
        if (range.includes(':')) {
            ipv6Ranges.push(range);
        } else {
            ipv4Ranges.push(range);
        }
    }

    const result = [...aggregateIpv4Ranges(ipv4Ranges), ...aggregateIpv6Ranges(ipv6Ranges)];
    console.log('Aggregation completed:', ipRanges.length, '->', result.length);
    return result;
}

/**
 * Aggregate IPv4 CIDR ranges.
 * Algorithm: parse → [start,end] intervals → sort → merge adjacent/overlapping
 * → decompose each merged interval into minimum valid CIDRs.
 * All arithmetic uses unsigned 32-bit numbers to avoid JS signed-integer issues.
 * @param {string[]} ipv4Ranges
 * @returns {string[]}
 */
function aggregateIpv4Ranges(ipv4Ranges) {
    if (!ipv4Ranges || ipv4Ranges.length === 0) return [];

    // Step 1: parse each CIDR to an unsigned [start, end] interval
    const intervals = [];
    for (const range of ipv4Ranges) {
        const slashIdx = range.indexOf('/');
        const ip = slashIdx >= 0 ? range.slice(0, slashIdx) : range;
        const prefix = slashIdx >= 0 ? parseInt(range.slice(slashIdx + 1), 10) : 32;

        const ipNum = ipToNumber(ip);
        if (ipNum === null || isNaN(prefix) || prefix < 0 || prefix > 32) continue;

        // Align to network boundary and compute end; use >>> 0 for unsigned safety
        const shift = 32 - prefix;
        const start = prefix === 0 ? 0 : ((ipNum >>> shift) << shift) >>> 0;
        const end = (start + Math.pow(2, shift) - 1) >>> 0;
        intervals.push([start, end]);
    }

    if (intervals.length === 0) return [];

    // Step 2: sort by start address (JS float handles 32-bit unsigned correctly)
    intervals.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    });

    // Step 3: single-pass merge of overlapping/adjacent intervals
    const merged = [[intervals[0][0], intervals[0][1]]];
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        const [s, e] = intervals[i];
        // adjacent condition: s === last[1] + 1, but last[1]+1 may overflow to
        // 4294967296 which is fine in JS float; s can be at most 4294967295
        if (s <= last[1] + 1) {
            if (e > last[1]) last[1] = e;
        } else {
            merged.push([s, e]);
        }
    }

    // Step 4: decompose each merged interval into minimum valid CIDR set
    const result = [];
    for (const [start, end] of merged) {
        ipv4IntervalToCidrs(start, end, result);
    }
    return result;
}

/**
 * Decompose an arbitrary IPv4 [start, end] interval into the minimum set of
 * valid (aligned) CIDR blocks and push them into `out`.
 * @param {number} start - unsigned 32-bit
 * @param {number} end   - unsigned 32-bit
 * @param {string[]} out
 */
function ipv4IntervalToCidrs(start, end, out) {
    let cur = start >>> 0;
    const last = end >>> 0;

    while (cur <= last) {
        // Count trailing zero bits of `cur` — this is the max alignment (block size = 2^bits)
        let bits;
        if (cur === 0) {
            bits = 32;
        } else {
            bits = 0;
            let n = cur;
            while ((n & 1) === 0 && bits < 32) { bits++; n >>>= 1; }
        }

        // Shrink block until it fits within [cur, last]
        while (bits > 0 && (cur + Math.pow(2, bits) - 1) >>> 0 > last) {
            bits--;
        }

        out.push(`${numberToIp(cur)}/${32 - bits}`);

        const blockSize = Math.pow(2, bits);
        cur = (cur + blockSize) >>> 0;
        if (cur === 0) break; // wrapped past 255.255.255.255
    }
}

// ---------------------------------------------------------------------------
// IPv6 aggregation
// ---------------------------------------------------------------------------

/**
 * Aggregate IPv6 CIDR ranges using BigInt-based interval merge + decomposition.
 * @param {string[]} ipv6Ranges
 * @returns {string[]}
 */
function aggregateIpv6Ranges(ipv6Ranges) {
    if (!ipv6Ranges || ipv6Ranges.length === 0) return [];

    const intervals = [];
    for (const range of ipv6Ranges) {
        const slashIdx = range.indexOf('/');
        const ip = slashIdx >= 0 ? range.slice(0, slashIdx) : range;
        const prefix = slashIdx >= 0 ? parseInt(range.slice(slashIdx + 1), 10) : 128;

        const ipNum = ipv6ToNumber(ip);
        if (ipNum === null || isNaN(prefix) || prefix < 0 || prefix > 128) continue;

        const shift = BigInt(128 - prefix);
        const mask = prefix === 0 ? 0n : ~((1n << shift) - 1n) & ((1n << 128n) - 1n);
        const start = ipNum & mask;
        const end = start + (1n << shift) - 1n;
        intervals.push([start, end]);
    }

    if (intervals.length === 0) return [];

    intervals.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));

    const merged = [[intervals[0][0], intervals[0][1]]];
    for (const [s, e] of intervals.slice(1)) {
        const last = merged[merged.length - 1];
        if (s <= last[1] + 1n) {
            if (e > last[1]) last[1] = e;
        } else {
            merged.push([s, e]);
        }
    }

    const result = [];
    for (const [start, end] of merged) {
        ipv6IntervalToCidrs(start, end, result);
    }
    return result;
}

/**
 * Decompose an IPv6 [start, end] BigInt interval into minimum valid CIDRs.
 */
function ipv6IntervalToCidrs(start, end, out) {
    let cur = start;

    while (cur <= end) {
        let bits = 0n;
        if (cur === 0n) {
            bits = 128n;
        } else {
            let n = cur;
            while ((n & 1n) === 0n && bits < 128n) { bits++; n >>= 1n; }
        }

        while (bits > 0n && cur + (1n << bits) - 1n > end) {
            bits--;
        }

        out.push(`${numberToIpv6(cur)}/${128n - bits}`);
        cur = cur + (1n << bits);
    }
}

/**
 * Expand IPv6 shorthand (::) to full 8-group form.
 * @param {string} ip
 * @returns {string}
 */
function expandIpv6(ip) {
    if (ip.includes('::')) {
        const [left, right] = ip.split('::');
        const leftGroups = left ? left.split(':') : [];
        const rightGroups = right ? right.split(':') : [];
        const missing = 8 - leftGroups.length - rightGroups.length;
        return [...leftGroups, ...Array(missing).fill('0'), ...rightGroups].join(':');
    }
    return ip;
}

/**
 * Parse an IPv6 address string to a BigInt.
 * @param {string} ip
 * @returns {BigInt|null}
 */
function ipv6ToNumber(ip) {
    try {
        const groups = expandIpv6(ip).split(':');
        if (groups.length !== 8) return null;
        let result = 0n;
        for (const g of groups) {
            const val = parseInt(g, 16);
            if (isNaN(val)) return null;
            result = (result << 16n) | BigInt(val);
        }
        return result;
    } catch {
        return null;
    }
}

/**
 * Convert a 128-bit BigInt to a compressed IPv6 string (RFC 5952).
 * @param {BigInt} num
 * @returns {string}
 */
function numberToIpv6(num) {
    const groups = [];
    for (let i = 0; i < 8; i++) {
        groups.unshift((num & 0xFFFFn).toString(16));
        num >>= 16n;
    }

    // Find the longest run of '0' groups for :: compression
    let bestStart = -1, bestLen = 0, curStart = -1, curLen = 0;
    for (let i = 0; i < 8; i++) {
        if (groups[i] === '0') {
            if (curStart < 0) { curStart = i; curLen = 1; }
            else curLen++;
            if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
        } else {
            curStart = -1; curLen = 0;
        }
    }

    if (bestLen < 2) return groups.join(':');

    const left = groups.slice(0, bestStart).join(':');
    const right = groups.slice(bestStart + bestLen).join(':');
    return `${left}::${right}`;
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
