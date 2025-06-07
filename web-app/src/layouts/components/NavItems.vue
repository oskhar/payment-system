<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
  <VerticalNavSectionTitle
    :item="{
      heading: 'Home',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Dashboard',
      to: '/dashboard',
      icon: 'ri-home-smile-line',
    }"
  />

  <VerticalNavSectionTitle
    :item="{
      heading: 'Penjualan',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Pelanggan',
      icon: 'ri-user-3-line',
      to: '/pelanggan',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Top Up',
      icon: 'ri-git-repository-commits-line',
      to: '/top-up',
      badgeContent: 'Freemium',
      badgeClass: 'bg-light-warning text-warning',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Riwayat Transaksi',
      icon: 'ri-exchange-dollar-line',
      to: '/riwayat',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Penjualan',
      icon: 'ri-shopping-cart-line', // Ikon untuk penjualan
      to: '/transaksi',
    }"
  />

  <VerticalNavSectionTitle
    :item="{
      heading: 'Persediaan',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Item & Stock',
      icon: 'ri-box-3-line',
      to: '/item',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Stock Opname',
      icon: 'ri-clipboard-line',
      to: '/stock-opname',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Kategori Item',
      icon: 'ri-price-tag-3-line',
      to: '/category-item',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Gudang',
      icon: 'ri-store-line',
      to: '/gudang',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />

  <VerticalNavSectionTitle
    :item="{
      heading: 'Settings',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Fitur Aktif',
      icon: 'ri-toggle-line',
      to: '/fitur-aktif',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Profile',
      icon: 'ri-user-line',
      to: '/profile',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
</template>
