/**
 * IP Converters Module
 * Contains functions for IP address conversion and validation
 */

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

// Mapping of netmask to CIDR
const maskToCidrMap = {
    "255.255.255.255": 32,
    "255.255.255.254": 31,
    "255.255.255.252": 30,
    "255.255.255.248": 29,
    "255.255.255.240": 28,
    "255.255.255.224": 27,
    "255.255.255.192": 26,
    "255.255.255.128": 25,
    "255.255.255.0": 24,
    "255.255.254.0": 23,
    "255.255.252.0": 22,
    "255.255.248.0": 21,
    "255.255.240.0": 20,
    "255.255.224.0": 19,
    "255.255.192.0": 18,
    "255.255.128.0": 17,
    "255.255.0.0": 16,
    "255.254.0.0": 15,
    "255.252.0.0": 14,
    "255.248.0.0": 13,
    "255.240.0.0": 12,
    "255.224.0.0": 11,
    "255.192.0.0": 10,
    "255.128.0.0": 9,
    "255.0.0.0": 8,
    "254.0.0.0": 7,
    "252.0.0.0": 6,
    "248.0.0.0": 5,
    "240.0.0.0": 4,
    "224.0.0.0": 3,
    "192.0.0.0": 2,
    "128.0.0.0": 1,
    "0.0.0.0": 0
};

/**
 * Convert CIDR notation to IP with netmask format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24)
 * @returns {string} - IP with netmask (e.g., 192.168.1.0 255.255.255.0)
 */
function convertCidrToIpMask(line) {
    const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
    if (!match) {
        throw new Error('Invalid CIDR format');
    }
    
    const [, ip, cidr] = match;
    const mask = cidrToMaskMap[cidr];
    
    if (!mask) {
        throw new Error('Invalid CIDR value');
    }
    
    return `${ip} ${mask}`;
}

/**
 * Convert IP with netmask to CIDR notation
 * @param {string} line - IP with netmask (e.g., 192.168.1.0 255.255.255.0)
 * @returns {string} - CIDR notation (e.g., 192.168.1.0/24)
 */
function convertIpMaskToCidr(line) {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 2) {
        throw new Error('Invalid IP and mask format');
    }
    
    const [ip, mask] = parts;
    
    if (!isValidIp(ip)) {
        throw new Error('Invalid IP address');
    }
    
    if (!isValidMask(mask)) {
        throw new Error('Invalid netmask');
    }
    
    const cidr = maskToCidrMap[mask];
    if (cidr === undefined) {
        throw new Error('Invalid netmask value');
    }
    
    return `${ip}/${cidr}`;
}

/**
 * Convert IP and mask to CIDR format
 * @param {string} ip - IP address
 * @param {string} mask - Netmask
 * @returns {string} - CIDR notation
 */
function convertIpMaskToCidrFormat(ip, mask) {
    // 验证IP地址和子网掩码的有效性
    if (!isValidIp(ip) || !isValidMask(mask)) {
        throw new Error('Invalid IP or mask format');
    }
    
    // 尝试使用映射表快速查找
    const cidr = maskToCidrMap[mask];
    if (cidr !== undefined) {
        return `${ip}/${cidr}`;
    }
    
    // 如果映射表中没有，手动计算CIDR前缀
    const maskParts = mask.split('.');
    let cidrPrefix = 0;
    
    for (const part of maskParts) {
        const num = parseInt(part, 10);
        // 计算每个部分中的1的个数
        for (let i = 7; i >= 0; i--) {
            if (num & (1 << i)) {
                cidrPrefix++;
            } else {
                break;
            }
        }
    }
    
    return `${ip}/${cidrPrefix}`;
}

/**
 * Extract IP from a line of text
 * @param {string} line - Line of text that may contain an IP address
 * @returns {string|null} - Extracted IP or null if not found
 */
function extractIp(line) {
    // 检查输入是否为有效字符串
    if (!line || typeof line !== 'string') {
        return null;
    }
    
    // Extract IP from various formats
    const ipMatch = line.match(/(\d+\.\d+\.\d+\.\d+)/);
    return ipMatch ? ipMatch[1] : null;
}

/**
 * Check if a string is a valid IP address
 * @param {string} ip - IP address to validate
 * @returns {boolean} - True if valid IP
 */
function isValidIp(ip) {
    if (!ip || typeof ip !== 'string') {
        return false;
    }
    
    // 移除前后空白
    ip = ip.trim();
    
    // 检查特殊情况：localhost
    if (ip === 'localhost') return true;
    
    // 检查是否是CIDR格式
    if (ip.includes('/')) {
        const parts = ip.split('/');
        if (parts.length !== 2) {
            return false;
        }
        
        const [ipPart, cidrPart] = parts;
        const cidr = parseInt(cidrPart, 10);
        
        // 验证CIDR值
        if (isNaN(cidr) || cidr < 0 || cidr > 32) {
            return false;
        }
        
        // 继续验证IP部分
        ip = ipPart;
    }
    
    // 检查IPv4格式
    if (ip.includes('.')) {
        const parts = ip.split('.');
        
        // 必须是4段
        if (parts.length !== 4) return false;
        
        // 检查每段是否是有效的数字
        for (const part of parts) {
            // 检查是否包含非数字字符
            if (!/^\d+$/.test(part)) return false;
            
            // 检查范围
            const num = parseInt(part, 10);
            
            // 检查前导零（除非是单独的零）
            if (part.length > 1 && part.startsWith('0')) return false;
            
            // 检查范围
            if (isNaN(num) || num < 0 || num > 255) return false;
        }
        
        return true;
    }
    
    // 简单验证IPv6格式
    if (ip.includes(':')) {
        // 检查最基本的IPv6格式要求
        const segments = ip.split(':');
        
        // IPv6地址最多有8段（如果有双冒号::，则可能更少）
        if (segments.length > 8) return false;
        
        // 检查双冒号（::）的数量，最多只能有一个
        const doubleColonCount = (ip.match(/::/g) || []).length;
        if (doubleColonCount > 1) return false;
        
        // 如果有双冒号并且段数已经是8，那就是无效的
        if (doubleColonCount === 1 && segments.length === 8) return false;
        
        // 检查每段是否是有效的十六进制
        for (let segment of segments) {
            // 处理空段（可能出现在双冒号中）
            if (segment === '') continue;
            
            // 每段最多4个十六进制字符
            if (segment.length > 4) return false;
            
            // 检查是否是有效的十六进制
            if (!/^[0-9A-Fa-f]+$/.test(segment)) return false;
        }
        
        return true;
    }
    
    return false;
}

/**
 * Validate if a string is a valid netmask
 * @param {string} mask - Netmask to validate
 * @returns {boolean} - True if valid netmask
 */
function isValidMask(mask) {
    if (!mask || typeof mask !== 'string') {
        return false;
    }
    
    // 移除前后空白
    mask = mask.trim();
    
    // 检查是否是预定义的掩码
    if (maskToCidrMap && mask in maskToCidrMap) {
        return true;
    }
    
    // 检查是否是有效的IP格式
    if (!isValidIp(mask)) {
        return false;
    }
    
    // 将IP格式转换为二进制字符串
    const parts = mask.split('.').map(part => parseInt(part, 10));
    let binary = '';
    
    for (const part of parts) {
        binary += part.toString(2).padStart(8, '0');
    }
    
    // 检查是否是连续的1后跟连续的0（有效的子网掩码模式）
    // 有效掩码：11111111.11111111.11111111.00000000 (255.255.255.0)
    // 无效掩码：11111111.11111111.11110111.00000000 (255.255.247.0)
    return /^1*0*$/.test(binary);
}

/**
 * Compare two IP addresses for sorting
 * @param {string} a - First IP address
 * @param {string} b - Second IP address
 * @returns {number} - Comparison result
 */
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

/**
 * Validate a list of IP addresses
 * @param {string[]} ipAddresses - Array of IP addresses to validate
 * @returns {Object} - Validation result with valid flag and message
 */
function validateIpAddresses(ipAddresses) {
    if (!ipAddresses || !Array.isArray(ipAddresses) || ipAddresses.length === 0) {
        return {
            valid: false,
            message: 'No IP addresses provided'
        };
    }
    
    const invalidIPs = [];
    
    for (let i = 0; i < ipAddresses.length; i++) {
        const ip = ipAddresses[i];
        
        // Skip empty lines
        if (!ip.trim()) {
            continue;
        }
        
        // Check for CIDR notation
        if (ip.includes('/')) {
            const parts = ip.split('/');
            if (parts.length !== 2) {
                invalidIPs.push({ line: i + 1, ip, reason: 'Invalid CIDR format' });
                continue;
            }
            
            const [ipPart, cidrPart] = parts;
            const cidr = parseInt(cidrPart, 10);
            
            // Validate IP part
            if (!isValidIp(ipPart)) {
                invalidIPs.push({ line: i + 1, ip, reason: 'Invalid IP address in CIDR' });
                continue;
            }
            
            // Validate CIDR part
            if (isNaN(cidr) || cidr < 0 || cidr > 32) {
                invalidIPs.push({ line: i + 1, ip, reason: 'Invalid CIDR value (must be 0-32)' });
                continue;
            }
        } 
        // Check for IP with netmask format
        else if (ip.includes(' ')) {
            const parts = ip.split(/\s+/);
            if (parts.length !== 2) {
                invalidIPs.push({ line: i + 1, ip, reason: 'Invalid IP and mask format' });
                continue;
            }
            
            const [ipPart, maskPart] = parts;
            
            // Validate IP part
            if (!isValidIp(ipPart)) {
                invalidIPs.push({ line: i + 1, ip, reason: 'Invalid IP address' });
                continue;
            }
            
            // Validate mask part
            if (!isValidMask(maskPart)) {
                invalidIPs.push({ line: i + 1, ip, reason: 'Invalid netmask' });
                continue;
            }
        }
        // Regular IP address
        else if (!isValidIp(ip)) {
            invalidIPs.push({ line: i + 1, ip, reason: 'Invalid IP address format' });
            continue;
        }
    }
    
    if (invalidIPs.length > 0) {
        // Format error message
        const errorDetails = invalidIPs.map(item => 
            `Line ${item.line}: "${item.ip}" - ${item.reason}`
        ).join('\n');
        
        return {
            valid: false,
            message: `Found ${invalidIPs.length} invalid IP address(es):\n${errorDetails}`
        };
    }
    
    return {
        valid: true,
        message: 'All IP addresses are valid'
    };
}

/**
 * 计算网络地址
 * @param {string} ip - IP地址
 * @param {string} mask - 子网掩码
 * @returns {string} - 网络地址
 */
function getNetworkAddress(ip, mask) {
    // 将IP地址和子网掩码转换为整数
    const ipParts = ip.split('.').map(part => parseInt(part, 10));
    const maskParts = mask.split('.').map(part => parseInt(part, 10));
    
    // 计算网络地址
    const networkParts = [];
    for (let i = 0; i < 4; i++) {
        networkParts.push(ipParts[i] & maskParts[i]);
    }
    
    // 返回网络地址
    return networkParts.join('.');
}

// 将所有函数添加到window对象上
window.cidrToMaskMap = cidrToMaskMap;
window.maskToCidrMap = maskToCidrMap;
window.convertCidrToIpMask = convertCidrToIpMask;
window.convertIpMaskToCidr = convertIpMaskToCidr;
window.convertIpMaskToCidrFormat = convertIpMaskToCidrFormat;
window.extractIp = extractIp;
window.isValidIp = isValidIp;
window.isValidMask = isValidMask;
window.compareIPs = compareIPs;
window.validateIpAddresses = validateIpAddresses;
window.getNetworkAddress = getNetworkAddress;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('ipConverters');
}
