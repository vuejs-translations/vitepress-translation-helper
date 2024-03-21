#!/usr/bin/env node

import { existsSync } from 'fs';
import minimist from 'minimist';
import simpleGit from 'simple-git'

import { defaultStatusFile, status, compare, update } from './index'

const helpMessage = `
This is vitepress translation helper!

Usage:
  v-translation status [<locale>] [--status-file=<file-path>]
  v-translation compare <locale> [<path>...] [--comment=<commit>] [--status-file=<file-path>]
  v-translation update <locale> [--comment=<commit>] [--status-file=<file-path>]
  v-translation --help
  v-translation --version

Arguments:
  locale: The target locale to check/compare/update.
  path: The target files/directories to compare. Default to the whole repository.

Options:
  -s, 
  --status-file:
    The path to the translation status file. Default to '${defaultStatusFile}'.
  -c,
  --comment:
    The target commit to compare/update. It could be a branch, a tag, or a hash. Default to 'main'.
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
  v-translation compare zh --comment=main
  v-translation compare zh --comment=1cf14f8
  v-translation compare zh docs/guide docs/api
  v-translation compare zh docs/guide docs/api --comment=main
  v-translation update zh
  v-translation update zh --comment=main
  v-translation update zh --comment=1cf14f8
`.trim()

const help = () => console.log(helpMessage)

const main = async () => {
  const argv = minimist(process.argv.slice(2))
  const commit = argv['commit'] || argv.c
  const statusFile = argv['status-file'] || argv.s

  if (argv.v || argv.version) {
    console.log(require('../package.json').version)
    return
  }

  if (argv.h || argv.help) {
    help()
    return
  }

  const command = argv._[0]

  if (command === 'status') {
    const [locale] = argv._.slice(1)
    status(locale, statusFile)
    return
  }

  if (command === 'compare') {
    const [locale, ...paths] = argv._.slice(1)
    const maybeCommit = paths[0]
    if (maybeCommit && !commit && !existsSync(maybeCommit)) {
      const git = simpleGit()
      try {
        await git.catFile(['-e', maybeCommit])
        console.warn(`Deprecated: The path '${maybeCommit}' looks like a commit. Please use --comment to specify the target commit.`)
        compare(locale, maybeCommit, statusFile, paths.slice(1))
        return
      } catch (err) {
      }
    }
    compare(locale, commit, statusFile, paths)
    return
  }

  if (command === 'update') {
    const [locale, maybeCommit] = argv._.slice(1)
    if (maybeCommit && !commit) {
      console.warn('Deprecated: Please use --comment to specify the target commit.')
    }
    update(locale, commit || maybeCommit, statusFile)
    return
  }

  if (command) {
    console.log('Please specify a command!\n')
    help()
    return
  }

  help()
}

main()
