<script setup>
import { ref } from 'vue'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { CreateMetafield, DeleteMetafield, MetafieldsList, UpdateMetafield } from '../features/metafield/index.js'
import api from '../api/index.js'

const breadcrumbs = [
  { name: 'Configurations', path: '/settings/configurations' },
  { name: 'Custom Data' }
]

const metafields = ref([])
const metafield = ref(null)
const currentAction = ref(null)

const onAction = ({ key, data }) => {
  currentAction.value = key
  metafield.value = data
}

const onCreate = (data) => metafields.value.push(data)

const onDelete = (deletedId) => {
  const index = metafields.value.findIndex(({ id }) => deletedId === id)
  metafields.value.splice(index, 1)
}

const onUpdate = (data) => {
  const index = metafields.value.findIndex(({ id }) => data.id === id)
  Object.assign(metafields.value[index], data)
}

api.metafield
  .getAll()
  .then(data => metafields.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Custom Data" description="Configure custom data fields for products and orders.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add custom field
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <MetafieldsList
      @action="onAction"
      :data="metafields"
    />
  </CfAppView>

  <CreateMetafield
    @success="onCreate"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <DeleteMetafield
    :data="metafield"
    @success="onDelete"
    @cancel="currentAction = metafield = null"
    v-if="currentAction === 'REMOVE'"
  />

  <UpdateMetafield
    :data="metafield"
    @success="onUpdate"
    @cancel="currentAction = metafield = null"
    v-if="currentAction === 'EDIT'"
  />
</template>