<script setup>
import { ref, onMounted } from 'vue'
import { getCollections } from '../api/index.js'
import {
  CfAppView,
  CfBreadcrumbs,
  CfHeader,
  CfFilledButton
} from '../../../components/index.js'
import CollectionsList from '../components/CollectionsList.vue'
import AddCollection from '../components/AddCollection.vue'
import UpdateCollection from '../components/UpdateCollection.vue'
import RemoveCollection from '../components/RemoveCollection.vue'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Inventory Collections'
  }
]

const collections = ref([])
const collection = ref(null)
const showAddCollection = ref(false)
const showUpdateCollection = ref(false)
const showRemoveCollection = ref(false)

const onCollectionsListAction = ({ action, item }) => {
  if (action === 'Edit') {
    showUpdateCollection.value = true
  } else if (action === 'Remove') {
    showRemoveCollection.value = true
  }

  collection.value = item
}

const onAddCollectionSuccess = (addedCollection) => {
  collections.value.push(addedCollection)
}

const onUpdateCollectionSuccess = (updatedCollection) => {
  const collectionIndex = collections.value
    .findIndex(({ id }) => id === updatedCollection.id)

  collections.value[collectionIndex] = updatedCollection
}

const onRemoveCollectionSuccess = (collectionIndex) => {
  collections.value.splice(collectionIndex, 1)
}

onMounted(async () => collections.value = await getCollections())
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfHeader title="Inventory Collections" description="Configure the collections that group your inventory materials and products.">
      <template #actions>
        <CfFilledButton @click="showAddCollection = true">
          Add collection
        </CfFilledButton>
      </template>
    </CfHeader>
    <CollectionsList
      :data="collections"
      @action="onCollectionsListAction"
    />
    <AddCollection
      @success="onAddCollectionSuccess"
      @cancel="showAddCollection = false"
      v-if="showAddCollection"
    />
    <UpdateCollection
      :data="collection"
      @success="onUpdateCollectionSuccess"
      @cancel="showUpdateCollection = false"
      v-if="showUpdateCollection"
    />
    <RemoveCollection
      :data="collection"
      @success="onRemoveCollectionSuccess"
      @cancel="showRemoveCollection = false"
      v-if="showRemoveCollection"
    />
  </CfAppView>
</template>