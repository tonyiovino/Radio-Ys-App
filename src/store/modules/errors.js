const state = {
  nextId: 1,
  errors: {},
}

const getters = {
  errors: (state) => state.errors,
}

const mutations = {
  addError: (state, payload) => {
    state.errors[payload.id] = payload.error
    state.nextId++
  },

  removeError: (state, errorId) => {
    delete state.errors[errorId]
  },
}

const actions = {
  addError: (context, errorMsg) => {
    const errorId = state.nextId
    context.commit('addError', { id: errorId, error: errorMsg })
    // setTimeout(() => context.commit('removeError', errorId), 5000)
  },

  removeError: (context, errorId) => {
    context.commit('removeError', errorId)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
