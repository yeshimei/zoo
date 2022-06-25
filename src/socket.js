import { io } from 'socket.io-client'
import store from './store/index'

let url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3003'
    : 'http://124.222.182.158:3003/'

url = 'http://124.222.182.158:3003/'

export let socket = io(url)

export function send(name, ...args) {
  socket.emit('game data', {
    uid: store.state.userData.id,
    name,
    args: args || []
  })
}
