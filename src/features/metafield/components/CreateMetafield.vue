<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSelect, CfSwitch, CfTagsInput, CfFilledButton } from 'vue-cf-ui'
import { OperationSelect } from '../../operation/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const typeOptions = ['Text', 'Number', 'Date', 'Dimension', 'Volume', 'Weight']
  .map(type => ({ label: type, value: type.toUpperCase() }))
const resourceOptions = [
  { label: 'Product', value: 'PRODUCT' },
  { label: 'Operation', value: 'OPERATION' }
]

const isLoading = ref(false)
const ctx = ref({
  name: '',
  type: '',
  resource: '',
  attributes: []
})
const resource = ref('')
const operationId = ref('')
const attributes = ref({
  'MIN': '',
  'MAX': '',
  'STEP': '',
  'OPTIONS': []
})
const showTagsInput = ref(false)

const invoke = async () => {
  try {
    isLoading.value = true

    ctx.value.resource = resource.value === 'OPERATION'
      ? `OPERATION:${operationId.value}`
      : 'PRODUCT'

    if (ctx.value.type === 'TEXT') {
      if (showTagsInput.value && attributes.value.OPTIONS.length) {
        ctx.value.attributes.push({
          type: 'OPTIONS',
          value: attributes.value.OPTIONS
        })
      }
    }

    if (ctx.value.type === 'NUMBER') {
      ['MIN', 'MAX', 'STEP'].forEach(key => {
        const attribute = attributes.value[key]

        if (attribute.length > 1) {
          ctx.value.attributes.push({
            type: key,
            value: attribute
          })
        }
      })
    }

    const metafield = await api.metafield.createOne(ctx.value)

    emit('success', metafield)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add custom field" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createMetafield" @submit.prevent="invoke">
        <CfInput
          v-model.trim="ctx.name"
          label="Name"
          required
        />
        <CfSelect
          v-model="resource"
          label="Resource"
          :options="resourceOptions"
          required
        />
        <OperationSelect
          v-model="operationId"
          :keys="['id']"
          v-if="resource === 'OPERATION'"
        />
        <CfSelect
          v-model="ctx.type"
          label="Type"
          :options="typeOptions"
          required
        />

        <CfSwitch
          v-model="showTagsInput"
          label="Limit to preset options"
          v-if="ctx.type === 'TEXT'"
        />
        <CfTagsInput
          v-model="attributes.OPTIONS"
          label="Options"
          v-if="ctx.type === 'TEXT' && showTagsInput"
        />

        <CfInput
          v-model="attributes.MIN"
          label="Minimum value"
          v-if="ctx.type === 'NUMBER'"
        />
        <CfInput
          v-model="attributes.MAX"
          label="Maximum value"
          v-if="ctx.type === 'NUMBER'"
        />
        <CfInput
          v-model="attributes.STEP"
          label="Step size"
          v-if="ctx.type === 'NUMBER'"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createMetafield" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createMetafield {
  display: grid;
  gap: 1rem;
}
</style>