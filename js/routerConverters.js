/**
 * Router Converters Module
 * Contains functions for converting IP addresses to router-specific configurations
 */


/**
 * Convert CIDR notation to Cisco IOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24) or IP address
 * @returns {string|null} - Cisco IOS configuration or null if invalid
 */
function convertCidrToCisco(line) {
    let ip, mask, gateway, name, cidr;

    // 1) 如果是 Cisco 格式： ip route x.x.x.x y.y.y.y z.z.z.z [ name ABC ]
    if (line.trim().startsWith('ip route ')) {
        const routeMatch = line.match(/ip route (\d+\.\d+\.\d+\.\d+) (\d+\.\d+\.\d+\.\d+) (\d+\.\d+\.\d+\.\d+)(?:\s+name\s+(\w+))?/);
        if (routeMatch) {
            const [, routeIp, routeMask, routeGateway, routeName] = routeMatch;

            // 验证 IP、掩码和网关
            if (!window.isValidIp(routeIp) || !window.isValidMask(routeMask) || !window.isValidIp(routeGateway)) {
                return null;
            }

            ip = routeIp;
            mask = routeMask;
            gateway = routeGateway;
            name = routeName;
            cidr = window.maskToCidrMap[mask];
        } else {
            return null;
        }

    // 2) 如果包含斜杠： x.x.x.x/NN
    } else if (line.includes('/')) {
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        ip = match[1];
        cidr = parseInt(match[2], 10);

        if (!window.isValidIp(ip) || cidr < 0 || cidr > 32) return null;

        mask = window.cidrToMaskMap[cidr];
        if (!mask) return null;

        if (cidr < 32) {
            ip = window.getNetworkAddress(ip, mask);
        }

    // 3) 如果是空格分隔（可能是 "ip mask" 或 "ip mask gateway"）
    } else if (line.includes(' ')) {
        const parts = line.trim().split(/\s+/);

        if (parts.length === 2) {
            // 3.1) IP + MASK
            const [ipPart, maskPart] = parts;
            if (!window.isValidIp(ipPart) || !window.isValidMask(maskPart)) return null;

            ip = ipPart;
            mask = maskPart;
            cidr = window.maskToCidrMap[mask];

            if (cidr < 32) {
                ip = window.getNetworkAddress(ip, mask);
            }

            // 默认网关还需从页面获取或设一个缺省值
            gateway = document.getElementById('ciscoGateway')?.value.trim()
                       || document.getElementById('nextHopIp')?.value.trim()
                       || '192.168.1.1';

        } else if (parts.length === 3) {
            // 3.2) IP + MASK + GATEWAY
            const [ipPart, maskPart, gwPart] = parts;

            if (!window.isValidIp(ipPart) || !window.isValidMask(maskPart) || !window.isValidIp(gwPart)) {
                return null;
            }

            ip = ipPart;
            mask = maskPart;
            gateway = gwPart;
            cidr = window.maskToCidrMap[mask];

            if (cidr < 32) {
                ip = window.getNetworkAddress(ip, mask);
            }

        } else {
            // 其它分段数不支持
            return null;
        }

    // 4) 否则当作单个 IP (/32)
    } else {
        ip = line;
        mask = '255.255.255.255';
        cidr = 32;

        if (!window.isValidIp(ip)) return null;

        // 默认网关同上
        gateway = document.getElementById('ciscoGateway')?.value.trim()
                   || document.getElementById('nextHopIp')?.value.trim()
                   || '192.168.1.1';
    }

    // 最终生成 Cisco 配置
    const routeName = name
        || document.getElementById('routeName')?.value.trim()
        || 'CN';

    // gateway 如果之前没取到，最后再兜底一下
    gateway = gateway
        || document.getElementById('ciscoGateway')?.value.trim()
        || document.getElementById('nextHopIp')?.value.trim()
        || '192.168.1.1';

    return `ip route ${ip} ${mask} ${gateway} name ${routeName}`;
}

/**
 * Convert CIDR notation to MikroTik RouterOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24) or IP address
 * @returns {string|null} - MikroTik RouterOS configuration or null if invalid
 */
function convertCidrToRouterOs(line) {
    let ip, cidr, gateway;
    
    // 检查是否是Cisco格式的路由命令
    if (line.trim().startsWith('ip route ')) {
        const routeMatch = line.match(/ip route (\d+\.\d+\.\d+\.\d+) (\d+\.\d+\.\d+\.\d+) (\d+\.\d+\.\d+\.\d+)/);
        if (routeMatch) {
            const [, routeIp, mask, routeGateway] = routeMatch;
            
            // 验证IP、掩码和网关的有效性
            if (!window.isValidIp(routeIp) || !window.isValidMask(mask) || !window.isValidIp(routeGateway)) {
                return null;
            }
            
            // 将IP和掩码转换为CIDR格式
            try {
                const cidrNotation = window.convertIpMaskToCidrFormat(routeIp, mask);
                const [cidrIp, cidrPrefix] = cidrNotation.split('/');
                ip = cidrIp;
                cidr = parseInt(cidrPrefix);
                gateway = routeGateway;
            } catch (error) {
                console.warn('Error converting Cisco route to CIDR:', error);
                return null;
            }
        } else {
            return null;
        }
    } else if (line.includes('/')) {
        // 处理CIDR格式
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;
        
        ip = match[1];
        cidr = parseInt(match[2]);
        
        // 验证IP和CIDR
        if (!window.isValidIp(ip) || cidr < 0 || cidr > 32) return null;
    } else {
        // 处理单个IP地址
        ip = line;
        cidr = 32;
        
        // 验证IP
        if (!window.isValidIp(ip)) return null;
    }
    
    // 获取子网掩码
    const mask = window.cidrToMaskMap[cidr];
    if (!mask) return null;
    
    // 获取网络地址
    const network = window.getNetworkAddress(ip, mask);
    
    // 获取RouterOS类型（address-list或route）
    const routerType = document.querySelector('input[name="routeros-type"]:checked')?.value || 'route';
    
    // 获取网关地址
    const routerosGateway = document.getElementById('routerosGateway')?.value.trim() || '';
    gateway = gateway || routerosGateway;
    
    // 获取地址列表名称
    const listName = document.getElementById('listName')?.value.trim() || 'IP_List';
    
    // 创建配置
    if (routerType === 'address-list') {
        return `/ip firewall address-list add list=${listName} address=${network}/${cidr}`;
    } else if (routerType === 'route') {
        if (gateway) {
            return `/ip route add dst-address=${network}/${cidr} gateway=${gateway}`;
        } else {
            return `/ip route add dst-address=${network}/${cidr} gateway=<gateway>`;
        }
    }
    
    // 默认返回address-list配置
    return `/ip firewall address-list add list=${listName} address=${network}/${cidr}`;
}

/**
 * Convert CIDR notation to Huawei VRP format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24) or IP address
 * @returns {string|null} - Huawei VRP configuration or null if invalid
 */
function convertCidrToHuawei(line) {
    let ip, cidr;
    
    // 检查是否是CIDR格式
    if (line.includes('/')) {
        // Match IP/CIDR pattern
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        ip = match[1];
        cidr = parseInt(match[2]);
    } else {
        // 处理单个IP地址，默认使用/32
        ip = line;
        cidr = 32;
    }

    // Validate IP and CIDR
    if (!window.isValidIp(ip) || cidr < 0 || cidr > 32) return null;

    const mask = window.cidrToMaskMap[cidr];
    const nextHop = document.getElementById('nextHopIp')?.value.trim() || 'NULL0';
    const vrfName = document.getElementById('vrfName')?.value.trim();
    
    // Generate VRP configuration with or without VRF
    if (vrfName) {
        return `ip route-static vpn-instance ${vrfName} ${ip} ${mask} ${nextHop}`;
    } else {
        return `ip route-static ${ip} ${mask} ${nextHop}`;
    }
}

/**
 * Convert CIDR notation to Juniper JunOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24) or IP address
 * @returns {string|null} - Juniper JunOS configuration or null if invalid
 */
function convertCidrToJuniper(line) {
    let ip, cidr;
    
    // 检查是否是Cisco路由命令
    const ciscoRouteInfo = extractIpFromCiscoRoute(line);
    if (ciscoRouteInfo) {
        const { ip: routeIp, mask } = ciscoRouteInfo;
        
        // 将IP和掩码转换为CIDR
        const cidrValue = window.maskToCidrMap[mask];
        if (!cidrValue) return null;
        
        ip = routeIp;
        cidr = cidrValue;
    } else if (line.includes('/')) {
        // Match IP/CIDR pattern
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (!match) return null;

        ip = match[1];
        cidr = parseInt(match[2]);
    } else if (line.includes(' ')) {
        // 处理IP掩码格式（如192.168.1.0 255.255.255.0）
        const parts = line.trim().split(/\s+/);
        if (parts.length === 2) {
            const ipPart = parts[0];
            const maskPart = parts[1];
            
            // 验证IP和掩码
            if (!window.isValidIp(ipPart) || !window.isValidMask(maskPart)) return null;
            
            // 将掩码转换为CIDR
            const cidrValue = window.maskToCidrMap[maskPart];
            if (!cidrValue) return null;
            
            ip = ipPart;
            cidr = cidrValue;
        } else {
            return null;
        }
    } else {
        // 处理单个IP地址，默认使用/32
        ip = line;
        cidr = 32;
    }

    // Validate IP and CIDR
    if (!window.isValidIp(ip) || cidr < 0 || cidr > 32) return null;

    // 如果是IP段，保持原始CIDR值；如果是单个IP地址（如10.0.0.0），保持其CIDR值
    // 获取网络地址，确保使用正确的网络前缀
    if (cidr < 32) {
        const mask = window.cidrToMaskMap[cidr];
        if (mask) {
            ip = window.getNetworkAddress(ip, mask);
        }
    }

    const nextHop = document.getElementById('juniperNextHop')?.value.trim() || '192.168.5.1';
    const routingInstance = document.getElementById('routingInstance')?.value.trim();
    
    // Generate JunOS configuration with or without routing-instance
    if (routingInstance) {
        return `set routing-instances ${routingInstance} routing-options static route ${ip}/${cidr} next-hop ${nextHop}`;
    } else {
        return `set routing-options static route ${ip}/${cidr} next-hop ${nextHop}`;
    }
}

/**
 * Convert CIDR notation or FQDN to Fortinet FortiOS format
 * @param {string} line - CIDR notation (e.g., 192.168.1.0/24), IP address, or FQDN
 * @returns {string|null} - Fortinet FortiOS configuration or null if invalid
 */
function convertCidrToFortinet(line) {
    let addrName, addrConfig;

    // 0) 首先检查是否是 Cisco 路由命令
    const ciscoRouteInfo = extractIpFromCiscoRoute(line); 
    // extractIpFromCiscoRoute(line) 会返回 { ip, mask, gateway } 或 null
    if (ciscoRouteInfo) {
        const { ip, mask } = ciscoRouteInfo;

        // 验证 IP+MASK
        if (!window.isValidIp(ip) || !window.isValidMask(mask)) {
            return null;
        }

        // 生成地址名
        const cidr = window.maskToCidrMap[mask];
        addrName = `${ip.replace(/\./g, '_')}_${cidr}`;

        addrConfig = `
config firewall address
    edit "${addrName}"
        set subnet ${ip} ${mask}
    next
end`.trim();

        return addrConfig;
    }

    // 1) 判断空格分隔的场景(可能是 "ip mask" 或 "ip mask gateway")
    if (line.includes(' ')) {
        const parts = line.trim().split(/\s+/);

        // 1.1) IP + MASK
        if (parts.length === 2) {
            const [ipPart, maskPart] = parts;
            // 验证
            if (!window.isValidIp(ipPart) || !window.isValidMask(maskPart)) {
                return null;
            }
            const cidr = window.maskToCidrMap[maskPart];
            addrName = `${ipPart.replace(/\./g, '_')}_${cidr}`;
            addrConfig = `
config firewall address
    edit "${addrName}"
        set subnet ${ipPart} ${maskPart}
    next
end`.trim();

            return addrConfig;

        // 1.2) IP + MASK + GATEWAY(或多余的东西) - Fortinet 不需要 GATEWAY，但可以容忍多余第三段
        } else if (parts.length === 3) {
            const [ipPart, maskPart] = parts; // 只取前两段
            if (!window.isValidIp(ipPart) || !window.isValidMask(maskPart)) {
                return null;
            }
            const cidr = window.maskToCidrMap[maskPart];
            addrName = `${ipPart.replace(/\./g, '_')}_${cidr}`;
            addrConfig = `
config firewall address
    edit "${addrName}"
        set subnet ${ipPart} ${maskPart}
    next
end`.trim();

            return addrConfig;
        }
        // 若分段数更多或更少(不在2~3之间)，则后续不处理，继续往下判断是否有CIDR/域名等
    }

    // 2) 如果包含斜杠，按 CIDR 解析
    if (line.includes('/')) {
        // 只匹配纯净的 "x.x.x.x/NN"
        const match = line.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
        if (match) {
            const ip = match[1];
            const cidr = parseInt(match[2], 10);

            if (!window.isValidIp(ip) || cidr < 0 || cidr > 32) return null;

            const mask = window.cidrToMaskMap[cidr];
            if (!mask) return null;

            addrName = `${ip.replace(/\./g, '_')}_${cidr}`;
            addrConfig = `
config firewall address
    edit "${addrName}"
        set subnet ${ip} ${mask}
    next
end`.trim();

            return addrConfig;
        }
    }

    // 3) 如果是单个 IP (不带 CIDR、不带空格)
    //    例如: 8.8.8.8 => 当作 /32
    if (/^\d+\.\d+\.\d+\.\d+$/.test(line)) {
        if (!window.isValidIp(line)) return null;

        addrName = `${line.replace(/\./g, '_')}_32`;
        addrConfig = `
config firewall address
    edit "${addrName}"
        set subnet ${line} 255.255.255.255
    next
end`.trim();

        return addrConfig;
    }

    // 4) 其它情况，一律按 FQDN 处理 (域名或子域名)
    //    如果既不是IP，也不符合域名正则，就返回 null
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])+$/.test(line)) {
        // 如果不满足域名规则，返回 null
        return null;
    }

    // (4.1) 生成 FQDN 地址
    addrName = line.replace(/\./g, '_');
    addrConfig = `
config firewall address
    edit "${addrName}"
        set type fqdn
        set fqdn "${line}"
    next
end`.trim();

    // 5) 根据 fortinetType 决定是否要加到某个地址组
    const fortinetType = document.querySelector('input[name="fortinet-type"]:checked')?.value || 'address';
    const addrGroupName = document.getElementById('addrGroupName')?.value.trim() || 'IP_Group';

    if (fortinetType === 'address') {
        // 仅创建 address
        return addrConfig;
    } else if (fortinetType === 'addrgrp') {
        // 创建 address 并加进 addrgrp
        const groupConfig = `
config firewall addrgrp
    edit "${addrGroupName}"
        append member "${addrName}"
    next
end`.trim();

        return addrConfig + '\n\n' + groupConfig;
    }

    // 如果没有选中任何类型，默认只返回地址配置
    return addrConfig;
}

/**
 * Extract IP and netmask from Cisco route command
 * @param {string} route - Cisco route command
 * @returns {Object|null} - Extracted IP and mask, or null if invalid
 */
function extractIpFromCiscoRoute(route) {
    if (!route || !route.trim().startsWith('ip route ')) {
        return null;
    }
    
    const match = route.match(/ip route (\d+\.\d+\.\d+\.\d+) (\d+\.\d+\.\d+\.\d+) (\d+\.\d+\.\d+\.\d+)/);
    if (!match) {
        return null;
    }
    
    const [, ip, mask, gateway] = match;
    
    // 验证IP、掩码和网关的有效性
    if (!window.isValidIp(ip) || !window.isValidMask(mask) || !window.isValidIp(gateway)) {
        return null;
    }
    
    return { ip, mask, gateway };
}

// 将所有函数添加到window对象上
window.convertCidrToCisco = convertCidrToCisco;
window.convertCidrToRouterOs = convertCidrToRouterOs;
window.convertCidrToHuawei = convertCidrToHuawei;
window.convertCidrToJuniper = convertCidrToJuniper;
window.convertCidrToFortinet = convertCidrToFortinet;
window.extractIpFromCiscoRoute = extractIpFromCiscoRoute;

// 标记模块已加载
if (window.markModuleAsLoaded) {
    window.markModuleAsLoaded('routerConverters');
}
