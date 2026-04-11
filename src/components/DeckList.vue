<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi.js'
import type { Card, Deck } from '@/types'

const router = useRouter()
const api = useApi()

const decks = ref<Deck[]>([])
const allCards = ref<Card[]>([])
const loading = ref(false)
const error = ref('')

const decksWithCards = computed(() => {
  return decks.value.map((deck) => {
    const normalizedCards = deck.cards.map((deckCard) => {
      const fullCard = allCards.value.find((card) => card.id === deckCard.id)
      return fullCard ?? deckCard
    })

    return {
      ...deck,
      cards: normalizedCards,
    }
  })
})

async function loadDecks() {
  loading.value = true
  error.value = ''

  try {
    const decksResponse = await api.getMyDecks()
    const cardsResponse = await api.getCards()

    decks.value = decksResponse
    allCards.value = cardsResponse
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Erreur lors du chargement des decks.'
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  router.push('/decks/create')
}

function handleView(deck: Deck) {
  router.push(`/decks/${deck.id}`)
}

function handleEdit(deck: Deck) {
  router.push(`/decks/${deck.id}/edit`)
}

async function handleDelete(deckId: number) {
  try {
    await api.deleteDeck(deckId)
    await loadDecks()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Erreur lors de la suppression du deck.'
  }
}

onMounted(() => {
  loadDecks()
})
</script>

<template>
  <section class="deck-list">
    <div class="deck-list__header">
      <h2>Mes decks</h2>
      <button class="deck-list__create-button" @click="handleCreate">
        Créer un deck
      </button>
    </div>

    <p v-if="loading">Chargement des decks...</p>
    <p v-else-if="error" class="deck-list__error">
      {{ error }}
    </p>
    <p v-else-if="decksWithCards.length === 0">Aucun deck pour le moment.</p>

    <div v-else class="deck-list__items">
      <article
        v-for="deck in decksWithCards"
        :key="deck.id"
        class="deck-list__item"
      >
        <div class="deck-list__content">
          <h3 class="deck-list__title">{{ deck.name }}</h3>
          <p class="deck-list__meta">{{ deck.cards.length }} cartes</p>
        </div>

        <div class="deck-list__thumbnails">
          <img
            v-for="card in deck.cards"
            :key="card.id"
            :src="card.imgUrl"
            :alt="card.name"
            class="deck-list__thumbnail"
          />
        </div>

        <div class="deck-list__actions">
          <button @click="handleView(deck)">Voir</button>
          <button @click="handleEdit(deck)">Modifier</button>
          <button @click="handleDelete(deck.id)">Supprimer</button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.deck-list {
  margin-top: 24px;
}

.deck-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.deck-list__create-button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #18a058;
  color: white;
  cursor: pointer;
}

.deck-list__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deck-list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: white;
}

.deck-list__title {
  margin: 0 0 4px;
}

.deck-list__meta {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.deck-list__thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.deck-list__thumbnail {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  background-color: #fff;
  padding: 2px;
}

.deck-list__actions {
  display: flex;
  gap: 8px;
}

.deck-list__error {
  color: #d03050;
}
</style>
