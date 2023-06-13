import { createRouter, createWebHistory } from 'vue-router'
import ConfigurationsView from '../features/misc/views/ConfigurationsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/settings/configurations',
      name: 'Configurations',
      component: ConfigurationsView
    },
    {
      path: '/production/orders',
      name: 'ProductionOrders',
      component: ConfigurationsView
    }
  ]
})

export default router
