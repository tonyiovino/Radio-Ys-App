import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'

import db from '../../firebaseInit'

const state = {
  lists: {},

  visibility: '',

  isGroupList: false,

  idGroup: '',

  loaded: false,
}

const getters = {
  // types: (state) => state.types,

  lists: (state) => state.lists,

  visibility: (state) => state.visibility,

  isGroupList: (state) => state.isGroupList,

  idGroup: (state) => state.idGroup,

  getListOf: (state) => (type) => {
    const listOf = {}
    Object.entries(state.lists).forEach(([key, list]) => {
      if (list.type === type) {
        listOf[key] = list
      }
    })
    return listOf
  },

  getIdOf: (state) => (visibility) => {
    console.log('vis', visibility)
    const keys = []
    Object.entries(state.lists).forEach(([key, list]) => {
      console.log('porco', key, list)
      if (list.visibility === visibility) {
        keys.push(key)
      }
    })
    return keys
  },

  listById: (state) => (id) => state.lists[id],

  listsLoaded: (state) => state.loaded,
}

const mutations = {
  set_id_group: (state, payload) => {
    state.idGroup = payload
  },

  set_is_group_list: (state, payload) => {
    state.isGroupList = payload
  },

  set_visibility: (state, payload) => {
    state.visibility = payload
  },

  set_lists: (state, payload) => {
    state.lists = payload
    // state.loaded = true ? Object.keys(payload).length !== 0 : false
  },

  set_list_loaded: (state, payload) => {
    state.loaded = payload
  },

  add_list: (state, payload) => {
    const { id, ...list } = payload
    state.lists[id] = list
  },

  delete_list: (state, payload) => {
    delete state.lists[payload]
  },

  update_list: (state, payload) => {
    state.lists[payload.id] = payload.list
  },

  check_list: (state, payload) => {
    state.lists[payload.id].checked = !state.lists[payload.id].checked
  },

  // add_collaborator: (state, payload) => {
  //   state.collaborators = state.collaborators.push(payload)
  // },
}

const actions = {
  async loadPrivateLists(ctx) {
    const lists = {}

    console.log('load', ctx.getters.visibility)

    const q = query(
      collection(db, 'lists'),
      where('owner', '==', ctx.getters.uid),
      where('visibility', '==', ctx.getters.visibility),
    )

    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      lists[doc.id] = doc.data()
    })

    ctx.commit('set_lists', lists)
    ctx.commit('set_list_loaded', true)
  },

  async loadGroupLists(ctx) {
    console.log('load group', ctx.getters.visibility)

    const q = query(
      collection(db, 'lists'),
      where('visibility', '==', ctx.getters.visibility),
    )

    onSnapshot(q, (querySnapshot) => {
      const lists = {}

      querySnapshot.forEach((doc) => {
        lists[doc.id] = doc.data()
      })
      ctx.commit('set_lists', lists)
      ctx.commit('set_list_loaded', true)
    })
  },

  async addList(ctx, payload) {
    // console.log('payload prima', payload)
    payload.owner = ctx.getters.uid
    payload.startAt = new Date().toISOString()
    payload.visibility = ctx.getters.visibility

    const docRef = await addDoc(collection(db, 'lists'), payload)
    payload.id = docRef.id

    // console.log('payload dopo:', payload)
    ctx.commit('add_list', payload)
  },

  async deleteList(ctx, id) {
    ctx.commit('delete_list', id) // leva il gioco dall'app

    await deleteDoc(doc(db, 'lists', id)) // leva il gioco dal database
  },

  async editList(ctx, payload) {
    // console.log("payload", payload);

    ctx.commit('update_list', payload)

    await updateDoc(doc(db, 'lists', payload.id), payload.list)

    // .then( data => resolve({ msg: 'Gioco aggiornato', ...data }) )
    // .catch( err => reject(err) )
  },

  async checkList(ctx, payload) {
    ctx.commit('check_list', payload)

    // console.log("payload", payload.lists);

    const lists = ctx.getters.lists
    const list = lists[payload.id]

    await updateDoc(doc(db, 'lists', payload.id), list)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
