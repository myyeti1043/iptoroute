# translations.js Documentation

## Overview

The `translations.js` module contains UI translations for English and Chinese, enabling localization of the application.

## Structure

### `translations.en`
Contains English translations for all UI elements.

### `translations.zh`
Contains Chinese translations for all UI elements.

## Translation Keys

The translations object uses keys that correspond to `data-lang` attributes in the HTML. For example:

```html
<button data-lang="convert">Convert</button>
```

Would have corresponding entries in both `translations.en` and `translations.zh`:

```javascript
// In translations.en
'convert': 'Convert'

// In translations.zh
'convert': '转换'
```

## Supported Languages

- English (`en`)
- Chinese (`zh`)

## Adding New Translations

To add a new language:

1. Add a new key to the `translations` object (e.g., `translations.es` for Spanish)
2. Add translations for all existing keys
3. Update the language selector in the HTML to include the new language
4. Update the `setupLanguageSelection()` function in `app.js` to handle the new language