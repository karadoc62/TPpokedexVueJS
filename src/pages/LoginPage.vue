<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { ROUTES } from '../router.js'
import { useAuthStore } from '../stores/auth.js'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.signIn({
      email: email.value,
      password: password.value,
    })
    router.push(ROUTES.HOME)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NLayout
    content-style="display: flex; justify-content: center; padding-top: 100px"
  >
    <NCard title="Connexion" style="max-width: 450px; width: 100%">
      <NForm>
        <NFormItem label="Email">
          <NInput v-model:value="email" placeholder="votre@email.com" />
        </NFormItem>

        <NFormItem label="Mot de passe">
          <NInput
            v-model:value="password"
            type="password"
            placeholder="********"
            show-password-on="click"
          />
        </NFormItem>

        <NAlert v-if="errorMessage" type="error" style="margin-bottom: 16px">
          {{ errorMessage }}
        </NAlert>

        <NButton
          type="primary"
          block
          :loading="loading"
          :disabled="loading"
          @click="handleSubmit"
        >
          Se connecter
        </NButton>

        <div class="footer-link">
          Pas encore de compte ?
          <RouterLink to="/register">S'inscrire</RouterLink>
        </div>
      </NForm>
    </NCard>
  </NLayout>
</template>

<style scoped>
.footer-link {
  margin-top: 16px;
  text-align: center;
}
</style>
