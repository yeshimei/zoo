import { find, lowerCase } from 'lodash'
import { provide } from '.'
import CheckerBoard from './CheckerBoard'
import Fan from './Fan'
import Player from './Player'
import Role from './Role'

// 玩家加入或重连
function playerJoin(uid, username, socketId) {
  if (!Fan.reconnection(uid, socketId)) {
    let player = new Player()
    player.role = Role.Create('实习医生')
    player.id = uid
    player.socketId = socketId
    player.username = username
    Fan.join(player)
  }
}

// 玩家离开
function playerLeave(socketId) {
  Fan.leave(socketId)
}

// 在地图的格子上放置一张物品牌
function putItemCard(id, gid) {
  let role = Fan.currentPlayer.role
  let grid = Fan.checkerBoard.getGrid(gid)
  let itemCard = role.getItemCard(id)
  if (itemCard && grid) {
    if (grid.addItemCard(itemCard)) role.removeItemCard(itemCard.id)
  }
}

// 在地图上移动角色
function moveRole(gid) {
  Fan.currentPlayer.role.move(Fan.checkerBoard.getGrid(gid))
}

// 获取角色的移动范围
function gridMoveRange() {
  provide({
    gridMoveRange: Fan.currentPlayer.role.computeMoveRange()
  })
}
// 获取手牌的放置范围
function itemCardPutRange(id) {
  let itemCard = Fan.currentPlayer.role.getItemCard(id)
  if (itemCard) {
    provide({
      itemCardPutRange: itemCard.computePutRange()
    })
  }
}

function clearItemCardPutRange() {
  provide({
    itemCardPutRange: null
  })
}

// 掷骰子
function roll() {
  Fan.currentPlayer.role.dice.roll()
}

// 玩家准备
function ready(id) {
  let player = find(Fan.players, { id })
  if (player) {
    player.ready = true
  }
}
// 玩家取消准备
function cancelReady(id) {
  let player = find(Fan.players, { id })
  if (player) {
    player.ready = false
  }
}
// 开始游戏
function play() {
  Fan.play()
}

// 结束回合
function next() {
  Fan.next()
}
// 再来一局
function restart() {
  Fan.clear()
  let checkerBoard = new CheckerBoard()
  Fan.setCheckerBoard(checkerBoard)
  checkerBoard.create()
}

let hooks = {
  playerJoin,
  playerLeave,
  putItemCard,
  gridMoveRange,
  itemCardPutRange,
  clearItemCardPutRange,
  moveRole,
  roll,
  next,
  restart,
  ready,
  cancelReady,
  play
}

let computedHooks = {}

for (let key in hooks) {
  computedHooks[lowerCase(key)] = hooks[key]
}

export default computedHooks
