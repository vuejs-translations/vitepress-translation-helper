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
import { computed, type PropType } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
    i18nLabels: {
      type: Object as PropType<{ [lang: string]: string }>,
      default: () => defaultI18nLabels
    },
    status: {
      type: Object as PropType<Status>,
      default: () => ({})
    }
  })


const { site } = useData()
const label = computed<string>(() => {
  const localeIndex = site.value.localeIndex
  if (!localeIndex || localeIndex === originalLang || !props.status[localeIndex]) {
    return ''
  }
  const { date, hash } = props.status[localeIndex]
  return (
    props.i18nLabels[localeIndex] ||
    defaultI18nLabels[localeIndex] ||
    props.i18nLabels.en ||
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
