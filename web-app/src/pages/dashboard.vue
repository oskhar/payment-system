<script setup lang="ts">
import Hi from '@/views/dashboard/Hi.vue'
import UpgradePlan from '@/views/dashboard/UpgratePlan.vue'
import IntegrationPlan from '@/views/dashboard/IntegrationPlan.vue'
import Chart from '@/views/dashboard/Chart.vue'
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="12"
    >
      <Hi />
    </VCol>
  </VRow>
  <VRow class="mt-8">
    <VCol cols="6">
      <UpgradePlan />
    </VCol>

    <VCol cols="6">
      <IntegrationPlan />
    </VCol>
  </VRow>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="12"
    >
      <Chart />
    </VCol>
  </VRow>
</template>
