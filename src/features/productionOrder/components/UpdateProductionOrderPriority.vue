<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({
  data: Object,
  productionOrders: Array
})

const isLoading = ref(false)
const position = ref(props.data.seq)

const productionOrder = computed(() => {
  const index = position.value - 1
  const productionOrders = props.productionOrders
    .filter(({ id }) => props.data.id !== id)
    .map(({ publicId, priority, product }) => {
      return {
        productNormalizedName: product.normalizedName,
        publicId,
        priority
      }
    })

  return {
    beforePrev: productionOrders[index - 2],
    prev: productionOrders[index - 1],
    next: productionOrders[index],
    afterNext: productionOrders[index + 1]
  }
})

const ctx = computed(() => {
  const prevPriority = productionOrder.value.prev?.priority || -1000
  const nextPriority = productionOrder.value.next?.priority || 1000
  const priority = (prevPriority + nextPriority) / (prevPriority && nextPriority ? 2 : 1)

  return {
    id: props.data.id,
    priority
  }
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.productionOrder.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Reprioritize production order" @close="emit('cancel')">
    <template #body>
      <form id="updateProductionOrderPriority" @submit.prevent="invoke">
        <CfInput
          label="ID"
          :value="props.data.publicId"
          disabled
        />
        <CfSelect v-model.number="position" label="Position" required>
          <option v-for="n in props.productionOrders.length" :value="n">
            {{ n }}
          </option>
        </CfSelect>
      </form>
      <div class="productionOrdersListPreview">
        <h4>Preview</h4>
        <ul>
          <li v-if="!productionOrder.next && productionOrder.beforePrev">
            <span>{{ position - 2 }}.</span>
            <span>{{ productionOrder.beforePrev.publicId }}</span>
            <span>{{ productionOrder.beforePrev.productNormalizedName }}</span>
          </li>
          <li v-if="productionOrder.prev">
            <span>{{ position - 1 }}.</span>
            <span>{{ productionOrder.prev.publicId }}</span>
            <span>{{ productionOrder.prev.productNormalizedName }}</span>
          </li>
          <li class="current">
            <span>{{ position }}.</span>
            <span>{{ props.data.publicId }}</span>
            <span>{{ props.data.product.normalizedName }}</span>
          </li>
          <li v-if="productionOrder.next">
            <span>{{ position + 1 }}.</span>
            <span>{{ productionOrder.next.publicId }}</span>
            <span>{{ productionOrder.next.productNormalizedName }}</span>
          </li>
          <li v-if="!productionOrder.prev && productionOrder.afterNext">
            <span>{{ position + 2 }}.</span>
            <span>{{ productionOrder.afterNext.publicId }}</span>
            <span>{{ productionOrder.afterNext.productNormalizedName }}</span>
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="updateProductionOrderPriority"
        :loading="isLoading"
        :disabled="position === props.data.seq"
      >
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style lang="scss">
#updateProductionOrderPriority {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.productionOrdersListPreview {
  h4 {
    font-size: 0.875rem;
    color: var(--cf-gray-3);
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  ul {
    border: 1px solid var(--cf-gray-5);
    border-radius: 0.3125rem;
    overflow: hidden;
  }

  li {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, max-content) auto;
    padding: 0.5rem;
  }

  .current {
    background: var(--cf-gray-9);
  }
}
</style>