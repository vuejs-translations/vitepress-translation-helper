export type Status = {
  [locale: string]: {
    hash: string
    date: string
  }
}

export const defaultStatusFile = './.vitepress/translation-status.json'
