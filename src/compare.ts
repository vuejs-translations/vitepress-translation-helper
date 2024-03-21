import { readFile } from 'fs/promises'
import simpleGit from 'simple-git'

import { Status, defaultStatusFile } from './shared'

async function getLocaleHash (
  locale: string,
  statusFile: string
) {
  try {
    const content = await readFile(statusFile, 'utf8')
    const data = JSON.parse(content) as Status
    return data[locale]?.hash
  } catch (err) {
    console.log('No previous status file. Will create a new one.')
  }
}

export async function compare (
  locale: string | undefined,
  commit: string = 'main',
  statusFile: string = defaultStatusFile,
  paths: string[] = ['.']
) {
  if (!locale) {
    console.log('Please specify a locale to compare.')
    return
  }
  const hash = await getLocaleHash(locale, statusFile)
  if (hash) {
    console.log(`The last checkpoint of docs(${locale}) is "${hash}".\n`)
    const git = simpleGit()
    const result = await git.diff([`${hash}..${commit}`, ...paths])
    console.log(result)
  } else {
    console.log(`No docs(${locale}) checkpoint found.\n`)
  }
}
