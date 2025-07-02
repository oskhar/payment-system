<template>
  <Chart
    :type="'doughnut'"
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script setup lang="ts">
import { Chart } from 'vue-chartjs'
defineProps<{
  chartData: any
  chartOptions: any
}>()
</script>
