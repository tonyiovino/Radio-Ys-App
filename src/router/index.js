import { createRouter, createWebHistory } from 'vue-router'

// import store from '../store'

// import MatchList from '../views/MatchList.vue'
import Home from '../views/Home.vue'

const routes = [
  // primary
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: HomeTest,
  // },
]

const router = createRouter({
  history: createWebHistory(),
  // base: process.env.BASE_URL,
  routes,
})

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'MatchList' && !store.getters.isAuthenticated) {
//     next({ name: 'MatchList' })
//   } else if (to.name === 'MatchList' && store.getters.isAuthenticated)
//     next({ name: 'home' })
//   else next()
// })

export default router
