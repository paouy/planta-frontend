<script setup>
import { ref, onBeforeMount } from 'vue'
import { CfDialog, CfInput, CfSelect, CfSwitch, CfTagsInput, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })
const typeOptions = ['Text', 'Number', 'Date', 'Dimension', 'Volume', 'Weight']
  .map(type => ({ label: type, value: type.toUpperCase() }))
const resourceOptions = ['Product', 'Production Order', 'Sales Order']
  .map(resource => ({ label: resource, value: resource.replace('_', ' ').toUpperCase() }))

const isLoading = ref(false)
const ctx = ref({
  id: '',
  name: '',
  type: '',
  resource: '',
  attributes: []
})
const attributes = ref({
  'MIN': '',
  'MAX': '',
  'STEP': '',
  'OPTIONS': []
})
const showTagsInput = ref(false)

onBeforeMount(() => {
  ctx.value = {
    id: props.data.id,
    name: props.data.name,
    type: props.data.type,
    resource: props.data.resource,
    attributes: []
  }

  props.data.attributes.forEach(attribute => {
    attributes.value[attribute.type] = attribute.value

    if (attribute.type === 'OPTIONS') {
      showTagsInput.value = true
    }
  })
})

const invoke = async () => {
  try {
    isLoading.value = true

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

    await api.metafield.updateOne(ctx.value)

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
  <CfDialog title="Edit custom field" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="updateMetafield" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
        <CfSelect
          v-model="ctx.resource"
          label="Resource"
          :options="resourceOptions"
          required
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
      <CfFilledButton type="submit" form="updateMetafield" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateMetafield {
  display: grid;
  gap: 1rem;
}
</style>