<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PokemonCardGrid from '@/components/PokemonCardGrid.vue'
import { useApi } from '@/composables/useApi.js'
import type { Deck } from '@/types'

const route = useRoute()
const router = useRouter()
const api = useApi()

const deck = ref<Deck | null>(null)
const loading = ref(false)
const error = ref('')

async function loadDeck() {
  loading.value = true
  error.value = ''

  try {
    deck.value = await api.getDeck(String(route.params.id))
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Erreur lors du chargement du deck.'
  } finally {
    loading.value = false
  }
}

function goToEdit() {
  router.push(`/decks/${route.params.id}/edit`)
}

onMounted(() => {
  loadDeck()
})
</script>

<template>
  <div class="page">
    <p v-if="loading">Chargement du deck...</p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <template v-else-if="deck">
      <div class="page__header">
        <h1>{{ deck.name }}</h1>

        <button class="edit-button" @click="goToEdit">Modifier le deck</button>
      </div>

      <p>{{ deck.cards.length }} cartes</p>

      <PokemonCardGrid :cards="deck.cards" :selected-cards="[]" :max="10" />
    </template>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}

.page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.edit-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #f0a020;
  color: white;
  cursor: pointer;
}

.error {
  color: #d03050;
}
</style>
