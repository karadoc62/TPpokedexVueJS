import type {
  AuthResponse,
  Card,
  Deck,
  DeckPayload,
  SignInPayload,
  SignUpPayload,
} from '../types/index.js'
import { useStorage } from './useStorage.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const storage = useStorage()

type ApiType =
  | string
  | {
      id?: number
      name?: string
    }

interface ApiCard {
  id: number
  name?: string
  hp?: number
  attack?: number
  type?: ApiType
  pokedexNumber?: number
  imgUrl?: string

  pokedexId?: number
  lifePoints?: number
  imageUrl?: string
}

type ApiDeckCard =
  | ApiCard
  | {
      id?: number
      deckId?: number
      cardId?: number
      card?: ApiCard
      pokemonCard?: ApiCard
    }

interface ApiDeck {
  id: number
  name: string
  userId?: number
  ownerId?: number
  cards: ApiDeckCard[]
}

const normalizeCard = (card: ApiCard): Card => {
  const typeValue =
    typeof card.type === 'string' ? card.type : (card.type?.name ?? 'Normal')

  return {
    id: card.id,
    name: card.name ?? 'Unknown',
    hp: card.hp ?? card.lifePoints ?? 0,
    attack: card.attack ?? 0,
    type: typeValue as Card['type'],
    pokedexNumber: card.pokedexNumber ?? card.pokedexId ?? 0,
    imgUrl: card.imgUrl ?? card.imageUrl ?? '',
  }
}

const normalizeDeckCard = (
  deckCard: ApiDeckCard,
  allCards?: Card[],
): Card | null => {
  if ('card' in deckCard && deckCard.card) {
    return normalizeCard(deckCard.card)
  }

  if ('pokemonCard' in deckCard && deckCard.pokemonCard) {
    return normalizeCard(deckCard.pokemonCard)
  }

  // si c'est déjà une vraie carte
  if ('name' in deckCard || 'imageUrl' in deckCard || 'imgUrl' in deckCard) {
    return normalizeCard(deckCard as ApiCard)
  }

  // si on n'a qu'un cardId, on retrouve la vraie carte depuis /cards
  if ('cardId' in deckCard && deckCard.cardId !== undefined && allCards) {
    return allCards.find((card) => card.id === deckCard.cardId) ?? null
  }

  return null
}

const normalizeDeck = (deck: ApiDeck, allCards?: Card[]): Deck => {
  return {
    id: deck.id,
    name: deck.name,
    userId: deck.userId ?? deck.ownerId ?? 0,
    cards: Array.isArray(deck.cards)
      ? deck.cards
          .map((deckCard) => normalizeDeckCard(deckCard, allCards))
          .filter((card): card is Card => card !== null)
      : [],
  }
}

const request = async <T>(path: string, options: RequestInit = {}) => {
  const token = storage.get<string>('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(
      (data as { message?: string }).message || `Erreur ${res.status}`,
    )
  }

  return res.json() as Promise<T>
}

export function useApi() {
  const signIn = ({ email, password }: SignInPayload) =>
    request<AuthResponse>('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

  const signUp = ({ email, password, username }: SignUpPayload) =>
    request<AuthResponse>('/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    })

  const getCards = async () => {
    const cards = await request<ApiCard[]>('/cards')
    return cards.map(normalizeCard)
  }

  const getMyDecks = async () => {
    const [decks, allCards] = await Promise.all([
      request<ApiDeck[]>('/decks/mine'),
      getCards(),
    ])

    return decks.map((deck) => normalizeDeck(deck, allCards))
  }

  const getDeck = async (id: string | number) => {
    const [deck, allCards] = await Promise.all([
      request<ApiDeck>(`/decks/${id}`),
      getCards(),
    ])

    return normalizeDeck(deck, allCards)
  }

  const createDeck = ({ name, cards }: DeckPayload) =>
    request<Deck>('/decks', {
      method: 'POST',
      body: JSON.stringify({ name, cards }),
    })

  const updateDeck = (id: string | number, { name, cards }: DeckPayload) =>
    request<Deck>(`/decks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, cards }),
    })

  const deleteDeck = (id: string | number) =>
    request<unknown>(`/decks/${id}`, { method: 'DELETE' })

  return {
    signIn,
    signUp,
    getCards,
    getMyDecks,
    getDeck,
    createDeck,
    updateDeck,
    deleteDeck,
  }
}
