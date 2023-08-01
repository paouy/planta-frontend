<script setup>
import { ref, onMounted } from 'vue'
import { useCustomerStore } from '../store.js'
import { getCustomers } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import CustomersList from '../components/CustomersList.vue'
import CreateCustomer from '../components/CreateCustomer.vue'
import UpdateCustomer from '../components/UpdateCustomer.vue'
import DeleteCustomer from '../components/DeleteCustomer.vue'

const { customers, ...customerStore } = useCustomerStore()

onMounted(() => getCustomers().then(customerStore.set))

const customer = ref(null)
const currentAction = ref(null)

const onAction = ({ action, data }) => {
  currentAction.value = action
  customer.value = data
}
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Sales" title="Customers">
      <template #actions>
        <CfOutlinedButton @click="currentAction = 'CREATE'">
          Add customer
        </CfOutlinedButton>
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