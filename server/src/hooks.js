import { lowerCase, pick } from 'lodash'
import { provide } from '.'
import CheckerBoard from './CheckerBoard'
import Player from './Player'
// 玩家加入或重连
function playerJoin(uid, username, socketId) {
  let player = new Player()
  player.id = uid
  player.socketId = socketId
  player.username = username
  CheckerBoard.join(player)
}

// 玩家离开
function playerLeave(socketId) {
  CheckerBoard.leave(socketId)
}

function reverse(id) {
  let grid = CheckerBoard.getGrid(id)
  if (grid && grid.card) grid.card.setReverse()
}

function action(id1, id2) {
  let g1 = CheckerBoard.getGrid(id1)
  let g2 = CheckerBoard.getGrid(id2)
  if (g1 && g2 && g1.card) g1.card.action(g2)
}

function giveUp() {
  provide({
    giveUp: pick(CheckerBoard.currentPlayer, 'id', 'username')
  })
}

function confirmGiveUp(b) {
  if (b) {
    CheckerBoard.play()
  }
  provide({
    giveUp: {}
  })
}

function selectedCard(id) {
  provide({
    toCard: id
  })
}

function next() {
  CheckerBoard.next()
}

let hooks = {
  playerJoin,
  playerLeave,
  reverse,
  action,
  giveUp,
  confirmGiveUp,
  next,
  selectedCard
}

let computedHooks = {}

for (let key in hooks) {
  computedHooks[lowerCase(key)] = hooks[key]
}

export default computedHooks
