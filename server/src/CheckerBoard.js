import { find, map, reject, shuffle, union, uniqueId } from 'lodash'
import Grid from './Grid'
import { getCards } from './Card'
import { provide } from '.'

class CheckerBoard {
  constructor() {
    this.id = uniqueId()
    this.grids = []
    this.row = 5
    this.col = 5
    this.players = []
    this.currentPlayer = null
    this.round = 0
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

  getGrid(id) {
    return find(this.grids, { id })
  }

  addGrid(grid) {
    this.grids.push(grid)
  }

  addPlayer(player) {
    if (this.players.length < 2 && !find(this.players, { id: player.id })) {
      this.players.push(player)
    }
  }

  play() {
    this.id = uniqueId()
    this.grids = []
    this.currentPlayer = null
    this.round = 0
    this.status = 'start'
    this.discardedCards = []
    this.players.forEach(player => {
      player.extraRound = 0
    })

    provide({
      luckCard: {},
      giveUp: {}
    })
    this.create()
    this.next()
  }

  pause() {}

  next() {
    if (this.currentPlayer && this.currentPlayer.extraRound > 0) {
      this.currentPlayer.extraRound--
    } else {
      this.currentPlayer = this.players[this.round % 2]
    }
    this.round++
  }

  computed() {
    this.players.forEach(player => (player.camp = -1))
    let p1 = this.players[0]
    let p2 = this.players[1]
    p1 && (p1.camp = 0)
    p2 && (p2.camp = 1)

    if (this.players.length >= 2) {
      this.play()
    }
  }
  join(player) {
    this.players = union(this.players, [player], 'id')
    this.computed()
  }

  leave(socketId) {
    this.players = reject(this.players, { socketId })
    this.computed()
  }

  create() {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        let grid = new Grid()
        grid.x = j
        grid.y = i
        this.addGrid(grid)
      }
    }
    let cards = shuffle(getCards())
    this.grids.forEach((grid, index) => grid.addCard(cards[index]))
  }
}

export default new CheckerBoard()
