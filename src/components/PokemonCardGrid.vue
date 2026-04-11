<script setup lang="ts">
import { NGrid, NGridItem } from 'naive-ui'

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
  <NGrid responsive="screen" cols="1 s:2 m:4 l:6 xl:8" :x-gap="12" :y-gap="12">
    <NGridItem v-for="card in cards" :key="card.id">
      <div class="grid-item">
        <PokemonCard
          :card="card"
          clickable
          :selected="isSelected(card)"
          :disabled="isDisabled(card)"
          @select="toggleCard"
        />
      </div>
    </NGridItem>
  </NGrid>
</template>

<style scoped>
.grid-item {
  display: flex;
  justify-content: center;
}
</style>
