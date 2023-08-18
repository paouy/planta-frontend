<script setup>
import { ref } from 'vue'
import { CfAppView, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { ChangePassword } from '../features/auth/index.js'
import { CreateUser, DeleteUser, UpdateUser, UsersList } from '../features/user/index.js'
import api from '../api/index.js'

const currentAction = ref(null)
const users = ref([])
const user = ref(null)

const onAction = ({ key, data }) => {
  currentAction.value = key
  user.value = data
}

const onDelete = (id) => {
  users.value = users.value.filter(user => id !== user.id)
}

const onUpdate = (data) => {
  const index = users.value.findIndex(({ id }) => data.id === id)
  Object.assign(users.value[index], data)
}

api.user
  .getAll()
  .then(data => users.value = data)
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Settings" title="Users">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add user
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <UsersList
      :data="users"
      @action="onAction"
    />
  </CfAppView>

  <CreateUser
    @success="data => users.push(data)"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <DeleteUser
    :data="user"
    @success="onDelete"
    @cancel="currentAction = user = null"
    v-if="currentAction === 'DELETE'"
  />

  <UpdateUser
    :data="user"
    @success="onUpdate"
    @cancel="currentAction = user = null"
    v-if="currentAction === 'UPDATE'"
  />

  <ChangePassword
    :user="user"
    @dismiss="currentAction = user = null"
    v-if="currentAction === 'CHANGE_PASSWORD'"
  />
</template>