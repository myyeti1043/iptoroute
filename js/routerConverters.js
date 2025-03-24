/**
 * Router Converters Module
 * Contains functions for converting IP addresses to router-specific configurations
 */

// Import necessary functions from ipConverters
import { cidrToMaskMap, isValidIp, isValidMask } from './ipConverters.js';

/**
 * Convert CIDR notation to Cisco IOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24)
 * @returns {string|null} - Cisco IOS configuration or null if invalid
 */
function convertCidrToCisco(line) {
    // Match IP/CIDR pattern
    const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
    if (!match) return null;

    const ip = match[1];
    const cidr = parseInt(match[2]);

    // Validate IP and CIDR
    if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

    const mask = cidrToMaskMap[cidr];
    const nextHop = document.getElementById('nextHopIp').value.trim() || 'Null0';
    const routeName = document.getElementById('routeName').value.trim() || 'CN';

    return `ip route ${ip} ${mask} ${nextHop} name ${routeName}`;
}

/**
 * Convert CIDR notation to MikroTik RouterOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24)
 * @returns {string|null} - RouterOS configuration or null if invalid
 */
function convertCidrToRouterOs(line) {
    // Match IP/CIDR pattern
    const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
    if (!match) return null;

    const ip = match[1];
    const cidr = parseInt(match[2]);

    // Validate IP and CIDR
    if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

    // Get the list name from the input field
    const listName = document.getElementById('listName').value || 'CN';
    
    // Get the gateway from the input field
    const gateway = document.getElementById('routerosGateway').value || '192.168.1.1';
    
    // Check which type is selected
    const routerosType = document.querySelector('input[name="routeros-type"]:checked').value;

    if (routerosType === 'address-list') {
        // Generate address-list command
        return `/ip firewall address-list add address=${ip}/${cidr} list=${listName}`;
    } else if (routerosType === 'route') {
        // Generate route command
        return `/ip route add dst-address=${ip}/${cidr} gateway=${gateway}`;
    }
    
    // Default to address-list if something goes wrong
    return `/ip firewall address-list add address=${ip}/${cidr} list=${listName}`;
}

/**
 * Convert CIDR notation to Huawei VRP format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24)
 * @returns {string|null} - Huawei VRP configuration or null if invalid
 */
function convertCidrToHuawei(line) {
    // Match IP/CIDR pattern
    const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
    if (!match) return null;

    const ip = match[1];
    const cidr = parseInt(match[2]);

    // Validate IP and CIDR
    if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

    const nextHop = document.getElementById('huaweiNextHop').value.trim() || 'Null0';
    if (!isValidIp(nextHop) && nextHop !== 'Null0') return null;

    const mask = cidrToMaskMap[cidr];
    return `ip route-static ${ip} ${mask} ${nextHop}`;
}

/**
 * Convert CIDR notation to Juniper JunOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24)
 * @returns {string|null} - Juniper JunOS configuration or null if invalid
 */
function convertCidrToJuniper(line) {
    // Match IP/CIDR pattern
    const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
    if (!match) return null;

    const ip = match[1];
    const cidr = parseInt(match[2]);

    // Validate IP and CIDR
    if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

    const nextHop = document.getElementById('juniperNextHop').value.trim() || 'reject';
    if (!isValidIp(nextHop) && nextHop !== 'reject') return null;

    // 为Juniper路由器使用不同的命令格式，取决于是否使用IP地址或reject作为下一跳
    if (nextHop === 'reject') {
        return `set routing-options static route ${ip}/${cidr} reject`;
    } else {
        return `set routing-options static route ${ip}/${cidr} next-hop ${nextHop}`;
    }
}

/**
 * Convert CIDR notation or FQDN to Fortinet FortiOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24) or FQDN
 * @returns {string|null} - Fortinet FortiOS configuration or null if invalid
 */
function convertCidrToFortinet(line) {
    // 检查输入是否为域名 (FQDN)
    // 使用更严格的域名正则表达式
    const fqdnPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;
    
    // 检查是否为有效域名
    let isFqdn = false;
    if (fqdnPattern.test(line) && !line.match(/^(\d+\.\d+\.\d+\.\d+)$/)) {
        // 进一步验证域名的各个部分
        const parts = line.split('.');
        // 检查顶级域名
        const tld = parts[parts.length - 1];
        if (!/^\d+$/.test(tld) && !/\d+[a-z]+$/.test(tld)) {
            // 检查域名的每一部分
            let allPartsValid = true;
            for (const part of parts) {
                // 域名部分不能是纯数字
                if (/^\d+$/.test(part)) {
                    allPartsValid = false;
                    break;
                }
            }
            isFqdn = allPartsValid;
        }
    }
    
    let addrName, addrConfig;
    
    if (isFqdn) {
        // Handle FQDN
        addrName = line.replace(/\./g, '_');
        addrConfig = `config firewall address
    edit "${line}"
        set type fqdn
        set fqdn "${line}"
    next
end`;
    } else {
        // Handle IP/CIDR
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        const ip = match[1];
        const cidr = parseInt(match[2]);

        // Validate IP and CIDR
        if (!isValidIp(ip) || cidr < 0 || cidr > 32) return null;

        // Get the address name by replacing dots with underscores
        addrName = `${ip.replace(/\./g, '_')}_${cidr}`;
        
        addrConfig = `config firewall address
    edit "${addrName}"
        set subnet ${ip} ${cidrToMaskMap[cidr]}
    next
end`;
    }
    
    // Get the fortinet type (address or addrgrp)
    const fortinetType = document.querySelector('input[name="fortinet-type"]:checked').value;
    const addrGroupName = document.getElementById('addrGroupName').value.trim() || 'IP_Group';
    
    // Create the configuration based on the type
    if (fortinetType === 'address') {
        return addrConfig;
    } else {
        return `${addrConfig}
config firewall addrgrp
    edit ${addrGroupName}
        append member "${isFqdn ? line : addrName}"
    next
end`;
    }
}

/**
 * Extract IP and netmask from Cisco route command
 * @param {string} route - Cisco route command
 * @returns {Object|null} - Extracted IP and mask, or null if invalid
 */
function extractIpFromCiscoRoute(route) {
    // Match pattern like: ip route 192.168.1.0 255.255.255.0 192.168.0.1 name CN
    const match = route.match(/ip route (\d+\.\d+\.\d+\.\d+) (\d+\.\d+\.\d+\.\d+)/);
    
    if (!match) {
        return null;
    }
    
    const [, ip, mask] = match;
    
    // Validate IP and mask
    if (!isValidIp(ip) || !isValidMask(mask)) {
        return null;
    }
    
    return { ip, mask };
}

// Export functions for use in other modules
export {
    convertCidrToCisco,
    convertCidrToRouterOs,
    convertCidrToHuawei,
    convertCidrToJuniper,
    convertCidrToFortinet,
    extractIpFromCiscoRoute
};
