<script setup lang="ts">
import { computed } from 'vue'

type ReviewPerformanceData = {
  rating?: string | number | null
  jalan?: number | string | null
  rakuten?: number | string | null
  ikyu?: number | string | null
  rurubu?: number | string | null
  google?: number | string | null
  booking?: number | string | null
  agoda?: number | string | null
  expedia?: number | string | null
}

const props = withDefaults(defineProps<{
  open: boolean
  loading?: boolean
  error?: string | null
  rows?: ReviewPerformanceData[]
  hotelName?: string
  periodStart?: string
  periodEnd?: string
}>(), {
  loading: false,
  error: null,
  rows: () => [],
  hotelName: '',
  periodStart: '',
  periodEnd: ''
})

const emit = defineEmits<{ (e: 'close'): void }>()

function normalizeRatingKey(value: unknown): string {
  const normalized = String(value ?? '').trim().toLowerCase()
  if (normalized === '合計件数' || normalized === 'total_reviews' || normalized === 'total') return 'total'
  if (normalized === '平均点' || normalized === 'average_score' || normalized === 'average') return 'average'
  if (normalized === '累計点数' || normalized === 'accumulated_score' || normalized === 'accumulated') return 'accumulated'
  return normalized
}

const reviewDataMap = computed(() => {
  const map = new Map<string, ReviewPerformanceData>()
  props.rows.forEach((item) => {
    const key = normalizeRatingKey(item.rating)
    if (key) map.set(key, item)
  })
  return map
})

function formatMetric(value: unknown, precision = 2): string {
  if (value === null || value === undefined || value === '') return '-'
  const num = Number(value)
  if (Number.isNaN(num)) return String(value)
  if (num === 0 || num === 100) return String(Math.round(num))
  const fixed = num.toFixed(precision)
  return fixed.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="emit('close')">
    <div class="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl">
      <div class="flex items-start justify-between border-b border-border p-4">
        <div>
          <h3 class="text-lg font-semibold">レビュー集計プレビュー</h3>
          <p class="text-sm text-muted-foreground">{{ hotelName }} | {{ periodStart }} - {{ periodEnd }}</p>
        </div>
        <AtButton variant="ghost" @click="emit('close')">閉じる</AtButton>
      </div>

      <div class="overflow-auto p-4">
        <div v-if="loading" class="py-8 text-center text-sm text-muted-foreground">読み込み中 レビューデータ...</div>
        <DataErrorAlert v-else-if="error" :message="error" />
        <div v-else-if="!rows.length" class="py-8 text-center text-sm text-muted-foreground">該当データがありません。</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-border text-sm">
            <thead class="bg-muted/40">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">評価</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Jalan</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Rakuten</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Ikyu</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Rurubu</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Google</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Booking</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Agoda</th>
                <th class="px-3 py-2 text-left font-medium text-muted-foreground">Expedia</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-border bg-white">
              <tr v-for="rating in [1, 2, 3, 4, 5]" :key="`rating-${rating}`">
                <td class="px-3 py-2 font-medium">{{ rating }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.jalan, 0) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.rakuten, 0) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.ikyu, 0) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.rurubu, 0) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.google, 0) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.booking, 0) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.agoda, 0) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get(String(rating))?.expedia, 0) }}</td>
              </tr>

              <tr class="bg-muted/20">
                <td class="px-3 py-2 font-semibold">レビュー総件数</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.jalan) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.rakuten) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.ikyu) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.rurubu) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.google) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.booking) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.agoda) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('total')?.expedia) }}</td>
              </tr>

              <tr class="bg-muted/20">
                <td class="px-3 py-2 font-semibold">Average Score</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.jalan, 1) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.rakuten, 1) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.ikyu, 1) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.rurubu, 1) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.google, 1) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.booking, 1) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.agoda, 1) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('average')?.expedia, 1) }}</td>
              </tr>

              <tr class="bg-muted/20">
                <td class="px-3 py-2 font-semibold">Accumulated Score</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.jalan) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.rakuten) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.ikyu) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.rurubu) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.google) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.booking) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.agoda) }}</td>
                <td class="px-3 py-2">{{ formatMetric(reviewDataMap.get('accumulated')?.expedia) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
