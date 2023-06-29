<script setup>
import InitializeApp from '../features/misc/components/InitializeApp.vue'
import { CfDefaultLayout, CfSidebarLink } from '../components/index.js'
</script>

<template>
  <InitializeApp/>
  <CfDefaultLayout>
    <template #brand>
      Planta
    </template>
    <template #sidebar>
      <CfSidebarLink icon="storefront" href="#">Sales</CfSidebarLink>
      <CfSidebarLink icon="pallet" parent>Production
        <template #children>
          <CfSidebarLink :to="{ name: 'ProductionOrders' }">Overview</CfSidebarLink>
          <CfSidebarLink :to="{ name: 'ProductionOperations' }">Operations</CfSidebarLink>
        </template>
      </CfSidebarLink>
      <CfSidebarLink icon="category" parent>Inventory
        <template #children>
          <CfSidebarLink :to="{ name: 'Products' }">Products</CfSidebarLink>
          <CfSidebarLink :to="{ name: 'Materials' }">Materials</CfSidebarLink>
        </template>
      </CfSidebarLink>
      <CfSidebarLink icon="monitoring" href="#">Reports</CfSidebarLink>
      <hr>
      <CfSidebarLink icon="settings" parent>Settings
        <template #children>
          <CfSidebarLink href="#">Users</CfSidebarLink>
          <CfSidebarLink :to="{ name: 'Configurations' }">Configurations</CfSidebarLink>
        </template>
      </CfSidebarLink>
    </template>
    <template #main>
      <RouterView/>
    </template>
  </CfDefaultLayout>
</template>