<script setup lang="ts">
import type { Card } from '@/types'

import PokemonCard from './PokemonCard.vue'

const props = withDefaults(
  defineProps<{
    cards: Card[]
    selectedCards: Card[]
    max?: number
  }>(),
  {
    max: 10,
  },
)

const emit = defineEmits<(e: 'update:selectedCards', value: Card[]) => void>()

function isSelected(card: Card) {
  return props.selectedCards.some((c) => c.id === card.id)
}

function isDisabled(card: Card) {
  return !isSelected(card) && props.selectedCards.length >= props.max
}

function toggleCard(card: Card) {
  const alreadySelected = isSelected(card)

  if (alreadySelected) {
    emit(
      'update:selectedCards',
      props.selectedCards.filter((c) => c.id !== card.id),
    )
    return
  }

  if (props.selectedCards.length >= props.max) return

  emit('update:selectedCards', [...props.selectedCards, card])
}
</script>

<template>
  <div class="grid">
    <PokemonCard
      v-for="card in cards"
      :key="card.id"
      :card="card"
      clickable
      :selected="isSelected(card)"
      :disabled="isDisabled(card)"
      @select="toggleCard"
    />
  </div>
</template>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
