import type { Card } from './card.js'

export interface Deck {
  id: number
  name: string
  userId: number
  cards: Card[]
}

export interface DeckPayload {
  name: string
  cards: number[] // tableau de 10 cardId
}
