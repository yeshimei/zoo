import Fan from './Fan'
import Feature from './Feature'
import ItemCard from './ItemCard'

export default class OutputCard extends ItemCard {
  static outputCards = []
  constructor() {
    super()
    this.type = 'outputCard'
  }
}

// 火
class Fire extends OutputCard {
  static name = '火'
  constructor() {
    super()
    this.name = Fire.name
    this.summary = '燃烧（中心格受到一点伤害）'
    this.feature = Feature.Create('火元素', this)
    this.toTriggers = {
      itemCard: ['火药']
    }
  }
  put() {
    this.registerAction(this.grid, {
      fast: false,
      trigger(grid) {
        this._to(grid, '炸药')
      }
    })
    this.registerAction(this.grid, {
      judge: this._hasRole(),
      trigger(grid) {
        grid.center().damage(1)
      }
    })
  }
}
// 油
class Oil extends OutputCard {
  static name = '油'
  constructor() {
    super()
    this.name = Oil.name
    this.summary = '骰子点数小，滑倒（不移动）'
    this.feature = Feature.Create('易燃物', this)
    this.being = 'permanent'
    this.isAttach = true
  }

  put() {}
}
// 毒素
class Toxin extends OutputCard {
  static name = '毒素'
  constructor() {
    super()
    this.name = Toxin.name
    this.summary = '慢性中毒（每回合受到一点伤害）'
    this.feature = Feature.Create('有毒物', this)
    this.being = 'permanent'
    this.isAttach = true
  }

  put() {}
}
// 种子
class Seed extends OutputCard {
  static name = '种子'
  constructor() {
    super()
    this.name = Seed.name
    this.summary = '植物 的友谊（不受伤害，并且会获得好处）'
    this.feature = Feature.Create('植物', this)
    this.isAttach = true
    this.isRepeatAttach = true
  }

  put() {}
}

// 水
class Water extends OutputCard {
  static name = '水'
  constructor() {
    super()
    this.name = Water.name
    this.summary = '稀释（清除）附着在角色身上的衍生物'
    this.feature = Feature.Create('水元素', this)
    this.isAttach = true
  }

  put() {}
}

// 气流
class AirRound extends OutputCard {
  static name = '气流'
  constructor() {
    super()
    this.name = AirRound.name
    this.summary = '附着 风 或 强风，借力（额外移动一次）'
    this.feature = Feature.Create('风元素', this)
    this.being = 'permanent'
  }

  put() {}
}

// 风
class Wind extends OutputCard {
  static name = '风'
  constructor() {
    super()
    this.name = Wind.name
    this.summary =
      '上升（三点骰子点数），滑行（经过物品不会被触发判定）;再附着 风 时，变成 强风'
    this.feature = Feature.Create('风元素', this)
    this.isAttach = true
    this.being = 'permanent'
  }

  put() {}
}

// 强风
class Gale extends OutputCard {
  static name = '强风'
  constructor() {
    super()
    this.name = Gale.name
    this.summary = '推力（增加一颗骰子）'
    this.feature = Feature.Create('风元素', this)
    this.isAttach = true
    this.being = 'permanent'
  }

  put() {}
}

// 冰
class Ice extends OutputCard {
  static name = '冰'
  constructor() {
    super()
    this.name = Ice.name
    this.summary = '阻碍通行（消耗剩余的骰子点数）'
    this.feature = Feature.Create('冰元素', this)
    this.being = 'permanent'
  }

  put() {}
}

// 鱼腥叶
class HouttuyniaCordataLeaves extends OutputCard {
  static name = '鱼腥叶'
  constructor() {
    super()
    this.name = HouttuyniaCordataLeaves.name
    this.summary = '治疗效果翻倍'
    this.feature = Feature.Create('植物', this)
    this.isAttach = true
    this.being = 'permanent'
  }

  put() {}
}

OutputCard.outputCards = [
  Fire,
  Oil,
  Toxin,
  Seed,
  Water,
  AirRound,
  Wind,
  Gale,
  Ice,
  HouttuyniaCordataLeaves
]
