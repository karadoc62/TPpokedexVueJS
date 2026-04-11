<script setup lang="ts">
import { NGrid, NGridItem } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PokemonCardGrid from '@/components/PokemonCardGrid.vue'
import { useApi } from '@/composables/useApi.js'
import type { Card, Deck } from '@/types'

const route = useRoute()
const router = useRouter()
const api = useApi()

const allCards = ref<Card[]>([])
const deck = ref<Deck | null>(null)
const deckName = ref('')
const selectedCards = ref<Card[]>([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const search = ref('')

const isFormValid = computed(() => {
  return deckName.value.trim() !== '' && selectedCards.value.length === 10
})

async function loadData() {
  loading.value = true
  error.value = ''

  try {
    const [cardsResponse, deckResponse] = await Promise.all([
      api.getCards(),
      api.getDeck(String(route.params.id)),
    ])

    allCards.value = cardsResponse
    deck.value = deckResponse
    deckName.value = deckResponse.name
    selectedCards.value = deckResponse.cards
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Erreur lors du chargement du deck.'
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  error.value = ''

  if (deckName.value.trim() === '') {
    error.value = 'Le nom du deck est obligatoire.'
    return
  }

  if (selectedCards.value.length !== 10) {
    error.value = 'Tu dois sélectionner exactement 10 cartes.'
    return
  }

  submitting.value = true

  try {
    await api.updateDeck(String(route.params.id), {
      name: deckName.value.trim(),
      cards: selectedCards.value.map((card) => card.id),
    })

    router.push(`/decks/${route.params.id}`)
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Erreur lors de la mise à jour du deck.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredCards = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (query === '') return allCards.value

  return allCards.value.filter((card) =>
    card.name.toLowerCase().includes(query),
  )
})
</script>

<template>
  <div class="page">
    <NGrid responsive="screen" cols="1" :x-gap="24" :y-gap="16">
      <NGridItem>
        <div class="page__content">
          <p v-if="loading">Chargement du deck...</p>

          <template v-else-if="deck">
            <h1>Modifier le deck</h1>

            <div class="form-group form-group--compact">
              <label for="deck-name">Nom du deck</label>
              <input
                id="deck-name"
                v-model="deckName"
                type="text"
                placeholder="Mon super deck"
              />
            </div>

            <div class="form-group form-group--compact">
              <label for="search-card">Rechercher une carte</label>
              <input
                id="search-card"
                v-model="search"
                type="text"
                placeholder="Ex : Pikachu"
              />
            </div>

            <p class="counter">
              Cartes sélectionnées : {{ selectedCards.length }} / 10
            </p>

            <p v-if="error" class="error">
              {{ error }}
            </p>

            <PokemonCardGrid
              v-model:selected-cards="selectedCards"
              :cards="filteredCards"
              :max="10"
            />

            <button
              class="submit-button"
              :disabled="!isFormValid || submitting"
              @click="handleSubmit"
            >
              {{
                submitting
                  ? 'Enregistrement...'
                  : 'Enregistrer les modifications'
              }}
            </button>
          </template>

          <p v-else-if="error" class="error">
            {{ error }}
          </p>
        </div>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped>
.page {
  padding: 16px;
}

.page__content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-group--compact {
  max-width: 420px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

input {
  width: 100%;
  max-width: 100%;
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
}

.counter {
  margin-bottom: 12px;
  font-weight: 600;
}

.error {
  color: #d03050;
  margin-bottom: 12px;
}

.submit-button {
  margin-top: 16px;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  background-color: #f0a020;
  color: white;
  cursor: pointer;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
