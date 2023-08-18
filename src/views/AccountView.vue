<script setup>
import { ref } from 'vue'
import { CfAppView, CfAppViewHeader, CfActionCard, CfFilledButton } from 'vue-cf-ui'
import { ChangePassword } from '../features/auth/index.js'

const showChangePassword = ref(false)
</script>

<template>
  <CfAppView>
    <CfAppViewHeader title="Account"/>
    <CfActionCard title="Password">
      <template #body>
        <p>Change your password any time. This does not revoke your current session.</p>
      </template>
      <template #action>
        <CfFilledButton @click="showChangePassword = true">
          Change password
        </CfFilledButton>
      </template>
    </CfActionCard>
  </CfAppView>

  <ChangePassword
    @dismiss="showChangePassword = false"
    v-if="showChangePassword"
  />
</template>