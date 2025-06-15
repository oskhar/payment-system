<template>
  <VRow dense>
    <VCol
      cols="12"
      md="5"
    >
      <TrafficCard />
    </VCol>

    <!-- Laba/Rugi Tahun Ini -->
    <VCol
      cols="12"
      md="7"
    >
      <TotalEarning />
    </VCol>

    <!-- Grafik Penjualan -->
    <VCol cols="12">
      <VCard class="pa-4 h-100">
        <VCardTitle class="d-flex justify-space-between align-center">
          <span class="text-h4">Grafik Penjualan</span>
          <div>
            <VBtn
              icon
              variant="text"
              @click="refreshChart"
            >
              <VIcon>ri-refresh-line</VIcon>
            </VBtn>
            <VBtn
              icon
              variant="text"
            >
              <VIcon>ri-calendar-line</VIcon>
            </VBtn>
          </div>
        </VCardTitle>
        <VCardSubtitle>Data penjualan bulan ini</VCardSubtitle>
        <div style="height: 300px">
          <LineChart
            :chart-data="chartData"
            :chart-options="chartOptions"
          />
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LineChart from '@/views/dashboard/LineChart.vue'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import TotalEarning from '@/views/dashboard/AnalyticsTotalEarning.vue'
import TrafficCard from '@/views/dashboard/TrafficCard.vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, PointElement, CategoryScale, LinearScale, ArcElement)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Penjualan',
      data: [12000, 14000, 10000, 18000, 15000, 17000, 16000],
      borderColor: '#6366f1', // warna garis (biru keunguan)
      backgroundColor: 'rgba(99, 102, 241, 0.2)', // area bawah
      pointBackgroundColor: '#6366f1',
      pointRadius: context => {
        // Tampilkan titik hanya di data terakhir
        const index = context.dataIndex
        const total = context.chart.data.datasets[0].data.length
        return index === total - 1 ? 6 : 0
      },
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6b7280' }, // abu-abu
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#6b7280' },
      grid: {
        color: 'rgba(0,0,0,0.05)',
        drawBorder: false,
      },
    },
  },
  elements: {
    line: { borderWidth: 2 },
  },
}

const doughnutData = {
  labels: ['Pendapatan', 'HPP', 'Beban Operasional', 'Beban Lainnya'],
  datasets: [
    {
      label: 'Laba Rugi',
      data: [1200000, 500000, 300000, 100000],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#a78bfa'],
    },
  ],
}

const doughnutOptions = {
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  responsive: true,
  maintainAspectRatio: false,
}

const revenueBreakdown = {
  Pendapatan: 1200000,
  HPP: 500000,
  'Beban Operasional': 300000,
  'Beban Lainnya': 100000,
}

const colors = {
  Pendapatan: '#3b82f6',
  HPP: '#10b981',
  'Beban Operasional': '#f59e0b',
  'Beban Lainnya': '#a78bfa',
}

const categoryChartData = {
  labels: ['Makanan', 'Minuman', 'Elektronik', 'Pakaian', 'Lainnya'],
  datasets: [
    {
      label: 'Penjualan',
      data: [400000, 350000, 600000, 200000, 150000],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'],
    },
  ],
}

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
}

const formatRupiah = (number: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number)

const refreshChart = () => {
  // Simulasikan refresh chart
  chartData.datasets[0].data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 20000 + 10000))
}
</script>
