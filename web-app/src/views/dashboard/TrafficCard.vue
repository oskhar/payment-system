<script setup lang="ts">
const trafficStats = [
  { label: 'Jumlah Transaksi', value: 2898, color: '#4CAF50' }, // green
  { label: 'Jenis Barang', value: 574, color: '#9C27B0' }, // purple
  { label: 'Sisa Stok', value: 2534, color: '#FFC107' }, // amber
]
</script>

<template>
  <VCard elevation="2">
    <VCardItem>
      <VCardTitle>Penjualan Hari Ini</VCardTitle>

      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center justify-space-between mb-16">
        <div>
          <h3 class="text-h3">Rp 9.009.000.-</h3>
          <div class="text-body-1">Total Penjualan</div>
        </div>
        <div>
          <h3 class="text-h3">Rp 5.064.000.-</h3>
          <div class="text-body-1 text-success">
            <VIcon
              size="24"
              icon="ri-arrow-up-s-line"
              color="success"
            />
            Total Margin
          </div>
        </div>
      </div>

      <div
        v-for="(item, index) in trafficStats"
        :key="index"
        class="d-flex align-center justify-space-between mb-7"
      >
        <div class="d-flex align-center gap-3">
          <span
            class="traffic-dot"
            :style="{ backgroundColor: item.color }"
          />
          <span class="font-weight-medium font-weight-medium">
            {{ item.label }}
          </span>
        </div>
        <div class="d-flex align-center gap-2">
          <span class="text-body-1 font-weight-medium">{{ item.value }} Unit</span>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
.traffic-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.graph-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 56px;
  background-color: rgba(103, 58, 183, 0.08); // light purple
  border-radius: 8px;
}
</style>
