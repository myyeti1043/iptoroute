# IPToRoute

A powerful web-based tool for IP address conversion and router configuration generation. This tool is built with pure JavaScript, helping network administrators and developers efficiently manage IP addresses and generate router configurations.

[English](#english) | [中文](#中文)

## English

### Features

- **IP Address Extraction**
  - Extract IP addresses and CIDR ranges from any text or JSON
  - Support for both IPv4 and IPv6
  - Automatic duplicate removal
  - Batch processing capability
  - Improved extraction from Cisco routing commands

- **Router Configuration Generation**
  - Support multiple router brands:
    - MikroTik (Address List and Route options)
    - Cisco
    - Huawei
    - Juniper
    - Fortinet
  - Convert IP/CIDR to router-specific commands
  - Support for FQDN (domain names) in Fortinet mode
  - Customizable configuration options
  - Auto-extraction of IPs when next-hop is not provided

- **Format Conversion**
  - CIDR to IP + Netmask conversion
  - IP + Netmask to CIDR conversion
  - Batch processing support
  - Proper validation for subnet masks

- **User Experience**
  - Light and dark mode support
  - Language support (English/Chinese)
  - Recent operations history
  - Responsive design for mobile and desktop
  - Copy to clipboard and download as TXT

### Usage

1. Visit the web page
2. Choose the desired operation mode:
   - Router Config: Generate router configurations
   - IP Extract: Extract IP addresses from text
   - CIDR to IP: Convert CIDR to IP and netmask
   - IP to CIDR: Convert IP and netmask to CIDR
3. Input your data and configure options
4. Click convert to get results
5. Copy or download the results

### Development

This is a pure frontend project using vanilla JavaScript. To run locally:

1. Clone the repository: `git clone https://github.com/myyeti1043/iptoroute.git`
2. Open index.html in your browser
3. No build process or dependencies required

## 中文

### 功能特点

- **IP地址提取**
  - 从任意文本或JSON中提取IP地址和CIDR范围
  - 支持IPv4和IPv6
  - 自动去除重复项
  - 批量处理能力
  - 优化对Cisco路由命令的IP提取

- **路由配置生成**
  - 支持多种路由器品牌：
    - MikroTik（支持地址列表和路由两种模式）
    - 思科
    - 华为
    - Juniper
    - Fortinet
  - 将IP/CIDR转换为特定路由器的命令
  - Fortinet模式支持FQDN（域名）
  - 可自定义配置选项
  - 无需下一跳时自动提取IP地址

- **格式转换**
  - CIDR转IP+子网掩码
  - IP+子网掩码转CIDR
  - 支持批量处理
  - 对子网掩码进行正确验证

- **用户体验**
  - 支持明暗主题模式
  - 支持中英文语言切换
  - 最近操作历史记录
  - 响应式设计，适配移动和桌面设备
  - 复制到剪贴板和下载为TXT文件

### 使用方法

1. 访问网页
2. 选择所需的操作模式：
   - 路由配置：生成路由器配置命令
   - IP提取：从文本中提取IP地址
   - CIDR转IP：将CIDR转换为IP和子网掩码
   - IP转CIDR：将IP和子网掩码转换为CIDR
3. 输入数据并配置选项
4. 点击转换获取结果
5. 复制或下载结果

### 开发说明

这是一个纯前端项目，使用原生JavaScript开发。本地运行方法：

1. 克隆仓库：`git clone https://github.com/myyeti1043/iptoroute.git`
2. 在浏览器中打开index.html
3. 无需构建过程或依赖项

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
