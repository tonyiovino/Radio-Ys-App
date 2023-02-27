const state = {
  pages: [
    {
      id: '1',
      name: 'games',
      title: 'Giochi',
      text: 'In Work',
      path: '/games',
    },
    {
      id: '2',
      name: 'things',
      title: 'Cazzatine',
      text: 'Empty',
      path: '/things',
    },
    {
      id: '3',
      name: 'film',
      title: 'Film',
      text: 'Empty',
      path: '/films',
    },
    {
      id: '4',
      name: 'trips',
      title: 'Viaggi',
      text: 'Empty',
      path: '/trips',
    },
  ],
}

const getters = {
  pages: (state) => state.pages,
}

export default {
  state,
  getters,
}
