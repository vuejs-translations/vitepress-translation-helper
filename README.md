# VitePress Translation Helper

A translation toolkit for VitePress, made by vuejs-translations.

## Usage

### 1. CLI commands

```bash
Usage:
  v-translation status [<locale>] [--status-file=<path>]
  v-translation compare <locale> [<commit>] [--status-file=<path>]
  v-translation update <locale> [<commit>] [--status-file=<path>]
  v-translation --help
  v-translation --version

Arguments:
  locale: The target locale to check/compare/update.
  comment: The target commit to compare/update. It could be a branch, a tag, or a hash. Default to 'main'.

Options:
  -s, 
  --status-file:
    The path to the translation status file. Default to './.vitepress/translation-status.json'.
  -h,
  --help:
    Print this help message.
  -v,
  --version:
    Print the version number.

Examples:
  v-translation status
  v-translation status zh
  v-translation compare zh
  v-translation compare zh main
  v-translation compare zh 1cf14f8
  v-translation update zh
  v-translation update zh main
  v-translation update zh 1cf14f8
```

### 2. Translation Status UI

Put the translation status UI component into your VitePress theme.

```ts
import { h } from 'vue'
import { Theme, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import TranslationStatus from 'vitepress-translation-helper/TranslationStatus'

const theme: Theme = {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(TranslationStatus),
    })
  },
}

export default theme
```
