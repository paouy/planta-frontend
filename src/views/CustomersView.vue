<script setup>
import { ref, onMounted } from 'vue'
import { CfAppView, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { useCustomerStore, CreateCustomer, CustomersList, DeleteCustomer, UpdateCustomer } from '../features/customer/index.js'
import api from '../api/index.js'

const { customers, ...customerStore } = useCustomerStore()

onMounted(() => api.customer.getAll().then(customerStore.set))

const customer = ref(null)
const currentAction = ref(null)

const onAction = ({ key, data }) => {
  currentAction.value = key
  customer.value = data
}
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Sales" title="Customers">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add customer
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <CustomersList
      :data="customers"
      @action="onAction"
    />
  </CfAppView>

  <CreateCustomer
    @success="customerStore.create"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />
  
  <UpdateCustomer
    :data="customer"
    @success="customerStore.update"
    @cancel="currentAction = customer = null"
    v-if="currentAction === 'EDIT'"
  />

  <DeleteCustomer
    :data="customer"
    @success="customerStore.remove"
    @cancel="currentAction = customer = null"
    v-if="currentAction === 'DELETE'"
  />
</template>