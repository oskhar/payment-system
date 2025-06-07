<template>
  <VRow dense>
    <!-- Grafik Penjualan -->
    <VCol
      cols="12"
      md="9"
    >
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

    <!-- Laba/Rugi Tahun Ini -->
    <VCol
      cols="12"
      md="3"
    >
      <VCard class="pa-4 h-100">
        <VCardTitle class="d-flex justify-space-between align-center">
          <span class="text-h4">Total Hari ini</span>
          <div>
            <VBtn
              icon
              variant="text"
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
        <VCardItem>
          <div class="text-h4 mb-4 text-primary">Rp 55.000,00</div>

          <div class="text-body-1">
            <div class="d-flex justify-space-between">
              <span>Jumlah Transaksi:</span>
              <strong>45</strong>
            </div>
            <div class="d-flex justify-space-between">
              <span>Jenis Barang:</span>
              <strong>18</strong>
            </div>
            <div class="d-flex justify-space-between">
              <span>Jumlah Barang:</span>
              <strong>320</strong>
            </div>
          </div>
        </VCardItem>
      </VCard>
    </VCol>

    <!-- Penjualan per Hari -->
    <VCol
      cols="12"
      md="6"
    >
      <VCard class="pa-4 h-100">
        <VCardTitle class="d-flex justify-space-between align-center">
          <span class="text-h4">Laba/Rugi Tahun Ini</span>
          <div>
            <VBtn
              icon
              variant="text"
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
        <VRow no-gutters>
          <VCol
            cols="12"
            sm="6"
          >
            <div style="height: 200px">
              <DoughnutChart
                :chart-data="doughnutData"
                :chart-options="doughnutOptions"
              />
            </div>
          </VCol>
          <VCol
            cols="12"
            sm="6"
            class="text-caption ps-4"
          >
            <div
              v-for="(value, key) in revenueBreakdown"
              :key="key"
              class="mb-2 d-flex align-center"
            >
              <VIcon
                :color="colors[key]"
                size="12"
                class="me-2"
                >ri-checkbox-blank-circle-fill</VIcon
              >
              <div>
                <strong>{{ key }}</strong> - {{ formatRupiah(value) }}
              </div>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <!-- Penjualan per Kategori -->
    <VCol
      cols="12"
      md="6"
    >
      <VCard class="pa-4 h-100">
        <VCardTitle class="text-h4">Penjualan per Kategori</VCardTitle>
        <div style="height: 300px">
          <BarChart
            :chart-data="categoryChartData"
            :chart-options="categoryChartOptions"
          />
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LineChart from '@/views/dashboard/LineChart.vue'
import DoughnutChart from '@/views/dashboard/DoughnutChart.vue'
import BarChart from '@/views/dashboard/BarChart.vue'

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

ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, PointElement, CategoryScale, LinearScale, ArcElement)

const chartData = {
  labels: Array.from({ length: 30 }, (_, i) => `${i + 1} Jan`),
  datasets: [
    {
      label: 'Penjualan',
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20000 + 10000)),
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f680',
      fill: true,
      tension: 0.4,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
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
