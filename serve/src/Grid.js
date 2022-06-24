import Fan from './Fan'
import GridHandler from './GridHandler'
import {
  defaults,
  find,
  flatMap,
  invokeMap,
  reject,
  some,
  times,
  uniq
} from 'lodash'
import { uniqueId } from 'lodash'

export default class Grid {
  constructor() {
    this.id = uniqueId()
    this.x = null
    this.y = null
    this.actions = []
    this.itemCards = []
    this.handler = new GridHandler()
    // 补齐指定张物品牌
    this.birth = false
    // 兑换道具牌和符文牌
    this.shop = false
  }

  top(n = 1) {
    let grids = times(n, i =>
      Fan.grids.find(grid => grid.x === this.x && grid.y === this.y - (i + 1))
    )
    return this.handler.compute(grids)
  }

  bottom(n = 1) {
    let grids = times(n, i =>
      Fan.grids.find(grid => grid.x === this.x && grid.y === this.y + i + 1)
    )
    return this.handler.compute(grids)
  }

  left(n = 1) {
    let grids = times(n, i =>
      Fan.grids.find(grid => grid.y === this.y && grid.x === this.x - (i + 1))
    )
    return this.handler.compute(grids)
  }

  right(n = 1) {
    let grids = times(n, i =>
      Fan.grids.find(grid => grid.y === this.y && grid.x === this.x + i + 1)
    )
    return this.handler.compute(grids)
  }

  center() {
    let grids = [this]
    return this.handler.compute(grids)
  }

  adjacent(n) {
    let grids = this.top(n)
      .grids.concat(this.right(n).grids)
      .concat(this.bottom(n).grids)
      .concat(this.left(n).grids)

    this.handler.compute(grids)
    return this.handler
  }

  twoAdjacent() {
    return this.adjacent(2)
  }

  around() {
    let grids = this.adjacent().grids.concat(this)

    this.handler.compute(grids)
    return this.handler
  }

  between(name) {
    let res = []
    // x轴遍历
    let grids = Fan.checkerBoard.grids.filter(grid =>
      some(grid.itemCards, { name })
    )
    grids.sort((a, b) => {
      if (a.y === b.y) {
        let n = a.x - b.x
        res = res.concat(
          times(n - 1, i =>
            find(Fan.checkerBoard.grids, { y: b.y, x: b.x + i + 1 })
          )
        )
      }
    })

    // y轴遍历
    let grids2 = [...Fan.checkerBoard.grids]
      .sort((a, b) => a.x - b.x)
      .filter(grid => some(grid.itemCards, { name }))
    grids2.sort((a, b) => {
      if (a.x === b.x) {
        let n = a.y - b.y
        res = res.concat(
          times(n - 1, i =>
            find(Fan.checkerBoard.grids, { x: b.x, y: b.y + i + 1 })
          )
        )
      }
    })
    res = uniq(res)
    this.handler.compute(res)
    return this.handler
  }

  /**
   *
   *
   * @param {ItemCard} itemCard
   * @param {boolean} [opts={force: false, isActive: true}]
   * @return {boolean} 是否放置成功
   * @memberof Grid
   */
  addItemCard(itemCard, opts = {}) {
    opts = defaults(opts, { force: false, isAction: true })

    if (
      opts.force ||
      // 1. 格子里没有物品牌
      // 2. 放置的物品牌是衍生物
      // 3. 格子里只有衍生物
      // 4. 移动点数不为零
      // 5. 在放置范围内
      // 6. 格子里不能有角色
      some(itemCard.computePutRange(), { id: this.id })
    ) {
      // 放置物品同样消耗一点移动点数
      itemCard.role && itemCard.role.dice.updateMovePoint(-1)

      itemCard.setGrid(this)
      this.itemCards.push(itemCard)

      // put 后，立刻触发 action
      if (opts.isAction) {
        Fan.checkerBoard.action(this, { id: itemCard.id })
      }
      return true
    }
  }

  removeItemCard(id) {
    this.itemCards = reject(this.itemCards, { id })

    this.removeAllAction(id)
  }

  addAction(action) {
    this.actions.push(action)
  }

  removeAllAction(id) {
    Fan.grids.forEach(
      grid =>
        (grid.actions = grid.actions.filter(action => action.ctx.id !== id))
    )
  }
}
