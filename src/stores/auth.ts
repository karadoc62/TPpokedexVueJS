import { defineStore } from 'pinia' // permet de crééer un store

// User pour typer l'utilsiateur
// SignUpPayload pour typer els données envoyées à l'inscription
// SignInPayload pour typer les données envoyées à la connexion
import { useApi } from '../composables/useApi.js' // pour parler avec le backend
import { useStorage } from '../composables/useStorage.js' // pour lire et ecrire dans le local storage
import type { SignInPayload, SignUpPayload, User } from '../types/index.js'

// On decrit la forme de l'état du store
interface AuthState {
  token: string | null // null car tant que user non connecté, on a ni token ni user
  user: User | null
}

// ces constantes servent pour le local storage
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// creation d'un store nommé auth. Le nom 'auth' sert d’identifiant interne à Pinia.
// On exporte useAuthStore pour pouvoir l’utiliser partout dans l’application :
//const authStore = useAuthStore()
// Le state représente les données du store, au depart pas de token ni d'utilsiateur
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),

  // getter : valeur calculée à partir de l’état - si state.token existe alors !! vaut true. On se base sur le token car c'est le JWT qui prouve l'authentification
  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // sert à enregistrer une authentifiation réussie
    setAuth(token: string, user: User) {
      // dans l'application
      this.token = token
      this.user = user
      // Dans le storage pour pouvoir restaurer les donénes
      const storage = useStorage()
      storage.set(TOKEN_KEY, token)
      storage.set(USER_KEY, user)
    },

    // methode qui relit le local storage au demarrage
    restoreAuth() {
      const storage = useStorage()

      this.token = storage.get<string>(TOKEN_KEY)
      this.user = storage.get<User>(USER_KEY)
    },

    // inverse de setAuth - vide memeoire t localstorage
    clearAuth() {
      this.token = null
      this.user = null

      const storage = useStorage()
      storage.remove(TOKEN_KEY, USER_KEY)
    },

    // connexion coté backend
    async signIn(payload: SignInPayload) {
      // on recupere l'API
      const api = useApi()
      // on appelle la methode signIn
      const response = await api.signIn(payload)

      // on enregistre token et user
      this.setAuth(response.token, response.user)
    },

    async signUp(payload: SignUpPayload) {
      // on recupere l'API
      const api = useApi()
      // on appelle la methode sign
      const response = await api.signUp(payload)
      // on enregistre token et user
      this.setAuth(response.token, response.user)
    },

    //methode de deconnexion
    logout() {
      this.clearAuth()
    },
  },
})
