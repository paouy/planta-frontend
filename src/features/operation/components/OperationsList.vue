<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'

const emit = defineEmits(['update:selection', 'action'])

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  selection: {
    type: Array,
    default: []
  },
  actions: Array,
  customTemplate: Boolean,
  selectable: Boolean,
  sortable: Boolean,
  searchable: Boolean
})

const sortKey = ref('')
const sortOrder = ref('asc')
const searchText = ref('')

let fuseResults

if (props.searchable) {
  fuseResults = useFuse(searchText, props.data, {
    fuseOptions: {
      keys: props.columns.map(({ key }) => key),
      minMatchCharLength: 3,
      threshold: 0.4
    },
    matchAllWhenSearchEmpty: true
  }).results
}

const computedData = computed(() => {
  const data = fuseResults.value ?? props.data

  return data
    .map(result => result.item || result)
    .sort((a, b) => {
      const aValue = a[sortKey.value]
      const bValue = b[sortKey.value]

      if (typeof aValue === 'string') {
        return sortOrder.value === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortOrder.value === 'asc'
        ? aValue - bValue
        : bValue - aValue
    })
    .map((item, index) => {
      const selectable = item.selectable ?? true
      const selected = props.selection.includes(item.id)

      return {
        ...item,
        index,
        selectable,
        selected
      }
    })
})

const isTableSelectable = computed(() => {
  return computedData.value.some(item => item.selectable)
})

const isTableSelected = computed(() => {
  const selectable = computedData.value
    .filter(item => item.selectable)
    .length

  return selectable >= 1 && (selectable === props.selection.length)
})

const onToggleTable = (event) => {
  let selection = []

  if (event.target.checked) {
    selection = computedData.value
      .filter(item => !item.disabled && item.selectable)
      .map(item => item.id)
  }

  emit('update:selection', selection)
}

const onToggleItem = (itemId) => {
  const selection = props.selection.includes(itemId)
    ? props.selection.slice().filter(id => id !== itemId)
    : props.selection.concat(itemId)

  emit('update:selection', selection)
}

const onSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
</script>

<template>
  <input type="text" v-model="searchText">
  <div class="cf-data-table-2">
    <header>
      <slot name="header"></slot>
    </header>
    <table>
      <colgroup>
        <col style="--w: 3rem" v-if="props.selectable">
        <col
          v-for="column in props.columns"
          :key="column.key"
          :style="{ '--w': column.width }"
        >
        <col
          :style="{ '--w': props.actions.length > 1 ? '4rem' : '8rem' }"
          v-if="props.actions"
        >
      </colgroup>
      <thead>
        <tr>
          <th data-table-checkbox v-if="props.selectable">
            <input
              type="checkbox"
              :checked="isTableSelected"
              :disabled="!isTableSelectable"
              @change="onToggleTable"
            >
          </th>
          <th v-for="column in props.columns" :key="column.key">
            <button @click="onSort(column.key)" v-if="props.sortable">
              {{ column.label }}
            </button>
            <div v-else>
              {{ column.label }}
            </div>
          </th>
          <th data-table-actions v-if="props.actions">
            <div v-if="props.actions.length === 1">
              Actions
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="!props.customTemplate">
        <tr v-for="item in computedData" :key="item.id">
          <td data-table-checkbox v-if="props.selectable">
            <input
              type="checkbox"
              :value="item.id"
              :checked="item.selected"
              :disabled="!item.selectable"
              @change="onToggleItem(item.id)"
            >
          </td>
          <td v-for="column in columns" :key="column.key">
            {{ item[column.key]?.toLocaleString() }}
          </td>
          <td data-table-actions v-if="props.actions">
            <button>
              {{ props.actions.length > 1 ? '•••' : props.actions[0] }}
            </button>
            <div v-if="props.actions.length > 1">
              <button
                v-for="action in props.actions"
                @click="emit('action', { action, item })"
              >
                {{ action }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="item in computedData" :key="item.id">
          <td data-table-checkbox v-if="props.selectable">
            <input
              type="checkbox"
              :value="item.id"
              :checked="item.selected"
              :disabled="!item.selectable"
              @change="onToggleItem(item.id)"
            >
          </td>
          <slot :item="item"></slot>
          <td data-table-actions v-if="props.actions">
            <button>
              {{ props.actions.length > 1 ? '•••' : props.actions[0] }}
            </button>
            <div v-if="props.actions.length > 1">
              <button
                v-for="action in props.actions"
                @click="emit('action', { action, item })"
              >
                {{ action }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.cf-data-table-2 {
  border: 1px solid var(--cf-gray-7);
  border-radius: 0.3125rem;
  overflow: hidden;

  table {
    table-layout: fixed;
    width: 100%;
  }

  col {
    width: var(--w);
  }

  thead {
    background: var(--cf-gray-9);

    button,
    div {
      padding: 0.5rem 1rem;
      width: 100%;
    }

    button:hover {
      background: var(--cf-gray-8);
    }
  }

  tbody {
    tr {
      border-top: 1px solid var(--cf-gray-8);
    }

    td {
      padding: 0.5rem 1rem;
    }
  }

  [data-table-actions] {
    position: relative;

    > button {
      &:only-child {
        color: var(--cf-blue-4);

        &:hover {
          text-decoration: underline;
          text-underline-offset: 0.25rem;
        }
      }

      &:not(:only-child) {
        display: block;
        text-align: center;
        border-radius: 0.3125rem;
        height: 1.5rem;
        width: 2rem;

        &:hover {
          background: var(--cf-gray-9);
        }
      }
    }

    div {
      display: none;
      margin-top: 0.25rem;
      border: 1px solid var(--cf-gray-7);
      border-radius: 0.3125rem;
      background: #fff;
      position: absolute;
      left: auto;
      right: 1rem;
      z-index: 1;
      overflow: hidden;

      button {
        padding: 0.5rem 1rem;

        &:hover {
          background: var(--cf-gray-9);
        }
      }
    }

    &:focus-within {
      > button {
        background: var(--cf-gray-9);
      }
      
      div {
        display: grid;
      }
    }
  }

  [data-table-checkbox] {
    padding: 0.5rem 1rem;
    position: relative;
    
    input {
      border: 1px solid var(--cf-gray-5);
      border-radius: 0.3125rem;
      margin: auto;
      background: #fff;
      width: 1rem;
      height: 1rem;
      transition: border-color 0.2s ease 0s;
      position: absolute;
      top: 0;
      bottom: 0;
      appearance: none;
      cursor: pointer;

      &:checked {
        background: var(--cf-gray-4) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="white"><path d="m8.229 14.062-3.521-3.541L5.75 9.479l2.479 2.459 6.021-6L15.292 7Z"/></svg>') no-repeat center;
      }

      &:hover:not(:checked, :disabled) {
        border-color: var(--cf-blue-4);
      }

      &:focus {
        border-color: var(--cf-blue-4);
        outline: 2px solid var(--cf-blue-4);
        outline-offset: 3px;
      }

      &:disabled {
        opacity: 0.5;
        cursor: default;

        ~ * {
          opacity: 0.5;
          cursor: default !important;
        }
      }
    }
  }
}
</style>