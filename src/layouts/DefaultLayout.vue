<script setup>
import { CfDefaultLayout, CfSidebarLink } from '../components/index.js'
</script>

<template>
  <CfDefaultLayout>
    <template #brand>
      Planta
    </template>
    <template #sidebar>
      <CfSidebarLink icon="storefront" href="#">Sales</CfSidebarLink>
      <CfSidebarLink icon="pallet" parent>Production
        <template #children>
          <CfSidebarLink to="/production/orders">Orders</CfSidebarLink>
          <CfSidebarLink href="#">Schedule</CfSidebarLink>
          <CfSidebarLink href="#">Floor</CfSidebarLink>
        </template>
      </CfSidebarLink>
      <CfSidebarLink icon="category" href="#">Inventory</CfSidebarLink>
      <CfSidebarLink icon="monitoring" href="#">Reports</CfSidebarLink>
      <hr>
      <CfSidebarLink icon="settings" parent>Settings
        <template #children>
          <CfSidebarLink href="#">Users</CfSidebarLink>
          <CfSidebarLink to="/settings/configurations">Configurations</CfSidebarLink>
        </template>
      </CfSidebarLink>
    </template>
    <template #main>
      <RouterView/>
    </template>
  </CfDefaultLayout>
</template>