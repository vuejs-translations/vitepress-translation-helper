import { writeFile, readFile } from 'fs/promises'
import simpleGit from 'simple-git'

import { Status, defaultStatusFile } from './shared'

// to override %H into %h to get the abbreviated commit hash
const GIT_LOG_PRETTY_FORMAT = 'òòòòòò %h ò %aI ò %s ò %D ò %b ò %aN ò %aE òò'

async function getCommitInfo (commit: string) {
  try {
    const git = simpleGit()
    const log = await git.log([commit, '-n', '1', `--pretty=format:${GIT_LOG_PRETTY_FORMAT}`])
    const { hash, date } = log.latest!
    return { hash, date: new Date(date).toISOString().substring(0, 10) }
  } catch (err) {
    return { hash: '', date: '' }
  }
}

async function writeLocaleMap (
  locale: string,
  hash: string,
  date: string,
  statusFile: string = defaultStatusFile
) {
  const data: Status = {}
  try {
    const previousContent = await readFile(statusFile, 'utf8')
    const previousJson = JSON.parse(previousContent)
    Object.assign(data, previousJson)
  }
  catch (err) {
    console.log('No previous status file. Will create a new one.')
  }
  data[locale] = {
    hash,
    date,
  }
  await writeFile(statusFile, JSON.stringify(data, null, 2))
}

export async function update(
  locale: string | undefined,
  commit: string = 'main',
  statusFile: string = defaultStatusFile
) {
  if (!locale) {
    console.log('Please specify a locale to update.')
    return
  }
  const { hash, date } = await getCommitInfo(commit)
  if (!hash) {
    console.log(`❌ No commit found for "${commit}".`)
    return
  } else {
    await writeLocaleMap(locale, hash, date, statusFile)
    console.log(`✅ Updated ${locale} to "${hash}" (${date})`)
  }
}
