<script setup>
import { CfAppLayout, CfSidebarLink } from 'vue-cf-ui'
import { useStore, InitializeApp } from '../features/misc/index.js'

const { isInitialized } = useStore()
</script>

<template>
  <CfAppLayout>
    <template #brand>
      Planta
    </template>
    <template #sidebar>
      <CfSidebarLink icon="storefront" parent>Sales
        <template #children>
          <CfSidebarLink :to="{ name:'SalesOrders' }">Orders</CfSidebarLink>
          <CfSidebarLink :to="{ name: 'Customers' }">Customers</CfSidebarLink>
        </template>
      </CfSidebarLink>
      <CfSidebarLink icon="pallet" parent>Production
        <template #children>
          <CfSidebarLink :to="{ name: 'ProductionOrders' }">Overview</CfSidebarLink>
          <CfSidebarLink :to="{ name: 'ProductionExecution' }">Execution</CfSidebarLink>
        </template>
      </CfSidebarLink>
      <CfSidebarLink icon="category" parent>Inventory
        <template #children>
          <CfSidebarLink :to="{ name: 'Products' }">Products</CfSidebarLink>
          <CfSidebarLink :to="{ name: 'Materials' }">Materials</CfSidebarLink>
        </template>
      </CfSidebarLink>
      <CfSidebarLink icon="monitoring" :to="{ name: 'Reports' }">Reports</CfSidebarLink>
      <hr>
      <CfSidebarLink icon="settings" parent>Settings
        <template #children>
          <CfSidebarLink href="#">Users</CfSidebarLink>
          <CfSidebarLink :to="{ name: 'Configurations' }">Configurations</CfSidebarLink>
        </template>
      </CfSidebarLink>
    </template>
    <template #main>
      <InitializeApp v-if="!isInitialized"/>
      <RouterView v-else/>
    </template>
  </CfAppLayout>
</template>