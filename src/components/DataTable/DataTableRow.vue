<script setup>
import { computed } from 'vue'
import { getProperty } from 'dot-prop'
import { RouterLink } from 'vue-router'

const emit = defineEmits(['toggle', 'action'])

const props = defineProps({
  data: Object,
  columns: Array,
  forceMenu: Boolean,
  includeCheckbox: Boolean
})

const hasMenu = computed(() => props.forceMenu || props.data.actions.length > 1)
const primaryActionLabel = computed(() => hasMenu.value ? '•••' : props.data.actions[0])
const actions = computed(() => props.data.actions.map(action => {
  const name = action.name || action
  const key = name.toUpperCase().replaceAll(' ', '_')
  let component = 'button'

  if (action.to) {
    component = RouterLink
  }

  if (action.href) {
    component = 'a'
  }

  return {
    label: name,
    to: action.to,
    href: action.href,
    key,
    component
  }
}))
</script>

<template>
  <tr>
    <td data-table-checkbox v-if="props.includeCheckbox">
      <input
        type="checkbox"
        :value="props.data.id"
        :checked="props.data.selected"
        :disabled="!props.data.selectable"
        @change="emit('toggle')"
      >
    </td>

    <slot>
      <td v-for="column in props.columns" :key="column.key">
        {{ getProperty(props.data, column.key)?.toLocaleString() }}
      </td>
    </slot>

    <td data-table-row-actions v-if="props.data.actions">
      <button>{{ primaryActionLabel }}</button>
      <div v-if="hasMenu">
        <component
          v-for="action in actions"
          :key="action.key"
          :is="action.component"
          :to="action.to"
          :href="action.href"
          @click="emit('action', { action: action.key, data: props.data })"
        >
          {{ action.label }}
        </component>
      </div>
    </td>
  </tr>
</template>