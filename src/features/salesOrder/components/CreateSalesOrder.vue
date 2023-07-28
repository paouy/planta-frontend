<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createSalesOrder } from '../api/index.js'
import { getCustomers } from '../../customer/api/index.js'
import { getProducts } from '../../product/api/index.js'
import { CfInput, CfSelect, CfOutlinedButton, CfFilledButton } from '../../../components/index.js'

const router = useRouter()

const isLoading = ref(false)
const customerOptions = ref([])
const products = ref([])
const salesOrder = ref({
  customFriendlyId: '',
  customerId: '',
  date: ''
})
const salesOrderItems = ref([
  {
    product: {
      id: '',
      uom: ''
    },
    qty: null
  }
])

const productOptions = computed(() => {
  const selectedProductIds = salesOrderItems.value
    .map(({ product }) => product.id)
    .filter(id => id)

  return products.value.map(({ id, sku, name, uom }) => ({
    label: `[${sku}] ${name}`,
    value: { id, uom },
    disabled: selectedProductIds.includes(id)
  }))
})

const hasSelectableProductOption = computed(() => productOptions.value.some(({ disabled }) => !disabled))

const addItem = () => {
  salesOrderItems.value.push({
    product: {
      id: '',
      uom: ''
    },
    qty: null
  })
}

const removeItem = (index) => {
  salesOrderItems.value.splice(index, 1)
}

const invoke = async () => {
  try {
    isLoading.value = true

    const order = {
      ...salesOrder.value,
      items: salesOrderItems.value.map(({ product, qty }) => ({
        productId: product.id,
        qty
      }))
    }

    // console.log(JSON.stringify(order, null, 2))

    await createSalesOrder(order)

    router.push({ name: 'SalesOrders' })
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  getCustomers().then(data => {
    customerOptions.value = data.map(({ id, shortName }) => ({
      label: shortName,
      value: id
    }))
  })

  getProducts().then(data => {
    products.value = data.map(
      ({ id, sku, name, uom }) => ({ id, sku, name, uom })
    )
  })
})
</script>

<template>
  <form id="createSalesOrder" @submit.prevent="invoke">
    <fieldset>
      <CfSelect
        v-model="salesOrder.customerId"
        label="Customer"
        :options="customerOptions"
        autofocus
        required
      />
      <CfInput
        v-model="salesOrder.customFriendlyId"
        label="Order number"
        required
      />
      <CfInput
        v-model="salesOrder.date"
        label="Date"
        type="date"
        required
      />
    </fieldset>
    <table class="createSalesOrderItems">
      <colgroup>
        <col v-for="n in 3">
      </colgroup>
      <tbody>
        <tr v-for="(item, index) in salesOrderItems" :key="index">
          <td>
            <CfSelect
              v-model="salesOrderItems[index].product"
              label="Product"
              :options="productOptions"
              required
            />
          </td>
          <td>
            <CfInput
              v-model.number="salesOrderItems[index].qty"
              label="Qty"
              :suffix="salesOrderItems[index].product.uom"
              type="number"
              step="any"
              min="1"
              required
            />
          </td>
          <td>
            <button
              type="button"
              @click="removeItem(index)"
              v-if="salesOrderItems.length > 1"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <CfOutlinedButton @click="addItem" :disabled="!hasSelectableProductOption">
      Add product
    </CfOutlinedButton>
    <hr>
    <footer>
      <CfFilledButton type="submit" :loading="isLoading">Create</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="router.push({ name: 'SalesOrders' })"
      >
        Cancel
      </CfFilledButton>
      <p>When you create a sales order, it does not immediately allocate stock or create production orders.</p>
    </footer>
  </form>
</template>

<style lang="scss">
#createSalesOrder {
  fieldset {
    display: grid;
    gap: 1rem;
    max-width: 18rem;
    margin-bottom: 1.5rem;
  }

  hr {
    border-top: 1px solid var(--cf-gray-8);
    margin: 1rem 0 1.5rem;
  }

  footer {
    display: flex;
    gap: 0.5rem;
    flex-direction: row-reverse;
    justify-content: end;
    align-items: center;

    p {
      margin-right: auto;
    }
  }
}

.createSalesOrderItems {
  margin-bottom: 1.5rem;
  width: 100%;

  col {
    &:first-child {
      width: 24rem;
    }

    &:nth-child(2) {
      width: 10rem;
    }
  }

  td {
    padding: 0.5rem;
    vertical-align: bottom;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    button {
      display: grid;
      place-content: center;
      color: var(--cf-gray-5);
      font-variation-settings: 'FILL' 0, 'wght' 350, 'GRAD' 0, 'opsz' 20;
      height: 2.125rem;
      width: 2.125rem;

      &:hover {
        color: var(--cf-red-4);
      }
    }
  }
}
</style>