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
import ProductionOrderView from '../features/productionOrder/views/ProductionOrderView.vue'
import ProductionExecutionView from '../features/misc/views/ProductionExecutionView.vue'
import AddOperationBatchReportView from '../features/operationBatch/views/AddOperationBatchReportView.vue'
import CustomersView from '../features/customer/views/CustomersView.vue'
import SalesOrdersView from '../features/salesOrder/views/SalesOrdersView.vue'
import SalesOrderView from '../features/salesOrder/views/SalesOrderView.vue'
import CreateSalesOrderView from '../features/salesOrder/views/CreateSalesOrderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sales',
      children: [
        {
          path: 'orders',
          children: [
            {
              path: '',
              name: 'SalesOrders',
              component: SalesOrdersView
            }, {
              path: ':salesOrderId',
              name: 'SalesOrder',
              component: SalesOrderView,
              props: true
            }, {
              path: 'create',
              name: 'CreateSalesOrder',
              component: CreateSalesOrderView
            }
          ]
        }, {
          path: 'customers',
          name: 'Customers',
          component: CustomersView
        }
      ]
    }, {
      path: '/production',
      children: [
        {
          path: 'overview',
          children: [
            {
              path: '',
              name: 'ProductionOrders',
              component: ProductionOrdersView
            }, {
              path: ':productionOrderId',
              name: 'ProductionOrder',
              component: ProductionOrderView,
              props: true
            }
          ]
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
              path: ':operationSlug/:operationBatchId/add-report',
              name: 'AddOperationBatchReport',
              component: AddOperationBatchReportView,
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
