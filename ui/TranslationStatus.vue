<script lang="ts">
type Status = {
  [locale: string]: {
    hash: string
    date: string
  }
}

const originalLang = 'root'
const defaultI18nLabels: {
  [lang: string]: string
} = {
  en: 'The translation is synced to the docs on ${date} of which the commit hash is <code>${hash}</code>.',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = withDefaults(
  defineProps<{
    i18nLabels: { [lang: string]: string }
    status: Status
  }>(),
  {
    i18nLabels: () => defaultI18nLabels,
    status: () => ({})
  }
)

const { i18nLabels, status } = props

const { site } = useData()
const label = computed<string>(() => {
  const localeIndex = site.value.localeIndex
  if (!localeIndex || localeIndex === originalLang || !status[localeIndex]) {
    return ''
  }
  const { date, hash } = status[localeIndex]
  return (
    i18nLabels[localeIndex] ||
    defaultI18nLabels[localeIndex] ||
    i18nLabels.en ||
    defaultI18nLabels.en
  ).
    replace('${date}', `<time>${date}</time>`).
    replace('${hash}', `<code>${hash.substring(0, 7)}</code>`)
})
</script>

<template>
  <div v-if="label" class="text-status" v-html="label"></div>
</template>

<style scoped>
.text-status {
  padding: 1em 1.25em;
  font-size: small;
  text-align: right;
  color: var(--vp-c-text-2);
}
</style>
