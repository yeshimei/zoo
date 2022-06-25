import { some, times, uniqueId } from 'lodash'
import CheckerBoard from './CheckerBoard'

let names = ['细菌', '鼠', '猫', '狗', '狼', '豹', '虎', '狮', '象']
let powerNames = ['穿越', '进化', '生命']

class Card {
  constructor() {
    this.id = uniqueId()
    this.name = ''
    this.level = 0
    this.grid = null
    this.reverse = false
    /**
     * 0 - 黑方
     * 1 - 红方
     */
    this.camp = 1
    // 穿越 - 可以在未反面的卡牌的格子上移动
    // 进化 - 升一级（象不能升级）
    // 生命 - 多一条命
    this.power = null
  }

  addGrid(grid) {
    this.grid = grid
  }

  setReverse() {
    this.reverse = true

    // luck 不消耗自己的回合
    if (this.name === '阳光') {
      this.grid.removeCard()
      CheckerBoard.grids.forEach(grid => grid.card && grid.card.setReverse())
      return
    }

    CheckerBoard.next()
  }

  action(grid) {
    // 只能选中 zoo card
    if (this.type !== 'zoo') return
    // 相邻格

    if (!some(this.grid.adjacent(), { id: grid.id })) {
      if (this.power === '穿越') {
        this.useThrough = true
      } else {
        return
      }
    }

    if (grid.card) {
      let { name, type, level, reverse, camp, power } = grid.card

      // 未反转
      if (!this.reverse || !reverse) return
      // 只能细菌可以消除自己能力卡，和吃了能力卡的动物牌
      if (
        (this.name === '细菌' && type === 'power' && this.camp === camp) ||
        (this.name === '细菌' && power)
      ) {
        this.move(grid)
        return
      }

      if (this.power && name === '细菌') return

      // 其余卡牌只能对敌对阵营展开行动
      if (this.camp === camp) return

      // 获取特殊卡牌
      if (type === 'power' && this.name !== '象') {
        this.move(grid)
        this.power = name
      }

      // 动物对决
      if (type === 'zoo') {
        // 进化能力卡
        let selfLevel = this.level
        if (this.power === '进化') {
          selfLevel++
        }

        if (power === '进化') {
          level++
        }

        // 特殊情况 鼠 -> 象
        if (this.name === '象' && name === '鼠') return
        if (this.name === '鼠' && name === '象') {
          this.move(grid)
        } else if (selfLevel > level) {
          this.move(grid)
        } else if (selfLevel === level) {
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

          CheckerBoard.next()

          if (this.useThrough && this.power === '穿越') {
            this.power = null
          }
        }
      }
    } else {
      // 移动到空格
      this.move(grid)
    }
  }

  move(grid) {
    if (grid.card && grid.card.power === '生命') {
      grid.card.power = null
      CheckerBoard.next()
      return
    }

    if (this.useThrough && this.power === '穿越') {
      this.power = null
    }

    this.grid.removeCard()
    this.grid = grid
    grid.addCard(this)
    CheckerBoard.next()
  }

  dead() {
    if (this.power === '生命') {
      this.power = null
      return
    }
    this.death = true
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
  sunCard.name = '阳光'
  sunCard.type = 'luck'

  cards.push(sunCard)

  return cards
}
