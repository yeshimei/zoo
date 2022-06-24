import { find, chain, compact, map, cond } from 'lodash'
import Fan from './Fan'

// TODO: GridHandler 是一个单列，内部属性在调用 gird 方法后，会被覆盖掉，千万注意
export default class GridHandler {
  constructor() {
    this.grids = []
    this.itemCards = []
    this.roles = []
  }

  compute(grids) {
    //! grid.top 有可能查出 undefined，用于过滤
    this.grids = compact(grids)
    // TODO 未来这里可能包含角色身上的 attachItemCard
    this.itemCards = chain(grids).map('itemCards').flatMap().value()
    this.roles = Fan.roles.filter(role => find(grids, { id: role.grid.id }))
    return this
  }

  hasRole() {
    return this.roles.length
  }

  hasItemCard(name) {
    for (let itemCard of this.itemCards) {
      if (itemCard.name === name) return true
    }
  }

  hasFeature(name) {
    for (let itemCard of this.itemCards) {
      if (itemCard.feature && itemCard.feature.name === name) return true
    }
  }

  itemCardBy(cd) {
    for (let grid of this.grids) {
      for (let itemCard of grid.itemCards) {
        cd(itemCard, grid)
      }
    }
  }

  /**
   * @param {number} n 受到几点伤害
   * @param {boolean} consume 消耗红心
   * @param {boolean} reduce 减少红心
   */
  damage(n, consume, reduce) {
    this.roles.forEach(role => role.damage(n, { consume, reduce }))
  }
}
