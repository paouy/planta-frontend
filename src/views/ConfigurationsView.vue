<script setup>
import { CfAppView, CfAppViewHeader, CfActionCard, CfFilledButton } from 'vue-cf-ui'
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Settings" title="Configurations"/>

    <CfActionCard title="Custom Data">
      <template #body>
        <p>Configure custom data fields for products and orders.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Metafields' }">
          Configure custom data
        </CfFilledButton>
      </template>
    </CfActionCard>

    <CfActionCard title="Operations">
      <template #body>
        <p>Set up the operations in your production.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Operations' }">
          Set up operations
        </CfFilledButton>
      </template>
    </CfActionCard>

    <CfActionCard title="Workstations">
      <template #body>
        <p>Add, edit, or remove workstations in your facility.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Workstations' }">
          Manage workstations
        </CfFilledButton>
      </template>
    </CfActionCard>

    <CfActionCard title="Workers">
      <template #body>
        <p>Add, edit, or remove workers who execute your production.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Workers' }">
          Manage workers
        </CfFilledButton>
      </template>
    </CfActionCard>

    <CfActionCard title="Equipment">
      <template #body>
        <p>Add, edit, or remove  equipment used in your production.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Equipment' }">
          Manage equipment
        </CfFilledButton>
      </template>
    </CfActionCard>

    <CfActionCard title="Inventory Categories">
      <template #body>
        <p>Configure the categories that group your materials and products.</p>
      </template>
      <template #action>
        <CfFilledButton :to="{ name: 'Categories' }">
          Configure categories
        </CfFilledButton>
      </template>
    </CfActionCard>

  </CfAppView>
</template>