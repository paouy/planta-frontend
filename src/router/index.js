import { createRouter, createWebHistory } from 'vue-router'
import MaterialsView from '../features/material/views/MaterialsView.vue'
import ConfigurationsView from '../features/misc/views/ConfigurationsView.vue'
import OperationsView from '../features/operation/views/OperationsView.vue'
import WorkstationsView from '../features/workstation/views/WorkstationsView.vue'
import EquipmentsView from '../features/equipment/views/EquipmentsView.vue'
import CollectionsView from '../features/collection/views/CollectionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/inventory',
      children: [
        {
          path: 'materials',
          name: 'Materials',
          component: MaterialsView
        }
      ]
    }, {
      path: '/settings/configurations',
      children: [
        {
          path: '',
          name: 'Configurations',
          component: ConfigurationsView
        }, {
          path: 'operations',
          name: 'Operations',
          component: OperationsView
        }, {
          path: 'workstations',
          name: 'Workstations',
          component: WorkstationsView
        }, {
          path: 'equipment',
          name: 'Equipment',
          component: EquipmentsView
        }, {
          path: 'collections',
          name: 'Collections',
          component: CollectionsView
        }
      ]
    }, {
      path: '/production/orders',
      name: 'ProductionOrders',
      component: ConfigurationsView
    }
  ]
})

export default router
