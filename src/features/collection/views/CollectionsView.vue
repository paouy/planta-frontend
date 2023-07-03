<script setup>
import { ref } from 'vue'
import { useCollectionStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { getCollections } from '../api/index.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from '../../../components/index.js'
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

const { isInitialized, isInitializing } = useMiscStore()
const { collections, ...collectionStore } = useCollectionStore()

if (!isInitialized.value && !isInitializing.value) {
  getCollections().then(collectionStore.set)
}

const collection = ref(null)
const currentAction = ref(null)

const onCollectionsListAction = ({ action, item }) => {
  currentAction.value = action
  collection.value = item
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Inventory Collections" description="Configure the collections that group your materials and products.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'ADD'">
          Add collection
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <CollectionsList
      :data="collections"
      @action="onCollectionsListAction"
    />
    <AddCollection
      @success="collectionStore.add"
      @cancel="currentAction = null"
      v-if="currentAction === 'ADD'"
    />
    <UpdateCollection
      :data="collection"
      @success="collectionStore.update"
      @cancel="currentAction = null"
      v-if="currentAction === 'EDIT'"
    />
    <RemoveCollection
      :data="collection"
      @success="collectionStore.remove"
      @cancel="currentAction = null"
      v-if="currentAction === 'REMOVE'"
    />
  </CfAppView>
</template>