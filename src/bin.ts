#!/usr/bin/env node

import minimist from 'minimist';

import { defaultStatusFile, status, compare, update } from './index'

const helpMessage = `
This is vitepress translation helper!

Usage:
  v-translation status [<locale>] [--status-file=<file-path>]
  v-translation compare <locale> [<commit>] [--status-file=<file-path>] [--path=<diff-path>]
  v-translation update <locale> [<commit>] [--status-file=<file-path>]
  v-translation --help
  v-translation --version

Arguments:
  locale: The target locale to check/compare/update.
  commit: The target commit to compare/update. It could be a branch, a tag, or a hash. Default to 'main'.

Options:
  -s, 
  --status-file:
    The path to the translation status file. Default to '${defaultStatusFile}'.
  -p,
  --path:
    The target files/directories to compare. You can set multiple paths if you like. Default to the whole repository.
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
  v-translation compare zh --path=docs
  v-translation compare zh main --path=docs/guide --path=docs/api
  v-translation update zh
  v-translation update zh main
  v-translation update zh 1cf14f8
`.trim()

const help = () => console.log(helpMessage)

const main = async () => {
  const argv = minimist(process.argv.slice(2))
  const paths = argv['path'] || argv.p
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
    const [locale, commit] = argv._.slice(1)
    compare(locale, commit, statusFile, paths)
    return
  }

  if (command === 'update') {
    const [locale, commit] = argv._.slice(1)
    update(locale, commit, statusFile)
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
