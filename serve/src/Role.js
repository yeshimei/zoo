import {
  defaults,
  differenceBy,
  filter,
  find,
  reject,
  times,
  uniqueId
} from 'lodash'
import CardManager from './CardManager'
import Dice from './Dice'
import Fan from './Fan'

export default class Role {
  constructor() {
    this.id = uniqueId()
    this.type = 'role'
    this.grid = null
    this.itemCards = []
    this.runeCards = []
    this.goodsCards = []
    this.attachItemCards = []
    this.dice = new Dice()
    this.routes = []
    this.moveRange = 'adjacent'
    this.moveRangeGrids = []
    this.death = false
    // 只有角色到达过商店，再返回出生点，才会补充卡牌
    this.arrivedShop = true
  }

  /**
   * 补充手牌
   */
  supply() {
    if (this.grid.birth && this.arrivedShop) {
      let n = Math.max(
        0,
        Fan.checkerBoard.itemCardCount - this.itemCards.length
      )
      times(n, () => {
        this.addItemCard(CardManager.sample('put'))
      })

      this.arrivedShop = false
    }
  }

  addItemCard(itemCard) {
    this.itemCards.push(itemCard)
    itemCard.setRole(this)
  }

  findItemCard(name) {
    return filter(this.itemCards, { name })
  }

  getItemCard(id) {
    return find(this.itemCards, { id })
  }

  removeItemCard(id) {
    this.itemCards = reject(this.itemCards, { id })
  }

  addRuneCard(runeCard) {
    this.runeCards.push(runeCard)
  }

  getRuneCard(id) {
    return find(this.runeCards, { id })
  }

  removeRuneCard(id) {
    this.runeCards = reject(this.runeCards, { id })
  }

  addAttachItemCard(itemCard) {
    if (!itemCard.isAttach) return

    let len = this.getAttachItemCard(itemCard.name).length
    if (!len || (len && itemCard.isRepeatAttach)) {
      this.attachItemCards.push(itemCard)
    }
  }

  getAttachItemCard(name) {
    return filter(this.attachItemCards, { name })
  }

  removeAttachItemCard(id) {
    this.attachItemCards = reject(this.attachItemCards, { id })
  }

  /**
   * 受到伤害
   * @param {number} n
   * @param {boolean} [opts.consume=false]  消耗红心
   * @param {boolean} [opts.reduce=false]  减少红心
   */
  damage(n, opts = {}) {
    defaults(opts, {
      consume: false,
      reduce: false
    })

    if (opts.consume) {
      this.redHeart = Math.max(0, this.redHeart - n)
    } else if (opts.reduce) {
      this.redHeart = Math.max(0, this.redHeart - n)
      this.rawRedHeart = Math.max(0, this.rawRedHeart - n)
    } else if (this.blueHeart > 0) {
      this.blueHeart -= n
      if (this.blueHeart < 0) {
        this.redHeart = Math.max(0, this.redHeart + this.blueHeart)
        this.blueHeart = 0
      }
    } else {
      this.redHeart = Math.max(0, this.redHeart - n)
    }

    if (this.redHeart <= 0) {
      this.dead()
    }
  }

  /**
   * 治疗恢复
   * @param {number} n
   * @param {boolean} [opts.blueHeart=false]  增加蓝心
   * @param {boolean} [opts.redHeart=false]  增加红心
   */
  cure(n, opts = {}) {
    defaults(opts, {
      treatment: 1,
      blueHeart: false,
      redHeart: false
    })

    if (opts.blueHeart) {
      this.blueHeart += n
    } else if (opts.redHeart) {
      this.rawRedHeart += n
      this.redHeart = Math.min(this.rawRedHeart, this.redHeart + n)
    } else {
      this.redHeart = Math.min(this.rawRedHeart, this.redHeart + n)
    }
  }

  dead() {
    this.death = true
    // 自己回合内，自己的角色死亡，直接结束回合
    if (Fan.currentPlayer.role.id == this.id) {
      Fan.next()
    }
    Fan.over()
  }

  computeMoveRange() {
    if (this.dice.movePoint <= 0) return []
    let grids = this.grid[this.moveRange]().grids
    return differenceBy(grids, this.routes, 'id')
  }

  move(grid, opts = {}) {
    if (!grid) return

    opts = defaults(opts, { force: false, isAction: true })

    if (
      opts.force ||
      // 1. 移动点数大于零
      // 2. 在移动范围内（默认为相邻格）
      // 3. 不允许重复路线
      find(this.computeMoveRange(), { id: grid.id })
    ) {
      this.grid = grid
      // 添加路径
      this.routes.push(grid)
      // 触发判定
      if (opts.isAction) Fan.checkerBoard.action(grid)
      // 减少一点移动点数
      this.dice.updateMovePoint(-1)
      // 记录是否达到过商店
      if (grid.shop) this.arrivedShop = true
      // 补充手牌
      this.supply()
    }
  }
}

class InternDoctor extends Role {
  static type = '实习医生'
  constructor(opts) {
    super(opts)
    this.type = InternDoctor.type
    this.name = '可甜'
    this.summary =
      '听说她是在全面战争中救下了一个营的传奇实习医生，总是在危急时刻发挥出惊人的......运气'
    this.redHeart = 5
    this.rawRedHeart = 5
    this.blueHeart = 5
  }
}

class Gambler extends Role {
  static type = '赌神'
  constructor(opts) {
    super(opts)
    this.type = Gambler.type
  }
}
class Scientist extends Role {
  static type = '科学家'
  constructor(opts) {
    super(opts)
    this.type = Scientist.type
  }
}
class Sprinter extends Role {
  static type = '短跑运动员'
  constructor(opts) {
    super(opts)
    this.type = Sprinter.type
  }
}
class Pianist extends Role {
  static type = '钢琴家'
  constructor(opts) {
    super(opts)
    this.type = Pianist.type
  }
}
class Swordsman extends Role {
  static type = '剑士'
  constructor(opts) {
    super(opts)
    this.type = Swordsman.type
  }
}
class Elementalist extends Role {
  static type = '元素师'
  constructor(opts) {
    super(opts)
    this.type = Elementalist.type
  }
}
class Electrician extends Role {
  static type = '电力工程师'
  constructor(opts) {
    super(opts)
    this.type = Electrician.type
  }
}

Role.roles = [
  Gambler,
  Scientist,
  Sprinter,
  Pianist,
  Swordsman,
  Elementalist,
  Electrician,
  InternDoctor
]

Role.Create = type => {
  let R = find(Role.roles, { type })
  return new R()
}
