import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './features/auth/index.js'
import CleanLayout from './components/CleanLayout.vue'
import DefaultLayout from './components/DefaultLayout.vue'

const ArchivedSalesOrdersView = () => import('./views/ArchivedSalesOrdersView.vue')
const CategoriesView = () => import('./views/CategoriesView.vue')
const ConfigurationsView = () => import('./views/ConfigurationsView.vue')
const CreateOperationBatchReportView = () => import('./views/CreateOperationBatchReportView.vue')
const CreateSalesOrderView = () => import('./views/CreateSalesOrderView.vue')
const CustomersView = () => import('./views/CustomersView.vue')
const EquipmentsView = () => import('./views/EquipmentsView.vue')
const LoginView = () => import('./views/LoginView.vue')
const MaterialsView = () => import('./views/MaterialsView.vue')
const OperationsView = () => import('./views/OperationsView.vue')
const ProductionExecutionView = () => import('./views/ProductionExecutionView.vue')
const ProductionOrdersView = () => import('./views/ProductionOrdersView.vue')
const ProductionOrderView = () => import('./views/ProductionOrderView.vue')
const ProductsView = () => import('./views/ProductsView.vue')
const ProductView = () => import('./views/ProductView.vue')
const ReleasedProductionOrdersView = () => import('./views/ReleasedProductionOrdersView.vue')
const ReportView = () => import('./views/ReportView.vue')
const SalesOrdersView = () => import('./views/SalesOrdersView.vue')
const SalesOrderView = () => import('./views/SalesOrderView.vue')
const UsersView = () => import('./views/UsersView.vue')
const WorkersView = () => import('./views/WorkersView.vue')
const WorkstationsView = () => import('./views/WorkstationsView.vue')

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
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: CleanLayout
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { session, clearSession } = useAuth()

  if (to.name === 'Login') {
    if (session.value?.user) {
      next({ name: 'SalesOrders' })
    } else {
      next()
    }
  }
  
  else if (to.name === 'NotFound') {
    if (session.value?.user) {
      next({ name: 'SalesOrders' })
    } else {
      next({ name: 'Login'})
    }
  }
  
  else if (to.path.includes('settings')) {
    if (session.value?.user?.isAdmin) {
      next()
    } else {
      next({ name: 'SalesOrders' })
    }
  }
  
  else {
    if (!session.value?.user || Math.floor(Date.now() / 1000) > session.value?.expiresIn) {
      clearSession()

      next({ name: 'Login' })
    } else {
      next()
    }
  }
})

export default router
