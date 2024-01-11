import { readFile } from 'fs/promises'

import { Status, defaultStatusFile } from './shared'

async function readLocaleMap (
  locale: string | undefined,
  statusFile: string
) {
  try {
    const content = await readFile(statusFile, 'utf8')
    const status = JSON.parse(content) as Status
    const locales = locale ? [locale] : Object.keys(status)
    locales.forEach(locale => {
      const { hash, date } = status[locale]
      console.log(`The last checkpoint of docs(${locale}) is "${hash}" (${date}).`)
    })
  }
  catch (err) {
    console.log('No status file found.')
  }
}

export async function status(
  locale: string | undefined,
  statusFile: string = defaultStatusFile
) {
  await readLocaleMap(locale, statusFile)
}
