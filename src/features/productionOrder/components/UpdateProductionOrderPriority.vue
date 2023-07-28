<script setup>
import { ref, computed } from 'vue'
import { updateProductionOrder } from '../api/index.js'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({
  data: Object,
  productionOrders: Array
})

const isLoading = ref(false)
const position = ref(props.data.seq)

const index = computed(() => position.value - 1)
const positionOptions = computed(() => Array.from({ length: props.productionOrders.length }, (_, i) => i + 1))
const productionOrders = computed(() => props.productionOrders.filter(({ id }) => props.data.id !== id))

const prev = computed(() => productionOrders.value[index.value - 1])
const next = computed(() => productionOrders.value[index.value])

const onSubmit = async () => {
  try {
    isLoading.value = true

    const productionOrder = {
      id: props.data.id,
      priority: ((prev.value?.priority || 0) + next.value.priority) / 2
    }

    await updateProductionOrder(productionOrder)

    emit('success', productionOrder)
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
      <form id="updateProductionOrderPriority" @submit.prevent="onSubmit">
        <CfInput
          label="ID"
          :value="props.data.friendlyId"
          disabled
        />
        <CfSelect
          v-model="position"
          label="Position"
          :options="positionOptions"
          required
        />
      </form>
      <div class="productionOrdersListPreview">
        <h4>Preview</h4>
        <ul>
          <li v-if="prev">
            <span>{{ position - 1 }}.</span>
            <span>{{ prev.friendlyId }}</span>
            <span>{{ prev.product.name }}</span>
          </li>
          <li class="currentProductionOrder">
            <span>{{ position }}.</span>
            <span>{{ props.data.friendlyId }}</span>
            <span>{{ props.data.product.name }}</span>
          </li>
          <li v-if="next">
            <span>{{ position + 1 }}.</span>
            <span>{{ next.friendlyId }}</span>
            <span>{{ next.product.name }}</span>
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
      >Save</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
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

  .currentProductionOrder {
    background: var(--cf-gray-9);
  }
}
</style>