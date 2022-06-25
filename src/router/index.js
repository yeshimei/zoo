import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'
import { socket, send } from '../socket'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASH),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/register') return next()
  const userData = JSON.parse(localStorage.getItem('__userData__'))
  if (userData && userData.id) {
    store.commit('saveGameData', { userData })
    // 上传用户数据
    send('player join', userData.id, userData.username)
    socket.on('game data', data => {
      store.commit('saveGameData', data)
    })

    let timer = setInterval(() => {
      if (store.state.checkerBoard) {
        clearInterval(timer)
        next()
      }
    }, 100)
  } else {
    router.push('/register')
  }
})

export default router
