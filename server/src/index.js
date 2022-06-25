import { pick } from 'lodash'
import CheckerBoard from './CheckerBoard'
import hooks from './hooks'
import Log from './Log'

let attrs = {
  player: ['id', 'username', 'status', 'camp'],
  card: ['id', 'name', 'camp', 'type', 'power', 'reverse', 'level'],
  grid: ['id', 'x', 'y']
}
let data = {
  giveUp: {}
}

export function provide(newData) {
  Object.assign(data, newData)
}

export function stringify() {
  data.checkerBoard = pick(CheckerBoard, 'id', 'row', 'col', 'round', 'status')
  data.players = CheckerBoard.players.map(player => pick(player, attrs.player))
  data.currentPlayer = pick(CheckerBoard.currentPlayer, attrs.player)

  data.grids = CheckerBoard.grids.map(grid => ({
    ...pick(grid, attrs.grid),
    card: pick(grid.card, attrs.card)
  }))

  data.log = Log

  return data
}

export function parse({ uid, name, args }) {
  // 用户验证（很简单，验证 id 即可）
  let allowNames = [
    'player join',
    'player leave',
    'confirm give up',
    'selected card'
  ]
  if (
    uid === (CheckerBoard.currentPlayer && CheckerBoard.currentPlayer.id) ||
    allowNames.includes(name)
  ) {
    let fn = hooks[name]
    if (fn) {
      console.info(`√ ${name} <- ${uid}`)
      fn(...args)
    } else {
      console.info(`× ${name} <- ${uid}`)
    }
  }
}
