/**
 * Web Worker for IP address processing
 * This worker handles IP extraction, validation, and conversion tasks
 */

// Function to extract IP addresses from text
function extractIpsWorker(text, ipv4Only = false) {
    if (!text || typeof text !== 'string') {
        return [];
    }
    
    const results = [];
    
    // IPv4 CIDR pattern: matches patterns like 192.168.1.0/24
    const ipv4CidrPattern = /\b(?:\d{1,3}\.){3}\d{1,3}\/\d{1,2}\b/g;
    
    // IPv4 pattern: matches patterns like 192.168.1.1
    const ipv4Pattern = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    
    // Extract IPv4 CIDR blocks
    const ipv4CidrMatches = text.match(ipv4CidrPattern) || [];
    
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
    const ipv4Matches = text.match(ipv4Pattern) || [];
    
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
        const ipv6CidrMatches = text.match(ipv6CidrPattern) || [];
        results.push(...ipv6CidrMatches);
        
        // Extract IPv6 addresses
        const ipv6Matches = text.match(ipv6Pattern) || [];
        
        // Filter out IPv6 addresses that are already part of CIDR blocks
        for (const match of ipv6Matches) {
            if (!ipv6CidrMatches.some(cidr => cidr.startsWith(match + '/'))) {
                results.push(match);
            }
        }
    }
    
    return results;
}

// Function to validate IP addresses
function bulkValidateIps(ips) {
    if (!Array.isArray(ips) || ips.length === 0) {
        return [];
    }
    
    return ips.map(ip => ({
        original: ip,
        valid: isValidIpOrCidr(ip),
        type: ip.includes(':') ? 'ipv6' : 'ipv4'
    }));
}

// Function to convert IP and netmask to CIDR
function convertToCidr(ips, netmasks) {
    if (!Array.isArray(ips) || ips.length === 0) {
        return [];
    }
    
    const results = [];
    
    for (let i = 0; i < ips.length; i++) {
        const ip = ips[i];
        const mask = netmasks[i] || '255.255.255.255';
        
        if (!isValidIp(ip) || !isValidMask(mask)) {
            results.push('');
            continue;
        }
        
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
    
    return results;
}

// Helper function to check if an IP or CIDR is valid
function isValidIpOrCidr(input) {
    if (input.includes('/')) {
        const [ip, cidr] = input.split('/');
        const cidrNum = parseInt(cidr, 10);
        return isValidIp(ip) && !isNaN(cidrNum) && cidrNum >= 0 && cidrNum <= (input.includes(':') ? 128 : 32);
    } else {
        return isValidIp(input);
    }
}

// Function to check if an IP address is valid
function isValidIp(ip) {
    if (!ip || typeof ip !== 'string') {
        return false;
    }
    
    // Check if it's an IPv6 address
    if (ip.includes(':')) {
        // Simple IPv6 validation
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}$|^(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}$|^(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}$|^:(?::[0-9a-fA-F]{1,4}){1,7}$|^::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])$|^(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/;
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

// Function to check if a netmask is valid
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

// Set up message handler for the worker
self.onmessage = function(e) {
    const { action, data } = e.data;
    
    try {
        let result;
        
        // Process the message based on the action
        if (action === 'extractIps') {
            const { text, ipv4Only } = data;
            result = extractIpsWorker(text, ipv4Only);
        } else if (action === 'validateIps') {
            const { ips } = data;
            result = bulkValidateIps(ips);
        } else if (action === 'convertToCidr') {
            const { ips, netmasks } = data;
            result = convertToCidr(ips, netmasks);
        } else {
            throw new Error(`Unknown action: ${action}`);
        }
        
        // Send the result back to the main thread
        self.postMessage({
            action,
            data: result
        });
    } catch (error) {
        // Send any errors back to the main thread
        self.postMessage({
            action,
            error: error.message
        });
    }
};
