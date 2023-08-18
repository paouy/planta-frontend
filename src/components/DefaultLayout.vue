<script setup>
import { CfAppLayout, CfAppBarLink, CfDropdownItem, CfSidebarLink } from 'vue-cf-ui'
import { useAuth, Logout } from '../features/auth/index.js'
import { useStore, InitializeApp } from '../features/misc/index.js'

const { session } = useAuth()
const { isInitialized, organizationName } = useStore()
</script>

<template>
  <CfAppLayout>
    <template #brand>
      <b>{{ organizationName }}</b>
    </template>

    <template #navigation>
      <CfAppBarLink dropdown>
        <template #default>
          {{ `${session.user?.firstName} ${session.user?.lastName}` }}
        </template>
        <template #dropdown>
          <CfDropdownItem large :to="{ name: 'Account' }">Manage Account</CfDropdownItem>
          <Logout v-slot="{ invoke }">
            <CfDropdownItem large @click="invoke">Log Out</CfDropdownItem>
          </Logout>
        </template>
      </CfAppBarLink>
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
      <hr v-if="session.user?.isAdmin">
      <CfSidebarLink icon="settings" parent v-if="session.user?.isAdmin">Settings
        <template #children>
          <CfSidebarLink :to="{ name: 'Users' }">Users</CfSidebarLink>
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