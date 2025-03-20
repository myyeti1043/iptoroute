# IPToRoute

A lightweight web tool for IP address conversion and router configuration generation, built with vanilla JavaScript.

[English](#english) | [中文](#中文)

## English

### Features

- **IP Address Extraction**
  - Extract IPv4/IPv6 addresses and CIDR ranges from text or JSON
  - Intelligent parsing with duplicate removal
  - Batch processing support

- **Router Configuration Generation**
  - Supports multiple platforms:
    - MikroTik RouterOS (Address List and Route modes)
    - Cisco IOS
    - Huawei VRP
    - Juniper JunOS
    - Fortinet FortiOS
  - FQDN (domain name) support for Fortinet
  - Customizable output options

- **Format Conversion**
  - CIDR ↔ IP+Netmask bidirectional conversion
  - Batch processing with validation

- **User Experience**
  - Light/dark themes and English/Chinese localization
  - Operation history with one-click restoration
  - Mobile and desktop responsive design
  - Easy copy/download of results

### Usage

1. Visit the website
2. Select operation mode (Router Config, IP Extract, CIDR→IP, or IP→CIDR)
3. Input data and configure options
4. Convert and use the results

### Development

Pure frontend project with no dependencies:

```
git clone https://github.com/myyeti1043/iptoroute.git
```

Open `index.html` in any browser to run locally.

## 中文

### 功能特点

- **IP地址提取**
  - 从文本或JSON中提取IPv4/IPv6地址和CIDR范围
  - 智能解析并去除重复项
  - 支持批量处理

- **路由器配置生成**
  - 支持多种平台：
    - MikroTik RouterOS（地址列表和路由模式）
    - Cisco IOS
    - Huawei VRP
    - Juniper JunOS
    - Fortinet FortiOS
  - Fortinet模式支持FQDN（域名）
  - 可自定义输出选项

- **格式转换**
  - CIDR ↔ IP+子网掩码双向转换
  - 批量处理并验证格式

- **用户体验**
  - 明暗主题和中英文本地化
  - 操作历史记录和一键还原
  - 移动和桌面自适应设计
  - 便捷复制/下载结果

### 使用方法

1. 访问网站
2. 选择操作模式（路由配置、IP提取、CIDR→IP或IP→CIDR）
3. 输入数据并配置选项
4. 转换并使用结果

### 开发

纯前端项目，无需依赖项：

```
git clone https://github.com/myyeti1043/iptoroute.git
```

在任意浏览器中打开`index.html`即可本地运行。

## License

[MIT License](LICENSE)
