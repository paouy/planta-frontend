<script setup>
import { ref, computed } from 'vue'
import { updateProductionOrder } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

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

const prevOrder = computed(() => productionOrders.value[index.value - 1])
const nextOrder = computed(() => productionOrders.value[index.value])

const onSubmit = async () => {
  try {
    isLoading.value = true

    const productionOrder = {
      id: props.data.id,
      priority: ((prevOrder.value?.priority || 0) + nextOrder.value.priority) / 2
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
        <CfField
          label="ID"
          :value="props.data.friendlyId"
          disabled
        />
        <CfField
          v-model="position"
          label="Position"
          type="select"
          :options="positionOptions"
          required
        />
      </form>
      <div class="productionOrdersListPreview">
        <h4>Preview</h4>
        <ul>
          <li v-if="prevOrder">
            <span>{{ position - 1 }}.</span>
            <span>{{ prevOrder.friendlyId }}</span>
            <span>{{ prevOrder.product.name }}</span>
          </li>
          <li class="currentProductionOrder">
            <span>{{ position }}.</span>
            <span>{{ props.data.friendlyId }}</span>
            <span>{{ props.data.product.name }}</span>
          </li>
          <li v-if="nextOrder">
            <span>{{ position + 1 }}.</span>
            <span>{{ nextOrder.friendlyId }}</span>
            <span>{{ nextOrder.product.name }}</span>
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
    background: var(--cf-blue-9);
  }
}
</style>