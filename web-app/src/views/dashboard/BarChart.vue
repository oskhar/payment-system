<script setup>
import { Bar } from 'vue-chartjs'
defineProps(['chartData', 'chartOptions'])
</script>

<template>
  <Bar
    :data="chartData"
    :options="chartOptions"
  />
</template>
