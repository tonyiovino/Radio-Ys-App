// import {
//   collection,
//   addDoc,
//   doc,
//   deleteDoc,
//   updateDoc,
//   getDocs,
//   query,
//   where,
// } from 'firebase/firestore'

// import db from '../../firebaseInit'

const state = {
  collaborators: {},
  loaded: false,
}

const getters = {
  getCollaborators: (state) => state.collaborators,
  collaboratorsById: (state) => (id) => state.collaborators[id],

  collaboratorsLoaded: (state) => state.loaded,
}

// const mutations = {
//   set_groups: (state, payload) => {
//     state.groups = payload
//     state.loaded = true
//   },

//   add_group: (state, payload) => {
//     const { id, ...group } = payload
//     console.log(id)
//     state.groups[id] = group
//   },

//   delete_group: (state, payload) => {
//     console.log(payload)
//     delete state.groups[payload]
//   },

//   update_group: (state, payload) => {
//     state.groups[payload.id] = payload.group
//   },
// }

// const actions = {
//   async loadGroups(ctx) {
//     const groups = {}

//     const q = query(
//       collection(db, 'groups'),
//       where('owner', '==', ctx.getters.uid),
//       // where('type', '==', type),
//     )

//     const querySnapshot = await getDocs(q)

//     querySnapshot.forEach((doc) => {
//       groups[doc.id] = doc.data()
//     })

//     ctx.commit('set_groups', groups)
//   },

//   async addGroup(ctx, payload) {
//     payload.owner = ctx.getters.uid
//     payload.startAt = new Date().toISOString()

//     const docRef = await addDoc(collection(db, 'groups'), payload)
//     payload.id = docRef.id
//     ctx.commit('add_group', payload)
//   },

//   async deleteGroup(ctx, id) {
//     ctx.commit('delete_group', id) // leva il gioco dall'app

//     await deleteDoc(doc(db, 'groups', id)) // leva il gioco dal database
//   },

//   async editGroup(ctx, payload) {
//     ctx.commit('update_group', payload)

//     await updateDoc(doc(db, 'groups', payload.id), payload.group)

//     // .then( data => resolve({ msg: 'Gioco aggiornato', ...data }) )
//     // .catch( err => reject(err) )
//   },
// }

export default {
  state,
  getters,
  // mutations,
  // actions,
}
