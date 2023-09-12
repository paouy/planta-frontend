<script setup>
import { ref, computed } from 'vue'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { CreateMetafield, DeleteMetafield, MetafieldsList, UpdateMetafield } from '../features/metafield/index.js'
import api from '../api/index.js'

const props = defineProps({ resource: String })

const metafields = ref([])
const metafield = ref(null)
const currentAction = ref(null)

const resource = computed(() => props.resource.toUpperCase())
const normalizedResource = computed(() => {
  return resource.value.charAt(0) + resource.value.slice(1).toLowerCase()
})
const breadcrumbs = computed(() => [
  { name: 'Custom Data', path: '/settings/configurations/custom-data' },
  { name: normalizedResource.value }
])

const onAction = ({ key, data }) => {
  if (key === 'MOVE_UP') {
    return onMoveUp(data)
  }

  if (key === 'MOVE_DOWN') {
    return onMoveDown(data)
  }

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

const onMoveUp = (data) => {
  const index = metafields.value.findIndex(({ id }) => data.id === id)
  const { id, position } = metafields.value[index - 1]

  api.metafield.updateOne({ id, position: position + 1 })
  api.metafield.updateOne({ id: data.id, position: data.position - 1 })

  metafields.value[index].position--
  metafields.value[index - 1].position++

  [
    metafields.value[index],
    metafields.value[index - 1]
  ] = [
    metafields.value[index - 1],
    metafields.value[index]
  ]
}

const onMoveDown = (data) => {
  const index = metafields.value.findIndex(({ id }) => data.id === id)
  const { id, position } = metafields.value[index + 1]
  
  api.metafield.updateOne({ id, position: position - 1 })
  api.metafield.updateOne({ id: data.id, position: data.position + 1 })

  metafields.value[index].position++
  metafields.value[index + 1].position--

  [
    metafields.value[index],
    metafields.value[index + 1]
  ] = [
    metafields.value[index + 1],
    metafields.value[index]
  ]
}

api.metafield
  .getAll({ resource: props.resource.toUpperCase() })
  .then(data => metafields.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="`Custom ${normalizedResource} Data`">
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
    :resource="props.resource.toUpperCase()"
    :last-position="metafields[metafields.length - 1]?.position"
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