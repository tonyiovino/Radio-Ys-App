import { doc, setDoc, getDoc } from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth'

import db from '../../firebaseInit'

import router from '../../router'

const state = {
  uid: null,
  token: null,
  profile: {
    username: null,
    email: null,
    avatar_path: null,
  },

  loaded: false,
}

const getters = {
  uid: (state) => state.uid,
  profile: (state) => state.profile,
  isAuthenticated: (state) => !!state.uid,
  profileLoaded: (state) => state.loaded,
}

const mutations = {
  setCredentials(state, payload) {
    state.uid = payload.uid
    state.token = payload.token
  },
  setProfile(state, payload) {
    state.profile = payload
    state.loaded = true
  },
  logout(state) {
    state.uid = null
    state.token = null
    state.profile = { username: null, avatar_path: null }
  },
}

const actions = {
  signup(ctx, payload) {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // console.log(userCredential);
        // console.log(user);
        ctx.commit('setCredentials', {
          uid: user.uid,
          token: user.accessToken,
        })
        ctx.dispatch('updateProfile', payload)
        ctx.dispatch('loadInitialData')

        router.push('/home')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message

        if (errorCode == 'auth/weak-password') {
          alert('Inserisci una password di minimo 6 caratteri')
        } else if (errorCode == 'auth/invalid-email') {
          alert('Inserisci un indirizzo email valido')
        } else {
          alert(
            'Codice di errore:\n' +
              errorCode +
              '\nMessaggio di errore:\n' +
              errorMessage,
          )
        }
      })
  },

  login(ctx, payload) {
    console.log('ooooooo')
    const auth = getAuth()
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        const user = userCredential.user

        ctx.commit('setCredentials', {
          uid: user.uid,
          token: user.accessToken,
        })

        ctx.dispatch('updateProfile', payload)

        ctx.dispatch('loadInitialData')

        router.push('/home')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        alert(
          'Codice di errore:\n' +
            errorCode +
            '\nMessaggio di errore:\n' +
            errorMessage,
        )
      })
  },

  // autoLogin(ctx, payload) {
  //   const auth = getAuth()
  //   setPersistence(auth, browserSessionPersistence)
  //     .then(() => {
  //       // Existing and future Auth states are now persisted in the current
  //       // session only. Closing the window would clear any existing state even
  //       // if a user forgets to sign out.
  //       // ...
  //       // New sign-in will be persisted with session persistence.
  //       return login(ctx, payload)
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code
  //       const errorMessage = error.message

  //       alert(
  //         'Codice di errore:\n' +
  //           errorCode +
  //           '\nMessaggio di errore:\n' +
  //           errorMessage,
  //       )
  //     })
  // },

  async googleSingIn(ctx) {
    const auth = getAuth()

    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')

    const result = await signInWithPopup(auth, provider)

    const credential = GoogleAuthProvider.credentialFromResult(result)

    const user = result.user
    const token = credential.accessToken

    ctx.commit('setCredentials', {
      uid: user.uid,
      token: token,
    })

    console.log(user.photoURL)
    console.log(user.email)

    ctx.commit('setProfile', {
      username: user.displayName,
      email: user.email,
      avatar_path: user.photoURL,
    })

    ctx.dispatch('loadInitialData')

    router.push('/home')
  },

  async updateProfile(ctx, payload) {
    delete payload.email
    delete payload.password

    console.log('update profile', payload)

    ctx.commit('setProfile', payload)

    await setDoc(doc(db, 'users', ctx.getters.uid), {
      profile: payload,
    })
  },

  async loadProfile(ctx) {
    const docRef = doc(db, 'users', ctx.getters.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      // console.log('Document data:', docSnap.data());
      const userData = docSnap.data()
      ctx.commit('setProfile', userData.profile)
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!')
    }
  },

  logout(ctx) {
    router.push('/')
    ctx.commit('set_lists', {})
    ctx.commit('set_list_loaded', false)
    ctx.commit('set_groups', {})
    ctx.commit('set_all_groups', {})
    ctx.commit('set_visibility', '')
    ctx.commit('logout')
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
