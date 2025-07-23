# translations.js 文档

## 概述

`translations.js` 模块包含英文和中文的 UI 翻译，实现应用的本地化。

## 结构

### `translations.en`
包含所有 UI 元素的英文翻译。

### `translations.zh`
包含所有 UI 元素的中文翻译。

## 翻译键

翻译对象使用与 HTML 中 `data-lang` 属性对应的键。例如：

```html
<button data-lang="convert">Convert</button>
```

在 `translations.en` 和 `translations.zh` 中会有相应的条目：

```javascript
// 在 translations.en 中
'convert': 'Convert'

// 在 translations.zh 中
'convert': '转换'
```

## 支持的语言

- 英文 (`en`)
- 中文 (`zh`)

## 添加新翻译

要添加新语言：

1. 向 `translations` 对象添加新键（例如，`translations.es` 表示西班牙语）
2. 为所有现有键添加翻译
3. 更新 HTML 中的语言选择器以包含新语言
4. 更新 `app.js` 中的 `setupLanguageSelection()` 函数以处理新语言