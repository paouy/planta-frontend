import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './features/auth/index.js'
import CleanLayout from './components/CleanLayout.vue'
import DefaultLayout from './components/DefaultLayout.vue'
import AccountView from './views/AccountView.vue'
import ArchivedSalesOrdersView from './views/ArchivedSalesOrdersView.vue'
import CategoriesView from './views/CategoriesView.vue'
import ConfigurationsView from './views/ConfigurationsView.vue'
import CreateOperationBatchReportView from './views/CreateOperationBatchReportView.vue'
import CreateSalesOrderView from './views/CreateSalesOrderView.vue'
import CustomersView from './views/CustomersView.vue'
import EquipmentsView from './views/EquipmentsView.vue'
import LoginView from './views/LoginView.vue'
import MaterialsView from './views/MaterialsView.vue'
import MetafieldsView from './views/MetafieldsView.vue'
import OperationsView from './views/OperationsView.vue'
import ProductionExecutionView from './views/ProductionExecutionView.vue'
import ProductionOrdersView from './views/ProductionOrdersView.vue'
import ProductionOrderView from './views/ProductionOrderView.vue'
import ProductsView from './views/ProductsView.vue'
import ProductView from './views/ProductView.vue'
import ReleasedProductionOrdersView from './views/ReleasedProductionOrdersView.vue'
import ReportView from './views/ReportView.vue'
import SalesOrdersView from './views/SalesOrdersView.vue'
import SalesOrderView from './views/SalesOrderView.vue'
import UsersView from './views/UsersView.vue'
import WorkersView from './views/WorkersView.vue'
import WorkstationsView from './views/WorkstationsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: CleanLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: LoginView
        }
      ]
    }, {
      path: '/sales',
      component: DefaultLayout,
      children: [
        {
          path: 'orders',
          children: [
            {
              path: '',
              name: 'SalesOrders',
              component: SalesOrdersView
            }, {
              path: 'archived',
              name: 'ArchivedSalesOrders',
              component: ArchivedSalesOrdersView
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
      component: DefaultLayout,
      children: [
        {
          path: 'overview',
          children: [
            {
              path: '',
              name: 'ProductionOrders',
              component: ProductionOrdersView
            }, {
              path: 'released',
              name: 'ReleasedProductionOrders',
              component: ReleasedProductionOrdersView
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
      component: DefaultLayout,
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
      path: '/reports',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'Reports',
          component: ReportView
        }
      ]
    }, {
      path: '/settings',
      component: DefaultLayout,
      children: [
        {
          path: 'users',
          name: 'Users',
          component: UsersView
        }, {
          path: 'configurations',
          children: [
            {
              path: '',
              name: 'Configurations',
              component: ConfigurationsView
            }, {
              path: 'custom-data',
              name: 'Metafields',
              component: MetafieldsView
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
    }, {
      path: '/account',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'Account',
          component: AccountView
        }
      ]
    }, {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: CleanLayout
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { session, clearSession } = useAuth()

  if (to.name === 'Login') {
    if (session.value.user) {
      next({ name: 'SalesOrders' })
    } else {
      next()
    }
  }
  
  else if (to.name === 'NotFound') {
    if (session.value?.user) {
      next({ name: 'SalesOrders' })
    } else {
      next({ name: 'Login' })
    }
  }
  
  else if (to.path.includes('settings')) {
    if (session.value.user?.isAdmin) {
      next()
    } else {
      next({ name: 'SalesOrders' })
    }
  }
  
  else {
    if (!session.value.user || Math.floor(Date.now() / 1000) > session.value.expiresIn) {
      clearSession()

      next({ name: 'Login' })
    } else {
      next()
    }
  }
})

export default router
