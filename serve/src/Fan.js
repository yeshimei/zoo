import { defaults, filter, find, invokeMap, reject } from 'lodash'
import { map, uniqueId } from 'lodash'
import Message from './Message'

class Fan {
  constructor() {
    this.id = uniqueId()
    this.checkerBoard = null
    this._players = []
    this.round = 0
    this.currentPlayer = null
    this.started = false
    /**
     * ready - 准备中
     * start 已经开始游戏了
     * pause- 暂停
     * over - 游戏结束
     */
    this.status = 'ready'
  }

  get roles() {
    return map(this.players, 'role')
  }

  get grids() {
    return this.checkerBoard.grids
  }

  get players() {
    return reject(this._players, { status: 'leave' })
  }

  clear() {
    this.id = uniqueId()
    this.checkerBoard && (this.checkerBoard.grids = [])
    this._players = []
    this.round = 1
    this.currentPlayer = null
  }

  play() {
    const len = this.players.length
    // 至少两个玩家
    if (len >= 2 && len <= this.checkerBoard.playerNumber) {
      this.status = 'start'
    }
    this.next()
  }

  pause() {
    this.status = 'pause'
  }

  over() {
    // 只剩一个玩家，或所有玩家全部死亡，游戏结束
    if (filter(this.roles, 'death').length >= this.roles.length - 1) {
      this.status = 'over'
    }
  }

  next() {
    if (this.status !== 'start') return
    if (this.currentPlayer) {
      let role = this.currentPlayer.role
      role.routes = []

      let dice = role.dice
      dice.disabled = false
      dice.points = []
      dice.dicePoint = dice.movePoint = 0
      // 角色死亡
      if (this.currentPlayer.role.death) {
      }
    }

    // 跳过角色以死亡的玩家
    let players = this.players.filter(player => !player.role.death)

    let len = players.length
    this.currentPlayer = players[this.round % len]
    this.round++
  }

  setCheckerBoard(checkerBoard) {
    this.checkerBoard = checkerBoard
  }

  setCurrentPlayer() {
    if (this.players.length === 1) {
      this.currentPlayer = this.players[0]
    }
  }
  join(player, opts = {}) {
    defaults(opts, {
      force: false
    })
    // TODO: 后续把超过上限加入的玩家当做观察者（不参与游戏）
    // 游戏开始后，或玩家人数满了之后，不允许再加入新玩家
    if (
      opts.force ||
      this.players.length < this.checkerBoard.playerNumber ||
      this.status == 'ready'
    ) {
      this._players.push(player)
      // 移动到出生点
      player.role.move(this.checkerBoard.getPointOfBirth(), { force: true })
      player.status = 'join'
      // 设置当前玩家
      this.setCurrentPlayer()
      Message.send(`${player.username} 加入`)
    }
  }

  reconnection(id, socketId) {
    let player = find(this._players, { id })
    if (player) {
      player.status = 'reconnection'
      player.socketId = socketId
      this.setCurrentPlayer()
      Message.send(`${player.username} 重连`)
      return true
    }
  }

  leave(socketId) {
    let player = find(this._players, { socketId })
    if (player) {
      player.status = 'leave'
      this.setCurrentPlayer()
      Message.send(`${player.username} 离开了`)
      this.next()
    }
  }
}

export default new Fan()
