<script setup lang="ts">
import type { DataTableColumn } from '~/components/molecules/layout/useDataTableLogic'
import type { ApiResponse } from '~/types/api/common'
import { assertApiSuccess } from '~/types/api/common'

type SearchPayload = {
  items?: Record<string, unknown>[]
  data?: Record<string, unknown>[]
  list?: Record<string, unknown>[]
  rows?: Record<string, unknown>[]
  total?: number
}

const props = withDefaults(defineProps<{
  title: string
  endpoint: string
  columns: DataTableColumn[]
  requestPath?: string
  method?: 'GET' | 'POST'
  searchPlaceholder?: string
}>(), {
  requestPath: undefined,
  method: 'POST',
  searchPlaceholder: 'Search...'
})

const { $apiFetch } = useNuxtApp()
const pending = ref(false)
const errorMsg = ref<string | null>(null)
const items = ref<Record<string, unknown>[]>([])
const totalRecords = ref<number | null>(null)

function normalizeRows(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[]
  if (!payload || typeof payload !== 'object') return []

  const p = payload as SearchPayload
  if (Array.isArray(p.items)) return p.items
  if (Array.isArray(p.data)) return p.data
  if (Array.isArray(p.list)) return p.list
  if (Array.isArray(p.rows)) return p.rows
  return []
}

async function fetchItems() {
  pending.value = true
  errorMsg.value = null
  try {
    const path = props.requestPath || `${props.endpoint}/search`
    const fetchOptions: { method: 'GET' | 'POST'; body?: { page: number; per_page: number } } = {
      method: props.method
    }

    if (props.method === 'POST') {
      fetchOptions.body = {
        page: 1,
        per_page: 100
      }
    }

    const res = await $apiFetch<ApiResponse<unknown> & { meta?: { pagination?: { total?: number } } }>(`/api/${path}`, fetchOptions)

    assertApiSuccess(res, `Cannot load ${props.title}`)

    items.value = normalizeRows(res.data)
    totalRecords.value = res.meta?.pagination?.total ?? items.value.length
  } catch (error: any) {
    errorMsg.value = error?.message || `Cannot load ${props.title}`
    items.value = []
    totalRecords.value = null
  } finally {
    pending.value = false
  }
}

onMounted(fetchItems)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-sm text-muted-foreground">
        {{ pending ? 'Loading data...' : `${totalRecords ?? items.length} records` }}
      </h2>
      <AtButton variant="outline" size="sm" :disabled="pending" @click="fetchItems">
        Reload
      </AtButton>
    </div>

    <DataErrorAlert :message="errorMsg" />

    <DataTablePage
      :title="title"
      :columns="columns"
      :items="items"
      :search-placeholder="searchPlaceholder"
      :page-size="10"
    />
  </div>
</template>
