<script setup>
import { ref } from 'vue'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { useCategoryStore, CategoriesList, CreateCategory, DeleteCategory, UpdateCategory } from '../features/category/index.js'
import { useMiscStore } from '../features/misc/index.js'
import api from '../api/index.js'

const breadcrumbs = [
  { name: 'Configurations', path: '/settings/configurations' },
  { name: 'Inventory Categories' }
]

const { isInitialized, isInitializing } = useMiscStore()
const { categories, ...categoryStore } = useCategoryStore()

if (!isInitialized.value && !isInitializing.value) {
  api.category.getAll().then(categoryStore.set)
}

const category = ref(null)
const currentAction = ref(null)

const onCategoriesListAction = ({ key, data }) => {
  currentAction.value = key
  category.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Inventory Categories" description="Configure the categories that group your materials and products.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add category
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <CategoriesList
      :data="categories"
      @action="onCategoriesListAction"
    />
  </CfAppView>

  <CreateCategory
    @success="categoryStore.add"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <UpdateCategory
    :data="category"
    @success="categoryStore.update"
    @cancel="currentAction = category = null"
    v-if="currentAction === 'EDIT'"
  />
  
  <DeleteCategory
    :data="category"
    @success="categoryStore.remove"
    @cancel="currentAction = category = null"
    v-if="currentAction === 'REMOVE'"
  />
</template>