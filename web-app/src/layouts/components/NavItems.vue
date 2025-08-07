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

  <!-- Tautan "Item & Stock" diubah menjadi "Item" -->
  <VerticalNavLink
    :item="{
      title: 'Item',
      icon: 'ri-box-3-line',
      to: '/item',
    }"
  />

  <!-- Tombol baru untuk "Stock" ditambahkan di sini -->
  <VerticalNavLink
    :item="{
      title: 'Stock',
      icon: 'ri-stack-line',
      to: '/stock',
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
      title: 'Unit',
      icon: 'ri-ruler-line', // Icon for units (e.g., measurement)
      to: '/unit', // Path to the unit page
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Toko Cabang',
      icon: 'ri-store-line',
      to: '/toko',
    }"
  />

  <VerticalNavSectionTitle
    :item="{
      heading: 'Settings',
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
