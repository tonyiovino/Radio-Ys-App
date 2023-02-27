const state = {
  nextId: 1,
  messages: {},
}

const getters = {
  logmessages: (state) => state.messages,
}

const mutations = {
  addLogMessage: (state, payload) => {
    state.messages[payload.id] = payload.msg
    state.nextId++
  },

  removeLogMessage: (state, msgId) => {
    delete state.messages[msgId]
  },
}

const actions = {
  addLogMessage: (ctx, msg) => {
    const msgId = state.nextId
    ctx.commit('addLogMessage', { id: msgId, msg: msg })
    setTimeout(() => ctx.commit('removeLogMessage', msgId), 3000)
  },

  removeLogMessage: (ctx, msgId) => {
    ctx.commit('removeLogMessage', msgId)
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
