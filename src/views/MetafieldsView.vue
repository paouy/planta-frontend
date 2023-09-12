<script setup>
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfActionCard, CfFilledButton } from 'vue-cf-ui'

const breadcrumbs = [
  { name: 'Configurations', path: '/settings/configurations' },
  { name: 'Custom Data' }
]
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Custom Data" description="Configure custom data fields for products and operations."/>

    <CfActionCard title="Operation">
      <template #body>
        <p>Configure custom data fields for operations.</p>
      </template>
      <template #action>
        <CfFilledButton to="/settings/configurations/custom-data/operation">
          Configure
        </CfFilledButton>
      </template>
    </CfActionCard>

    <CfActionCard title="Product">
      <template #body>
        <p>Configure custom data fields for products.</p>
      </template>
      <template #action>
        <CfFilledButton to="/settings/configurations/custom-data/product">
          Configure
        </CfFilledButton>
      </template>
    </CfActionCard>
  </CfAppView>
</template>