<script setup lang="ts">
import aviato from '@images/logos/aviato.png'
import bitbank from '@images/logos/bitbank.png'
import zipcar from '@images/logos/zipcar.png'
import dana from '@images/logos/dana.png'
import mandiri from '@images/logos/mandiri.png'
import bri from '@images/logos/bri.png'
import bca from '@images/logos/bca.png'

const earnings = [
  {
    avatar: dana,
    title: 'Dana',
    subtitle: 'e-wallet',
    amount: 'Rp 2.000.000.000',
    progress: 'primary',
  },
  {
    avatar: mandiri,
    title: 'Mandiri',
    subtitle: 'bank',
    amount: 'Rp 2.000.000.000',
    progress: 'primary',
  },
  {
    avatar: bri,
    title: 'BRI',
    subtitle: 'bank',
    amount: 'Rp 2.000.000.000',
    progress: 'primary',
  },
  {
    avatar: bca,
    title: 'BCA',
    subtitle: 'bank',
    amount: 'Rp 2.000.000.000',
    progress: 'primary',
  }
]

const moreList = [
  { title: 'Share', value: 'Share' },
  { title: 'Refresh', value: 'Refresh' },
  { title: 'Update', value: 'Update' },
]
</script>

<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Pembayaran Non Tunai</VCardTitle>

      <template #append>
        <div class="me-n3">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText>
      <div class="d-flex align-center">
        <h3 class="text-h3">
          Rp 8.000.000.000
        </h3>

        <VIcon
          size="24"
          icon="ri-arrow-up-s-line"
          color="success"
        />
        <div class="text-success">
          10%
        </div>
      </div>
      <div class="text-body-1 mb-12">
        Compared to $84,325 last year
      </div>

      <VList class="card-list">
        <VListItem
          v-for="earning in earnings"
          :key="earning.title"
        >
          <template #prepend>
            <VAvatar
              rounded
              :image="earning.avatar"
              variant="tonal"
            />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ earning.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-body-1">
            {{ earning.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div>
              <h6 class="text-h6 mb-2">
                {{ earning.amount }}
              </h6>
              <VProgressLinear
                :color="earning.progress"
                model-value="80"
                rounded-bar
                rounded
              />
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}
</style>
