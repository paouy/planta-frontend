import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

// import {
//   CfActionCard,
//   CfAppLayout,
//   CfAppView,
//   CfAppViewHeader,
//   CfBanner,
//   CfBreadcrumbs,
//   CfFilledButton,
//   CfOutlinedButton,
//   CfTextButton,
//   CfChoice,
//   CfChoiceList,
//   CfDataTable,
//   CfDialog,
//   CfDropdown,
//   CfDropdownItem,
//   CfHeader,
//   CfInput,
//   CfSelect,
//   CfSummaryList,
//   CfSwitch,
//   CfTag
// } from 'vue-cf-ui'
import 'vue-cf-ui/dist/style.css'

const app = createApp(App)

app.use(router)

// app.component('CfActionCard', CfActionCard)

app.mount('#app')