import { find, stubTrue } from 'lodash'
import CardManager from './CardManager'
import Fan from './Fan'
import ItemCard from './ItemCard'

export default class Feature extends ItemCard {
  constructor(itemCard) {
    super()
    this.type = 'feature'
    this.id = itemCard.id
    this.itemCard = itemCard
  }

  destroy() {
    this.beforeDestroy()
  }
}

class Explosive extends Feature {
  static name = '爆炸物'
  constructor(itemCard) {
    super(itemCard)
    this.name = Explosive.name
  }

  trigger(grid) {
    grid.around().itemCardBy((itemCard, grid) => {
      let featureName = itemCard.feature.name
      let id = itemCard.id
      //! 必须置于最前面
      //破坏周围格其他放置物，直接消失
      if (
        !['爆炸物', '有毒物', '植物', '水元素', '冰元素', '风元素'].includes(
          featureName
        ) &&
        itemCard.name !== '油桶'
      ) {
        itemCard.destroy({ force: true })
      }

      // 引爆周围格的爆炸物
      if (featureName === '爆炸物' && !itemCard.isDestroy) {
        Fan.checkerBoard.action(grid, {
          id,
          immediate: true
        })
      }
      // 破坏周围格 有毒物，变成 毒素
      if (featureName === '有毒物') {
        itemCard.destroy({ force: true })
        grid.addItemCard(CardManager.take('毒素'), { force: true })
      }
      // 破坏周围格 植物，变成 种子
      if (featureName === '植物') {
        itemCard.destroy({ force: true })
        grid.addItemCard(CardManager.take('种子'), { force: true })
      }
      // 破坏周围格 水元素，变成 水
      if (featureName === '水元素') {
        itemCard.destroy({ force: true })
        grid.addItemCard(CardManager.take('水'), { force: true })
      }
      // 破坏周围格 冰元素，变成 冰
      if (featureName === '冰元素') {
        itemCard.destroy({ force: true })
        grid.addItemCard(CardManager.take('冰'), { force: true })
      }
      // 破坏周围格 风元素，变成 风
      if (featureName === '风元素') {
        itemCard.destroy({ force: true })
        grid.addItemCard(CardManager.take('风'), { force: true })
      }
      // 破坏周围格 油桶，变成 油
      if (itemCard.name === '油桶') {
        itemCard.destroy({ force: true })
        grid.addItemCard(CardManager.take('油'), { force: true })
      }
    })
  }
}

/**
 * 障碍物（特性）
 */
class Obstacle extends Feature {
  static name = '障碍物'
  constructor(itemCard) {
    super(itemCard)
    this.name = Obstacle.name
    this.summary = ['角色经过会被强制触发判定']
  }
}

/**
 * 易燃物 （特性）
 */
class Flammable extends Feature {
  static name = '易燃物'
  constructor(itemCard) {
    super(itemCard)
    this.name = Flammable.name
    this.summary = []
  }
}

/**
 * 有毒物 （特性）
 */
class Toxic extends Feature {
  static name = '有毒物'
  constructor(itemCard) {
    super(itemCard)
    this.name = Toxic.name
    this.summary = ['周围格的 植物，产生毒性（增益效果变为负面效果）']
  }

  beforeDestroy() {}
}

/**
 * 植物 （特性）
 */
class Plant extends Feature {
  static name = '植物'
  constructor(itemCard) {
    super(itemCard)
    this.name = Plant.name
    this.summary = [
      '休眠（不会被触发判定） ',
      '周围格的 光元素 参与光合作用，苏醒（会被触发判定）'
    ]
  }
}

/**
 * 电力 （特性）
 */
class Electricity extends Feature {
  static name = '电力'
  constructor(itemCard) {
    super(itemCard)
    this.name = Electricity.name
    this.summary = ['被水元素传导的电流会产生电流，触电（受到一点伤害）']
  }

  put() {}
}

/**
 * 水元素 （特性）
 */
class WaterElement extends Feature {
  static name = '水元素'
  constructor(itemCard) {
    super(itemCard)
    this.name = WaterElement.name
    this.summary = ['传导周围格的 电力']
  }

  put() {}
}

/**
 * 冰元素 （特性）
 */
class IceElement extends Feature {
  static name = '冰元素'
  constructor(itemCard) {
    super(itemCard)
    this.name = IceElement.name
    this.summary = [
      '冻结周围格的 水元素，覆盖 冰',
      '在 冰元素 上，连续移动两次或者停留，冻伤（中心格受到一点伤害）'
    ]
  }

  put() {}
}

/**
 * 火元素 （特性）
 */
class FireElement extends Feature {
  static name = '火元素'
  constructor(itemCard) {
    super(itemCard)
    this.name = FireElement.name
    this.summary = [
      '点燃周围格的 易燃物，变成 火',
      '点燃周围格的 植物，变成 火',
      '融化周围格的 冰元素，变成 水',
      '汽化中心格的 水，变成 气流'
    ]
  }

  put() {
    this.registerAction(this.itemCard.grid, {
      judge: stubTrue,
      trigger(grid) {
        grid.around().itemCardBy((itemCard, grid) => {
          const featureName = itemCard.feature && itemCard.feature.name

          if (featureName === '易燃物' || featureName === '植物') {
            itemCard.destroy({ force: true })
            grid.addItemCard(CardManager.take('火'), { force: true })
          }
          if (featureName === '冰元素') {
            itemCard.destroy({ force: true })
            grid.addItemCard(CardManager.take('水'), { force: true })
          }
          if (featureName === '水元素') {
            itemCard.destroy({ force: true })
            grid.addItemCard(CardManager.take('气流'), { force: true })
          }
        })
      }
    })
  }
}

/**
 * 风元素 （特性）
 */
class WindElement extends Feature {
  static name = '风元素'
  constructor(itemCard) {
    super(itemCard)
    this.name = WindElement.name
    this.summary = []
  }

  put() {}
}

/**
 * 光元素 （特性）
 */
class LightElement extends Feature {
  static name = '光元素'
  constructor(itemCard) {
    super(itemCard)
    this.name = LightElement.name
    this.summary = ['驱散中心格的 暗元素']
  }

  put() {}
}

/**
 * 暗元素 （特性）
 */
class DarkElement extends Feature {
  static name = '暗元素'
  constructor(itemCard) {
    super(itemCard)
    this.name = DarkElement.name
    this.summary = [
      '角色无法治疗',
      '中心格的 植物 强制休眠',
      '中心格的 有毒物 基础效果翻倍'
    ]
  }

  put() {}
}

let features = [
  Obstacle,
  Explosive,
  Flammable,
  Toxic,
  Plant,
  Electricity,
  WaterElement,
  IceElement,
  FireElement,
  WindElement,
  LightElement,
  DarkElement
]

/**
 *
 * 特性
 *
 * 障碍物 - Obstacle
 * 爆炸物 - Explosive
 * 易燃物 - Flammable
 * 有毒物 - Toxic
 * 植物 - Plant
 * 电力 - Electricity
 * 水元素 - WaterElement
 * 冰元素 - IceElement
 * 火元素 - FireElement
 * 风元素 - WindElement
 * 光元素 - LightElement
 * 暗元素 - DarkElement
 *
 * @param {string} name
 * @returns
 */
Feature.Create = (name, itemCard) => {
  let R = find(features, { name })
  return new R(itemCard)
}
