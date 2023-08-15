import { createRouter, createWebHistory } from 'vue-router'
import {
  CategoriesView,
  ConfigurationsView,
  CreateOperationBatchReportView,
  CreateSalesOrderView,
  CustomersView,
  EquipmentsView,
  MaterialsView,
  OperationsView,
  ProductionExecutionView,
  ProductionOrdersView,
  ProductionOrderView,
  ProductsView,
  ProductView,
  SalesOrdersView,
  SalesOrderView,
  WorkersView,
  WorkstationsView
} from './views/index.js'

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
              name: 'CreateOperationBatchReport',
              component: CreateOperationBatchReportView,
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
          path: 'workers',
          name: 'Workers',
          component: WorkersView
        }, {
          path: 'equipment',
          name: 'Equipment',
          component: EquipmentsView
        }, {
          path: 'categories',
          name: 'Categories',
          component: CategoriesView
        }
      ]
    }
  ]
})

export default router
