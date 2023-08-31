<script setup>
import { ref } from 'vue'
import { CfInput, CfFilledButton } from 'vue-cf-ui'
import { CategorySelect } from '../../category/index.js'
import { Metafield } from '../../metafield/index.js'
import { OperationChoiceList } from '../../operation/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const metafields = ref([])
const productMeta = ref({})
const ctx = ref({
  sku: '',
  name: '',
  uom: '',
  category: {},
  operationIds: [],
  meta: null
})

const invoke = async () => {
  try {
    isLoading.value = true

    if (Object.values(productMeta.value).some(({ value }) => value !== null)) {
      ctx.value.meta = {}

      metafields.value.forEach(({ id }) => {
        if (productMeta.value[id].value) {
          ctx.value.meta[id] = productMeta.value[id]
        }
      })
    }

    const product = await api.product.createOne(ctx.value)

    emit('success', product)
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

const setupMetafields = (data) => {
  if (data.length) {
    metafields.value = data

    data.forEach(({ id, type }) => {
      const meta = { value: null } 
      
      if (['DIMENSION', 'VOLUME', 'WEIGHT'].includes(type)) {
        meta.uom = null
      }

      productMeta.value[id] = meta
    })
  }
}

api.metafield
  .getAll({ resource: 'PRODUCT' })
  .then(setupMetafields)
</script>

<template>
  <form id="createProduct" @submit.prevent="invoke">
    <fieldset>
      <CategorySelect
        v-model="ctx.category"
        type="products"
      />
      <CfInput
        v-model="ctx.sku"
        label="SKU"
        required
      />
      <CfInput
        v-model="ctx.name"
        label="Name"
        required
      />
      <CfInput
        v-model="ctx.uom"
        label="UOM"
        required
      />
      <OperationChoiceList v-model="ctx.operationIds"/>
    </fieldset>
    <fieldset v-if="metafields.length">
      <Metafield
        v-for="field in metafields"
        v-model="productMeta[field.id]"
        :key="field.id"
        :data="field"
      />
    </fieldset>
    <hr>
    <footer>
      <CfFilledButton type="submit" :loading="isLoading">
        Add
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
      <p>After you add a product, you can only edit it if it has no production orders.</p>
    </footer>
  </form>
</template>

<style lang="scss">
#createProduct {
  fieldset {
    display: grid;
    gap: 1rem;
    max-width: 22rem;

    &:nth-child(2) {
      margin-top: 1rem;
    }
  }

  hr {
    border-top: 1px solid var(--cf-gray-8);
    margin: 1.5rem 0;
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
</style>