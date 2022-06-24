import { castArray, noop, stubTrue, truncate, uniqueId } from 'lodash'
import Fan from './Fan'
import GridHandler from './GridHandler'

export default class ItemCard {
  constructor() {
    this.id = uniqueId()
    this.name = null
    this.grid = null
    this.role = null
    this.putRange = []
    this.feature = null
    this.combination = false
    this.exchange = false
    this.pelt = false
    this.depletion = false
    this.attach = false
    this.repeatAttach = false
    this.replacement = false
    /**
     * 1 - 一次性
     * 2 - 永久
     * 3 - 回合结束后
     * 4 - 角色移动后
     */
    this.being = 1
    this.direction = 1
    this.triggerCount = 0
    this.isDestroy = false
    this.putRange = []
    this.range = 'adjacent'
  }

  setGrid(grid) {
    this.grid = grid
    this.put()
    if (this.feature) {
      this.feature.put()
    }
  }

  setRole(role) {
    this.role = role
  }

  putted() {}
  put() {}
  beforeDestroy() {}

  destroy(opts = { force: false }) {
    if (this.isDestroy) return
    this.triggerCount++
    if (this.being === 1 || opts.force) {
      this.grid.removeItemCard(this.id)
      this.isDestroy = true
      this.beforeDestroy()
    }
  }

  registerAction(grid, { judge = stubTrue, trigger = noop, fast = true }) {
    if (grid instanceof GridHandler) grid = grid.grids
    castArray(grid).forEach(g =>
      g.addAction({
        ctx: this,
        judge: judge.bind(this),
        trigger: trigger.bind(this),
        fast
      })
    )
  }

  computePutRange() {
    if (this.role.dice.movePoint <= 0) return []

    return this.role.grid[this.range]
      .call(this.role.grid)
      .grids.filter(grid => !grid.center().hasRole())
      .filter(
        grid =>
          grid.itemCards.length === 0 ||
          this.type === 'outputCard' ||
          this.depletion ||
          !grid.itemCards.some(
            itemCard => !['outputCard'].includes(itemCard.type)
          ) ||
          grid.itemCards.every(itemCard => itemCard.type === 'outputCard')
      )
  }

  _hasRole() {
    return grid => grid.center().hasRole()
  }

  _hasItemCard(name) {
    return grid => grid.center().hasItemCard(name)
  }

  _hasFeature(name) {
    return grid => grid.center().hasFeature(name)
  }

  _to(grid, name) {
    if (!(grid instanceof GridHandler)) grid = grid.center()
    grid.itemCardBy((itemCard, grid) => {
      if (
        castArray(name).includes(
          itemCard.name || (itemCard.feature && itemCard.feature.name)
        )
      ) {
        Fan.checkerBoard.action(grid.grids, { id: itemCard.id })
      }
    })
  }
}
