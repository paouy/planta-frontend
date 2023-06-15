<script setup>
import { CfAppView, CfHeader, CfActionCard, CfFilledButton } from '../../../components/index.js'
</script>

<template>
  <CfAppView>
    <CfHeader
      surtitle="Settings"
      title="Configurations"
    />
    <CfActionCard title="Operations">
      <template #body>
        <p>Configure the operations in your production.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Operations' }">
          Configure operations
        </CfFilledButton>
      </template>
    </CfActionCard>
    <CfActionCard title="Workstations">
      <template #body>
        <p>Configure the workstations in your facility.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Workstations' }">
          Configure workstations
        </CfFilledButton>
      </template>
    </CfActionCard>
    <CfActionCard title="Equipment">
      <template #body>
        <p>Configure the equipment used in your production.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Equipment' }">
          Configure equipment
        </CfFilledButton>
      </template>
    </CfActionCard>
    <CfActionCard title="Inventory Collections">
      <template #body>
        <p>Configure the collections that group your inventory materials and products.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Collections' }">
          Configure collections
        </CfFilledButton>
      </template>
    </CfActionCard>
  </CfAppView>
</template>