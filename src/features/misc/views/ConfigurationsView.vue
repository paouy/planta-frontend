<script setup>
import { CfAppView, CfHeader } from '../../../components/index.js'
import OperationsList from '../../operation/components/OperationsList.vue'
import WorkstationsList from '../../workstation/components/WorkstationsList.vue'
</script>

<template>
  <CfAppView>
    <CfHeader
      surtitle="Settings"
      title="Configurations"
    />
    <OperationsList/>
    <WorkstationsList/>
  </CfAppView>
</template>