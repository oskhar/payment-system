<script setup lang="ts">
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler } from 'chart.js'
import { Chart } from 'vue-chartjs'
import { onMounted, ref, watch } from 'vue'
import { useTheme } from 'vuetify'

defineProps<{
  chartData: any
  chartOptions: any
}>()

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler)

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors

const chartRef = ref()

const applyGradient = () => {
  const chart = chartRef.value?.chart
  if (!chart) return

  const ctx = chart.ctx
  const area = chart.chartArea
  if (!area) return

  const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom)
  gradient.addColorStop(0, currentTheme.primary + '66') // 0.4 opacity
  gradient.addColorStop(0.95, currentTheme.primary + '40') // 0.25
  gradient.addColorStop(1, currentTheme.surface + '33') // 0.2

  chart.data.datasets[0].backgroundColor = gradient
  chart.update()
}

onMounted(() => {
  setTimeout(() => {
    applyGradient()
  }, 100)
})
</script>

<template>
  <Chart
    ref="chartRef"
    :type="'line'"
    :data="chartData"
    :options="chartOptions"
  />
</template>
