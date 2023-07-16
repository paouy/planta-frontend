import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '../features/product/views/ProductsView.vue'
import ProductView from '../features/product/views/ProductView.vue'
import MaterialsView from '../features/material/views/MaterialsView.vue'
import ConfigurationsView from '../features/misc/views/ConfigurationsView.vue'
import OperationsView from '../features/operation/views/OperationsView.vue'
import WorkstationsView from '../features/workstation/views/WorkstationsView.vue'
import EquipmentsView from '../features/equipment/views/EquipmentsView.vue'
import CollectionsView from '../features/collection/views/CollectionsView.vue'
import ProductionOrdersView from '../features/productionOrder/views/ProductionOrdersView.vue'
import ProductionExecutionView from '../features/misc/views/ProductionExecutionView.vue'
import AddProductionBatchReportView from '../features/misc/views/AddProductionBatchReportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/production',
      children: [
        {
          path: 'overview',
          name: 'ProductionOrders',
          component: ProductionOrdersView
        }, {
          path: 'execution',
          name: 'ProductionExecution',
          redirect: '/production/execution/',
          children: [
            {
              path: ':operationSlug?',
              component: ProductionExecutionView,
              props: true
            }, {
              path: ':operationSlug/:productionBatchId/add-report',
              name: 'AddProductionBatchReport',
              component: AddProductionBatchReportView,
              props: true
            }
          ]
        }
      ]
    }, {
      path: '/inventory',
      children: [
        {
          path: 'products',
          children: [
            {
              path: '',
              name: 'Products',
              component: ProductsView
            }, {
              path: ':productId',
              name: 'Product',
              component: ProductView,
              props: true
            }
          ]
        }, {
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
    }
  ]
})

export default router
