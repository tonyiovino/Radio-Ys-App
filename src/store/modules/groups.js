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
  groups: {},
  groups_loaded: false,

  all_groups: {},
  all_groups_loaded: false,
}

const getters = {
  getGroups: (state) => state.groups,
  groupById: (state) => (id) => state.groups[id],

  // getAllIds: (state) => Object.keys(state.groups),

  getAllGroups: (state) => state.all_groups,
  allGroupsById: (state) => (id) => state.all_groups[id],
  // state.all_groups[id] ? state.all_groups[id] : console.log('non esiste'),

  groupsLoaded: (state) => state.groups_loaded,
  allGroupsLoaded: (state) => state.all_groups_loaded,
}

const mutations = {
  set_all_groups: (state, payload) => {
    state.all_groups = payload
  },

  set_all_groups_loaded: (state, payload) => {
    state.all_groups_loaded = payload
  },

  set_groups: (state, payload) => {
    state.groups = payload
  },

  set_groups_loaded: (state, payload) => {
    state.groups_loaded = payload
  },

  add_group: (state, payload) => {
    const { id, ...group } = payload
    console.log(id)
    state.groups[id] = group
  },

  delete_group: (state, payload) => {
    console.log(payload)
    delete state.groups[payload]
  },

  update_group: (state, payload) => {
    state.groups[payload.id] = payload.group
  },
}

const actions = {
  join(ctx, groupId) {
    const group = ctx.getters.groupById(groupId)
    const group_from_all = ctx.getters.allGroupsById(groupId)

    // console.log('gruop', group)
    // console.log('group_from_all', group_from_all)

    // se il gruppo da aggiungere non esiste da nessuna parte
    if (group_from_all === undefined) {
      console.log('Il gruppo non esiste!')
      return
    }

    // se il gruppo non è stato aggiunto
    if (group === undefined) {
      console.log('Il gruppo esiste')
      console.log('capienza', group_from_all.collaborators_available)
      console.log('adesso', group_from_all.collaborators.length)
      if (
        group_from_all.collaborators.length <
        group_from_all.collaborators_available
      ) {
        console.log('Sto aggiungendo il gruppo')
        ctx.dispatch('addGroup', {
          id: groupId,
          group: group_from_all,
        })
      } else {
        console.log('Il gruppo è pieno')
      }
    } else {
      console.log('Il gruppo è già stato aggiunto')
    }
  },

  async loadAllGroups(ctx) {
    const q = query(collection(db, 'groups'))

    onSnapshot(q, (querySnapshot) => {
      const groups = {}

      querySnapshot.forEach((doc) => {
        groups[doc.id] = doc.data()
      })
      ctx.commit('set_all_groups', groups)
      ctx.commit('set_all_groups_loaded', true)
    })
  },

  async loadGroups(ctx) {
    // const groups = {}

    const q = query(
      collection(db, 'groups'),
      where('collaborators', 'array-contains', ctx.getters.uid),
      // where('type', '==', type),
    )

    // const querySnapshot = await getDocs(q)
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        ctx.commit('update_group', { id: doc.id, group: doc.data() })
      })
      ctx.commit('set_groups_loaded', true)
    })
  },

  async createGroup(ctx, payload) {
    payload.owner = ctx.getters.uid
    payload.startAt = new Date().toISOString()

    const docRef = await addDoc(collection(db, 'groups'), payload)
    payload.id = docRef.id
    ctx.commit('add_group', payload)
  },

  async leaveGroup(ctx, payload) {
    // console.log('leave_group', payload.group.collaborators)
    const index = payload.group.collaborators.indexOf(ctx.getters.uid)
    if (index > -1) {
      payload.group.collaborators.splice(index, 1)
    }

    ctx.commit('delete_group', payload.id)

    if (payload.group.collaborators.length > 0) {
      // sto uscendo, e ci sono altre persone dentro
      await updateDoc(doc(db, 'groups', payload.id), payload.group)
    } else {
      // sto uscendo, e non c'è più nessuno
      await deleteDoc(doc(db, 'groups', payload.id))

      // quindi elimina le liste del gruppo
      const listsOfGroup = ctx.getters.getIdOf(ctx.getters.visibility)
      listsOfGroup.forEach(async (id) => {
        ctx.commit('delete_list', id)
        await deleteDoc(doc(db, 'lists', id))
      })
    }
  },

  async addGroup(ctx, payload) {
    payload.group.collaborators.push(ctx.getters.uid)
    // console.log('adding group', payload.group.collaborators.length)
    ctx.commit('add_group', payload)

    await updateDoc(doc(db, 'groups', payload.id), payload.group)
  },

  async deleteGroup(ctx, id) {
    ctx.commit('delete_group', id) // leva il gioco dall'app

    await deleteDoc(doc(db, 'groups', id)) // leva il gioco dal database
  },

  async editGroup(ctx, payload) {
    ctx.commit('update_group', payload)

    await updateDoc(doc(db, 'groups', payload.id), payload.group)

    // .then( data => resolve({ msg: 'Gioco aggiornato', ...data }) )
    // .catch( err => reject(err) )
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
