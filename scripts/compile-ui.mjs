import { readFile, writeFile, mkdir } from 'fs/promises'
import { compile } from 'vue-simple-compiler'

const distDir = './ui'

async function outputFile(file) {
  const { filename, code, sourceMap } = file
  await writeFile(`${distDir}/${filename}`, code)
  await addSoureMapComment(`${distDir}/${filename}`, `${filename}.map`)
  await writeSourceMap(`${distDir}/${filename}.map`, sourceMap)
}

async function ensureDir(dir) {
  try {
    await mkdir(dir)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
}

async function writeSourceMap(filepath, sourceMap) {
  const { file, mappings, names, sources, sourcesContent, version } = sourceMap
  const map = {
    version,
    file,
    mappings,
    names,
    sources,
    sourcesContent,
  }
  await writeFile(filepath, JSON.stringify(map))
}

async function addSoureMapComment(filepath, mapFilepath) {
  const sourceMapComment = filepath.endsWith('.css')
    ? `/*# sourceMappingURL=${mapFilepath} */`
    : `//# sourceMappingURL=${mapFilepath}`
  const content = await readFile(filepath, 'utf-8')
  await writeFile(filepath, `${content}\n${sourceMapComment}`)
}


async function main() {
  const source = await readFile('./src/TranslationStatus.vue', 'utf-8')
  const { js, css, errors } = compile(source, {
    filename: 'TranslationStatus.vue',
    autoImportCss: true,
    autoResolveImports: true,
    isProd: true,
  })
  
  if (errors.length) {
    errors.forEach((error) => console.error(error))
    process.exit(1)
  }

  await ensureDir(distDir)
  await outputFile(js)
  await Promise.all(css.map(outputFile))

  console.log('Done!')
}

main()
