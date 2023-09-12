<script setup>
import { computed } from 'vue'
import { CfAppLayout, CfAppBarLink, CfDropdownItem, CfSidebarLink } from 'vue-cf-ui'
import { useAuth, Logout } from '../features/auth/index.js'
import { useStore, InitializeApp } from '../features/misc/index.js'

const { session } = useAuth()
const { isInitialized, organizationName } = useStore()
const userFullName = computed(() => `${session.value.user?.firstName} ${session.value.user?.lastName}`)

const links = [
  {
    label: 'Sales',
    path: '/sales',
    children: [
      {
        label: 'Orders',
        route: { name: 'SalesOrders' }
      }, {
        label: 'Customers',
        route: { name: 'Customers' }
      }
    ]
  }, {
    label: 'Production',
    path: '/production',
    children: [
      {
        label: 'Overview',
        route: { name: 'ProductionOrders' }
      }, {
        label: 'Execution',
        route: { name: 'ProductionExecution' }
      }
    ]
  }, {
    label: 'Inventory',
    path: '/inventory',
    children: [
      {
        label: 'Products',
        route: { name: 'Products' }
      }, {
        label: 'Materials',
        route: { name: 'Materials' }
      }
    ]
  }, {
    label: 'Reports',
    route: { name: 'Reports' }
  }
]

const adminOnlyLink = {
  label: 'Settings',
  path: '/settings',
  children: [
    {
      label: 'Users',
      route: { name: 'Users' }
    }, {
      label: 'Configurations',
      route: { name: 'Configurations' }
    }
  ]
}
</script>

<template>
  <CfAppLayout>
    <template #brand>
      <img class="logo" src="/logo.png" :alt="organizationName"/>
    </template>

    <template #navigation>
      <CfAppBarLink dropdown>
        <template #default>
          {{ userFullName }}
        </template>
        <template #dropdown>
          <CfDropdownItem :to="{ name: 'Account' }" large>Manage Account</CfDropdownItem>
          <Logout v-slot="{ invoke }">
            <CfDropdownItem @click="invoke" large>Log Out</CfDropdownItem>
          </Logout>
        </template>
      </CfAppBarLink>
    </template>

    <template #sidebar>
      <CfSidebarLink
        v-for="link in links"
        :key="link.label"
        :label="link.label"
        :to="link.route"
        :path="link.path"
      >
        <template #children v-if="link.children">
          <CfSidebarLink
            v-for="child in link.children"
            :key="child.label"
            :icon="false"
            :label="child.label"
            :to="child.route"
          />
        </template>
      </CfSidebarLink>

      <hr v-if="session.user?.isAdmin">

      <CfSidebarLink
        :label="adminOnlyLink.label"
        :path="adminOnlyLink.path"
        v-if="session.user?.isAdmin"
      >
        <template #children>
          <CfSidebarLink
            v-for="child in adminOnlyLink.children"
            :key="child.label"
            :icon="false"
            :label="child.label"
            :to="child.route"
          />
        </template>
      </CfSidebarLink>
    </template>
    
    <template #main>
      <InitializeApp v-if="!isInitialized"/>
      <RouterView v-else/>
    </template>
  </CfAppLayout>
</template>

<style lang="scss">
.logo {
  height: 2.5rem;
  width: auto;
}

.cf-sidebar-link {
  &--sales {
    --icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%230051c3" height="24" viewBox="0 -960 960 960" width="24"><path d="M830.615-521.077v318.769q0 30.308-21 51.307-21 21-51.308 21H202.923q-30.307 0-51.307-21-21-20.999-21-51.307v-319.538q-24.154-19.847-36.27-51.5-12.115-31.654-.5-68.346l40.462-132.154q8-25.23 27.154-40.692 19.154-15.461 45.769-15.461H753.23q26.616 0 45.462 14.769 18.846 14.769 27.461 40.615l41.231 132.923q11.615 36.692-.5 68.115-12.115 31.423-36.269 52.5Zm-262-28.922q32.77 0 49.27-20.039 16.5-20.038 13.5-43.038l-24.307-156.925h-96.463V-612q0 25.231 17.077 43.616 17.077 18.385 40.923 18.385Zm-180 0q27.616 0 44.809-18.385 17.192-18.385 17.192-43.616v-158.001h-96.463l-24.308 158.463q-3.23 21.308 13.385 41.423 16.616 20.116 45.385 20.116Zm-178 0q22.231 0 38.232-15.5 16-15.501 19.769-38.962l23.539-165.54h-84.924q-6.539 0-10.385 2.885-3.847 2.885-5.77 8.655l-38.461 130.153q-7.924 25.77 7.461 52.039 15.385 26.27 50.539 26.27Zm540 0q32.462 0 49.693-25.5 17.231-25.501 8.308-52.809l-40.461-130.923q-1.924-5.769-5.77-8.27-3.846-2.5-10.385-2.5h-82.924l23.539 165.54q3.769 23.461 19.769 38.962 16 15.5 38.231 15.5Zm-547.692 360h555.384q5.386 0 8.847-3.462 3.462-3.462 3.462-8.847v-291.231q-6.538 2.384-10.923 2.961t-9.078.577q-27 0-47.5-9.769t-39.73-31.308q-16.846 18.769-39.846 29.923-23 11.154-52.462 11.154-25.462 0-48-10.577t-42.462-30.5q-18.538 19.923-42 30.5-23.461 10.577-47.538 10.577-27.077 0-50.769-9.807-23.693-9.808-41.693-31.27-25.231 25.231-46.5 33.154-21.269 7.923-41.5 7.923-4.692 0-9.692-.577-5.001-.577-10.308-2.961v291.231q0 5.385 3.461 8.847 3.462 3.462 8.847 3.462Zm555.384 0H202.923h555.384Z"/></svg>');
  }

  &--production {
    --icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%230051c3" height="24" viewBox="0 -960 960 960" width="24"><path d="M117.695-128.465v-119.997h724.61v119.997h-95.383v-59.999H527.691v59.999h-95.382v-59.999H213.078v59.999h-95.383ZM256.54-328.462q-15.366 0-25.76-10.394-10.394-10.394-10.394-25.76v-447.69q0-15.365 10.394-25.759t25.76-10.394h446.92q15.366 0 25.76 10.394 10.394 10.394 10.394 25.759v444.613q0 16.673-11.058 27.952-11.057 11.279-27.404 11.279H256.54Zm23.845-59.999h399.23v-400h-399.23v400ZM360-636.923h240v-59.998H360v59.998Zm-79.615 248.462v-400 400Z"/></svg>');
  }

  &--inventory {
    --icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%230051c3" height="24" viewBox="0 -960 960 960" width="24"><path d="M287.694-535.386 480-850.767l192.306 315.381H287.694ZM700-95.386q-68.846 0-116.73-47.884T535.386-260q0-68.846 47.884-116.73T700-424.614q68.846 0 116.73 47.884T864.614-260q0 68.846-47.884 116.73T700-95.386Zm-564.614-20v-289.228h289.228v289.228H135.386Zm564.603-39.998q43.934 0 74.28-30.336 30.347-30.335 30.347-74.269 0-43.934-30.336-74.28-30.335-30.347-74.269-30.347-43.934 0-74.28 30.336-30.347 30.335-30.347 74.269 0 43.934 30.336 74.28 30.335 30.347 74.269 30.347Zm-504.605-20h169.232v-169.232H195.384v169.232Zm198.154-420h172.924L480-734.462l-86.462 139.078Zm86.462 0ZM364.616-344.616ZM700-260Z"/></svg>');
  }

  &--reports {
    --icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%230051c3" height="24" viewBox="0 -960 960 960" width="24"><path d="M212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h535.382q30.308 0 51.308 21t21 51.308v535.382q0 30.308-21 51.308t-51.308 21H212.309ZM200-613.537h560v-134.154q0-4.616-3.846-8.463-3.847-3.846-8.463-3.846H212.309q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v134.154Zm0 207.076h560v-147.078H200v147.078ZM212.309-200h535.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-134.154H200v134.154q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846Zm43.077-450.923v-72.307h72.307v72.307h-72.307Zm0 207.077v-72.308h72.307v72.308h-72.307Zm0 207.076v-72.307h72.307v72.307h-72.307Z"/></svg>');
  }

  &--settings {
    --icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%230051c3" height="24" viewBox="0 -960 960 960" width="24"><path d="m387.694-100.001-15.231-121.846q-16.077-5.385-32.962-15.077-16.885-9.693-30.193-20.77l-112.846 47.692L104.156-370l97.615-73.769q-1.385-8.923-1.962-17.923-.577-9-.577-17.923 0-8.539.577-17.347.577-8.808 1.962-19.269L104.156-590l92.306-159.229 112.461 47.308q14.462-11.462 30.885-20.962 16.424-9.501 32.27-15.27l15.616-121.846h184.612l15.231 122.231q18 6.538 32.578 15.269 14.577 8.731 29.423 20.578l114-47.308L855.844-590l-99.153 74.922q2.154 9.693 2.346 18.116.192 8.423.192 16.962 0 8.154-.384 16.577-.385 8.423-2.77 19.27L854.46-370l-92.307 159.998-112.615-48.077q-14.846 11.847-30.308 20.962-15.462 9.116-31.693 14.885l-15.231 122.231H387.694Zm92.767-260q49.923 0 84.961-35.038Q600.46-430.078 600.46-480t-35.038-84.961q-35.038-35.038-84.961-35.038-50.537 0-85.268 35.038-34.73 35.039-34.73 84.961t34.73 84.961q34.731 35.038 85.268 35.038Zm0-59.999q-25 0-42.5-17.5t-17.5-42.5q0-25 17.5-42.5t42.5-17.5q25 0 42.5 17.5t17.5 42.5q0 25-17.5 42.5t-42.5 17.5ZM480-480Zm-40 320h78.615L533-267.154q30.615-8 55.961-22.731 25.346-14.73 48.885-37.884L737.231-286l39.384-68-86.769-65.385q5-15.538 6.808-30.461 1.807-14.923 1.807-30.154 0-15.615-1.807-30.154-1.808-14.538-6.808-29.692L777.385-606 738-674l-100.539 42.385q-20.076-21.462-48.115-37.923-28.039-16.462-56.731-23.308L520-800h-79.385l-13.23 106.769q-30.616 7.231-56.539 22.154-25.923 14.923-49.461 38.462L222-674l-39.385 68L269-541.615q-5 14.23-7 29.615-2 15.385-2 32.385Q260-464 262-449q2 15 6.615 29.615l-86 65.385L222-286l99-42q22.769 23.385 48.692 38.308 25.923 14.923 57.308 22.923L440-160Z"/></svg>');
  }
}
</style>