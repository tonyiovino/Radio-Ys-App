import { createRouter, createWebHistory } from 'vue-router'

// import store from '../store'

// import MatchList from '../views/MatchList.vue'
import Home from '@/views/Home.vue'

const routes = [
  // primary
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '/podcast',
    name: 'Podcast',
    component: () => import('@/views/Podcasts.vue'),
  },

  {
    path: '/book',
    name: 'Book',
    component: () => import('@/views/Books.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  // base: process.env.BASE_URL,
  routes,
})

export default router
