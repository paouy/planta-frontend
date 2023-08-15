<script setup>
import { ref, computed } from 'vue'
import { CfInput, CfSelect, CfOutlinedButton, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const customerOptions = ref([])
const products = ref([])
const lastPublicId = ref('')
const ctx = ref({
  publicId: '',
  customer: {
    id: ''
  },
  date: new Date().toLocaleDateString('en-CA'),
  items: [
    {
      product: {
        id: '',
        uom: ''
      },
      qty: null
    }
  ]
})

const productOptions = computed(() => {
  const selectedProductIds = ctx.value.items
    .map(({ product }) => product.id)
    .filter(id => id)

  const options = products.value.map(({ id, normalizedName, uom }) => ({
    label: normalizedName,
    value: { id, uom },
    disabled: selectedProductIds.includes(id)
  }))

  return options
})

const hasSelectableProductOption = computed(() => productOptions.value.some(({ disabled }) => !disabled))

const addItem = () => {
  ctx.value.items.push({
    product: {
      id: '',
      uom: ''
    },
    qty: null
  })
}

const removeItem = (index) => {
  ctx.value.items.splice(index, 1)
}

const invoke = async () => {
  try {
    isLoading.value = true

    const salesOrder = await api.salesOrder.createOne(ctx.value)

    emit('success', salesOrder)
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

api.customer.getAll().then(data => {
  customerOptions.value = data.map(({ id, shortName }) => ({
    label: shortName,
    value: id
  }))
})

api.lookup
  .get('lastSalesOrderPublicId')
  .then(data => lastPublicId.value = data.lastSalesOrderPublicId)

api.product.getAll().then(data => {
  products.value = data.map(
    ({ id, normalizedName, uom }) => ({ id, normalizedName, uom })
  )
})
</script>

<template>
  <form id="createSalesOrder" @submit.prevent="invoke">
    <fieldset>
      <CfSelect
        v-model="ctx.customer.id"
        label="Customer"
        :options="customerOptions"
        required
      />
      <CfInput
        v-model="ctx.publicId"
        label="Order number"
        :helper="lastPublicId ? `Last order number: ${lastPublicId}` : null"
        required
      />
      <CfInput
        v-model="ctx.date"
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
        <tr v-for="(item, index) in ctx.items" :key="index">
          <td>
            <CfSelect
              v-model="ctx.items[index].product"
              label="Product"
              :options="productOptions"
              required
            />
          </td>
          <td>
            <CfInput
              v-model.number="ctx.items[index].qty"
              label="Qty"
              :suffix="ctx.items[index].product.uom"
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
              v-if="ctx.items.length > 1"
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
      <CfFilledButton type="submit" :loading="isLoading">
        Create
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
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
    margin-bottom: 2rem;
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