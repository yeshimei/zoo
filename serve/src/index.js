import CheckerBoard from './CheckerBoard'
import Fan from './Fan'
import { isArray, isObject, pick } from 'lodash'
import hooks from './hooks'
import Message from './Message'
import Log from './Log'

let checkerBoard = new CheckerBoard()
Fan.setCheckerBoard(checkerBoard)
checkerBoard.create()

const attrs = {
  checkerBoard: ['id', 'col', 'row', 'itemCardCount', 'playerNumber'],
  grid: ['id', 'x', 'y', 'birth', 'shop'],
  itemCard: [
    'id',
    'name',
    'summary',
    'combination',
    'pelt',
    'exchange',
    'depletion',
    'attach',
    'repeatAttach',
    'replacement',
    'being',
    'direction',
    'isDestroy',
    'triggerCount'
  ],
  feature: ['id', 'name', 'summary'],
  player: ['id', 'username', 'status', 'ready'],
  role: [
    'id',
    'name',
    'type',
    'summary',
    'redHeart',
    'rawRedHeart',
    'blueHeart',
    'death'
  ],
  dice: ['count', 'disabled', 'dicePoint', 'movePoint', 'extraPoint', 'points']
}

let data = {}

export function provide(newData) {
  Object.assign(data, newData)
}

export function stringify() {
  // Fan
  data.controller = pick(Fan, 'id', 'round', 'status')
  data.controller.currentPlayer = pick(Fan.currentPlayer, 'id', 'username')
  // checkerBoard
  data.checkerBoard = pick(Fan.checkerBoard, attrs.checkerBoard)
  data.checkerBoard.grids = Fan.checkerBoard.grids.map(grid => ({
    ...pick(grid, attrs.grid),
    itemCards: grid.itemCards.map(itemCard => ({
      ...pick(itemCard, attrs.itemCard),
      feature: pick(itemCard.feature, attrs.feature)
    }))
  }))
  // player
  data.players = Fan.players.map(player => ({
    ...pick(player, attrs.player),
    role: {
      ...pick(player.role, attrs.role),
      dice: pick(player.role.dice, attrs.dice),
      itemCards: player.role.itemCards.map(itemCard => ({
        ...pick(itemCard, attrs.itemCard)
      })),
      routes: player.role.routes.map(grid => pick(grid, attrs.grid)),
      grid: pick(player.role.grid, attrs.grid)
    }
  }))

  // 通知消息
  data.messages = Message.messages

  data.log = Log

  // provide 数据处理
  if (data.gridMoveRange) {
    data.gridMoveRange = data.gridMoveRange.map(grid => pick(grid, attrs.grid))
  }

  if (data.itemCardPutRange) {
    data.itemCardPutRange = data.itemCardPutRange.map(grid =>
      pick(grid, attrs.grid)
    )
  }

  return data
}

export function parse({ uid, name, args }) {
  // 用户验证（很简单，验证 id 即可）
  let allowNames = [
    'player join',
    'player leave',
    'ready',
    'cancel ready',
    'play'
  ]
  if (
    uid === (Fan.currentPlayer && Fan.currentPlayer.id) ||
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

stringify()
