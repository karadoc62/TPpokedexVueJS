<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors.js'
import type { Card } from '@/types'

const props = withDefaults(
  defineProps<{
    card: Card
    size?: 'sm' | 'md'
    selected?: boolean
    disabled?: boolean
    clickable?: boolean
    currentHp?: number
  }>(),
  {
    size: 'md',
    selected: false,
    disabled: false,
    clickable: false,
  },
)

const { hpColor } = useColors()

const typeClass = computed(() => {
  const classes: Record<string, string> = {
    Normal: 'type-normal',
    Fire: 'type-fire',
    Water: 'type-water',
    Electric: 'type-electric',
    Grass: 'type-grass',
    Ice: 'type-ice',
    Fighting: 'type-fighting',
    Poison: 'type-poison',
    Ground: 'type-ground',
    Flying: 'type-flying',
    Psychic: 'type-psychic',
    Bug: 'type-bug',
    Rock: 'type-rock',
    Ghost: 'type-ghost',
    Dragon: 'type-dragon',
    Dark: 'type-dark',
    Steel: 'type-steel',
    Fairy: 'type-fairy',
  }

  return classes[props.card.type] || 'type-default'
})

const hpPercent = computed(() => {
  if (props.currentHp === undefined) return 0

  const percent = (props.currentHp / props.card.hp) * 100

  if (percent < 0) return 0
  if (percent > 100) return 100
  return percent
})

const hpBarStyle = computed(() => ({
  width: `${hpPercent.value}%`,
  backgroundColor: hpColor(hpPercent.value),
}))

const emit = defineEmits<(e: 'select', card: Card) => void>()

function handleClick() {
  if (!props.clickable || props.disabled) return
  emit('select', props.card)
}
</script>

<template>
  <article
    class="pokemon-card"
    :class="[
      `pokemon-card--${size}`,
      { 'pokemon-card--selected': selected },
      { 'pokemon-card--disabled': disabled },
      { 'pokemon-card--clickable': clickable && !disabled },
    ]"
    @click="handleClick"
  >
    <img class="pokemon-card__image" :src="card.imgUrl" :alt="card.name" />

    <p class="pokemon-card__id">#{{ card.pokedexNumber }}</p>

    <p class="pokemon-card__name">{{ card.name }}</p>

    <span class="pokemon-card__type" :class="typeClass">
      {{ card.type }}
    </span>

    <div class="pokemon-card__stats">
      <span>❤️ {{ card.hp }}</span>
      <span>⚔ {{ card.attack }}</span>
    </div>

    <div v-if="currentHp !== undefined" class="pokemon-card__hp">
      <div class="pokemon-card__hp-bar">
        <div class="pokemon-card__hp-fill" :style="hpBarStyle" />
      </div>
      <span class="pokemon-card__hp-text">
        {{ currentHp }} / {{ card.hp }}
      </span>
    </div>
  </article>
</template>

<style scoped>
.pokemon-card {
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: white;
  text-align: center;
}

.pokemon-card__image {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.pokemon-card__id {
  margin: 6px 0 2px;
  font-size: 12px;
  color: #888;
}

.pokemon-card__name {
  margin: 0 0 8px;
  font-size: 14px;
}

.pokemon-card__type {
  display: inline-block;
  margin-bottom: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  background-color: #ddd;
  font-size: 12px;
}

.pokemon-card__stats {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 12px;
  color: #555;
  margin-bottom: 8px;
}

.pokemon-card__hp {
  margin-top: 8px;
}

.pokemon-card__hp-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.pokemon-card__hp-fill {
  height: 100%;
  border-radius: 999px;
}

.pokemon-card__hp-text {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #666;
}

/*================================
      Styles liés aux tailles
================================*/
.pokemon-card--md {
  width: 120px;
  min-height: 190px;
  padding: 12px;
}

.pokemon-card--sm {
  width: 95px;
  min-height: 155px;
  padding: 8px;
}

.pokemon-card--sm .pokemon-card__image {
  width: 56px;
  height: 56px;
}

.pokemon-card--sm .pokemon-card__name {
  font-size: 12px;
}

/*================================
      Styles liés aux conditions
================================*/
.pokemon-card--clickable {
  cursor: pointer;
}

.pokemon-card--selected {
  border: 2px solid #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.15);
}

.pokemon-card--disabled {
  opacity: 0.35;
  pointer-events: none;
}

/*================================
  Styles liés aux types de pokemon
================================*/
.type-normal {
  background-color: #a8a878;
  color: white;
}
.type-fire {
  background-color: #f08030;
  color: white;
}
.type-water {
  background-color: #6890f0;
  color: white;
}
.type-electric {
  background-color: #f8d030;
  color: #333;
}
.type-grass {
  background-color: #78c850;
  color: white;
}
.type-ice {
  background-color: #98d8d8;
  color: #333;
}
.type-fighting {
  background-color: #c03028;
  color: white;
}
.type-poison {
  background-color: #a040a0;
  color: white;
}
.type-ground {
  background-color: #e0c068;
  color: #333;
}
.type-flying {
  background-color: #a890f0;
  color: white;
}
.type-psychic {
  background-color: #f85888;
  color: white;
}
.type-bug {
  background-color: #a8b820;
  color: white;
}
.type-rock {
  background-color: #b8a038;
  color: white;
}
.type-ghost {
  background-color: #705898;
  color: white;
}
.type-dragon {
  background-color: #7038f8;
  color: white;
}
.type-dark {
  background-color: #705848;
  color: white;
}
.type-steel {
  background-color: #b8b8d0;
  color: #333;
}
.type-fairy {
  background-color: #ee99ac;
  color: white;
}
.type-default {
  background-color: #999;
  color: white;
}
</style>
