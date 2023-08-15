<script setup>
import { ref, onMounted } from 'vue'
import { useCustomerStore } from '../store.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from 'vue-cf-ui'
import CustomersList from '../components/CustomersList.vue'
import CreateCustomer from '../components/CreateCustomer.vue'
import UpdateCustomer from '../components/UpdateCustomer.vue'
import DeleteCustomer from '../components/DeleteCustomer.vue'
import api from '../../../api/index.js'

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