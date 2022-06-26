import {
  every,
  findLast,
  last,
  map,
  random,
  sample,
  shuffle,
  some,
  times,
  uniqueId
} from 'lodash'
import CheckerBoard from './CheckerBoard'

let names = ['细菌', '鼠', '猫', '狗', '狼', '豹', '虎', '狮', '象']
let powerNames = ['穿越', '进化', '生命']
let luckNames = ['阳光', '汹涌', '礼物']

export default class Card {
  constructor() {
    this.id = uniqueId()
    this.name = ''
    this.level = 0
    this.grid = null
    this.reverse = false
    this.camp = 1
    this.power = null
  }

  addGrid(grid) {
    this.grid = grid
  }

  setReverse() {
    this.reverse = true

    if (this.type === 'luck') {
      this.grid.removeCard()
      if (this.name === '阳光') {
        CheckerBoard.grids.forEach(grid => grid.card && grid.card.setReverse())
      } else if (this.name === '汹涌') {
        let cards = shuffle(map(CheckerBoard.grids, 'card'))
        CheckerBoard.grids.forEach(grid => grid.removeCard())
        CheckerBoard.grids.forEach(
          (grid, i) => cards[i] && grid.addCard(cards[i])
        )
      } else if (this.name === '礼物') {
        CheckerBoard.currentPlayer.extraRound = random(1, 3)
      }

      return
    }

    CheckerBoard.next()
  }

  through() {
    if (this.allowThrough) {
      this.power === '穿越' && (this.power = null)
      this.allowThrough = false
    }
  }

  action(grid) {
    // 卡牌未反转
    if (!this.reverse || (grid.card && !grid.card.reverse)) return
    // 仅允许选中动物牌
    if (this.type !== 'zoo') return
    // 移动范围（相邻格）
    this.allowThrough = false
    if (
      !some(this.grid.adjacent(), { id: grid.id }) &&
      !(this.power === '穿越' && (this.allowThrough = true)) /* 穿越 */
    )
      return
    // 移动到空格
    if (!grid.card) return this.move(grid)
    let { name, type, level, camp, power } = grid.card

    // 细菌
    // - 消除己方能力牌
    // - 吃掉敌方附着能力的动物牌
    // - 敌方附着能力的动物牌不能吃掉细菌
    if (this.name === '细菌' && type === 'power' && this.camp === camp)
      return this.move(grid)
    if (this.name === '细菌' && power && this.camp !== camp)
      return this.move(grid)
    if (this.power && name === '细菌' && this.camp !== camp) return

    // 动物牌仅允许对敌方阵营的卡牌展开行动（细菌除外）
    if (this.camp === camp) return

    // 附着一张能力牌
    // 象不能附着能力牌
    if (type === 'power' && this.name !== '象') {
      this.move(grid)
      this.power = name
    }

    // 动物对决
    if (type === 'zoo') {
      //* 进化能力牌
      let L = this.level
      this.power === '进化' && L++
      power === '进化' && level++

      // 鼠 -> 象 √
      // 象 -> 鼠 ×
      if (this.name === '象' && name === '鼠') return
      if (this.name === '鼠' && name === '象') {
        this.move(grid)
        // 大吃小
      } else if (L > level) {
        this.move(grid)
        // 同归于尽
      } else if (L === level) {
        //* 生命能力牌
        // - 双方都附着生命能力，同归于尽
        // - 一方有生命能力，其生命能力消除，另一方死亡
        if (this.power === '生命' && power === '生命') {
          this.grid.removeCard()
          grid.removeCard()
        } else if (this.power === '生命') {
          this.power = null
          grid.removeCard()
        } else if (power === '生命') {
          grid.card.power = null
          this.grid.removeCard()
        } else {
          this.grid.removeCard()
          grid.removeCard()
        }

        //* 穿越 | 允许移动到任意格一次，也可以是吃掉，或者附着能力
        this.through()
        CheckerBoard.next()
      }
    }
  }

  move(grid) {
    if (grid.card && grid.card.power === '生命' && this.name !== '细菌') {
      grid.card.power = null
      this.through()
      CheckerBoard.next()
      return
    }

    this.through()
    this.grid.removeCard()
    this.grid = grid
    grid.addCard(this)
    CheckerBoard.next()
  }
}

export function getCards() {
  let cards = []

  times(2, i => {
    names.forEach((name, index) => {
      let card = new Card()
      card.type = 'zoo'
      card.name = name
      card.level = index
      card.camp = i
      cards.push(card)
    })

    powerNames.forEach((powerName, index) => {
      let card = new Card()
      card.type = 'power'
      card.name = powerName
      cards.push(card)
      card.camp = i
    })
  })

  let sunCard = new Card()
  sunCard.name = sample(luckNames)
  sunCard.type = 'luck'

  cards.push(sunCard)

  return cards
}
